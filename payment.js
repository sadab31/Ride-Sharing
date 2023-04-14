var express = require("express");
var payment = express.Router();

var db = require('./db');

payment.get('/info', (req, res) => {

    console.log(req.body)
    console.log("Yeppers")
    
    
    res.render("payment");
})




module.exports = payment;
