var express = require("express");
var payment = express.Router();

var db = require("./db");

payment.get("/info", (req, res) => {
  res.render("payment");
});

module.exports = payment;
