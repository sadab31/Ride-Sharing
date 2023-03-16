var express = require("express");
var dashboard = express.Router();


dashboard.get('/rider', (req, res) => {
   // res.send("Ye hain rider dashboard")
   res.render("riderDashboard")
})

dashboard.get('/provider', (req, res) => {
   // res.send("Ye hain provider dashboard")
   res.render("riderDashboard")
})

dashboard.get('/requested', (req, res) => {
   res.send("Ye hain Ride requested")
   // res.render("riderDashboard")
})





module.exports = dashboard;