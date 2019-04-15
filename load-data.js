require("dotenv").config({ path: __dirname + "/variables.env" });
const fs = require("fs");

const mongoose = require("mongoose");
const {
  getHTML,
  getPigCameHomeMenu,
  getRanchoCameHomeMenu
} = require("./modules-utils/lib/scraper");
const { db } = require("./modules-utils/lib/db");
const {
  getStringDate,
  daysOfWeek,
  findOpenRestaurants,
  getRandomIndex,
  returnItemsForSuggestion
} = require("./modules-utils/lib/helper");

const pigFoodora =
  "https://www.foodora.ca/restaurant/s1jc/when-the-pig-came-home";

const tacoFoodora = "https://www.foodora.ca/chain/cs4gd/rancho-relaxo";

mongoose.connect(process.env.DATABASE_URL);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
const Restaurant = require("./models/Restaurant");

async function saveMenu() {
  console.log("scraping!!");
  const restaurants = await Promise.all([
    getPigCameHomeMenu(pigFoodora),
    getRanchoCameHomeMenu(tacoFoodora)
  ]);
  //commented out code will write to db.json file.
  db.set("restaurants", restaurants).write();
  return restaurants;
}

// const restaurants = JSON.parse(
//   fs.readFileSync(__dirname + "/db.json", "utf-8")
// );

async function deleteData() {
  console.log("😢😢 Goodbye Data...");
  await Restaurant.remove();
  console.log(
    "Data Deleted. To load sample data, run\n\n\t npm run sample\n\n"
  );
  process.exit();
}

async function loadData() {
  try {
    const restaurants = await saveMenu();
    console.log(restaurants);
    await Restaurant.insertMany(restaurants);
    console.log("👍👍👍👍👍👍👍👍 Done!");
    process.exit();
  } catch (e) {
    console.log(
      "\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n"
    );
    console.log(e);
    process.exit();
  }
}

if (process.argv.includes("--delete")) {
  deleteData();
} else {
  loadData();
}
