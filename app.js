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

const aboutContent = `
    Welcome to our platform, a safe and anonymous space where students can freely share their thoughts, feelings, and confessions. We understand that the journey through education is filled with a multitude of emotions, experiences, and challenges. Our website was born out of the desire to create a supportive community where students can express themselves without fear of judgment. Whether it's a secret, a triumph, a struggle, or a moment of inspiration, this platform is your canvas to paint your stories, knowing that you're not alone in your journey.

    At its core, our platform is built on the principles of empathy, respect, and inclusivity. We believe that everyone's story is unique and deserves to be heard. The power of confession lies in its cathartic effect – a chance to unburden your heart and mind, and in doing so, perhaps find solace in the shared experiences of others. Through anonymity, we aim to foster an environment where students from all walks of life can openly communicate their thoughts, forge connections, and realize that they are part of a larger, compassionate community. So, take a step into this virtual confessional, express yourself authentically, and discover the strength that comes from embracing your truth alongside fellow students.
`;
const contactContent = `
    Have questions, suggestions, or simply want to reach out? We're here to listen. Feel free to get in touch with us using the contact details provided below. Your feedback is invaluable as we continue to improve and grow our platform.

    **Email:** contact@example.com
    **Phone:** +123-456-7890
    **Address:** 123 Street, City, Country

    We are committed to maintaining a welcoming and responsive communication channel. Whether you have technical inquiries, partnership proposals, or anything in between, don't hesitate to connect with us. Your voice matters to us, and we look forward to hearing from you.
`;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// mongoose.connect("mongodb://admin:password@localhost:27017/confessionDB");
mongoose.connect(`mongodb://admin:password@localhost:27017/confessionDB?authSource=admin`); //for mongodb in docker

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
      }else{
        res.redirect("/register");
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
