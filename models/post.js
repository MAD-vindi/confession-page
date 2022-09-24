const mongoose = require('mongoose'); 

const postSchema = new mongoose.Schema({
  title: String,
  category: String,
  content: String,
  postDate: String,
  username: String,
})

module.exports = mongoose.model("Post", postSchema); 