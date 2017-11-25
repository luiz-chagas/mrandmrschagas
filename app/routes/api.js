var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/confirm', function(req, res) {
  console.log(req.body.person, req.body.amount);
  return res.status(200).json("Success");
});

module.exports = router;
