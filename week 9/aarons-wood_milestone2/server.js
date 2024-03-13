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
  user: "eaaronsw_CapstoneAdmin",
  password: "P@s$w0rd0312",
  database: "eaaronsw_Capstone",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connection Complete!");
});

app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.redirect("/admin/insertuser.html");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/getusercat/", function (req, res) {
  var fname = req.query.facultyname;
  var femail = req.query.facultyemail;
  console.log(fname, femail);

  var sqlsel = "SELECT * FROM Category";
  // var inserts = ['%' + fname + '%', '%' + femail + '%'];
  var sql = mysql.format(sqlsel);
  console.log(sql);

  con.execute(sql, function (err, data) {
    if (err) throw err;
    console.log("1 set recorded");
    console.log(data);
    // res.redirect("/user/insertfaculty.html");
    // res.end();
    res.send(JSON.stringify(data));
  });
});

app.get("/getuserrole/", function (req, res) {
  var fname = req.query.facultyname;
  var femail = req.query.facultyemail;
  console.log(fname, femail);

  var sqlsel = "SELECT * FROM Role";
  // var inserts = ['%' + fname + '%', '%' + femail + '%'];
  var sql = mysql.format(sqlsel);
  console.log(sql);

  con.execute(sql, function (err, data) {
    if (err) throw err;
    console.log("1 set recorded");
    console.log(data);
    // res.redirect("/user/insertfaculty.html");
    // res.end();
    res.send(JSON.stringify(data));
  });
});

app.post("/insertuser", function (req, res) {
  var cname = req.body.customername;
  var clastname = req.body.userlastname; // Added based on the form
  var caddress = req.body.customeraddress;
  var ccity = req.body.usercity; // Added based on the form
  var cstate = req.body.userstate; // Added based on the form
  var czip = req.body.customerzip;
  var cemail = req.body.customeremail;
  var cpw = req.body.customerpw;
  var userCat = req.body.userCat;
  var userRole = req.body.userRole;

  var saltRounds = 10;
  var theHashedPW = "";
  bcrypt.hash(cpw, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log("Error hashing password: ", err);
      return res.status(500).send("Error processing the request.");
    } else {
      theHashedPW = hashedPassword;
      var sqlins =
        "INSERT INTO User (UserFirstName, UserLastName, UserAddress, UserCity, UserState, UserZip, UserEmail, UserPassword, CatagoryID, RoleID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      var inserts = [
        cname,
        clastname,
        caddress,
        ccity,
        cstate,
        czip,
        cemail,
        theHashedPW,
        userCat,
        userRole,
      ];

      var sql = mysql.format(sqlins, inserts);

      con.execute(sql, function (err, result) {
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).send("Error processing the request.");
        }
        console.log("1 set recorded");
        res.redirect("insertuser.html");
      });
    }
  });
});

app.get("/searchusers", function (req, res) {
  const name = req.query.name;
  const lastname = req.query.lastname;
  const address = req.query.address;
  const city = req.query.city;
  const state = req.query.state;
  const zip = req.query.zip;
  const email = req.query.email;
  const userCat = req.query.userCat;
  const userRole = req.query.userRole;

  // Construct the SQL query
  let sql = `SELECT * FROM User WHERE `;
  let conditions = [];

  // Add conditions for each filter, if provided
  if (name) conditions.push(`UserFirstName LIKE '%${name}%'`);
  if (lastname) conditions.push(`UserLastName LIKE '%${lastname}%'`);
  if (address) conditions.push(`UserAddress LIKE '%${address}%'`);
  if (city) conditions.push(`UserCity LIKE '%${city}%'`);
  if (state) conditions.push(`UserState LIKE '%${state}%'`);
  if (zip) conditions.push(`UserZip LIKE '%${zip}%'`);
  if (email) conditions.push(`UserEmail LIKE '%${email}%'`);
  if (userCat) conditions.push(`CatagoryID = ${userCat}`);
  if (userRole) conditions.push(`RoleID = ${userRole}`);

  // Join all conditions using AND
  sql += conditions.join(" AND ");

  // Handle the case where there are no conditions
  if (conditions.length === 0) {
    sql = sql.replace("WHERE", "");
  }

  console.log(sql); // for debugging

  // Execute the SQL query
  con.query(sql, function (err, results) {
    if (err) {
      console.error("Error executing the query", err);
      return res.status(500).send("Error executing the query");
    }

    // Send the results back to the client
    res.json(results);
    console.log(results);
  });
});

app.post("/updateuser", function (req, res) {
  // Extracting data sent from the frontend
  var userId = req.body.userId; // Unique identifier for the user to be updated
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var address = req.body.address;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var roleId = req.body.roleId;
  var categoryId = req.body.categoryId;

  // SQL query
  var sqlUpdate =
    "UPDATE User SET UserFirstName = ?, UserLastName = ?, UserAddress = ?, UserCity = ?, UserState = ?, UserZip = ?, UserEmail = ?, CatagoryID = ?, RoleID = ? WHERE UserID = ?";

  var updates = [
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    email,
    categoryId,
    roleId,
    userId,
  ];

  var sql = mysql.format(sqlUpdate, updates);

  con.execute(sql, function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).send("Error processing the request.");
    }
    console.log("User updated successfully");
    // Send a response back to the client
    res.json({ message: "User updated successfully", userId: userId });
  });
});

