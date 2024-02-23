const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const fs = require("fs");
const path = require("path");

app.use(bodyParser.json());
app.use(express.static("public"));

const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "eaaronsw_epicDBAdmin",
    password: "P@s$w0rd0312",
    database: "eaaronsw_epicDB2"

});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connection Complete!")
});

var FACULTY_FILE = path.join(__dirname, "faculty.json");
var COURSES_FILE = path.join(__dirname, "courses.json");
var COURSE_INFO_FILE = path.join(__dirname, 'courseinfo.json');


// Add this route to your server.js
app.post("/api/storefaculty", function (req, res) {
  fs.readFile(FACULTY_FILE, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var faculty = JSON.parse(data);
    var newFaculty = {
      id: Date.now(),
      name: req.body.name,
      email: req.body.email,
    };
    faculty.push(newFaculty);

    fs.writeFile(
      FACULTY_FILE,
      JSON.stringify(faculty, null, 4),
      function (err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        res.setHeader("Cache-Control", "no-cache");
        res.json(faculty);
      }
    );
  });
});

app.post("/api/insertcourse", function (req, res) {
  fs.readFile(COURSES_FILE, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    var courses = JSON.parse(data);

    // Log the received data
    console.log("Received course data:", req.body);

    var newCourse = {
      id: Date.now(),
      faculty: req.body.faculty,
      semester: req.body.semester,
      year: req.body.year,
      coursePrefix: req.body.coursePrefix,
      courseNumber: req.body.courseNumber,
      section: req.body.section,
    };

    // Log the new course data
    console.log("New course data:", newCourse);

    courses.push(newCourse);

    // Log the updated courses array
    console.log("Updated courses:", courses);

    fs.writeFile(
      COURSES_FILE,
      JSON.stringify(courses, null, 4),
      function (err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        res.setHeader("Cache-Control", "no-cache");
        res.json(courses);
      }
    );
  });
});
app.get("/api/courses", function (req, res) {
  fs.readFile(COURSES_FILE, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading course data");
    }
    res.json(JSON.parse(data));
  });
});
app.post("/api/sendemail", function (req, res) {
    const { recipient, subject, body } = req.body;
  
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });
  
    // Setup email data
    const mailOptions = {
      from: "your-email@gmail.com",
      to: recipient,
      subject: subject,
      text: body,
    };
  
    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  });

app.get('/api/courseinfo', (req, res) => {
  fs.readFile(COURSE_INFO_FILE, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading course info');
    }
    res.json(JSON.parse(data));
  });
});

app.post('/course', function (req, res) {
  var faculty = req.body.faculty;
  var semester = req.body.semester;
  var year = req.body.year;
  var coursePrefix = req.body.coursePrefix;
  var courseNumber = req.body.courseNumber;
  var section = req.body.section;
  var coursePrefix = req.body.coursePrefix;
  // var epw = req.body.employeepw;
  // var ephone = req.body.employeephone;
  // var esalary = req.body.employeesalary;
  // var emailer = req.body.employeemailer;
  // var etype = req.body.employeetype;
  console.log(faculty)
  console.log(coursePrefix)

  var sqlins = "INSERT INTO epiccourses (courseprefix, coursenumber, coursesection, coursesemester, courseyear, courseinstructor) VALUES (?, ?, ?, ?, ?, ?)";
  var inserts = [coursePrefix, courseNumber, section, semester, year, faculty];
  var sql = mysql.format(sqlins, inserts);

  // Execute SQL statement
  con.execute(sql, function (err, result) {
      if (err) throw err;
      console.log("1 set recorded");
      // res.redirect("/user/insertfaculty.html");
      res.end();
  });
});

app.get('/showcourses/', function(req, res) {
  var sqlsel = "SELECT courseprefix, coursenumber, coursesection, coursesemester, courseyear, courseinstructor FROM epiccourses";
  var sql = mysql.format(sqlsel);

  // Execute SQL statement
  con.execute(sql, function (err, data) {
      if (err) throw err;
      console.log("1 set recorded");
      // res.redirect("/user/insertfaculty.html");
      // res.end();
      res.send(JSON.stringify(data));
      

  });
});

app.get('/searchcourse/', function (req, res) {
  var faculty = req.query.faculty;
  var semester = req.query.semester;
  var year = req.query.year;
  var coursePrefix = req.query.coursePrefix;
  var courseNumber = req.query.courseNumber;
  var courseSection = req.query.courseSection;
  // var epw = req.body.employeepw;
  // var ephone = req.body.employeephone;
  // var esalary = req.body.employeesalary;
  // var emailer = req.body.employeemailer;
  // var etype = req.body.employeetype;
  console.log(faculty);
  console.log(coursePrefix);

  var sqlsel = "SELECT * FROM epiccourses WHERE courseprefix LIKE ? AND coursenumber LIKE ? AND coursesection LIKE ? " +
  "AND coursesemester LIKE ? AND courseyear LIKE ? AND courseinstructor LIKE ?";
  var inserts = ['%' + coursePrefix + '%', '%' + courseNumber + '%', '%' + courseSection + '%', 
                 '%' + semester + '%', '%' + year + '%', '%' + faculty + '%'];
  var sql = mysql.format(sqlsel, inserts);
  console.log(sql);

  // Execute SQL statement
  con.execute(sql, function (err, data) {
      if (err) throw err;
      console.log("1 set recorded");
      console.log(data)
      // res.redirect("/user/insertfaculty.html");
      // res.end();
      res.send(JSON.stringify(data));
      

  });
});

app.get('/searchfac/', function(req, res) {
  var fname = req.query.facultyname;
  var femail = req.query.facultyemail;
  console.log(fname, femail);

  var sqlsel = "SELECT * FROM epicusers";
  // var inserts = ['%' + fname + '%', '%' + femail + '%'];
  var sql = mysql.format(sqlsel);
  console.log(sql);

  con.execute(sql, function (err, data) {
    if (err) throw err;
    console.log("1 set recorded");
    console.log(data)
    // res.redirect("/user/insertfaculty.html");
    // res.end();
    res.send(JSON.stringify(data));
    

});
});

app.get('/facdropdown', function(req, res) {
  
});

app.post('/faculty', function (req, res) {
  // var fid = req.body.facultyid;
  var fname = req.body.facultyname;
  var femail = req.body.facultyemail;
  // var epw = req.body.employeepw;
  // var ephone = req.body.employeephone;
  // var esalary = req.body.employeesalary;
  // var emailer = req.body.employeemailer;
  // var etype = req.body.employeetype;
  console.log(fname)
  console.log(femail)

  var sqlins = "INSERT INTO epicusers (username, useremail) VALUES (?, ?)";
  var inserts = [fname, femail];
  var sql = mysql.format(sqlins, inserts);

  // Execute SQL statement
  con.execute(sql, function (err, result) {
      if (err) throw err;
      console.log("1 set recorded");
      // res.redirect("/user/insertfaculty.html");
      res.end();
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/login.html'))
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
