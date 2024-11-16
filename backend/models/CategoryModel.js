const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    default: "default category description",
  },
  image: {
    type: String,
    default: "/images/tablets-category.png",
  },
  attrs: [{ key: { type: String }, value: [{ type: String }] }],
});

categorySchema.index({ description: 1 }); //searching and assign category in  increaing order by mongo db

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
