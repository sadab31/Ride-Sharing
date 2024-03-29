const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const router = require("./router");
const dashboard = require("./dashboard");
const rider = require("./rider");
const payment = require("./payment");
const rate = require("./rate");
const provider = require("./provider");
const receipt = require("./receipt");
const app = express();

const port = process.env.PORT || 3000;

//DATABASE

var db = require("./db");

// var mysql = require("mysql");
// var db = mysql.createConnection({

//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "ridesharing",

//     multipleStatements: true

// });

// db.connect(function (error) {
//     if (error) {
//       console.log("Error Connecting to DB");
//     } else {
//       console.log("successfully Connected to DB");
//     }
//   });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// load static assets
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(
  session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/route", router);
app.use("/dashboard", dashboard);
app.use("/rider", rider);
app.use("/payment", payment);
app.use("/rate", rate);
app.use("/provider", provider);
app.use("/receipt", receipt);

// home route
// app.get('/', (req, res) =>{
//     res.render('base', { title : "Login System"});
// })

// //////////////////////
app.get("/", (req, res) => {
  res.render("rslogin", { title: "Login System" });
});

app.post("/", (req, res) => {
  console.log(req.body);
  var id = encodeURIComponent(req.body.id.toString());

  var provider = req.body.flexRadioDefault;
  if (provider == "on") {
    let sql1 = "SELECT * FROM providers WHERE id=?";

    let query = db.query(sql1, [id], (err, result1) => {
      if (err) throw err;

      if (req.body.password == result1[0].password) {
        console.log("PASSWORD MATCHED");
        res.redirect("/dashboard/provider/?id=" + id);
      } else {
        res.send("Password incorrect");
      }
    });
  } else {
    let sql1 = "SELECT * FROM rider WHERE id=?";

    let query = db.query(sql1, [id], (err, result1) => {
      if (err) throw err;
      console.log(result1);
      console.log("result1", result1);
      console.log(typeof req.body.password, typeof result1[0].password);
      console.log(req.body.password.length, result1[0].password.length);
      console.log(req.body.password, result1[0].password);
      if (req.body.password == result1[0].password) {
        console.log("PASSWORD MATCHED");
        res.redirect("/dashboard/rider/?id=" + id);
      } else {
        res.send("Password incorrect");
      }
    });
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("registration", { title: "Login System" });
});
app.post("/register", (req, res) => {
  let details = {
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    pickup: req.body.pickup,
    department: req.body.department,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
  };
  console.log(details);
  let details2 = {
    ...details,
    vehicleNum: req.body.Vnum,
    vehicleType: req.body.Vtype,
    vehicleColor: req.body.Vcolor,
    vehicleModel: req.body.Vmodel,
    driverName: req.body.DriverName,
    driverNum: req.body.DriverNum,
  };

  var provider = req.body.flexRadioDefault;
  if (provider == "on") {
    let sql = "INSERT INTO providers SET ?";

    let query = db.query(sql, details2, (err, result) => {
      if (err) throw err;
      console.log(result);
    });

    res.redirect("/");
  } else {
    /// Pushing rider data into database
    let sql = "INSERT INTO rider SET ?";

    let query = db.query(sql, details, (err, result) => {
      if (err) throw err;
      console.log(result);
    });

    res.redirect("/");
  }
});

////////////////////// DATABASE ///////////////////

app.get("/create", (req, res) => {
  let sql =
    "CREATE TABLE posts (id int AUTO_INCREMENT, title VARCHAR(255), PRIMARY KEY (id))";

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("psots table created");
  });
});

app.get("/insert", (req, res) => {
  let details = {
    id: 201012655,
    name: "Ahnaf",
    address: "Gulshan",
    pickup: "Gloria Jeans, Gulshan 1",
    department: "Microbio",
    password: "mimi",
    email: "mimooo@yahooy.com",
    phone: 4555555556,
  };
  let sql = "INSERT INTO rider SET ?";

  let query = db.query(sql, details, (err, result) => {
    if (err) throw err;
    console.log(result);
    //    res.send('Rider info added')
  });
});

// module.exports = {db};
app.listen(port, () => {
  console.log("Listening to the server on http://localhost:3000");
});
