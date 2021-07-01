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
//FIX THIS: Maybe use dotenv to locate server
var serverLocation = "http://localhost:3001";
//2018 African Swimming Championships – Women's 50 metre backstroke
//the above produces questionable link at the bottom

//handle forms functions
function handleWikiRacerInputs(event){
  event.preventDefault();
  var start = document.getElementById('startPoint').value;
  var end = document.getElementById('endPoint').value;
  if ((!end || end === "") && (!start || start === "")){
    changeCode(
      <div className='centerInfo'  >
        <div className='errorMsg'> You cannot leave the values empty. </div>
        <h1> WikiRacer </h1>
        If you have two Wikipedia articles in mind, you can put their article titles here.
        <br></br>
        <form onSubmit={handleWikiRacerInputs}>
        <label>Starting Wikipedia Article:</label><br></br>
        <input id='startPoint' name="start"></input><br></br>
        <label>Ending Wikipedia Article: </label><br></br>
        <input id='endPoint' name="end"></input><br></br>
        <br></br>
        <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
        </form>
        <br></br>
        <br></br>
        <Button variant="dark" onClick={chosenSoftRandomWikiRacer}>Two Fair Random Curated Articles</Button> <br></br>
        <br></br><br></br>
        <Button variant="dark" onClick={chosenChaoticRandomWikiRacer}>ANY Two Random Curated Articles</Button> <br></br>
        <br></br><br></br>
        <Button variant="dark" onClick={chosenTrueRandomWikiRacer}>ANY Two Random Wikipedia Articles</Button> <br></br>
        </div>
    );
  }
  else if (!end || end === ""){
    changeCode(
      <div className='centerInfo'  >
        <div className='errorMsg'> You need an end destination for your WikiRace. </div>
        <h1> WikiRacer </h1>
        If you have two Wikipedia articles in mind, you can put their article titles here.
        <br></br>
        <form onSubmit={handleWikiRacerInputs}>
        <label>Starting Wikipedia Article:</label><br></br>
        <input id='startPoint' name="start"></input><br></br>
        <label>Ending Wikipedia Article: </label><br></br>
        <input id='endPoint' name="end"></input><br></br>
        <br></br>
        <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
        </form>
        <br></br>
        <br></br>
        <Button variant="dark" onClick={chosenSoftRandomWikiRacer}>Two Fair Random Curated Articles</Button> <br></br>
        <br></br><br></br>
        <Button variant="dark" onClick={chosenChaoticRandomWikiRacer}>ANY Two Random Curated Articles</Button> <br></br>
        <br></br><br></br>
        <Button variant="dark" onClick={chosenTrueRandomWikiRacer}>ANY Two Random Wikipedia Articles</Button> <br></br>
        </div>
    );
  }
  else if (!start || start === ""){
    changeCode(
      <div className='centerInfo'  >
        <div className='errorMsg'> You need a starting position for your WikiRace. </div>
        <h1> WikiRacer </h1>
        If you have two Wikipedia articles in mind, you can put their article titles here.
        <br></br>
        <form onSubmit={handleWikiRacerInputs}>
        <label>Starting Wikipedia Article:</label><br></br>
        <input id='startPoint' name="start"></input><br></br>
        <label>Ending Wikipedia Article: </label><br></br>
        <input id='endPoint' name="end"></input><br></br>
        <br></br>
        <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
        </form>
        <br></br>
        <br></br>
        <Button variant="dark" onClick={chosenSoftRandomWikiRacer}>Two Fair Random Curated Articles</Button> <br></br>
        <br></br><br></br>
        <Button variant="dark" onClick={chosenChaoticRandomWikiRacer}>ANY Two Random Curated Articles</Button> <br></br>
        <br></br><br></br>
        <Button variant="dark" onClick={chosenTrueRandomWikiRacer}>ANY Two Random Wikipedia Articles</Button> <br></br>
        </div>
    );
  }
  else{
    fetch(serverLocation + "/check?random=false&start=" + start + "&end=" + end)
    .then(response=>response.json())
    .then(data => {
      var selectList = [];
      var e = []
      console.log('Success:', data);
      if (data.status === 0){
        produceWikiRacerGamePage(data.start,data.end,data.current,data.steps,data.links.split('^'));
      }else if (data.status === 5){ //An Error has occurred
        changeCode(
          <div className='centerInfo'  >
            <div className='errorMsg'> An unexpected error has occured. Please refresh the page or try again. </div>
            <h1> WikiRacer </h1>
            If you have two Wikipedia articles in mind, you can put their article titles here.
            <br></br>
            <form onSubmit={handleWikiRacerInputs}>
            <label>Starting Wikipedia Article:</label><br></br>
            <input id='startPoint' name="start"></input><br></br>
            <label>Ending Wikipedia Article: </label><br></br>
            <input id='endPoint' name="end"></input><br></br>
            <br></br>
            <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
            </form>
            <br></br>
            <br></br>
            <Button variant="dark" onClick={chosenSoftRandomWikiRacer}>Two Fair Random Curated Articles</Button> <br></br>
            <br></br><br></br>
            <Button variant="dark" onClick={chosenChaoticRandomWikiRacer}>ANY Two Random Curated Articles</Button> <br></br>
            <br></br><br></br>
            <Button variant="dark" onClick={chosenTrueRandomWikiRacer}>ANY Two Random Wikipedia Articles</Button> <br></br>
            </div>
        )
      }else if (data.status === 11){ //Ending was ambiguous
        e = data.eList.split("^");
        for (let x = 0; x < e.length; x++){
          selectList.push(<option key={e[x]}>{e[x]}</option>)
        }
        changeCode(
          <div>
          Your starting point, {data.startTerm}, was not ambiguous, so there is no need to change it.
          <form onSubmit={handleWikiRacerInputs}>
            <input id="startPoint" type="hidden" value={data.startTerm}></input>
            Your ending point, {data.endTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
            <br></br>
            <select id='endPoint'>
            {selectList}
            </select>
            <br></br>
            <Button variant="dark" type="submit" >Confirm</Button> <br></br>
          </form>
        </div>
        )
      }else if (data.status === 12){ //Stating was ambiguous
        e = data.sList.split("^");
        for (let x = 0; x < e.length; x++){
          selectList.push(<option key={e[x]}>{e[x]}</option>)
        }
        changeCode(
          <div>
          Your ending point, {data.endTerm}, was not ambiguous, so there is no need to change it.
          <form onSubmit={handleWikiRacerInputs}>
            <input id="endPoint" type="hidden" value={data.endTerm}></input>
            Your starting point, {data.startTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
            <br></br>
            <select id='startPoint'>
            {selectList}
            </select>
            <br></br>
            <Button variant="dark" type="submit" >Confirm</Button> <br></br>
          </form>
        </div>
        )
      }else if (data.status === 99){ //Both Ambiguous
        var sList = [];
        var eList = [];
        var ss = data.sList.split("^");
        var ee = data.eList.split("^");
        for (let x = 0; x < ss.length; x++){
          sList.push(<option key={ss[x]}>{ss[x]}</option>);
        }
        for (let x = 0; x < ee.length; x++){
          eList.push(<option key={ee[x]}>{ee[x]}</option>);
        }
        changeCode(
          <form onSubmit={handleWikiRacerInputs}>
            Your starting point, { data.startTerm }, was ambiguous. You're going to need to be more specific. Here are options based on your starting point.
            <br></br>
            <select id='startPoint'>
              {sList}
            </select>
            <br></br>
            Your ending point, { data.endTerm }, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
            <br></br>
            <select id='endPoint'>
              {eList}
            </select>
            <br></br>
            <Button variant="dark" type="submit" >Confirm</Button> <br></br>
          </form>
        );
      }
      else if (data.status === 100){
        changeCode(
          <div className='centerInfo' >
            <div className='errorMsg'> Please choose values that are not the same. </div>
            <h1> WikiRacer </h1>
            If you have two Wikipedia articles in mind, you can put their article titles here.
            <br></br>
            <form onSubmit={handleWikiRacerInputs}>
            <label>Starting Wikipedia Article:</label><br></br>
            <input id='startPoint' name="start"></input><br></br>
            <label>Ending Wikipedia Article: </label><br></br>
            <input id='endPoint' name="end"></input><br></br>
            <br></br>
            <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
            </form>
            <br></br>
            <br></br>
            <Button variant="dark" onClick={chosenSoftRandomWikiRacer}>Two Fair Random Curated Articles</Button> <br></br>
            <br></br><br></br>
            <Button variant="dark" onClick={chosenChaoticRandomWikiRacer}>ANY Two Random Curated Articles</Button> <br></br>
            <br></br><br></br>
            <Button variant="dark" onClick={chosenTrueRandomWikiRacer}>ANY Two Random Wikipedia Articles</Button> <br></br>
            </div>
        )
      }
    })
  }
}
function handle2PagesInputs(event){
  event.preventDefault();
  var start = document.getElementById('startPoint').value;
  var end = document.getElementById('endPoint').value;
  if ((!end || end === "") && (!start || start === "")){
    changeCode(
      <div className="centerInfo">
      <div className='errorMsg'> You cannot leave the values empty. </div>
      <h1> 2Pages </h1>
      If you have two Wikipedia articles in mind, you can put their article titles here.
      <br></br>
        <form onSubmit={handle2PagesInputs}>
      <label>Wikipedia Article Start Point 1:</label><br></br>
      <input id='startPoint' name="start"></input><br></br>
      <label>Wikipedia Article Start Point 2: </label><br></br>
      <input id='endPoint' name="end"></input><br></br>
        <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br><br></br>
      </form>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
      </div>
    )
  }
  else if (!end || end === ""){
    changeCode(
      <div className="centerInfo">
      <div className='errorMsg'> You cannot leave your second starting point empty. </div>
      <h1> 2Pages </h1>
      If you have two Wikipedia articles in mind, you can put their article titles here.
      <br></br>
        <form onSubmit={handle2PagesInputs}>
      <label>Wikipedia Article Start Point 1:</label><br></br>
      <input id='startPoint' name="start"></input><br></br>
      <label>Wikipedia Article Start Point 2: </label><br></br>
      <input id='endPoint' name="end"></input><br></br><br></br>
        <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
      </form>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
      </div>
    )
  }
  else if (!start || start === ""){
    changeCode(
      <div className="centerInfo">
      <div className='errorMsg'> You cannot leave your first starting point empty. </div>
      <h1> 2Pages </h1>
      If you have two Wikipedia articles in mind, you can put their article titles here.
      <br></br>
        <form onSubmit={handle2PagesInputs}>
      <label>Wikipedia Article Start Point 1:</label><br></br>
      <input id='startPoint' name="start"></input><br></br>
      <label>Wikipedia Article Start Point 2: </label><br></br>
      <input id='endPoint' name="end"></input><br></br><br></br>
      <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
      </form>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
      </div>
    )
  }
  else{
    fetch(serverLocation + "/check2?random=false&start=" + start + "&end=" + end)
    .then(response=>response.json())
    .then(data => {
      if (data.status === 100){ //Values were the same
        changeCode(
          <div className="centerInfo">
          <div className='errorMsg'> Please choose values that are not the same. </div>
          <h1> 2Pages </h1>
          If you have two Wikipedia articles in mind, you can put their article titles here.
          <br></br>
            <form onSubmit={handle2PagesInputs}>
          <label>Wikipedia Article Start Point 1:</label><br></br>
          <input id='startPoint' name="start"></input><br></br>
          <label>Wikipedia Article Start Point 2: </label><br></br>
          <input id='endPoint' name="end"></input><br></br>
          </form><br></br>
            <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
          <br></br><br></br>
          <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
          <br></br><br></br>
          <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
          </div>
        )
      }
      else if (data.status === 5){///An error has occurred
        changeCode(
          <div className="centerInfo">
            <div className='errorMsg'> An unexpected error has occured. Please refresh the page or try again. </div>
          <h1> 2Pages </h1>
          If you have two Wikipedia articles in mind, you can put their article titles here.
          <br></br>
            <form onSubmit={handle2PagesInputs}>
          <label>Wikipedia Article Start Point 1:</label><br></br>
          <input id='startPoint' name="start"></input><br></br>
          <label>Wikipedia Article Start Point 2: </label><br></br>
          <input id='endPoint' name="end"></input><br></br><br></br>
          <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
          </form>
          <br></br><br></br>
          <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
          <br></br><br></br>
          <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
          </div>
        )
      }
      else if (data.status === 13){/// Second starting point ambiguous
        var eList = [];
        var ee = data.rList.split("^");
        for (let x = 0; x < ee.length; x++){
          eList.push(<option key={ee[x]}>{ee[x]}</option>);
        }
        changeCode(
        <div>
        Your first starting point, {data.lTerm}, was not ambiguous, so there is no need to change it.
        <form onSubmit={handle2PagesInputs}>
         <input type='hidden' id='startPoint' value={data.lTerm}></input>
          Your second starting point, {data.rTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
          <br></br>
          <select id='endPoint'>
            {eList}
          </select>
          <br></br>
          <Button variant="dark" type="submit" >Confirm</Button> <br></br>
        </form>
        </div>
      )
      }
      else if (data.status === 12){/// First starting point ambiguous
        var sList = [];
        var ss = data.lList.split("^");
        for (let x = 0; x < ss.length; x++){
          sList.push(<option key={ss[x]}>{ss[x]}</option>);
        }
        changeCode(
        <div>
        Your second starting point, {data.rTerm}, was not ambiguous, so there is no need to change it.
        <form onSubmit={handle2PagesInputs}>
         <input type='hidden' id='endPoint' value={data.rTerm}></input>
          Your first starting point, {data.lTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
          <br></br>
          <select id='startPoint'>
            {sList}
          </select>
          <br></br>
          <Button variant="dark" type="submit" >Confirm</Button> <br></br>
        </form>
        </div>
      )
      }
      else if (data.status === 17){/// Both starting points ambiguous
        var startList = [];
        var sss = data.lList.split("^");
        var endList = [];
        var eee = data.rList.split("^");
        for (let x = 0; x < sss.length; x++){
          startList.push(<option key={sss[x]}>{sss[x]}</option>);
        }
        for (let x = 0; x < eee.length; x++){
          endList.push(<option key={eee[x]}>{eee[x]}</option>);
        }
        changeCode(
          <form onSubmit={handle2PagesInputs}>
            Your first starting point, {data.lTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your starting point.
            <br></br>
            <select name='start' id='startPoint'>
            {startList}
            </select>
            <br></br>
            Your second starting point, {data.rTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
            <br></br>
            <select name='end' id='endPoint'>
            {endList}
            </select>
            <br></br>
            <Button variant="dark" type="submit" >Confirm</Button> <br></br>
            </form>
        )
      }
      else if (data.status === 0){//All has gone well
          produce2PagesGamePage(data.cLeft,data.cRight,data.steps,data.linksLeft.split('^'),data.linksRight.split('^'));
      }
      else if (data.status === 10000){
        changeCode(
          <div className="centerInfo">
            <div className='errorMsg'> You shouldn't start from the same point. </div>
          <h1> 2Pages </h1>
          If you have two Wikipedia articles in mind, you can put their article titles here.
          <br></br>
            <form onSubmit={handle2PagesInputs}>
          <label>Wikipedia Article Start Point 1:</label><br></br>
          <input id='startPoint' name="start"></input><br></br>
          <label>Wikipedia Article Start Point 2: </label><br></br>
          <input id='endPoint' name="end"></input><br></br><br></br>
          <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
          </form>
          <br></br><br></br>
          <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
          <br></br><br></br>
          <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
          </div>
        )
      }
    })
  }
}
function handleWikiRacerLinks(value){
  console.log(value);
  fetch(serverLocation + "/wikiracer",{
    method: "POST",
    headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
    },
    body: JSON.stringify({'link':value})
  })
  .then(response=>response.json())
  .then(data => {
    console.log(data)
  })

}
function handle2PagesLinks(pos,value){
  console.log(value)
}
//wikiRacer Game pages
function produceWikiRacerGamePage(start,end,current,steps,links){
  //FIX THIS ALLOW CLICKABLE END VALUE
  var listToUse = [];
  for (let i = 0; i < links.length; i++){
    listToUse.push(
      <div key={links[i]}>
      <div className="pseudolink" onClick={() => handleWikiRacerLinks(links[i])}>
      {links[i]}
      </div>
      <br></br></div>)
  }
  changeCode(
    <div>
    <div className='statusBar'>
      <span><b>Current:</b> {current}   </span>
      <span><b>Destination:</b> {end}   </span>
      <span><b>Steps Made:</b> {steps} </span>
      <span><Button variant="dark" onClick={getWikiRacer}>Restart</Button></span>
    </div>
    <div className="centerInfo">
    <br></br>
    <h1> {current} </h1>
    <br></br>
    {listToUse}
    </div>
    </div>
  );
}
//wikiRacer Connection Functions
function chosenTrueRandomWikiRacer(){
  fetch(serverLocation + "/check?random=true",{
    // mode:'no-cors'
  })
    .then(response=>response.json())
    .then(data => {
      console.log('Success:', data);
      produceWikiRacerGamePage(data.start,data.end,data.current,data.steps,data.links.split('^'));
    })
}
function chosenChaoticRandomWikiRacer(){
  fetch(serverLocation + "/check?random=softchaos")
  .then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    produceWikiRacerGamePage(data.start,data.end,data.current,data.steps,data.links.split('^'));
  })
}
function chosenSoftRandomWikiRacer(){
  fetch(serverLocation + "/check?random=soft")
  .then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    produceWikiRacerGamePage(data.start,data.end,data.current,data.steps,data.links.split('^'));
  })
}
//2Pages Game Pages
function produce2PagesGamePage(left,right,steps,lLinks,rLinks){
  var lListToUse = [];
  for (let i = 0; i < lLinks.length; i++){
    lListToUse.push(<div key={lLinks[i]}><div className="pseudolink" onClick={() => handle2PagesLinks(left,lLinks[i])}>{lLinks[i]}</div><br></br></div>)
  }
  var rListToUse = [];
  for (let i = 0; i < rLinks.length; i++){
    rListToUse.push(<div key={rLinks[i]}><div className="pseudolink" onClick={() => handle2PagesLinks(right,rLinks[i])}>{rLinks[i]}</div><br></br></div>)
  }
  changeCode(
    <div>
    <div className='statusBar'>
      <span><b>Left:</b> {left}  </span>
      <span><b>Right:</b> {right}  </span>
      <span><b>Steps Made:</b> {steps}  </span>
      <span><Button variant="dark" onClick={get2Pages}>Restart</Button></span>
    </div>
    <div className="leftLinks half">
      <h2> {left} </h2>
      <br></br>
      {lListToUse}
    </div>
    <div className="rightLinks half">
      <h2> {right} </h2>
      <br></br>
      {rListToUse}
    </div>
    </div>
  );
}
//2Pages Connections Functions
function chosenTrueRandom2Pages(){
  fetch(serverLocation + "/check2?random=true",{
    // mode:'no-cors'
  }).then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    produce2PagesGamePage(data.cLeft,data.cRight,data.steps,data.linksLeft.split('^'),data.linksRight.split('^'));
  })
}
function chosenCuratedRandom2Pages(){
  fetch(serverLocation + "/check2?random=soft",{
    // mode:'no-cors'
  }).then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    produce2PagesGamePage(data.cLeft,data.cRight,data.steps,data.linksLeft.split('^'),data.linksRight.split('^'));
  })
}
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
    <div className='centerInfo'  >
      <h1> WikiRacer </h1>
      If you have two Wikipedia articles in mind, you can put their article titles here.
      <br></br>
      <form onSubmit={handleWikiRacerInputs}>
      <label>Starting Wikipedia Article:</label><br></br>
      <input id='startPoint' name="start"></input><br></br>
      <label>Ending Wikipedia Article: </label><br></br>
      <input id='endPoint' name="end"></input><br></br>
      <br></br>
      <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
      </form>
      <br></br>
      <br></br>
      <Button variant="dark" onClick={chosenSoftRandomWikiRacer}>Two Fair Random Curated Articles</Button> <br></br>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenChaoticRandomWikiRacer}>ANY Two Random Curated Articles</Button> <br></br>
      <br></br><br></br>
      <Button variant="dark" onClick={chosenTrueRandomWikiRacer}>ANY Two Random Wikipedia Articles</Button> <br></br>
      </div>
  )
}
function get2Pages(){
  changeCode(
    <div className="centerInfo">
    <h1> 2Pages </h1>
    If you have two Wikipedia articles in mind, you can put their article titles here.
    <br></br>
      <form onSubmit={handle2PagesInputs}>
    <label>Wikipedia Article Start Point 1:</label><br></br>
    <input id='startPoint' name="start"></input><br></br>
    <label>Wikipedia Article Start Point 2: </label><br></br>
    <input id='endPoint' name="end"></input><br></br><br></br>
    <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
    </form>
    <br></br><br></br>
    <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
    <br></br><br></br>
    <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
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
