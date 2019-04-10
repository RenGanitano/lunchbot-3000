var express = require("express");
var router = express.Router();
const {
  getHTML,
  getPigCameHomeMenu,
  getRanchoCameHomeMenu
} = require("../modules-utils/lib/scraper");
// const db = require("../modules-utils/lib/db");
const { initDB } = require("../modules-utils/lib/db");
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

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log("test");
  let token = "0bEIhpPa5Bx3eXTQbUXbnfG8";

  const dt = getStringDate(new Date().getDay());
  if (req.query.token === token) {
    let lunchData = {
      response_type: "in_channel",
      text: "Have a Joseph from When the Pig Came Home!",
      attachments: [
        {
          text: "https://goo.gl/maps/qvivC1dXUP32"
        }
      ]
    };

    res.setHeader("Content-Type", "application/json");
    res.send({ dt });
  } else {
    res.status(403).end();
  }
});

router.get("/test", function(req, res, next) {
  console.log("test");
  const dt = getStringDate(new Date().getDay());
  res.json({ dt });
});

//console.log(db);
router.get("/scrape", async (req, res, next) => {
  console.log("scraping!!");
  const restaurants = await Promise.all([
    getPigCameHomeMenu(pigFoodora),
    getRanchoCameHomeMenu(tacoFoodora)
  ]);
  res.json({ restaurants });
});

initDB().then(async db => {
  router.get("/save", async (req, res, next) => {
    console.log("scraping!!");
    const restaurants = await Promise.all([
      getPigCameHomeMenu(pigFoodora),
      getRanchoCameHomeMenu(tacoFoodora)
    ]);
    console.log(db);
    db.set("restaurants", restaurants).write();
    res.json({ restaurants });
  });
});

router.get("/slack", async (req, res, next) => {
  //TO DO
  //1. check what day of the week it is
  const dayOfWeek = getStringDate(new Date().getDay());
  //2. grab restaurants that are open today
  var openRestaurants = [];
  initDB().then(db => {
    openRestaurants.push(...db.get("restaurants").value());
    //console.log(openRestaurants);
  });
  console.log(openRestaurants);
  openRestaurants = findOpenRestaurants(openRestaurants, dayOfWeek);
  //3. pick random items to suggest
  let items = returnItemsForSuggestion(openRestaurants);
  //return them
  res.json({ items });
});

router.post("/slack", async (req, res, next) => {});

module.exports = router;
