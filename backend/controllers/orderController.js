const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const { ObjectId } = require('mongodb');

const getUserOrders = async (req, res, next) => {
    try {
        // Use new ObjectId when converting the user ID
        const orders = await Order.find({ user: new ObjectId(req.user._id) });
        res.send(orders);
    } catch (error) {
        next(error);
    }
}


const getOrder = async (req, res, next) => {
    try {
      // Find order by ID and populate the user details excluding sensitive fields
      const order = await Order.findById(req.params.id)
        .populate("user", "-password -isAdmin -_id -__v -createdAt -updatedAt")
        .orFail();
  
      // Send the order data in the response
      res.send(order);
    } catch (err) {
      // If order not found or any other error, pass it to error handling middleware
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: "Order not found" });
      } else {
        next(err); // Passes error to custom error handling middleware
      }
    }
  };
  


  const createOrder = async (req, res, next) => {
      try {
          const { cartItems, orderTotal, paymentMethod } = req.body;
  
          // Validate the required fields
          if (!cartItems || cartItems.length === 0 || !orderTotal || !paymentMethod) {
              return res.status(400).send("All inputs are required");
          }
  
          // Extract product IDs and quantities from cartItems
          let ids = cartItems.map(item => item.productID);
          let qty = cartItems.map(item => Number(item.quantity));
  
          // Update product sales atomically using bulk update
          const bulkUpdateOps = cartItems.map((item) => ({
              updateOne: {
                filter: { _id: item.productID },
                update: { $inc: { sales: item.quantity }
             },
              }  
          }));
  
          await Product.bulkWrite(bulkUpdateOps);
  
          // Create a new order
          const order = new Order({
              user: new ObjectId(req.user._id), // Ensure user ID is an ObjectId
              orderTotal: orderTotal,
              cartItems: cartItems,   
              paymentMethod: paymentMethod,
          });
  
          // Save the order to the database
          const createdOrder = await order.save();
          res.status(201).send(createdOrder);  
  
      } catch (err) {
          next(err);    
      }   
  };  
 
  const updateOrderToDelivered = async (req, res, next) => {
    try {
       const order = await Order.findById(req.params.id).orFail();
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.send(updatedOrder);
    } catch (err) {
        next(err);
    }
}

const updateOrderToPaid = async (req, res, next) => {
    try {
        // Find the order by ID and throw an error if not found
        const order = await Order.findById(req.params.id).orFail();

        // Mark the order as paid and set the current time as paidAt
        order.isPaid = true;
        order.paidAt = Date.now();

        // Optional: You can store additional payment details here
        // order.paymentDetails = {
        //     method: req.body.paymentMethod,
        //     transactionId: req.body.transactionId
        // };

        // Save the updated order
        const updatedOrder = await order.save();

        // Respond with the updated order
        res.status(200).send(updatedOrder);

    } catch (err) {
        // Handle specific errors like when the order is not found
        if (err.name === 'DocumentNotFoundError') {
            return res.status(404).send({ message: "Order not found" });
        }

        // Pass any other errors to the error-handling middleware
        next(err);
    }
};


const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate("user","-password").sort({paymentMethod:"desc" });
        res.send(orders);
    } catch (err) {
        next(err)
    }
}

const getOrderForAnalysis = async (req, res, next) => {
    try {
        const start = new Date(req.params.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.params.date);
        end.setHours(23, 59, 59, 999);

        const order = await Order.find({
            createdAt: { 
                $gte: start,
                $lte: end,
            }
        }).sort({ createdAt: "asc" });
        res.send(order);

    } catch (err) {
        next(err)
    }
}

module.exports = {getUserOrders, getOrder, createOrder, updateOrderToPaid,updateOrderToDelivered, getOrders, getOrderForAnalysis,}