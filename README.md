# WikiRacerReact

## Introduction:
This Github repository is a conversion of another repository made by me, [WikiRacer](https://github.com/DennisLi66/WikiRacer "Original WikiRacer Project"). While that repository made a front-end using EJS, this repository creates a front-end using React.
## Changes Opposed to the Original Repository:
The repository, besides the obvious React conversion from EJS, has a few other changes.
1. The original repository only requires the server-side app.js to be activated to serve the client and server. This implementation separates the backend into server.js and the frontend into client/src/app.js.
2. The original repository used cookies to manage traversing between links during a WikiRacer. In this implementation, I used client-side variables to track important elements and React Hooks to display most of them.
## What The Server Does:
Server.js sends JSON data as response when it receives certain GET requests. Server.js separates itself into three GET request handlers, check, check2, and getLinks.
1. check is used by the WikiRacer portion of the program. Its purpose is to use the wikijs package to confirm if the two articles for a game exist given their titles. Insufficient information or erroneous information will cause the code to return JSON associated with errors. Titles that are too ambiguous will send JSON with more specific article titles. Unambiguous information will send JSON with the links found on a page.
2. check2 is used by the 2Pages portion of the program. It performs the same actions as the above check function. It will however return information on correct articles titles for both articles given, since they are both starting points.
3. getLinks is used by both portions of the program. Given a title for an article, it produces the hyperlinks found on that articles page in JSON.
## What The Client Does:
App.js handles displaying the pages and tracks the data and variables server.js sends to it. When choosing inputs for articles, the client will send requests to check or check2 when dealing with WikiRacer or 2Pages inputs, respectively. On each hyperlink clicked during the game, it will send a GET request to getLinks in order to determine if the game has been won or what links to show on the client side.
## Transcription from Original WikiRacer Repository:
### WikiRacer
Wiki Racing!

### Node Modules Used:
Axios and Cheerio: Used to web scrape the hyperlinks off of Wikipedia bodyParser, ejs, and Express: Used to rend cookieParser: Used to remember what Wikipedia article the user started on and wants to end on wikijs: Used to check if a wikipedia article actually exists and if it's ambiguous

### Page Descriptions:
Homepage: The homepage is a simple homepage, meant to redirect you to other pages.

Description: The description page briefly describes how the games on this site are meant to be played.

WikiRacer Pages: Decisions Page: On the first page, users will be able to input an article to start on and an article to end on. If the article titles aren't correct or don't exist, the user will be told that. The user can also choose randomly selected articles from the wikijs module or from my personal choices. Checking Page: If one or both of the inputted article titles were too ambiguous, they will be cleared up here. Game-In-Action Page: Players will be able to choose a link to make progress. Users can also click the destination on the stats bar to see what it is if they are unfamiliar with it. Victory Page: On victory, users will be shown the stats and link history of their game.

2Pages Pages: Decisions Page: On the first page, users will be able to input two articles to start on. If the article titles aren't correct or don't exist, the user will be told that. The user can also choose randomly selected articles from the wikijs module or from my personal choices. Checking Page: If one or both of the inputted article titles were too ambiguous, they will be cleared up here. Game-In-Action Page: Players will be able to choose a link on either half of the site to make progress. Victory Page: On victory, users will be shown the stats and link history of their game, associated with which links on which side were clicked.
