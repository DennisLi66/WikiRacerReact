const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const wiki = require('wikijs').default;
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.static("public"));
// app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.get('/', function(req, res) {
  return res.status(200).json({ message: 'Welcome to Express API template' });
});

app.listen(3000, function() {
  console.log("Server Started.")
});
