const {
  getHTML,
  getPigCameHomeMenu,
  getRanchoCameHomeMenu
} = require("../modules-utils/lib/scraper");
const { db } = require("../modules-utils/lib/db");
const {
  getStringDate,
  daysOfWeek,
  findOpenRestaurants,
  getRandomIndex,
  returnItemsForSuggestion
} = require("../modules-utils/lib/helper");

const pigFoodora =
  "https://www.foodora.ca/restaurant/s1jc/when-the-pig-came-home";

const tacoFoodora = "https://www.foodora.ca/chain/cs4gd/rancho-relaxo";
const pig = "https://www.whenthepigcamehome.ca/menu";

exports.test = function(req, res, next) {
  console.log("test");
  const dt = getStringDate(new Date().getDay());
  res.json({ dt });
};

exports.scrape = async (req, res, next) => {
  console.log("scraping!!");
  const restaurants = await Promise.all([
    getPigCameHomeMenu(pigFoodora),
    getRanchoCameHomeMenu(tacoFoodora)
  ]);
  res.json({ restaurants });
};

exports.saveMenu = async (req, res, next) => {
  console.log("scraping!!");
  const restaurants = await Promise.all([
    getPigCameHomeMenu(pigFoodora),
    getRanchoCameHomeMenu(tacoFoodora)
  ]);
  //commented out code will write to db.json file.
  // db.set("restaurants", restaurants).write();
  res.json({ restaurants });
};

const getItemsForSlack = () => {
  //1. check what day of the week it is
  const dayOfWeek = getStringDate(new Date().getDay());
  //2. grab restaurants that are open today
  let openRestaurants = db.get("restaurants").value();
  openRestaurants = findOpenRestaurants(openRestaurants, dayOfWeek);
  //3. pick random items to suggest
  let items = returnItemsForSuggestion(openRestaurants);
  return items;
};

exports.slackItems = async (req, res, next) => {
  const items = getItemsForSlack();
  res.json({ items });
};

exports.receiveCommand = async (req, res, next) => {
  console.log(req.body);
  const items = getItemsForSlack();
  const index = getRandomIndex(0, 1);
  console.log(index);
  let lunchData = {
    response_type: "in_channel",
    text: items[index]
  };

  res.status(200).send(lunchData);
  //  res.sendStatus(200);
};
