'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// added
const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "eaaronsw_internetProg",
    password: "P@s$w0rd0312",
    database: "eaaronsw_internetProgAndDatabaseSPR24"

});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connection Complete!")
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/insertcustomer.html'))
});
app.get('/getcustypes/', function (req, res) {
    var sqlsel = 'select * from customerewards';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getemptypes/', function (req, res) {
    var sqlsel = 'select * from employeetypes';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getemp/', function (req, res) {
    var eid = req.query.employeeid;
    var ename = req.query.employeename;
    var ephone = req.query.employeephone;
    var email = req.query.employeeemail;
    var esalary = req.query.employeesalary;
    var emailer = req.query.employeemailer;
    var etype = req.query.employeetype;

    console.log("Mailer:"+ emailer);
    console.log("Type:" + etype);

    if (emailer == 1 || emailer == 0) {
        var maileraddon = ' and dbemployeemailer = ?';
        var maileraddonvar = emailer;
    } else {
        var maileraddon = ' and dbemployeemailer Like ?';
        var maileraddonvar = "%%";
    }
    if (etype > 0) {
        var typeaddon = ' and dbemployeetype = ?';
        var typeaddonvar = etype;
    } else {
        var typeaddon = ' and dbemployeetype Like ?';
        var typeaddonvar = '%%';
    }
  
    var sqlsel = 'select employeetable.*, employeetypes.dbemptypename from employeetable ' +
             'inner join employeetypes on employeetypes.dbemptypeid = employeetable.dbemployeetype ' +
             'where dbemployeeid Like ? and dbemployeename Like ? and dbemployeephone Like ? ' +
             'and dbemployeeemail Like ? and dbemployeesalary Like ?' + maileraddon + typeaddon;

    var inserts = ['%' + eid + '%', '%' + ename + '%', '%' + ephone + '%', '%' + email + '%', '%' + esalary + '%', maileraddonvar, typeaddonvar];
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

app.get('/getcus/', function (req, res) {
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
        var participantaddon = ' and dbcustparticipant = ?';
        var participantaddonvar = cparticipant;
    } else {
        var participantaddon = ' and dbcustparticipant Like ?';
        var participantaddonvar = '%%';
    }
    if (creward > 0) {
        var rewardaddon = ' and dbcustreward = ?';
        var rewardaddonvar = creward;
    } else {
        var rewardaddon = ' and dbcustreward Like ?';
        var rewardaddonvar = '%%';
    }
  
    var sqlsel = 'Select * from customertable where dbcustomername Like ? and dbcustomeraddress Like ? ' +
              'and dbcustomerzip Like ? and dbcustomercredit Like ? and dbcustomeremail Like ?' + participantaddon + rewardaddon;
    var inserts = ['%' + cname + '%', '%' + caddress + '%', '%' + czip + '%', '%' + ccredit + '%', '%' + cemail + '%', participantaddonvar, rewardaddonvar];
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

app.post('/customer', function (req, res) {
    var cname = req.body.customername;
    var caddress = req.body.customeraddress;
    var czip = req.body.customerzip;
    var ccredit = req.body.customercredit;
    var cemail = req.body.customeremail;
    var cparticipant = req.body.customerparticipant;
    var creward = req.body.customerrewards;
    console.log(cname)

    var sqlins = "INSERT INTO customertable (dbcustomername, dbcustomeraddress, dbcustomerzip, dbcustomercredit, dbcustomeremail, dbcustparticipant, dbcustreward) VALUES (?, ?, ?, ?, ?, ?, ?)";

    var inserts = [cname, caddress, czip, ccredit, cemail, cparticipant, creward];

    var sql = mysql.format(sqlins, inserts)

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 set recorded");
        res.redirect("insertcustomer.html");
        res.end();
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/insertemployee.html'))
});

app.post('/employee', function (req, res) {
    var eid = req.body.employeeid;
    var ename = req.body.employeename;
    var eemail = req.body.employeeemail;
    var ephone = req.body.employeephone;
    var esalary = req.body.employeesalary;
    var emailer = req.body.employeemailer;
    var etype = req.body.employeetype;
    console.log(ename)

    var sqlins = "INSERT INTO employeetable (dbemployeeid, dbemployeename, dbemployeeemail, dbemployeephone, dbemployeesalary, dbemployeemailer, dbemployeetype) VALUES (?, ?, ?, ?, ?, ?, ?)";

    var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype];

    var sql = mysql.format(sqlins, inserts)

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 set recorded");
        res.redirect("insertemployee.html");
        res.end();
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
