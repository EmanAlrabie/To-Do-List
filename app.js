const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");

const app = express();
app.set("view engine", "ejs");
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var items = [];
var workItems = [];
// simple route
app.get("/", (req, res) => {
  res.render("list", { listTitle: "Sunday", newItem: items }); // render like send file but with parameters
});

app.post("/", (req, res) => {
  var newItem = req.body.newItem;
  if(req.body.button === "Work"){
    workItems.push(newItem);
    res.redirect("/work");
  }else{
    items.push(newItem);
    res.redirect("/");
  }
 
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", newItem: workItems });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