app.post("/insertproduct", function (req, res) {
  var pName = req.body.productName;
  var pDesc = req.body.productDesc;
  var pPrice = req.body.productPrice;
  var pSize = req.body.productSize;

  var sqlins =
    "INSERT INTO Product (ProductName, ProductDesc, ProductPrice, ProductSize) VALUES (?, ?, ?, ?)";
  var inserts = [pName, pDesc, pPrice, pSize];
  var sql = mysql.format(sqlins, inserts);

  con.query(sql, function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).send("Error processing the request.");
    }
    console.log("1 product inserted");
    res.send({ success: true, productId: result.insertId}); // Respond with success and the ID of the inserted product
  });
});

app.post("/updateproduct", function (req, res) {
  // Extract the product information from the request body
  var pId = req.body.productId;
  var pName = req.body.productName;
  var pDesc = req.body.productDesc;
  var pPrice = req.body.productPrice;
  var pSize = req.body.productSize;

  // SQL statement to update the product
  var sqlUpdate = `
    UPDATE Product 
    SET ProductName = ?, ProductDesc = ?, ProductPrice = ?, ProductSize = ? 
    WHERE ProductID = ?`;

  // Array of values to use in the SQL statement
  var updates = [pName, pDesc, pPrice, pSize, pId];
  var sql = mysql.format(sqlUpdate, updates);

  // Execute the update query
  con.query(sql, function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).send({ success: false, message: "Error processing the request." });
    }
    console.log("Product updated successfully");
    res.send({ success: true, message: "Product updated successfully", productId: pId });
  });
});


app.get("/searchproducts", function (req, res) {
  // Assume that the query parameters could be used for searching/filtering
  const name = req.query.name;
  const desc = req.query.desc;
  const price = req.query.price;
  const size = req.query.size;

  // Construct the SQL query
  let sql = "SELECT ProductID, ProductName, ProductDesc, ProductPrice, ProductSize FROM Product";
  let conditions = [];
  let params = [];

  // Add conditions for each filter, if provided
  if (name) {
    conditions.push("ProductName LIKE ?");
    params.push(`%${name}%`);
  }
  if (desc) {
    conditions.push("ProductDesc LIKE ?");
    params.push(`%${desc}%`);
  }
  if (price) {
    conditions.push("ProductPrice = ?");
    params.push(price);
  }
  if (size) {
    conditions.push("ProductSize LIKE ?");
    params.push(`%${size}%`);
  }

  // Join all conditions using AND, or select all if no conditions
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log(sql); // For debugging

  // Execute the SQL query with parameter substitution to prevent SQL injection
  con.query(sql, params, function (err, results) {
    if (err) {
      console.error("Error executing the query", err);
      return res.status(500).send("Error executing the query");
    }
    // Send the results back to the client
    res.json(results);
  });
});

app.post("/insertinventory", function (req, res) {
  var invProductId = req.body.productID;
  var invQuantity = req.body.inventoryQuantity;

  // SQL Query to insert inventory data
  var sqlins = "INSERT INTO Inventory (ProductID, InventoryQuantity) VALUES (?, ?)";
  var inserts = [invProductId, invQuantity];
  var sql = mysql.format(sqlins, inserts);

  // Execute SQL query
  con.query(sql, function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).send("Error processing the request.");
    }
    console.log("1 inventory record inserted");
    res.send({ success: true, inventoryId: result.insertId });
  });
});

app.post("/updateinventory", function (req, res) {
  var inventoryId = req.body.inventoryId;
  var quantity = req.body.quantity;

  if (!inventoryId || quantity === undefined) {
    return res.status(400).send({ message: "Inventory ID and Quantity are required." });
  }

  var sqlUpdate = "UPDATE Inventory SET InventoryQuantity = ? WHERE InventoryID = ?";
  var updates = [quantity, inventoryId];

  con.execute(sqlUpdate, updates, function (err, result) {
    if (err) {
      console.error("Error executing inventory update query: ", err);
      return res.status(500).send({ message: "Error updating inventory." });
    }
    console.log("Inventory updated successfully");
    res.json({ message: "Inventory updated successfully", inventoryId: inventoryId });
  });
});


app.get("/searchinventory", function (req, res) {
  // Assume that the query parameters could be used for searching/filtering
  const productId = req.query.productId;
  const inventoryQuantity = req.query.inventoryQuantity;

  // Construct the SQL query
  let sql = `
    SELECT inv.InventoryID, inv.ProductID, prod.ProductName, inv.InventoryQuantity
    FROM Inventory inv
    INNER JOIN Product prod ON inv.ProductID = prod.ProductID
  `;
  let conditions = [];
  let params = [];

  // Add conditions for each filter, if provided
  if (productId) {
    conditions.push("prod.ProductID = ?");
    params.push(productId);
  }
  if (inventoryQuantity) {
    conditions.push("inv.InventoryQuantity = ?");
    params.push(inventoryQuantity);
  }

  // Join all conditions using AND, or select all if no conditions
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log(sql); // For debugging

  // Execute the SQL query with parameter substitution to prevent SQL injection
  con.query(sql, params, function (err, results) {
    if (err) {
      console.error("Error executing the inventory search query", err);
      return res.status(500).send("Error executing the inventory search query");
    }
    // Send the results back to the client
    res.json(results);
  });
});

app.get("/getplayers", function (req, res) {
  // Construct the SQL query to select all players
  let sql = "SELECT PlayerID, PlayerFirstName FROM Player";

  // Execute the SQL query
  con.query(sql, function (err, results) {
    if (err) {
      console.error("Error executing the query", err);
      return res.status(500).send("Error executing the query");
    }

    // Send the results back to the client
    res.json(results);
    console.log(results);
  });
});



app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
