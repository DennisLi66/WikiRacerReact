const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const wiki = require('wikijs').default;
const axios = require('axios');
const cheerio = require('cheerio');
//functions

function getTwoRandomSafe() {
  // return array
  var duoList = [];
  var goodStarts = [
    "Napkin",
    "Raid:_Shadow_Legends",
    "M. Night Shyamalan",
    "Walt Disney",
    "Dentistry",
    "Aura_(paranormal)",
    "Artificial intelligence",
    "Emu",
    "Parkour",
    "Paradox",
    "Neolithic Revolution",
    "Jason Mraz",
    "Jimi_Hendrix",
    "Javascript",
    "Cashew",
    "Count_Dracula",
    "Javascript",
    "Ikea",
    "Nitrogen",
    "Batman"
  ];
  var goodEnds = [
    "Marie Curie",
    "Abraham_Lincoln",
    "Nintendo",
    'Georgia_(Country)',
    "Tornado",
    "Halloween"
  ];
  var start = goodStarts[Math.floor(Math.random() * goodStarts.length)];
  var end = goodEnds[Math.floor(Math.random() * goodEnds.length)];
  duoList.push(start);
  duoList.push(end);
  return duoList;
}

function getTwoRandomChaos() {
  var duoList = [];
  var articles = [
    "Abraham_Lincoln",
    "Jason Mraz",
    "Nintendo",
    "Jimi_Hendrix",
    "Cashew",
    "Javascript",
    "Ikea",
    "Nitrogen",
    'Georgia_(Country)',
    "Tornado",
    "Count_Dracula",
    "Marie Curie",
    "Napkin",
    "Raid:_Shadow_Legends",
    "M. Night Shyamalan",
    "Walt Disney",
    "Dentistry",
    "Aura_(paranormal)",
    "Artificial intelligence",
    "Emu",
    "Parkour",
    "Paradox",
    "Batman",
    "Neolithic Revolution"
  ]
  var start = articles[Math.floor(Math.random() * articles.length)];
  var end = articles[Math.floor(Math.random() * articles.length)];
  while (start === end) {
    end = articles[Math.floor(Math.random() * articles.length)];
  }
  duoList.push(start);
  duoList.push(end);
  return duoList;
}
// server

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

