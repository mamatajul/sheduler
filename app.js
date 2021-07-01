// jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin-chanchal:pokemonc@cluster0.zha3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = {
  name : String
};

const Item = mongoose.model("Item", itemSchema);

const item = new Item ({
  name : "Do More"
});

const defaultItems = [item];


app.get("/", function(req, res) {
  const day = date();
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        }else {
          console.log("Successfully added new items.");
        };
      });
      res.redirect("/");
    }
      res.render("list", { listTitle: day,  newItemList: foundItems });
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log(err);
    }else {
      res.redirect("/");
    }
  });
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newItemList: workItems
  });
});

app.post("/work", function(req, res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(req, res) {
  console.log("Server has started Successfully");
});
