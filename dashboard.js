var express = require("express");
var dashboard = express.Router();
// var {db1} = require('./server.js');
var db = require("./db");

async function dummyRides() {
  let sql = "SELECT * FROM rideinfo";
  let query = await db.query(sql, (err, results) => {
    if (err) throw err;

    let dummy = {
      start1: results[0].start,
      address1: results[0].address,
      start2: results[1].start,
      address2: results[1].address,
      start3: results[2].start,
      address3: results[2].address,
    };
    console.log("dummmyyyyyyyyyyyyyyy", dummy);
    return dummy;
  });
  return query;
}
function findIdByStart(start, objects) {
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].start === start) {
      return objects[i].id;
    }
  }
  return null; // Return null if no object with matching start is found
}

function providerMatch(objArray1, objArray2) {
  for (let obj1 of objArray1) {
    for (let obj2 of objArray2) {
      if (obj1.start === obj2.start) {
        return obj2.id;
      }
    }
  }
  return null;
}

function generateUniqueCode(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

dashboard.get("/rider", (req, res) => {
  var passedid = req.query.id;
  console.log("Passed id", passedid);

  let sql = "SELECT * FROM rideinfo";
  console.log("eikhane");
  let query = db.query(sql, (err, results) => {
    if (err) throw err;

    let sql2 = "SELECT * FROM ongoingrides WHERE riderID = ?";

    let query = db.query(sql2, [passedid], (err, result2) => {
      if (err) throw err;
      console.log("Result2", result2);
      console.log(results[0]);

      // res.send("Ye hain rider dashboard")
      var passedVariable = req.query.valid;
      var flag = true;
      console.log(passedVariable);
      if (result2.length === 0) {
        result2 = [{ uniqueProviderId: "N/A", uniqueRideId: "N/A" }];
      }
      if (passedVariable === "false") {
        console.log("yessir");

        res.render("riderDashboard", {
          unique: result2[0].uniqueProviderId,
          uniqueRideId: result2[0].uniqueRideId,
          rideadd: false,
          start1: results[0].start,
          address1: results[0].address,
          start2: results[1].start,
          address2: results[1].address,
          start3: results[2].start,
          address3: results[2].address,
        });
      } else {
        res.render("riderDashboard", {
          unique: result2[0].uniqueProviderId,
          uniqueRideId: result2[0].uniqueRideId,
          rideadd: true,
          start1: results[0].start,
          address1: results[0].address,
          start2: results[1].start,
          address2: results[1].address,
          start3: results[2].start,
          address3: results[2].address,
        });
      }
    });
  });
});

dashboard.get("/provider", (req, res) => {
  var passedVariable = req.query.id;
  var status = req.query.status;
  console.log(status);

  console.log("passed id in provider", passedVariable);

  let sql1 = "SELECT * FROM rideinfo WHERE id = ? ";
  let query = db.query(sql1, [passedVariable], (err, result1) => {
    console.log("result 1 RIDEINFO", result1);
    if (err) throw err;

    let sql2 = "SELECT * FROM requestedrides";
    let query = db.query(sql2, (err, result2) => {
      console.log("result 2 requestedRides", result2);
      if (err) throw err;
      console.log(
        "Before matching the riders id is:",
        result1[0].start,
        result2
      );
      console.log(
        "After matching the riders id is:",
        findIdByStart(result1[0].start, result2)
      );
      let matchedRiderId = findIdByStart(result1[0].start, result2);
      console.log("matchedRiderId", matchedRiderId);

      let sql3 = "SELECT * FROM rider WHERE id = ?";
      let query = db.query(sql3, [matchedRiderId], (err, result3) => {
        console.log("result 3 riders", result3);
        if (err) throw err;

        let sql4 = "SELECT * FROM rideinfo";

        let query = db.query(sql4, (err, results) => {
          if (err) throw err;
          var uniqueProviderId = generateUniqueCode();
          if (status === "accepted") {
            let sql5 = "INSERT INTO ongoingrides SET ? ";
            var uniqueRideId = generateUniqueCode();

            var details5 = {
              riderID: matchedRiderId,
              providerID: passedVariable,
              start: result1[0].start,
              end: result1[0].end,
              pickup: result1[0].address,
              uniqueRideId: uniqueRideId,
              uniqueProviderId: uniqueProviderId,
            };
            let query = db.query(sql5, details5, (err, results) => {
              if (err) throw err;
            });
          }
          console.log(uniqueProviderId);
          res.render("providerDashboard", {
            uniqueRideId: uniqueRideId,
            status: status,
            start1: results[0].start,
            address1: results[0].address,
            start2: results[1].start,
            address2: results[1].address,
            start3: results[2].start,
            address3: results[2].address,
            name: result3[0].name,
            phone: result3[0].phone,
            unique: uniqueProviderId,
            id: passedVariable,
          });
        });
      });
    });
  });
});

dashboard.get("/requested", (req, res) => {
  res.send("Ye hain Ride requested");
  // res.render("riderDashboard")
});

dashboard.get("/details", (req, res) => {
  // res.send("Ye hain Ride requested")

  res.render("detailsForm");
});

dashboard.post("/details", (req, res) => {
  console.log("printing details");

  let details = {
    id: req.body.id,
    start: req.body.from,
    address: req.body.address,
    end: req.body.to,
    time: req.body.time,
  };
  console.log(details);
  let sql = "INSERT INTO rideinfo SET ?";

  let query = db.query(sql, details, (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  res.redirect("/dashboard/provider");
});

module.exports = dashboard;
