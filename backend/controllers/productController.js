const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");
const imageValidate = require("../utils/imagevalidate");

//get request for fetching products
const getProducts = async (req, res, next) => {
  try {
    let query = {};
    let queryConditon = false;

    //filtering by price
    let priceQueryCondition = {};
    if (req.query.price) {
      queryConditon = true;
      priceQueryCondition = { price: { $lte: Number(req.query.price) } };
    }
    //filtering by rating
    let ratingQueryCondition = {};
    if (req.query.rating) {
      queryConditon = true;
      ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
    }
    //find search product by category name in AlL search
    let categoryQueryCondition = {};
    const categoryName = req.params.categoryName || "";
    if (categoryName) {
      queryConditon = true;
      let a = categoryName.replace(/,/g,"/");
      var regEx = new RegExp("^" + a);
      categoryQueryCondition = { category: regEx };
    }

    //filter by category
    if (req.query.category) {
      queryConditon = true;
      let a = req.query.category.split(",").map((item) => {
        if (item) return new RegExp("^" + item);
      });
      categoryQueryCondition = {
        category: { $in: a },
      };
    }

    //filter by attributes
    let attrsQueryCondition = [];
    if (req.query.attrs) {
      //attrs=RAM-1TB-2TB-4TB,color-blue,-red
      //['RAM-1TB-4TB','color-blue',']
      attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
        if (item) {
          let a = item.split("-");
          let values = [...a];
          values.shift(); //removes first item
          let a1 = {
            attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
          };
          acc.push(a1);
          // console.dir(acc,{depth:null})
          queryConditon = true;
          return acc;
        } else return acc;
      }, []);
    }

    //Pagination
    const pageNum = Number(req.query.pageNum) || 1;

    //for sorting name,price etc.

    let sort = {};
    const sortOptions = req.query.sort || "";
    if (sortOptions) {
      let sortOpt = sortOptions.split("_");
      sort = { [sortOpt[0]]: Number(sortOpt[1]) };
    }

    // search query from search bar product search
    const searchQuery = req.params.searchQuery || "";
    let searchQueryCondition = {};
    let select = {};

    if (searchQuery) {
      queryConditon = true;
      searchQueryCondition = { $text: { $search: searchQuery } }; // Proper variable name
      select = {
        score: { $meta: "textScore" }, // Meta score to rank search results
      };
      sort = { score: { $meta: "textScore" } }; // Sort by textScore
    }

    // filtering for both price and rating  /find and search product by category name//filter by attribute//
    if (queryConditon) {
      query = {
        $and: [
          priceQueryCondition,
          ratingQueryCondition,
          categoryQueryCondition,
          ...attrsQueryCondition,
          searchQueryCondition,
        ],
      };
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .select(select)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

//Get Product by id function start

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("reviews")
      .orFail();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

//find the product of bes seller

const getBestsellers = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      { $match: { sales: { $gt: 0 } } },
      { $sort: { sales: -1 } },
      {
        $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } },
      },
      { $replaceRoot: { newRoot: "$doc_with_max_sales" } },
      { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
      { $limit: 3 },
    ]);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

//admin routes function
const adminGetProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ category: 1 })
      .select("name price category");
    return res.json(products);
  } catch (error) {
    next(error);
  }   
};

//admin delete product
const adminDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    await product.deleteOne();
    res.json({ message: "product removed"});
  } catch (error) {
    next(error);
  }
};

//admin create new product function
const adminCreateProduct = async (req, res, next) => {
  try {
    const product = new Product();
    const { name, description, count, price, category, attributesTable } =
      req.body;
    product.name = name;
    product.description = description;
    product.count = count;
    product.price = price;
    product.category = category;
    if (attributesTable.length > 0) {
      attributesTable.map((item) => {
        product.attrs.push(item);
      });
    }
    await product.save();

    res.json({
      message: "Product Created",
      productId: product._id,
    });
  } catch (err) {
    next(err);
  }
};

//for updating the product

const adminUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    const { name, description, count, price, category, attributesTable } =
      req.body;

    // Update product fields only if new values are provided
    product.name = name || product.name;
    product.description = description || product.description;
    product.count = count || product.count;
    product.price = price || product.price;
    product.category = category || product.category;

    // Check if attributesTable is defined and is an array before updating attributes
    if (
      attributesTable &&
      Array.isArray(attributesTable) &&
      attributesTable.length > 0
    ) {
      product.attrs = [];
      attributesTable.forEach((item) => {
        product.attrs.push(item);
      });
    } else {
      product.attrs = [];
    }

    await product.save();
    res.json({
      message: "Product updated",
      // product: product // Optional: return updated product details
    });
  } catch (error) {
    next(error);
  }
};

// for upload an image

const adminUpload = async (req, res, next) => {
  if (req.query.cloudinary === "true") {
      try {
          let product = await Product.findById(req.query.productId).orFail();
          product.images.push({ path: req.body.url });
          await product.save();
      } catch (err) {
          next(err);
      }
     return 
  }
try {
  if (!req.files || !!req.files.images === false) {
    return res.status(400).send("No files were uploaded.");
  }

  const validateResult = imageValidate(req.files.images);
  if (validateResult.error) {
    return res.status(400).send(validateResult.error);
  }

  const path = require("path");
  const { v4: uuidv4 } = require("uuid");
  const uploadDirectory = path.resolve(
    __dirname,
    "../../frontend",
    "public",
    "images",
    "products"
  );

  let product = await Product.findById(req.query.productId).orFail();

  let imagesTable = [];
  if (Array.isArray(req.files.images)) {
    imagesTable = req.files.images;
  } else {
    imagesTable.push(req.files.images);
  }

  for (let image of imagesTable) {
    var fileName = uuidv4() + path.extname(image.name);
    var uploadPath = uploadDirectory + "/" + fileName;
    product.images.push({ path: "/images/products/" + fileName });
    image.mv(uploadPath, function (err) {
      if (err) {
        return res.status(500).send(err);
      }
    });
  }
  await product.save();
  return res.send("Files uploaded!");
} catch (err) {
  next(err);
}
};

//delete image of products

const adminDeleteProductImage = async (req, res, next) => {
  const imagePath = decodeURIComponent(req.params.imagePath);
  if (req.query.cloudinary === "true") {
      try {
         await Product.findOneAndUpdate({ _id: req.params.productId }, { $pull: { images: { path: imagePath } } }).orFail(); 
          return res.end();
      } catch(er) {
          next(er);
      }
      return
  }
try {
  const path = require("path");
  const finalPath = path.resolve("../frontend/public") + imagePath;
  const fs = require("fs");
  fs.unlink(finalPath, (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
  await Product.findOneAndUpdate(
    { _id: req.params.productId },
    { $pull: { images: { path: imagePath } } }
  ).orFail();
  return res.end();
} catch (err) {
  next(err);
}
};

module.exports = {
  getProducts,
  getProductById,
  getBestsellers,
  adminGetProducts,
  adminDeleteProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpload,
  adminDeleteProductImage,
};
