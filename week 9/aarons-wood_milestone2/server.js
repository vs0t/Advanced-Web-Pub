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
app.get("/", function (req, res) {
  res.redirect("landing.html");
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
  var employeenameEA = req.body.employeename;
  var employeelastnameEA = req.body.employeelastname;
  var employeeaddressEA = req.body.employeeaddress;
  var employeecityEA = req.body.employeecity;
  var employeestateEA = req.body.employeestate;
  var employeezipEA = req.body.employeezip;
  var employeeemailEA = req.body.employeeemail;
  var employeepwEA = req.body.employeepw;
  var userCatEA = req.body.userCat;
  var userRoleEA = req.body.userRole;

  var saltRounds = 10;
  var theHashedPWEA = "";

  bcrypt.hash(employeepwEA, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log("Error hashing password: ", err);
      return res.status(500).send("Error processing the request.");
    } else {
      theHashedPWEA = hashedPassword;
      var sqlinsEA = "INSERT INTO User (UserFirstName, UserLastName, UserAddress, UserCity, UserState, UserZip, UserEmail, UserPassword, CatagoryID, RoleID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      var insertsEA = [
        employeenameEA,
        employeelastnameEA,
        employeeaddressEA,
        employeecityEA,
        employeestateEA,
        employeezipEA,
        employeeemailEA,
        theHashedPWEA,
        userCatEA,
        userRoleEA,
      ];
      var sqlEA = mysql.format(sqlinsEA, insertsEA);
      con.execute(sqlEA, function (err, result) {
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
  var pNameEA = req.body.productName;
  var pDescEA = req.body.productDesc;
  var pPriceEA = req.body.productPrice;
  var pSizeEA = req.body.productSize;

  var sqlinsEA = "INSERT INTO Product (ProductName, ProductDesc, ProductPrice, ProductSize) VALUES (?, ?, ?, ?)";
  var insertsEA = [pNameEA, pDescEA, pPriceEA, pSizeEA];
  var sqlEA = mysql.format(sqlinsEA, insertsEA);

  con.query(sqlEA, function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).send("Error processing the request.");
    }
    console.log("1 product inserted");
    res.send({ success: true, productId: result.insertId }); // Respond with success and the ID of the inserted product
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
      return res
        .status(500)
        .send({ success: false, message: "Error processing the request." });
    }
    console.log("Product updated successfully");
    res.send({
      success: true,
      message: "Product updated successfully",
      productId: pId,
    });
  });
});

app.get("/searchproducts", function (req, res) {
  // Assume that the query parameters could be used for searching/filtering
  const name = req.query.name;
  const desc = req.query.desc;
  const price = req.query.price;
  const size = req.query.size;

  // Construct the SQL query
  let sql =
    "SELECT ProductID, ProductName, ProductDesc, ProductPrice, ProductSize FROM Product";
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
  var invProductIdEA = req.body.productID;
  var invQuantityEA = req.body.inventoryQuantity;

  // SQL Query to insert inventory data
  var sqlinsEA = "INSERT INTO Inventory (ProductID, InventoryQuantity) VALUES (?, ?)";
  var insertsEA = [invProductIdEA, invQuantityEA];
  var sqlEA = mysql.format(sqlinsEA, insertsEA);

  // Execute SQL query
  con.query(sqlEA, function (err, result) {
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
    return res
      .status(400)
      .send({ message: "Inventory ID and Quantity are required." });
  }

  var sqlUpdate =
    "UPDATE Inventory SET InventoryQuantity = ? WHERE InventoryID = ?";
  var updates = [quantity, inventoryId];

  con.execute(sqlUpdate, updates, function (err, result) {
    if (err) {
      console.error("Error executing inventory update query: ", err);
      return res.status(500).send({ message: "Error updating inventory." });
    }
    console.log("Inventory updated successfully");
    res.json({
      message: "Inventory updated successfully",
      inventoryId: inventoryId,
    });
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

app.post("/insertplayer", function (req, res) {
  var playerFirstNameEA = req.body.playerFirstName;
  var playerLastNameEA = req.body.playerLastName;
  var playerEmailEA = req.body.playerEmail;
  var playerPasswordEA = req.body.playerPassword;
  var playerAddressEA = req.body.playerAddress;
  var playerCityEA = req.body.playerCity;
  var playerStateEA = req.body.playerState;
  var playerZipEA = req.body.playerZip;
  var rewardsIdEA = req.body.rewardsId;

  var saltRounds = 10;

  // Hash the player's password
  bcrypt.hash(playerPasswordEA, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log("Error hashing password: ", err);
      return res.status(500).send("Error processing the request.");
    } else {
      var theHashedPWEA = hashedPassword;
      var sqlins =
        "INSERT INTO Player (PlayerFirstName, PlayerLastName, PlayerEmail, PlayerPassword, PlayerAddress, PlayerCity, PlayerState, PlayerZip, RewardsID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      var inserts = [
        playerFirstNameEA,
        playerLastNameEA,
        playerEmailEA,
        theHashedPWEA,
        playerAddressEA,
        playerCityEA,
        playerStateEA,
        playerZipEA,
        rewardsIdEA,
      ];
      var sql = mysql.format(sqlins, inserts);

      // Execute the SQL query
      con.execute(sql, function (err, result) {
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).send("Error processing the request.");
        }
        console.log("1 record inserted");
        // Redirect or send a response here
        res.send({
          success: true,
          message: "Player inserted successfully.",
        });
      });
    }
  });
});

