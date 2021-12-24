const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");

const app = express();
app.set("view engine", "ejs");
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

var items = []

// simple route
app.get("/", (req, res) => {
  res.render("list", { day: "Sunday", newItem: items });
  //   res.json({ message: "Welcome to bezkoder application." });
});

app.post("/", (req, res) => {
var newItem = req.body.newItem;
items.push(newItem)
  res.redirect("/");
 
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