app.get("/check", function(req, res) {
  //look at body and return a cookie, error, or disambiguation page
  res.clearCookie('wikiracer');
  var random = req.query.random;
  if (!random) {
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  } else if (random === 'false') {
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
      //Check that page exists
      //Check Ambiguity
      console.log("Accessing WikiJS for checking...");
      var startList = [];
      var endList = [];
      wiki().page(start).then(
        page => {
          if (page.pageprops && 'disambiguation' in page.pageprops) {
            page.links().then(links => {
              startList = links;
            }).finally(function() {
              wiki().page(end).then(
                page => {
                  if (page.pageprops && 'disambiguation' in page.pageprops) {
                    page.links().then(links => {
                      endList = links;
                      console.log("Both Start and End Were ambiguous");
                      return res.status(200).json({
                        banner: 'WikiRacer: Disambiguation',
                        startTerm: start,
                        sAmbiguous: true,
                        sList: startList.join('^'),
                        endTerm: end,
                        eAmbiguous: true,
                        eList: endList.join('^')
                      })
                    });
                  } else {
                    console.log("Only Start Was Ambiguous");
                    return res.status(200).json({
                      status: 12,
                      message: "Starting was Ambiguous",
                      startTerm: start,
                      sAmbiguous: true,
                      sList: startList.join('^'),
                      endTerm: end,
                      eAmbiguous: false,
                    })
                  }
                }, error => {
                  console.log(error);
                  return res.status(200).json({
                    status: 5,
                    message: "An error has occurred."
                  });
                }
              )
            });
          } else {
            wiki().page(end).then(
              page => {
                if (page.pageprops && 'disambiguation' in page.pageprops) {
                  page.links().then(links => {
                    endList = links;
                    console.log("Only End was ambiguous");
                    return res.status(200).json({
                      status: 11,
                      message: "Ending was Ambiguous",
                      startTerm: start,
                      sAmbiguous: false,
                      endTerm: end,
                      eAmbiguous: true,
                      eList: endList.join('^')
                    })
                  });
                } else {
                  console.log("Nobody was ambiguous");
                  let cookieObj = {
                    start: start,
                    current: start,
                    end: end,
                    steps: 0,
                    history: ''
                  }
                  res.cookie("wikiracer", cookieObj);
                  return res.status(200).json({
                    status: 0,
                    message: "Values Established.",
                    start: start,
                    current: start,
                    end: end,
                    steps: 0,
                    history: ''
                  })
                }
              }, error => {
                console.log(error);
                return res.status(200).json({
                  status: 5,
                  message: "An error has occurred."
                });
              }
            )
          }
        },
        error => {
          console.log(error);
          return res.status(200).json({
            status: 5,
            message: "An error has occurred."
          });
        }
      )
    }
  } else if (random === 'true') {
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
      res.cookie("wikiracer", cookieObj);
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
  } else if (random === 'soft') {
    var details = getTwoRandomSafe();
    let cookieObj = {
      start: details[0],
      current: details[0],
      end: details[1],
      steps: 0,
      history: ''
    }
    res.cookie("wikiracer", cookieObj);
    return res.status(200).json({
      status: 0,
      message: "Randomization Successful.",
      start: details[0],
      current: details[0],
      end: details[1],
      steps: 0,
      history: ''
    })
  } else if (random === 'softchaos') {
    var details = getTwoRandomChaos();
    let cookieObj = {
      start: details[0],
      current: details[0],
      end: details[1],
      steps: 0,
      history: ''
    }
    res.cookie("wikiracer", cookieObj);
    return res.status(200).json({
      status: 0,
      message: "Randomization Successful.",
      start: details[0],
      current: details[0],
      end: details[1],
      steps: 0,
      history: ''
    })
  } else {
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  }
})
app.get("/check2", function(req, res) {
  res.clearCookie('pages');
  var random = req.query.random;
  if (!random) {
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  } else if (random === 'soft') {
    var details = getTwoRandomSafe();
    let cookieObj = {
      lStart: details[0],
      rStart: details[1],
      cLeft: details[0],
      cRight: details[1],
      steps: 0,
      history: '',
      orientation: ''
    }
    res.cookie("pages", cookieObj);
    return res.status(200).json({
      status: 0,
      message: "Randomization Successful.",
      lStart: details[0],
      rStart: details[1],
      cLeft: details[0],
      cRight: details[1],
      steps: 0,
      history: '',
      orientation: ''
    })
  } else if (random === 'softchaos') {
    var details = getTwoRandomChaos();
    let cookieObj = {
      lStart: details[0],
      rStart: details[1],
      cLeft: details[0],
      cRight: details[1],
      steps: 0,
      history: '',
      orientation: ''
    }
    res.cookie("pages", cookieObj);
    return res.status(200).json({
      status: 0,
      message: "Randomization Successful.",
      lStart: details[0],
      rStart: details[1],
      cLeft: details[0],
      cRight: details[1],
      steps: 0,
      history: '',
      orientation: ''
    })
  } else if (random === 'true') {
    wiki().random(2).then(results => {
      var start = results[0];
      var end = results[1];
      let cookieObj = {
        lStart: start,
        rStart: end,
        cLeft: start,
        cRight: end,
        steps: 0,
        history: '',
        orientation: ''
      }
      res.cookie("pages", cookieObj);
      return res.status(200).json({
        status: 0,
        message: "Randomization Successful",
        lStart: start,
        rStart: end,
        cLeft: start,
        cRight: end,
        steps: 0,
        history: '',
        orientation: ''
      });
    })
  } else if (random === 'false') {
    var start = req.query.start;
    var end = req.query.end;
    if (!start && !end) {
      return res.status(200).json({
        status: 1,
        message: "Neither starting point had been provided."
      })
    } else if (!start) {
      return res.status(200).json({
        status: 2,
        message: "The first starting article was not defined."
      })
    } else if (!end) {
      return res.status(200).json({
        status: 3,
        message: "The second starting article was not defined."
      })
    } else {
      console.log("Accessing WikiJS for checking...");
      var startList = [];
      var endList = [];
      wiki().page(start).then(
        page => {
          if (page.pageprops && 'disambiguation' in page.pageprops) {
            page.links().then(links => {
              startList = links;
            }).finally(function() {
              wiki().page(end).then(
                page => {
                  if (page.pageprops && 'disambiguation' in page.pageprops) {
                    page.links().then(links => {
                      endList = links;
                      console.log("Both 1 and 2 Were ambiguous.");
                      return res.status(200).json({
                        status: 13,
                        message: "Both starting points were Ambiguous",
                        lTerm: start,
                        lAmbiguous: true,
                        lList: startList.join('^'),
                        rTerm: end,
                        rAmbiguous: true,
                        rList: endList.join('^')
                      })

                    });
                  } else {
                    console.log("Only 1 Was Ambiguous");
                    return res.status(200).json({
                      status: 12,
                      message: "Starting point 1 was Ambiguous",
                      leftTerm: start,
                      lAmbiguous: true,
                      lList: startList.join('^'),
                      rTerm: end,
                      rAmbiguous: false,
                    })
                  }
                }, error => {
                  console.log(error);
                  return res.status(200).json({
                    status: 5,
                    message: "An error has occurred."
                  });
                }
              )
            });
          } else {
            wiki().page(end).then(
              page => {
                if (page.pageprops && 'disambiguation' in page.pageprops) {
                  page.links().then(links => {
                    endList = links;
                    console.log("Only 2 was ambiguous");
                    return res.status(200).json({
                      status: 13,
                      message: "Starting point 2 was Ambiguous",
                      leftTerm: start,
                      lAmbiguous: false,
                      rTerm: end,
                      rAmbiguous: true,
                      rlist: endList.join('^')
                    })
                  });
                } else {
                  console.log("Nobody was ambiguous");
                  let cookieObj = {
                    lStart: start,
                    rStart: end,
                    cLeft: start,
                    cRight: end,
                    steps: 0,
                    history: '',
                    orientation: ''
                  }
                  res.cookie("pages", cookieObj);
                  return res.status(200).json({
                    lStart: start,
                    rStart: end,
                    cLeft: start,
                    cRight: end,
                    steps: 0,
                    history: '',
                    orientation: ''
                  })
                }
              }, error => {
                console.log(error);
                return res.status(200).json({
                  status: 5,
                  message: "An error has occurred."
                });
              }
            )
          }
        }, error => {
          console.log(error);
          return res.status(200).json({
            status: 5,
            message: "An error has occurred."
          });
        })
    }
  } else {
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  }
})
app.get("/test", function(req, res) {

})

app.get("/game", function(req, res) {

})

app.listen(3000, function() {
  console.log("Server Started.")
});
