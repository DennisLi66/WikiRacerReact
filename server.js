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
  return res.status(200).json({
    message: 'Welcome to Express API template'
  });
});

app.post("/check", function(req, res) {
  //look at body and return a cookie, error, or disambiguation page
  var start = req.body.start;
  var end = req.body.end;
  if (req.body.start) {

  }


  return res.status(200).json({

  })
})
app.get("/test", function(req, res) {
  //FIX THIS CLEAR cookie
  //FIX THIS PROVIDE AN EZ WAY to get easier randoms
  var random = req.query.random;
  if (!random){
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  }
  else if (random === 'false') {
    var start = req.query.start;
    var end = req.query.end;
    if (!start && !end) {
      return res.status(200).json({
        status: 1,
        message: "Neither start not end had been provided."
      })
    } else if (!start) {
      return res.status(200).json({
        status: 2,
        message: "The starting article was not defined."
      })
    } else if (!end) {
      return res.status(200).json({
        status: 3,
        message: "The ending article was not defined."
      })
    } else {
      //Check Ambiguity
    }
  }
  else if (random === 'true'){
    //Access wikijs and produce two random articles
    wiki().random(2).then(results => {
      var start = results[0];
      var end = results[1];
      let cookieObj = {
        start: start,
        current: start,
        end: end,
        steps: 0,
        history: ''
      }
      res.cookie("wikiracer",cookieObj);
      return res.status(200).json({
        status: 0,
        message: "Randomization Successful",
        start: start,
        current: start,
        end: end,
        steps: 0,
        history: ''
      });
    })
  }
  else if (random === 'soft'){

  }else{
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  }
})


app.get("/game", function(req, res) {

})

app.listen(3000, function() {
  console.log("Server Started.")
});
