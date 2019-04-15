const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  title: String,
  items: [String]
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  categories: [categoriesSchema],
  daysOpen: [String]
});

// const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = mongoose.model("Restaurant", restaurantSchema);
// export default Restaurant;
