var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let token = '0bEIhpPa5Bx3eXTQbUXbnfG8';

  if (req.query.token === token)
  {
    let lunchData = {
      "response_type": "in_channel",
      "text": "Have a Joseph from When the Pig Came Home!",
      "attachments" : [
        {
          "text": "https://goo.gl/maps/qvivC1dXUP32"
        }
      ]
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(lunchData));
  } else {
    res.status(403).end();
  }
});

module.exports = router;