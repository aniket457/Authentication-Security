//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/useDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser.save().then(function (user) {
      if (user) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }).then(function (foundUser) {
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result == true) {
          res.render("secrets");
        } else {
          res.render("login");
        }
      });
    } else {
      res.redirect("/register");
    }
  });
});

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
