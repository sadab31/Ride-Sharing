var mysql = require("mysql");
var db = mysql.createConnection({
 
    host: "localhost",
    user: "root",
    password: "",
    database: "ridesharing",
    
    multipleStatements: true
 
});
 
db.connect(function (error) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      console.log("successfully Connected to DB");
    }
  });



module.exports = db;