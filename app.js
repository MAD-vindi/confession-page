//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");
const _ = require("lodash");
const User = require('./models/user'); 
const Post = require('./models/post'); 

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/confessionDB");

// const postSchema = {
//   title: String,
//   category: String,
//   content: String,
//   postDate: String,
//   username: String,
// };

// const userSchema = {
//   username: String,
//   password: String
// };

// const Post = new mongoose.model("Post", postSchema);
// const User = new mongoose.model("User", userSchema);

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({
    username: username
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("home", {
            currentUser: username
          })
        }
      }
    }
  })
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({
    username: username,
    password: md5(password)
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        currentUser: username
      });
    }
  })
})

app.get("/", function (req, res) {
  res.render("login");
})

app.get("/home", function (req, res) {
  res.render("home");
})

app.post("/home", function (req, res) {
  const date = new Date();
  const post = new Post({
    title: req.body.postTitle,
    category: req.body.postCategory,
    content: req.body.postBody,
    postDate: date.toDateString(),
    username: req.body.Author
  });

  // posts.push(post);
  post.save(function (err) {
    if (!err) {
      res.redirect("/confess");
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/confess", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("confess", {
      posts: posts
    });
  });
});


app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({
    _id: requestedPostId
  }, function (err, post) {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content,
        date: post.postDate
      });
    }
  });

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});