var express = require("express");
var provider = express.Router();

var db = require("./db");

provider.get("/current/:id", (req, res) => {
  const id = req.params.id;
  console.log("FROM PARAMS", id);
  var status = "accepted";
  res.redirect("/dashboard/provider/?id=" + id + "&status=" + status);
});

module.exports = provider;
