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
      console.log("Before matching the riders start is:", result1[0].start);
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
            console.log("inside accepted");
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
          console.log(results);
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

dashboard.get("/provider", (req, res) => {
  var passedVariable = req.query.id;
  var status = req.query.status;

  let sql1 = "SELECT * FROM rideinfo";
  let query = db.query(sql1, (err, result1) => {
    if (err) throw err;
    phoneNumber = getPhoneNumber();
    details = {
      uniqueRideId: "N/A",
      status: "N/A",
      start1: result1[0].start,
      address1: result1[0].address,
      start2: result1[1].start,
      address2: result1[1].address,
      start3: result1[2].start,
      address3: result1[2].address,
      name: "N/A",
      phone: "N/A",
      unique: "N/A",
      id: "N/A",
    };
    res.render("providerDashboard", details);
  });
});

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
      if (passedVariable === "false") {
        console.log("yessir");

        res.render("riderDashboard", {
          requestStatus:
            reqflag === "Not accepted" ? "Not accepted" : "Accepted",
          providerID: result2[0].providerID,
          payment: "Unpaid",
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
          providerID: result2[0].providerID,
          requestStatus:
            reqflag === "Not accepted" ? "Not accepted" : "Accepted",
          payment: "Unpaid",
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

let sql6 = "SELECT * FROM payment WHERE id = ?";

let query = db.query(sql6, [passedVariable], (err, result6) => {
  if (err) throw err;
  console.log(result6);
  console.log("payyy", paymentChecker(passedVariable, result6));
  if (passedVariable === "false") {
    console.log("yessir");

    res.render("riderDashboard", {
      requestStatus: reqflag === "Not accepted" ? "Not accepted" : "Accepted",
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
      requestStatus: reqflag === "Not accepted" ? "Not accepted" : "Accepted",
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
