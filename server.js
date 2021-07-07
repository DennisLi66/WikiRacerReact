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
    "Raid: Shadow Legends",
    "M. Night Shyamalan",
    "Walt Disney",
    "Dentistry",
    "Aura (paranormal)",
    "Artificial intelligence",
    "Emu",
    "Parkour",
    "Paradox",
    "Neolithic Revolution",
    "Jason Mraz",
    "Jimi Hendrix",
    "Javascript",
    "Cashew",
    "Count Dracula",
    "Javascript",
    "Ikea",
    "Nitrogen",
    "Batman"
  ];
  var goodEnds = [
    "Marie Curie",
    "Abraham Lincoln",
    "Nintendo",
    'Georgia (Country)',
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
function getTitle(term){
  var url = encodeURI('https://en.wikipedia.org/wiki/' + term);
  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      var links = $('a');
      var title = $('h1').contents().first().text();
      console.log(title)
      return title;
    })
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
  //determine that values exist
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
                      var beginTitle = $('h1').contents().first().text();
                      console.log(beginTitle);
                      const linkSet = new Set();
                      for (let i = 0; i < links.length; i++) {
                        var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                        if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                          links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                          links[i].attribs.href !== '/wiki/' + start.replace(/ /g, "_")) {
                          linkSet.add(links[i].attribs.title);
                        }
                      }
                      //Now Axios for the true title of the second page
                      var url = encodeURI('https://en.wikipedia.org/wiki/' + end);
                      axios(url)
                        .then(response => {
                          const html = response.data;
                          const $ = cheerio.load(html);
                          var links = $('a');
                          var title = $('h1').contents().first().text();
                          console.log(title)
                          if (exact(title,beginTitle)){
                            return res.status(200).json({
                              status: -1,
                              message: "They are the same."
                            })
                          }else{
                          return res.status(200).json({
                            status: 0,
                            message: "Connection Successful",
                            startTitle: beginTitle,
                            endTitle: title,
                            current: start,
                            end: end,
                            links: [...linkSet].join("^"),
                            steps: 0
                          })
                        }
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
            return res.status(200).json({
              status: 0,
              message: "Randomization Successful",
              current: start,
              end: end,
              links: [...linkSet].join("^"),
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
      status: -1,
      message: "A meaningful value for random has not been assigned."
    })
  }
})
app.get("/check2", function(req, res) {
  var random = req.query.random;
  if (!random){
    return res.status(200).json({
      status: -1,
      message: "A meaningful value for random has not been assigned."
    })
  } else if (random === 'false'){
    var left = req.query.left;
    var right = req.query.right;
    if (!left && !end){
      return res.status(200).json({
        status: -1,
        message: "Neither starting value had been provided."
      })
    }
    else if (!left){
      return res.status(200).json({
        status: -1,
        message: "The first starting value was not defined."
      })
    }
    else if (!right){
      return res.status(200).json({
        status: -1,
        message: "The ending article was not defined."
      })
    }
    else{
      console.log("Accessing WikiJS for checking...");
      var leftList = [];
      var rightList = [];
      wiki().page(left).then(
        page => {
          if (page.pageprops && 'disambiguation' in page.pageprops) {
            page.links().then(links => {
              leftList = links;
            }).finally(function() {
              wiki().page(right).then(
                page => {
                  if (page.pageprops && 'disambiguation' in page.pageprops) {
                    page.links().then(links => {
                      rightList = links;
                      console.log("Both Starting Points Were ambiguous");
                      return res.status(200).json({
                        status: 99,
                        message: "Both were Ambiguous",
                        leftTerm: left,
                        lAmbiguous: true,
                        lList: leftList.join('^'),
                        rightTerm: right,
                        rAmbiguous: true,
                        rList: rightList.join('^')
                      })
                    });
                  } else {
                    console.log("Only the first starting point Was ambiguous");
                    return res.status(200).json({
                      status: 12,
                      message: "First Starting was Ambiguous",
                      leftTerm: left,
                      lAmbiguous: true,
                      lList: leftList.join('^'),
                      rightTerm: right,
                      rAmbiguous: false,
                    })
                  }
                }, error => {
                  console.log(error);
                  return res.status(200).json({
                    status: -1,
                    message: "An error has occurred."
                  });
                }
              )
            });
          } else {
            wiki().page(right).then(
              page => {
                if (page.pageprops && 'disambiguation' in page.pageprops) {
                  page.links().then(links => {
                    rightList = links;
                    console.log("Only the second starting point was ambiguous");
                    return res.status(200).json({
                      status: 11,
                      message: "Second point was Ambiguous",
                      leftTerm: left,
                      lAmbiguous: false,
                      rightTerm: right,
                      rAmbiguous: true,
                      rList: rightList.join('^')
                    })
                  });
                } else {
                  console.log("Nobody was ambiguous");
                  if (exact(left,right)){
                    return res.status(200).json({
                      status: 100,
                      message: "Wow. Anticlimatic.",
                      leftTerm: left,
                      rightTerm: right,
                      steps: 0
                    })
                  }
                  else{
                  var url = encodeURI('https://en.wikipedia.org/wiki/' + left);
                  axios(url)
                    .then(response => {
                      const html = response.data;
                      const $ = cheerio.load(html);
                      var links = $('a');
                      var beginTitle = $('h1').contents().first().text();
                      console.log(beginTitle);
                      const linkSet = new Set();
                      for (let i = 0; i < links.length; i++) {
                        var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                        if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                          links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                          links[i].attribs.href !== '/wiki/' + left.replace(/ /g, "_")) {
                          linkSet.add(links[i].attribs.title);
                        }
                      }
                      //Now Axios for the true title of the second page
                      var url = encodeURI('https://en.wikipedia.org/wiki/' + right);
                      axios(url)
                        .then(response => {
                          const html = response.data;
                          const $ = cheerio.load(html);
                          var links = $('a');
                          var title = $('h1').contents().first().text();
                          console.log(title)
                          if (exact(title,beginTitle)){
                            return res.status(200).json({
                              status: 10000,
                              message: "They are the same."
                            })
                          }else{
                            const linkSet2 = new Set();
                            for (let i = 0; i < links.length; i++) {
                              var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                              if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                                links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                                links[i].attribs.href !== '/wiki/' + right.replace(/ /g, "_")) {
                                linkSet2.add(links[i].attribs.title);
                              }
                            }
                          return res.status(200).json({
                            status: 0,
                            message: "Connection Successful",
                            leftTitle: beginTitle,
                            rightTitle: title,
                            leftLinks: [...linkSet].join("^"),
                            rightLinks: [...linkSet2].join("^")
                          })
                        }
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
      )
    }
  } else if (random === 'true'){
    wiki().random(2).then(results =>{
      var start = results[0];
      var start2 = results[1];
      if (exact(start,start2)){
        return res.status(200).json({
          status: 1000,
          message: "Randomization Successful",
          start: start,
          current: start2,
          steps: 0,
        });
      }
      else{
        var url = encodeURI('https://en.wikipedia.org/wiki/' + start);
        var url2 = encodeURI('https://en.wikipedia.org/wiki/' + start2);
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
            axios(url2)
              .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                var links = $('a');
                const linkSet2 = new Set();
                for (let i = 0; i < links.length; i++) {
                  var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
                  if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                    links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                    links[i].attribs.href !== '/wiki/' + start2.replace(/ /g, "_")) {
                    linkSet2.add(links[i].attribs.title);
                  }
                }
                return res.status(200).json({
                  status: 0,
                  message: "Randomization Successful",
                  leftStart: start,
                  rightStart: start2,
                  leftLinks: [...linkSet].join("^"),
                  rightLinks: [...linkSet2].join("^"),
                  steps: 0
                })
              })
          })
      }
    })
  }else if (random === 'soft'){
    var details = getTwoRandomChaos();
    var start = details[0];
    var start2 = details[1];
    console.log(start,start2)
    var url = encodeURI('https://en.wikipedia.org/wiki/' + start);
    var url2 = encodeURI('https://en.wikipedia.org/wiki/' + start2);
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
        axios(url2)
          .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            var links = $('a');
            const linkSet2 = new Set();
            for (let i = 0; i < links.length; i++) {
              var regex = '^\/wiki\/[\-.,%"\'#_\(\)A-Za-z0-9]+$';
              if (links[i].attribs && links[i].attribs.title && links[i].attribs.href &&
                links[i].attribs.href.match(regex) && links[i].attribs.href !== '/wiki/Main_Page' &&
                links[i].attribs.href !== '/wiki/' + start2.replace(/ /g, "_")) {
                linkSet2.add(links[i].attribs.title);
              }
            }
            return res.status(200).json({
              status: 0,
              message: "Randomization Successful",
              leftStart: start,
              rightStart: start2,
              leftLinks: [...linkSet].join("^"),
              rightLinks: [...linkSet2].join("^"),
              steps: 0
            })
          })
      })
  }else{
    return res.status(200).json({
      status: -1,
      message: "A meaningful value for random has not been assigned."
    })
  }
})
app.get("/getLinks",function(req,res){
  //Check that it is possible to reach current from previous, then return links
  //no need to check if actually exists
  console.log(req.query.link,req.query.end);
  if (exact(req.query.link,req.query.end)){
    return res.status(200).json({
      status: 1000,
      message: "Victory!"
    })
  }
  else{
    var url = encodeURI('https://en.wikipedia.org/wiki/' + req.query.link);
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
            links[i].attribs.href !== '/wiki/' + req.query.link.replace(/ /g, "_")) {
            linkSet.add(links[i].attribs.title);
          }
        }
        return res.status(200).json({
          status: 0,
          current: req.query.link,
          message: "Links Found",
          links: [...linkSet].join("^"),
        })
      })
    // return res.status(200).json({
    //   message: "Message Received."
    // })
}
})


app.listen(3001, function() {
  console.log("Server Started.")
});
