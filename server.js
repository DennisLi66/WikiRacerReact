const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const wiki = require('wikijs').default;
const axios = require('axios');
const cheerio = require('cheerio');
var cors = require("cors");
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
//comparator
function exact(current,destination){
  return current.toUpperCase().replace(/ /g,"_") === destination.toUpperCase().replace(/ /g,"_");
}
//server
const app = express();
app.use(express.static("public"));
app.use(cors(
  {
    origin: 'http://localhost:3000',
    // credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
res.header('Content-Type', 'application/json;charset=UTF-8')
res.header('Access-Control-Allow-Credentials', true)
res.header(
  'Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept'
)
next()
})
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/check", function(req, res) {
  //look at body and return a cookie, error, or disambiguation page
  console.log(req.cookies);
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
                        status: 99,
                        message: "Both were Ambiguous",
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
                  if (exact(start,end)){
                    return res.status(200).json({
                      status: 100,
                      message: "Wow. Anticlimatic.",
                      start: start,
                      end: end,
                      steps: 0
                    })
                  }
                  else{
                  var url = encodeURI('https://en.wikipedia.org/wiki/' + start);
                  axios(url)
                    .then(response => {
                      const html = response.data;
                      const $ = cheerio.load(html);
                      var links = $('a');
                      const linkSet = new Set();
                      for (let i = 0; i < links.length; i++) {
                        var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                        if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                          links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                          links[i].attribs.href !== '/wiki/' + start.replace(/ /g, "_")) {
                          linkSet.add(links[i].attribs.title);
                        }
                      }
                      let cookieObj = {
                        start: start,
                        current: start,
                        end: end,
                        steps: 0,
                        // links: [...linkSet].join("^"),
                        history: ''
                      }
                      return res.status(200).json({
                        status: 0,
                        message: "Connection Successful",
                        current: start,
                        end: end,
                        links: [...linkSet].join("^"),
                        steps: 0
                      })
                    })
                  }
                }
              }, error => {
                console.log(error);
                return res.status(200).json({
                  status: 5,
                  message: "An error has occurred."
                });
              }
            )}},
        error => {
          console.log(error);
          return res.status(200).json({
            status: 5,
            message: "An error has occurred."
          });
        }
      )}
  } else if (random === 'true') {
    //Access wikijs and produce two random articles
    wiki().random(2).then(results => {
      var start = results[0];
      var end = results[1];
      if (exact(start,end)){
        return res.status(200).json({
          status: 999,
          message: "Randomization Successful",
          start: start,
          current: start,
          end: end,
          steps: 0,
          history: ''
        });
      }
      else{
        var url = encodeURI('https://en.wikipedia.org/wiki/' + start);
        axios(url)
          .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            var links = $('a');
            const linkSet = new Set();
            for (let i = 0; i < links.length; i++) {
              var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
              if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                links[i].attribs.href !== '/wiki/' + start.replace(/ /g, "_")) {
                linkSet.add(links[i].attribs.title);
              }
            }
            let cookieObj = {
              start: start,
              current: start,
              end: end,
              steps: 0,
              // links: [...linkSet].join("^"),
              history: ''
            }
            return res.status(200).json({
              status: 0,
              message: "Randomization Successful",
              current: start,
              end: end,
              links: [...linkSet].join("^"),
              steps: 0
            })
          })
      }
    })
  } else if (random === 'soft') {
    var details = getTwoRandomSafe();
    var start = details[0];
    var end = details[1];
    var url = encodeURI('https://en.wikipedia.org/wiki/' + start);
    axios(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        var links = $('a');
        const linkSet = new Set();
        for (let i = 0; i < links.length; i++) {
          var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
          if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
            links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
            links[i].attribs.href !== '/wiki/' + start.replace(/ /g, "_")) {
            linkSet.add(links[i].attribs.title);
          }
        }
        return res.status(200).json({
          status: 0,
          message: "Randomization Successful",
          current: start,
          end: end,
          links: [...linkSet].join("^"),
          steps: 0
        })
      })
  } else if (random === 'softchaos') {
    var details = getTwoRandomChaos();
    var start = details[0];
    var end = details[1];
    var url = encodeURI('https://en.wikipedia.org/wiki/' + start);
    axios(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        var links = $('a');
        const linkSet = new Set();
        for (let i = 0; i < links.length; i++) {
          var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
          if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
            links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
            links[i].attribs.href !== '/wiki/' + start.replace(/ /g, "_")) {
            linkSet.add(links[i].attribs.title);
          }
        }
        return res.status(200).json({
          status: 0,
          message: "Randomization Successful",
          current: start,
          end: end,
          links: [...linkSet].join("^"),
          steps: 0
        })
      })
  } else {
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  }
})
app.get("/check2", function(req, res) {
  // res.clearCookie('pages');
  var random = req.query.random;
  if (!random) {
    return res.status(200).json({
      status: 4,
      message: "A meaningful value for random has not been assigned."
    })
  } else if (random === 'soft') {
    var details = getTwoRandomChaos();
    var cLeft = details[0];
    var cRight = details[1];
    var url1 = encodeURI('https://en.wikipedia.org/wiki/' + cLeft);
    var url2 = encodeURI('https://en.wikipedia.org/wiki/' + cRight);
    axios(url1)
      .then(response1 => {
        const html1 = response1.data;
        const $ = cheerio.load(html1);
        var links = $('a');
        const linkSet1 = new Set();
        for (let i = 0; i < links.length; i++) {
          var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
          if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
            links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
            links[i].attribs.href !== '/wiki/' + cLeft.replace(/ /g, "_")) {
            linkSet1.add(links[i].attribs.title);
          }
        }
        axios(url2)
          .then(response2 => {
            const html2 = response2.data;
            const $ = cheerio.load(html2);
            var links = $('a');
            const linkSet2 = new Set();
            for (let i = 0; i < links.length; i++) {
              var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
              if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                links[i].attribs.href !== '/wiki/' + cRight.replace(/ /g, "_")) {
                linkSet2.add(links[i].attribs.title);
              }
            }
            return res.status(200).json({
              cLeft: cLeft,
              cRight: cRight,
              linksLeft: [...linkSet1].join("^"),
              linksRight: [...linkSet2].join("^"),
              steps: 0
            })
          })
      })
  } else if (random === 'true') {
    wiki().random(2).then(results => {
      var cLeft = results[0];
      var cRight = results[1];
      if (exact(cLeft,cRight)){
        return res.status(200).json({
          status: 999,
          message: "Randomization Successful",
          start: start,
          current: start,
          end: end,
          steps: 0,
          history: ''
        });
      }
      else{
        var url1 = encodeURI('https://en.wikipedia.org/wiki/' + cLeft);
        var url2 = encodeURI('https://en.wikipedia.org/wiki/' + cRight);
        axios(url1)
          .then(response1 => {
            const html1 = response1.data;
            const $ = cheerio.load(html1);
            var links = $('a');
            const linkSet1 = new Set();
            for (let i = 0; i < links.length; i++) {
              var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
              if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                links[i].attribs.href !== '/wiki/' + cLeft.replace(/ /g, "_")) {
                linkSet1.add(links[i].attribs.title);
              }
            }
            axios(url2)
              .then(response2 => {
                const html2 = response2.data;
                const $ = cheerio.load(html2);
                var links = $('a');
                const linkSet2 = new Set();
                for (let i = 0; i < links.length; i++) {
                  var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                  if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                    links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                    links[i].attribs.href !== '/wiki/' + cRight.replace(/ /g, "_")) {
                    linkSet2.add(links[i].attribs.title);
                  }
                }
                return res.status(200).json({
                  status: 0,
                  message: "Randomization Successful",
                  cLeft: cLeft,
                  cRight: cRight,
                  linksLeft: [...linkSet1].join("^"),
                  linksRight: [...linkSet2].join("^"),
                  steps: 0
                })


              })
          })
      }
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
                        status: 17,
                        message: "Both starting points were Ambiguous",
                        lTerm: start,
                        lList: startList.join('^'),
                        rTerm: end,
                        rList: endList.join('^')
                      })

                    });
                  } else {
                    console.log("Only 1 Was Ambiguous");
                    return res.status(200).json({
                      status: 12,
                      message: "Starting point 1 was Ambiguous",
                      lTerm: start,
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
                      lTerm: start,
                      rTerm: end,
                      rList: endList.join('^')
                    })
                  });
                } else {
                  console.log("Nobody was ambiguous");
                  var cLeft = start;
                  var cRight = end;
                  if (exact(cLeft,cRight)){
                    return res.status(200).json({
                      status: 10000
                    })
                  }
                  else{
                  var url1 = encodeURI('https://en.wikipedia.org/wiki/' + cLeft);
                  var url2 = encodeURI('https://en.wikipedia.org/wiki/' + cRight);
                  axios(url1)
                    .then(response1 => {
                      const html1 = response1.data;
                      const $ = cheerio.load(html1);
                      var links = $('a');
                      const linkSet1 = new Set();
                      for (let i = 0; i < links.length; i++) {
                        var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                        if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                          links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                          links[i].attribs.href !== '/wiki/' + cLeft.replace(/ /g, "_")) {
                          linkSet1.add(links[i].attribs.title);
                        }
                      }
                      axios(url2)
                        .then(response2 => {
                          const html2 = response2.data;
                          const $ = cheerio.load(html2);
                          var links = $('a');
                          const linkSet2 = new Set();
                          for (let i = 0; i < links.length; i++) {
                            var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                            if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                              links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                              links[i].attribs.href !== '/wiki/' + cRight.replace(/ /g, "_")) {
                              linkSet2.add(links[i].attribs.title);
                            }
                          }
                          let cookieObj = {
                            lStart: start,
                            rStart: end,
                            cLeft: start,
                            cRight: end,
                            steps: 0,
                            history: '',
                            linksLeft: [...linkSet1].join("^"),
                            linksRight: [...linkSet2].join("^"),
                            orientation: ''
                          }
                          return res.status(200).json({
                            status: 0,
                            cLeft: cLeft,
                            cRight: cRight,
                            linksLeft: [...linkSet1].join("^"),
                            linksRight: [...linkSet2].join("^"),
                            steps: 0
                          })
                        })
                    })
                  }
                }}, error => {
                console.log(error);
                return res.status(200).json({
                  status: 5,
                  message: "An error has occurred."
                });
              }
            )}},error => {
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
app.get("/connection",function(req,res){
  //Check that it is possible to reach current from previous, then return links
  console.log(req.query.previous);
  console.log(req.query.link);


  return res.status(200).json({
    message: "Message Received."
  })
})


app.listen(3001, function() {
  console.log("Server Started.")
});