app.get("/getplayers", function (req, res) {
  // Construct the SQL query to select all players
  let sql = "SELECT PlayerID, PlayerFirstName, PlayerLastName FROM Player";

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

app.post("/insertorder", function (req, res) {
  // Extract order details from the request body
  var userIdEA = req.body.userId;
  var productIdEA = req.body.productId;
  var quantityEA = req.body.quantity;
  var priceEA = req.body.price;
  var dateEA = req.body.date;
  var timeEA = req.body.time;
  var orderStatusEA = req.body.orderStatus;

  // Create SQL to insert the order
  var sqlinsEA = `INSERT INTO Orders (UserID, ProductID, OrderQuantity, OrderTotalPrice, OrdersDate, OrdersTime, OrderStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  var valuesEA = [
    userIdEA,
    productIdEA,
    quantityEA,
    priceEA * quantityEA,
    dateEA,
    timeEA,
    orderStatusEA,
  ];
  var sqlEA = mysql.format(sqlinsEA, valuesEA);

  // Execute the SQL query
  con.execute(sqlEA, function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).send("Error processing the request.");
    }
    console.log("1 record inserted");
    // Redirect or send a response here
    res.send({ success: true, message: "Order inserted successfully." });
  });
});

app.post("/insertreservation", function (req, res) {
  // Extract reservation details from the request body
  var playerIdEA = req.body.playerId;
  var reservationsDateEA = req.body.reservationsDate;
  var reservationsTimeEA = req.body.reservationsTime;
  var reservationsCountEA = req.body.reservationsCount;
  var reservationsStatusEA = '0'; // Default status is '0'

  // SQL query to insert the reservation data
  var sqlinsEA = "INSERT INTO Reservations (PlayerID, ReservationsDate, ReservationsTime, ReservationsCount, ReservationsStatus) VALUES (?, ?, ?, ?, ?)";
  var insertsEA = [
    playerIdEA,
    reservationsDateEA,
    reservationsTimeEA,
    reservationsCountEA,
    reservationsStatusEA
  ];
  var sqlEA = mysql.format(sqlinsEA, insertsEA);

  // Execute the SQL query
  con.execute(sqlEA, function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).send("Error processing the reservation request.");
    }
    console.log("1 reservation inserted");
    console.log(sqlEA);
    res.send({
      success: true,
      message: "Reservation inserted successfully.",
      reservationId: result.insertId
    });
  });
});


app.get("/getrewards", function (req, res) {
  // Construct the SQL query to select all players
  let sql = "SELECT * FROM Rewards";

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

app.post("/loginemp/", function (req, res) {
  var eemail = req.body.employeeemail;
  var epw = req.body.employeepw;
  var sqlsel = "select * from User where UserEmail = ?";
  var inserts = [eemail];
  var sql = mysql.format(sqlsel, inserts);
  console.log("sql: " + sql);
  con.query(sql, function (err, data) {
    if (data.length > 0) {
      console.log("user name correct:");
      console.log(data[0].UserPassword);
      bcrypt.compare(
        epw,
        data[0].UserPassword,
        function (err, passwordCorrect) {
          if (err) {
            throw err;
          } else if (!passwordCorrect) {
            console.log("Password incorrect");
          } else {
            console.log("password correct");
            res.send({ redirect: "insertuser.html" });
          }
        }
      );
    } else {
      console.log("incorrect username or password...");
    }
  });
});

app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
