var express = require("express");
var dashboard = express.Router();

var db = require("./db");

function getPhoneNumber(id, callback) {
  let sql = `SELECT phone FROM providers WHERE id=${id}`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
    } else if (result.length === 0) {
      callback(new Error(`Provider with ID ${id} not found.`), null);
    } else {
      callback(null, result[0].phone);
    }
  });
}

function getRiderById(id, callback) {
  let sql = `SELECT * FROM rider WHERE id=${id}`;
  db.query(sql, (error, results, fields) => {
    if (error) throw error;
    callback(results[0]);
  });
}

function findIdByStart(start, objects) {
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].start === start) {
      return objects[i].id;
    }
  }
  return null;
}
function paymentChecker(id, objects) {
  console.log("Inside payment", id, objects);
  for (let i = 0; i < objects.length; i++) {
    var temp = objects[i].id.toString();

    if (temp === id) {
      if (objects[i].status === "paid") {
        return "Paid";
      } else {
        return "Unpaid";
      }
    }
  }
  return null;
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

  let query = db.query(sql, (err, results) => {
    if (err) throw err;

    let sql2 = "SELECT * FROM ongoingrides WHERE riderID = ?";

    let query = db.query(sql2, [passedid], (err, result2) => {
      if (err) throw err;
      console.log("Result2", result2);

      console.log(results[0]);

      var passedVariable = req.query.valid;
      var flag = true;

      var reqflag;
      if (result2.length === 0) {
        result2 = [
          {
            uniqueProviderId: "N/A",
            uniqueRideId: "N/A",
            requestStatus: "Not accepted",
          },
        ];
        reqflag: "Not accepted";
      }

      let sql3 = "SELECT * FROM providers WHERE id = ? ";
      let query = db.query(sql3, [result2[0].providerID], (err, result3) => {
        if (err) throw err;
        console.log("Phone numberrrr", result3);
        let sql6 = "SELECT * FROM payment WHERE id = ?";

        let query = db.query(sql6, [passedVariable], (err, result6) => {
          if (err) throw err;
          console.log(result6);
          console.log("payyy", paymentChecker(passedVariable, result6));
          if (passedVariable === "false") {
            console.log("yessir");

            res.render("riderDashboard", {
              requestStatus:
                reqflag === "Not accepted" ? "Not accepted" : "Accepted",
              phone: result3.length !== 0 ? result3[0].phone : "N/A",
              payment: result6.length === 0 ? "UNPAID" : result6[0].status,
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
              phone: result3.length !== 0 ? result3[0].phone : "N/A",
              providerID: result2[0].providerID,
              requestStatus:
                reqflag === "Not accepted" ? "Not accepted" : "Accepted",
              payment: result6.length === 0 ? "UNPAID" : result6[0].status,
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
  });
});

dashboard.get("/provider", (req, res) => {
  var passedVariable = req.query.id;

  var status = req.query.status;

  let sql1 = "SELECT * FROM rideinfo WHERE id = ? ";
  let query = db.query(sql1, [passedVariable], (err, result1) => {
    if (result1.length === 0) {
      details = {
        payment: "N/A",
        uniqueRideId: "N/A",
        status: "N/A",
        start1: "N/A",
        address1: "N/A",
        start2: "N/A",
        address2: "N/A",
        start3: "N/A",
        address3: "N/A",
        name: "N/A",
        phone: "N/A",
        unique: "N/A",
        id: "N/A",
      };
      res.render("providerDashboard", details);
    } else {
      if (err) throw err;

      let sql2 = "SELECT * FROM requestedrides";
      let query = db.query(sql2, (err, result2) => {
        console.log("result 2 requestedRides", result2);
        if (err) throw err;
        console.log("Before matching the riders start is:", result1[0].start);
        console.log(
          "After matching the riders id is:",
          findIdByStart(result1[0].start, result2)
        );
        let matchedRiderId = findIdByStart(result1[0].start, result2);
        console.log("matchedRiderId", matchedRiderId);

        let sql3 = "SELECT * FROM rider WHERE id = ?";
        let query = db.query(sql3, [matchedRiderId], (err, result3) => {
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

            let sql6 = "SELECT * FROM payment WHERE id = ?";

            let query = db.query(sql6, [passedVariable], (err, result6) => {
              if (err) throw err;
              console.log(result6);
              console.log("payyy", paymentChecker(passedVariable, result6));
              res.render("providerDashboard", {
                payment: result6.length === 0 ? "UNPAID" : result6[0].status,
                uniqueRideId: uniqueRideId,
                status: status,
                start1: results[0].start,
                address1: results[0].address,
                start2: results[1].start,
                address2: results[1].address,
                start3: results[2].start,
                address3: results[2].address,
                name: result3.length === 0 ? "n/a" : result3[0].name,
                phone: result3.length === 0 ? "n/a" : result3[0].phone,
                unique: uniqueProviderId,
                id: passedVariable,
              });
            });
          });
        });
      });
    }
  });
});

dashboard.get("/requested", (req, res) => {
  res.send("Ye hain Ride requested");
});

dashboard.get("/details", (req, res) => {
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
