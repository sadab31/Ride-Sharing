var express = require("express");
var rate = express.Router();

var db = require('./db');

rate.get('/', (req, res) => {     
    res.render("rate");
})

rate.post('/', (req, res) => {     
    

    let details ={
        id: req.body.id,
        phone: req.body.phone,
        stars: req.body.rating,
        comment: req.body.comment        
       }
     
     let sql="INSERT INTO ratings SET ?";
  
     let query = db.query(sql,details, (err, result) =>{
     if (err) throw err;
     console.log(result)
  
  });
    var provider = (req.body.flexRadioDefault);
    if (provider == 'on'){
        res.redirect("/dashboard/provider/?id=" +details.id);
    }else{
        res.redirect("/dashboard/rider/?id=" +details.id);
    }
})



module.exports = rate;