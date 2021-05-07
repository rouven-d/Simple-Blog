//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is a simple blog website I built while learning backend development with node.js. The blog uses a mongodb database that I set-up with mongoose.";
const aboutContent = "Hi, I'm Rouven. Currently learning full stack web development via an online bootcamp. During day time I'm working as a project manager in the healthcare sector, in the evenings I learn how to code or work on my side project: Hiroi: Hiring Open Innovation.";
const contactContent = "You can reach out to me via the channels below.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// mongoose.connect("mongodb://localhost:27017/blogPostsDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});


const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String
});


const BlogPost = mongoose.model("BlogPost", blogPostSchema);


app.get("/", function(req, res){
  BlogPost.find({}, function(err, foundBlogPost){
    res.render("home", {
                        homeStartingContentEjs: homeStartingContent,
                        posts: foundBlogPost,
    });
  });
});


app.get("/about", function(req, res){
  res.render("about", {aboutContentEjs: aboutContent});
});


app.get("/contact", function(req, res){
  res.render("contact", {contactContentEjs: contactContent});
});


app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  BlogPost.create([{
    title: req.body.inputBlogTitle,
    content: req.body.inputBlogPost,
  }], function(err, savedPost){
    if(!err){
      res.redirect("/");
    }
  });
});


app.get("/posts/:postID", function(req, res){
  const requestedPostId = req.params.postID;
  BlogPost.findOne({_id: requestedPostId}, function(err, foundBlogPost){
    if(!err){
      res.render("post", {
        title: foundBlogPost.title,
        content: foundBlogPost.content
      });
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
