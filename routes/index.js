var express = require("express");
var router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/test", restaurantController.test);

router.get("/scrape", restaurantController.scrape);

router.get("/save", restaurantController.saveMenu);

router.get("/slack", restaurantController.slackItems);

router.post("/slack", restaurantController.receiveCommand);

module.exports = router;
