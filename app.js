const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();
app.set("view engine", "ejs");

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//connect with a database
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

//Database for the default list
//create a schema for
const itemsSchema = {
  name: String,
};
//create model
const ItemModel = mongoose.model("item", itemsSchema);

//Database for the custom lists
//create schema
const listSchema = {
  name: String,
  items: [itemsSchema],
};
//create model
const ListModel = mongoose.model("List", listSchema);

// Default items
const item1 = new ItemModel({
  name: "Welcome to your todolist!",
});
const item2 = new ItemModel({
  name: "Hit + button to add a new item.",
});
const item3 = new ItemModel({
  name: "<-- Hit this to delete an item.",
});
const items = [item1, item2, item3];


// routes: get homepage
app.get("/", (req, res) => {
  ItemModel.find({}, (err, item) => {
    if (item.length === 0) {
      ItemModel.insertMany(items, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Done!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Default", newItem: item }); // render like send file but with parameters
    }
  });
});

// routes: post to homepage
app.post("/", (req, res) => {
  var newItem = req.body.newItem;
  var listName = req.body.button;

  const itemDocument = new ItemModel({
    name: newItem,
  });

  if (listName === "Default") {
    itemDocument.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
  } else {
    ListModel.findOne({ name: listName }, (err, list) => {
      list.items.push(itemDocument);
      list.save();
      res.redirect("/" + listName);
    });
  }
});

// routes: get custem lists
app.get("/:custemListName", (req, res) => {
  const custemListName = _.capitalize(req.params.custemListName);

  ListModel.findOne({ name: custemListName }, (err, list) => {
    if (!err) {
      if (!list) {
        //create new list
        const list = new ListModel({
          name: custemListName,
          items: items, // defult items
        });

        list.save();
        res.redirect("/" + custemListName);
      } else {
        //show an existing list
        res.render("list", { listTitle: custemListName, newItem: list.items });
      }
    }
  });
});


app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Default") {
    ItemModel.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  }else{
    ListModel.findOneAndUpdate(
      {name: listName}, //the filter 
      {$pull:{items: {_id: checkedItemId}}}, // the update we want to applied. The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
      function(err,foundList){
        if (! err){
          res.redirect("/"+ listName)
        }
      })
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
