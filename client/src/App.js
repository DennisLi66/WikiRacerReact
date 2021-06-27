import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
// import Form from 'react-bootstrap/Form'
// import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
// import logo from './logo.svg';
import './App.css';

function App() {

const [code,changeCode] = React.useState(
  <div className='centerBox'>
    <h1> Welcome to WikiRacer </h1><br></br>
    <Button variant="dark" onClick={getDescription}>What is WikiRacing?</Button> <br></br><br></br>
    <Button variant="dark" onClick={getWikiRacer}>Play WikiRacer</Button> <br></br><br></br>
    <Button variant="dark" onClick={get2Pages}>Play 2Pages</Button> <br></br>
  </div>
)

//wikiRacer Connection Functions

//2Pages Connections Functions


//get Pages
function getHome(){
  changeCode(
    <div className='centerBox'>
      <h1> Welcome to WikiRacer </h1><br></br>
    <Button variant="dark" onClick={getDescription}>What is WikiRacing?</Button> <br></br><br></br>
    <Button variant="dark" onClick={getWikiRacer}>Play WikiRacer</Button> <br></br><br></br>
    <Button variant="dark" onClick={get2Pages}>Play 2Pages</Button> <br></br>
    </div>
  )
}
function getDescription(){
  changeCode(
    <div className="centerInfo">
      <br></br>
      <br></br>
    <h1>Info on WikiRacer</h1>

      Here you will find information on WikiRacing and how this site incorporates WikiRacing.

    <h2>What is WikiRacing?</h2>

      WikiRacing is the act of going from one Wikipedia article to another, using only hyperlinks found on the Wikipedia article, in as few hyperlinks as possible.

    <h2>What is this site's version of WikiRacing?</h2>

      This site uses a very simple version of WikiRacer. Once on the WikiRacer page, you can input the titles of two Wikipedia articles, get random options based on
      our selections, or get two truly random Wikipedia Articles. If you input your own values and they are too ambiguous, you will be prompted to change them. Once you
      have two unambiguous terms, you will be moved to the game page. You will then click links on the page until you have reached the destination page from the starting page.

    <h2>What is 2Pages?</h2>

      This version of WikiRacer was inspired by a website that implemented this game in same format, but the website has now gone defunct. The setup is for the most part very similar
      to WikiRacer setup. However, the end goal for 2Pages is to make both article halves into the same article through clicking links on either side.

    </div>
  )
}
function getWikiRacer(){
  changeCode(
    <div className='centerInfo'>
      <h1> WikiRacer </h1>
      If you have two Wikipedia articles in mind, you can put their article titles here.
      <br></br>
      <form action='/checkit' method="get" id='wikiForm'>
      <input type='hidden' name='random' id='random' value='false'></input>
      <label>Starting Wikipedia Article:</label><br></br>
      <input id='startPoint' name="start"></input><br></br>
      <label>Ending Wikipedia Article: </label><br></br>
      <input id='endPoint' name="end"></input><br></br>
      </form>
      <br></br>
      <Button variant="dark" onClick={console.log("Hello")}>Confirm Choices</Button> <br></br>
      <br></br>
      <br></br>
      <Button variant="dark" onClick={console.log("Hello")}>Two Fair Random Curated Articles</Button> <br></br>
      <br></br><br></br>
      <Button variant="dark" onClick={console.log("Hello")}>ANY Two Random Curated Articles</Button> <br></br>
      <br></br><br></br>
      <Button variant="dark" onClick={console.log("Hello")}>ANY Two Random Wikipedia Articles</Button> <br></br>
      </div>
  )
}
function get2Pages(){
  changeCode(
    <div className="centerInfo">
    <h1> 2Pages </h1>
    If you have two Wikipedia articles in mind, you can put their article titles here.
    <br></br>
    <form action='/checkit2' method="get" id='wikiForm'>
    <input type='hidden' name='random' id='random' value='false'></input>
    <label>Wikipedia Article Start Point 1:</label><br></br>
    <input id='startPoint' name="start"></input><br></br>
    <label>Wikipedia Article Start Point 2: </label><br></br>
    <input id='endPoint' name="end"></input><br></br>
    </form><br></br>
    <Button variant="dark" onClick={console.log("Hello")}>Confirm Choices</Button> <br></br>
    <br></br><br></br>
    <Button variant="dark" onClick={console.log("Hello")}> Two Random Curated Articles</Button> <br></br>
    <br></br><br></br>
    <Button variant="dark" onClick={console.log("Hello")}> Any Two Random Wikipedia Articles</Button> <br></br>
    </div>
  )
}

  return (
    <div className="App">

    <Navbar bg="light" expand="lg">
      <Navbar.Brand onClick={getHome}>WikiRacer</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
        <Nav
          className="mr-auto my-2 my-lg-0"
          style={{ maxHeight: '100px' }}
          navbarScroll
        >
          <Nav.Link onClick={getHome}>Home</Nav.Link>
          <Nav.Link onClick={getDescription}>Description</Nav.Link>
          <Nav.Link onClick={getWikiRacer}>WikiRacer</Nav.Link>
          <Nav.Link onClick={get2Pages}>2Pages</Nav.Link>
        </Nav>

      </Navbar.Collapse>
    </Navbar>

      {code}
    </div>
  );
}

export default App;
