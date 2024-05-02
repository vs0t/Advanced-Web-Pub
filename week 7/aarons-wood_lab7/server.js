"use strict";
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var bcrypt = require("bcrypt");

// added
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "istwebclass.org",
  user: "",
  password: "",
  database: "",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connection Complete!");
});

app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/login.html"));
});
app.post("/loginemp/", function (req, res) {
  var eemail = req.body.employeeemail;
  var epw = req.body.employeepw;
  var sqlsel = "select * from employeetable where dbemployeeemail = ?";
  var inserts = [eemail];
  var sql = mysql.format(sqlsel, inserts);
  console.log("sql: " + sql);
  con.query(sql, function (err, data) {
    if (data.length > 0) {
      console.log("user name correct:");
      console.log(data[0].dbemployeepassword);
      bcrypt.compare(
        epw,
        data[0].dbemployeepassword,
        function (err, passwordCorrect) {
          if (err) {
            throw err;
          } else if (!passwordCorrect) {
            console.log("Password incorrect");
          } else {
            console.log("password correct");
            res.send({ redirect: "/backend/searchemployee.html" });
          }
        }
      );
    } else {
      console.log("incorrect username or password...");
    }
  });
});

app.post("/logincus/", function (req, res) {
  var cemail = req.body.customeremail;
  var cpw = req.body.customerpw;
  var sqlsel = "select * from customertable where dbcustomeremail = ?";
  var inserts = [cemail];
  var sql = mysql.format(sqlsel, inserts);
  console.log("sql: " + sql);
  con.query(sql, function (err, data) {
    if (data.length > 0) {
      console.log("user name correct:");
      console.log(data[0].dbcustpassword);
      bcrypt.compare(
        cpw,
        data[0].dbcustpassword,
        function (err, passwordCorrect) {
          if (err) {
            throw err;
          } else if (!passwordCorrect) {
            console.log("Password incorrect");
          } else {
            console.log("password correct");
            res.send({ redirect: "/searchcustomer.html" });
          }
        }
      );
    } else {
      console.log("incorrect username or password...");
    }
  });
});

