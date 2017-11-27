const config = require('../config/config');

var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

const twilio = require('twilio')(
  config.twilio.TWILIO_ACCOUNT_SID,
  config.twilio.TWILIO_AUTH_TOKEN
);


/* GET users listing. */
router.post('/confirm', function(req, res) {
  if (!req.body.person) {
    return res.status(500).json("Something went wrong");
  }

  const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.gmail.user,
      pass: config.gmail.pass
    }
  });

  let content = {
    from: 'mrandmrschagas@gmail.com',
    to: 'luizchagasjr@gmail.com',
    subject: 'Wedding RSVP'
  };

  if (req.body.amount > 0) {
    content.html = `
    ${req.body.person} just confirmed ${req.body.amount} people at our reception.
    `;
  } else {
    content.html = `
    ${req.body.person} just confirmed they can't come.
    `;
  }

  twilio.messages.create({
    from: config.twilio.TWILIO_PHONE_NUMBER,
    to: config.phone,
    body: content.html
  }).then(() => console.log(`Text message sent`));

  transport.sendMail(content, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Email sent succesfully`);
  });

  return res.status(200).json("Success");
});

module.exports = router;
