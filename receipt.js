var express = require("express");
var receipt = express.Router();

var db = require("./db");

receipt.get("/:name", (req, res) => {
  const name = req.params.name;
  console.log("FROM PARAMS", name);

  res.render("receipt", { name: name });
});

module.exports = receipt;