app.get("/getemps/", function (req, res) {
  var sqlsel = "select * from employeetable";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.post("/Cart/", function (req, res) {
  var cartemp = req.body.CartEmp;

  var sqlsel =
    "select MAX(dbcartdailyid) as daymax from cartinfo " +
    "WHERE DATE(dbcartdate) = CURDATE()";
  var sql = mysql.format(sqlsel);

  var dailynumber = 1;

  con.query(sql, function (err, data) {
    console.log(data[0].daymax);

    if (!data[0].daymax) {
      dailynumber = 1;
    } else {
      dailynumber = data[0].daymax + 1;
    }

    var sqlinscart =
      "INSERT INTO cartinfo (dbcartemp, dbcartdailyid, " +
      "dbcartpickup, dbcartmade, dbcartdate) VALUES (?, ?, ?, ?, now())";
    var insertscart = [cartemp, dailynumber, 0, 0];

    var sqlcart = mysql.format(sqlinscart, insertscart);

    con.execute(sqlcart, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.json({message: "1 record inserted"});
    //   res.redirect("/backend/insertcart.html");
      res.end();
    });
  });
});

app.get("/getcart/", function (req, res) {
  var empid = req.query.employeeid;

  var sqlsel =
    "Select cartinfo.*, employeetable.dbemployeename from cartinfo " +
    "inner join employeetable on employeetable.dbemployeekey = cartinfo.dbcartemp " +
    "where dbcartemp = ? ";

  var inserts = [empid];

  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get("/getsingleemp/", function (req, res) {
  var ekey = req.query.upempkey;

  var sqlsel = "select * from employeetable where dbemployeekey = ?";
  var inserts = [ekey];
  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get("/getsinglecus/", function (req, res) {
  var cid = req.query.upcusid;

  var sqlsel = "select * from customertable where dbcustomerid = ?";
  var inserts = [cid];
  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.post("/updatesingleemp", function (req, res) {
  var eid = req.body.upemployeeid;
  var ename = req.body.upemployeename;
  var ephone = req.body.upemployeephone;
  var eemail = req.body.upemployeeemail;
  var esalary = req.body.upemployeesalary;
  var emailer = req.body.upemployeeemailer;
  var etype = req.body.upemployeetype;
  var ekey = req.body.upemployeekey;

  var sqlins =
    "UPDATE employeetable SET dbemployeeid = ?, dbemployeename = ?, dbemployeeemail = ?, " +
    " dbemployeephone = ?, dbemployeesalary = ?, dbemployeemailer = ?, dbemployeetype = ? " +
    " WHERE dbemployeekey = ?";
  var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, ekey];
  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});

app.post("/updatesinglecus", function (req, res) {
  var cid = req.body.upcustomerid;
  var cname = req.body.upcustomername;
  var caddress = req.body.upcustomeraddress;
  var czip = req.body.upcustomerzip;
  var ccredit = req.body.upcustomercredit;
  var cemail = req.body.upcustomeremail;
  var cparticipant = req.body.upcustomerparticipant;
  var creward = req.body.upcustomerreward;

  var sqlins =
    "UPDATE customertable SET dbcustomername = ?, dbcustomeraddress = ?, dbcustomerzip = ?, dbcustomercredit = ?, dbcustomeremail = ?, dbcustparticipant = ?, dbcustreward = ? " +
    " WHERE dbcustomerid = ?";
  var inserts = [
    cname,
    caddress,
    czip,
    ccredit,
    cemail,
    cparticipant,
    creward,
    cid,
  ];
  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});

app.get("/getcustypes/", function (req, res) {
  var sqlsel = "select * from customerewards";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get("/getemptypes/", function (req, res) {
  var sqlsel = "select * from employeetypes";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get("/getemp/", function (req, res) {
  var eid = req.query.employeeid;
  var ename = req.query.employeename;
  var ephone = req.query.employeephone;
  var email = req.query.employeeemail;
  var esalary = req.query.employeesalary;
  var emailer = req.query.employeemailer;
  var etype = req.query.employeetype;

  console.log("Mailer:" + emailer);
  console.log("Type:" + etype);

  if (emailer == 1 || emailer == 0) {
    var maileraddon = " and dbemployeemailer = ?";
    var maileraddonvar = emailer;
  } else {
    var maileraddon = " and dbemployeemailer Like ?";
    var maileraddonvar = "%%";
  }
  if (etype > 0) {
    var typeaddon = " and dbemployeetype = ?";
    var typeaddonvar = etype;
  } else {
    var typeaddon = " and dbemployeetype Like ?";
    var typeaddonvar = "%%";
  }

  var sqlsel =
    "select employeetable.*, employeetypes.dbemptypename from employeetable " +
    "inner join employeetypes on employeetypes.dbemptypeid = employeetable.dbemployeetype " +
    "where dbemployeeid Like ? and dbemployeename Like ? and dbemployeephone Like ? " +
    "and dbemployeeemail Like ? and dbemployeesalary Like ?" +
    maileraddon +
    typeaddon;

  var inserts = [
    "%" + eid + "%",
    "%" + ename + "%",
    "%" + ephone + "%",
    "%" + email + "%",
    "%" + esalary + "%",
    maileraddonvar,
    typeaddonvar,
  ];
  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get("/getcus/", function (req, res) {
  var cname = req.query.customername;
  var caddress = req.query.customeraddress;
  var czip = req.query.customerzip;
  var ccredit = req.query.customercredit;
  var cemail = req.query.customeremail;
  var cparticipant = req.query.customerparticipant;
  var creward = req.query.customerrewards;

  console.log("Participant: " + cparticipant);
  console.log("Reward Level: " + creward);

  if (cparticipant == 1 || cparticipant == 0) {
    var participantaddon = " and dbcustparticipant = ?";
    var participantaddonvar = cparticipant;
  } else {
    var participantaddon = " and dbcustparticipant Like ?";
    var participantaddonvar = "%%";
  }
  if (creward > 0) {
    var rewardaddon = " and dbcustreward = ?";
    var rewardaddonvar = creward;
  } else {
    var rewardaddon = " and dbcustreward Like ?";
    var rewardaddonvar = "%%";
  }

  var sqlsel =
    "Select * from customertable where dbcustomername Like ? and dbcustomeraddress Like ? " +
    "and dbcustomerzip Like ? and dbcustomercredit Like ? and dbcustomeremail Like ?" +
    participantaddon +
    rewardaddon;
  var inserts = [
    "%" + cname + "%",
    "%" + caddress + "%",
    "%" + czip + "%",
    "%" + ccredit + "%",
    "%" + cemail + "%",
    participantaddonvar,
    rewardaddonvar,
  ];
  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.post("/customer", function (req, res) {
  var cname = req.body.customername;
  var caddress = req.body.customeraddress;
  var czip = req.body.customerzip;
  var ccredit = req.body.customercredit;
  var cemail = req.body.customeremail;
  var cpw = req.body.customerpw;
  var cparticipant = req.body.customerparticipant;
  var creward = req.body.customerrewards;
  console.log("username: " + cname);
  console.log("pw: " + cpw);

  var saltRounds = 10;
  var theHashedPW = "";
  bcrypt.hash(cpw, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log("Bad");
      return;
    } else {
      theHashedPW = hashedPassword;
      console.log("Pass 1: " + theHashedPW);
      var sqlins =
        "INSERT INTO customertable (dbcustomername, dbcustomeraddress, dbcustomerzip, dbcustomercredit, dbcustomeremail, dbcustparticipant, dbcustreward, dbcustpassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      var inserts = [
        cname,
        caddress,
        czip,
        ccredit,
        cemail,
        cparticipant,
        creward,
        theHashedPW,
      ];

      var sql = mysql.format(sqlins, inserts);

      con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 set recorded");
        res.redirect("insertcustomer.html");
        res.end();
      });
    }
  });
});

//     var sqlins = "INSERT INTO customertable (dbcustomername, dbcustomeraddress, dbcustomerzip, dbcustomercredit, dbcustomeremail, dbcustparticipant, dbcustreward, dbcustpassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

//     var inserts = [cname, caddress, czip, ccredit, cemail, cparticipant, creward, cpw];

//     var sql = mysql.format(sqlins, inserts)

//     con.execute(sql, function (err, result) {
//         if (err) throw err;
//         console.log("1 set recorded");
//         res.redirect("insertcustomer.html");
//         res.end();
//     });
// });

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/insertemployee.html"));
});

app.post("/employee", function (req, res) {
  var eid = req.body.employeeid;
  var ename = req.body.employeename;
  var eemail = req.body.employeeemail;
  var epw = req.body.employeepw;
  var ephone = req.body.employeephone;
  var esalary = req.body.employeesalary;
  var emailer = req.body.employeemailer;
  var etype = req.body.employeetype;
  console.log(ename);
  console.log(epw);

  var saltRounds = 10;
  var theHashedPW = "";
  bcrypt.hash(epw, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log("bad");
      return;
    } else {
      theHashedPW = hashedPassword;
      console.log("password 1: " + theHashedPW);

      var sqlins =
        "INSERT INTO employeetable (dbemployeeid, dbemployeename, dbemployeeemail, dbemployeephone, dbemployeesalary, dbemployeemailer, dbemployeetype, dbemployeepassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      var inserts = [
        eid,
        ename,
        eemail,
        ephone,
        esalary,
        emailer,
        etype,
        theHashedPW,
      ];

      var sql = mysql.format(sqlins, inserts);

      con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 set recorded");
        res.redirect("insertemployee.html");
        res.end();
      });
    }
  });
});

//     var sqlins = "INSERT INTO employeetable (dbemployeeid, dbemployeename, dbemployeeemail, dbemployeephone, dbemployeesalary, dbemployeemailer, dbemployeetype, dbemployeepassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

//     var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, theHashedPW];

//     var sql = mysql.format(sqlins, inserts)

//     con.execute(sql, function (err, result) {
//         if (err) throw err;
//         console.log("1 set recorded");
//         res.redirect("insertemployee.html");
//         res.end();
//     });
// });

app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
