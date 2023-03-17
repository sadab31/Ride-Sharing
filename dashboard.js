var express = require("express");
var dashboard = express.Router();


dashboard.get('/rider', (req, res) => {
   // res.send("Ye hain rider dashboard")
   res.render("riderDashboard")
})

dashboard.get('/provider', (req, res) => {
   // res.send("Ye hain provider dashboard")
   res.render("providerDashboard")
})

dashboard.get('/requested', (req, res) => {
   res.send("Ye hain Ride requested")
   // res.render("riderDashboard")
})

dashboard.get('/details', (req, res) => {
   // res.send("Ye hain Ride requested")
   res.render("detailsForm")
})

dashboard.post('/details', (req, res) => {
   console.log("printing details");
   console.log(req.body);
   res.redirect("/dashboard/provider")
})



module.exports = dashboard;