var express = require("express");
var router = express.Router();
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

/* GET users listing. */
router.get("/", function(req, res, next) {
  let token = "0bEIhpPa5Bx3eXTQbUXbnfG8";
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
  } else {
    res.status(403).end();
  }
});

module.exports = router;
