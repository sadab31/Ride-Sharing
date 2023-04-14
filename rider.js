var express = require("express");
var rider = express.Router();

var db = require('./db');

rider.post('/details', (req, res) => {

    console.log(req.body)
    console.log("Yeppers")
    var string = encodeURIComponent('false');
    
    res.redirect("/dashboard/rider/?valid=" +string)   
})




module.exports = rider;