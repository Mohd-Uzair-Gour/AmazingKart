const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const { hashPassword ,comparePasswords } = require("../utils/hashPassword")
const { generateAuthToken } = require("../utils/generateAuthToken");


const getUsers = async (req, res, next) => { 
  try {
    const users = await User.find({}).select("-password ");
    return res.json(users);
  } catch (error) {
    next(error);
  }
};



const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("user exists");
    } else {
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });  
      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          // {
          //   httpOnly: true,
          //   secure: process.env.NODE_ENV === "production",
          //   sameSite: "strict",
          // }
        )
        .status(201)
        .json({
          success: "User created",
          userCreated: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
    }
  } catch (err) {
    next(err);
  }
};
 



const loginUser = async (req, res, next) => {
    try {
        const { email, password, doNotLogout } = req.body;
        
        // Check if email and password are provided
        if (!(email && password)) {
            return res.status(400).send("All inputs are required");
        }
        
        // Find the user by email
        const user = await User.findOne({ email }).orFail();
        
        if (user && comparePasswords (password ,user.password)) {
            // Compare the password with the hashed password stored in the database
    
            
            // Set cookie parameters 
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            };
            
            // If "doNotLogout" is true, extend cookie expiry
            if (doNotLogout) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // 7 days
            }
            
            // Set the JWT as an HTTP-only cookie
            return res
                .cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), cookieParams)
                .json({
                    success: "user logged in",
                    userLoggedIn: {
                        _id: user._id,
                        name: user.name,
                        lastName: user.lastName,
                        email: user.email,
                        isAdmin: user.isAdmin ,
                        doNotLogout
                    }
                });
        } else {
            return res.status(401).send("wrong credentials");
        }
    } catch (error) {
        next(error); // Pass error to next middleware for error handling
    }
};



const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }
    await user.save();

    res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        
      },
    });
  } catch (err) {
    next(err);
  }
};
 
 const getUserProfile = async (req,res,next) => {
    try { 
        const user = await User.findById(req.params.id).orFail()
        return res.send(user)
    } catch (error) {
        next(error)
    }
 }  

 const writeReview = async (req, res, next) => {
  let session = null; // Initialize session outside try block
  try {
    // Start a session
    session = await Review.startSession();

    // Start a transaction
    session.startTransaction();

    // Get comment and rating from the request
    const { comment, rating } = req.body;

    // Validate input
    if (!(comment && rating)) {
      return res.status(400).send("All inputs are required");
    }

    // Generate a manual review ID
    const ObjectId = require("mongodb").ObjectId;
    let reviewId = new ObjectId();

    // Create the review
    await Review.create(
      [
        {
          _id: reviewId,
          comment: comment,
          rating: Number(rating),
          user: { _id: req.user._id, name: req.user.name + " " + req.user.lastName },
        },
      ],
      { session: session } // Associate session with the operation
    );

    // Find the product
    const product = await Product.findById(req.params.productId)
      .populate("reviews")
      .session(session); // Use session in query

    // Check if the product has already been reviewed by this user
    const alreadyReviewed = product.reviews.find(
      (r) => r.user._id.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      throw new Error("product already reviewed");
    }

    // Update product reviews and ratings
    let prc = [...product.reviews];
    prc.push({ rating: rating });
    product.reviews.push(reviewId);
    if (product.reviews.length === 1) {
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    } else {
      product.reviewsNumber = product.reviews.length;
      let ratingCalc =
        prc
          .map((item) => Number(item.rating))
          .reduce((sum, item) => sum + item, 0) / product.reviews.length;
      product.rating = Math.round(ratingCalc);
    }
    await product.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    res.send("review created");
  } catch (err) {
    if (session && session.inTransaction()) {
      // Abort the transaction only if it was started
      await session.abortTransaction();
    }
    next(err);
  } finally {
    if (session) {
      // Ensure the session is ended
      session.endSession();
    }
  }
};


  
const getUser = async (req, res, next) => {
try {
    const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail();
    return res.send(user);
} catch (err) {
   next(err); 
}
}

const updateUser = async (req, res, next) => {
try {
   const user = await User.findById(req.params.id).orFail(); 

    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin

    await user.save();

    res.send("user updated");

} catch (err) {
   next(err); 
}
}

const deleteUser = async (req, res, next) => {
    try {
      const result = await User.deleteOne({ _id: req.params.id });
  
      // Check if any document was deleted
      if (result.deletedCount === 0) {
        return res.status(404).send("User not found");
      }
  
      res.status(200).send("User removed");
    } catch (err) {
      next(err);  // Passes any errors to the global error handler
    }
  };
  
module.exports = { getUsers, registerUser,loginUser,updateUserProfile ,getUserProfile,writeReview,getUser,updateUser,deleteUser};
