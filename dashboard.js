var express = require("express");
var dashboard = express.Router();
// var {db1} = require('./server.js');
var db = require('./db');


dashboard.get('/rider', (req, res) => {
   // res.send("Ye hain rider dashboard")
   var passedVariable = req.query.valid;
   console.log(passedVariable)
   if (passedVariable === "false"){
      console.log("yessir")
      res.render("riderDashboard", {rideadd : false})
   }else{
      res.render("riderDashboard", {rideadd : true})
   }
   
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
 
   let details ={
      id: req.body.id,
      start: req.body.from,
      address: req.body.address,
      end: req.body.to,
      time: req.body.time,
     }
   console.log(details)
   let sql="INSERT INTO rideinfo SET ?";

   let query = db.query(sql,details, (err, result) =>{
   if (err) throw err;
   console.log(result)

});



   res.redirect("/dashboard/provider")

   
})



module.exports = dashboard;