const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const fs = require("fs");
const path = require("path");

app.use(bodyParser.json());
app.use(express.static("public"));

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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
