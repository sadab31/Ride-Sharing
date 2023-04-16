var express = require("express");
var rider = express.Router();

var db = require('./db');

rider.post('/details', (req, res) => {
    let details ={
        id: req.body.id,
        start: req.body.from,
        pickup: req.body.pickup,
        end: req.body.pickup,
        time: req.body.time,
       }
       let sql="INSERT INTO requestedrides SET ?";

       let query = db.query(sql,details, (err, result) =>{
       if (err) throw err;
       console.log(result)
    
    });

    console.log(req.body)
    console.log("Yeppers")
    var string = encodeURIComponent('false');
    
    res.redirect("/dashboard/rider/?valid=" +string)   
})




module.exports = rider;