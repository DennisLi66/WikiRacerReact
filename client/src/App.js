import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import './App.css';
function App() {
//wikiracer variables
var beginning = "";
var destination = "";
//2pages variables
var leftStart =  "";
var rightStart = "";
var currentLeft = "";
var currentRight = "";
var orientation = "";
var prevLeftList = "";
var prevRightList = "";
//omnivariables
var steps = 0;
var history = "";

const [code,changeCode] = React.useState(
  <div className='centerBox'>
    <h1> Welcome to WikiRacer </h1><br></br>
    <Button variant="dark" onClick={getDescription}>What is WikiRacing?</Button> <br></br><br></br>
    <Button variant="dark" onClick={getWikiRacer}>Play WikiRacer</Button> <br></br><br></br>
    <Button variant="dark" onClick={get2Pages}>Play 2Pages</Button> <br></br>
  </div>
)
const [details,changeDetails] = React.useState({
  statusHidden: true,
  start: "",
  end: "",
  current: "",
  steps: 0,
  history: ""
})
const [details2,changePages] = React.useState({
  statusHidden: true,
  leftCurrent: "",
  rightCurrent: "",
  steps: 0,
  orientation: "",
  history: ""
})
var serverLocation = "http://localhost:3001";
//FIX THIS 2018 African Swimming Championships – Women's 50 metre backstroke
//the above produces questionable link at the bottom
//assistance Functions
function openInNewWindow(value){
  //console.log("https://en.wikipedia.org/wiki/" + value);
  window.open("https://en.wikipedia.org/wiki/" + value,"_blank");
}
//background function
function hideDetails(){
  changeDetails( prev => {
    return {
    ...prev,
    statusHidden: true
  }
  })
}
function hideDetailsPages(){
  changePages( prev => {
      return {
        ...prev,
        statusHidden: true
      }
  }
  )
}
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
    fetch(serverLocation + "/check?random=false&start=" + start + "&end=" + end,{
        withCredentials: true, credentials:  'include'
    })
    .then(response=>response.json())
    .then(data => {
      var selectList = [];
      var e = []
      console.log('Success:', data);
      if (data.status === 0){
        changeDetails({
          statusHidden: false,
          start: data.startTitle,
          end: data.endTitle,
          current: data.startTitle,
          steps: 0,
          history: start
        })
        destination = data.endTitle;
        beginning = data.startTitle;
        history = data.startTitle;
        produceWikiRacerGamePage(data.startTitle,data.links.split('^'))
      }else if (data.status === 5){ //An Error has occurred
        changeCode(
          <div className='centerInfo'  >
            <div className='errorMsg'> These articles were not both valid. Please type new ones. </div>
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
    fetch(serverLocation + "/check2?random=false&left=" + start + "&right=" + end,{
        withCredentials: true, credentials:  'include'
    })
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
          <br></br>
          <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
          </form>
          <br></br>
          <br></br>
          <Button variant="dark" onClick={chosenCuratedRandom2Pages}> Two Random Curated Articles</Button> <br></br>
          <br></br><br></br>
          <Button variant="dark" onClick={chosenTrueRandom2Pages}> Any Two Random Wikipedia Articles</Button> <br></br>
          </div>
        )
      }
      else if (data.status === -1){///An error has occurred
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
      else if (data.status === 11){/// Second starting point ambiguous
        var eList = [];
        var ee = data.rList.split("^");
        for (let x = 0; x < ee.length; x++){
          eList.push(<option key={ee[x]}>{ee[x]}</option>);
        }
        changeCode(
        <div>
        Your first starting point, {data.leftTerm}, was not ambiguous, so there is no need to change it.
        <form onSubmit={handle2PagesInputs}>
         <input type='hidden' id='startPoint' value={data.leftTerm}></input>
          Your second starting point, {data.rightTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
          <br></br>
          <select id='endPoint'>
            {eList}
          </select>
          <br></br>
          <br></br>
          <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
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
        Your second starting point, {data.rightTerm}, was not ambiguous, so there is no need to change it.
        <form onSubmit={handle2PagesInputs}>
         <input type='hidden' id='endPoint' value={data.rightTerm}></input>
          Your first starting point, {data.leftTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
          <br></br>
          <select id='startPoint'>
            {sList}
          </select>
          <br></br>
          <br></br>
          <Button variant="dark" type="submit" >Confirm Choices</Button> <br></br>
          </form>
        </div>
      )
      }
      else if (data.status === 99){/// Both starting points ambiguous
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
            Your first starting point, {data.leftTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your starting point.
            <br></br>
            <select name='start' id='startPoint'>
            {startList}
            </select>
            <br></br>
            Your second starting point, {data.rightTerm}, was ambiguous. You're going to need to be more specific. Here are options based on your ending point.
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
          leftStart = data.leftTitle;
          rightStart = data.rightTitle;
          changePages({
            statusHidden: false,
            leftCurrent: data.leftTitle,
            rightCurrent: data.rightTitle,
            steps: 0
          })
          produce2PagesGamePage(data.leftTitle,data.rightTitle,data.leftLinks,data.rightLinks);
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
// Links
function handleWikiRacerLinks(value){
  console.log(value);
  fetch(serverLocation + "/getLinks?link=" + value + "&end=" + destination)
  .then(response=>response.json())
  .then(data => {
    console.log(data);
    if (data.status === -1){
      hideDetails();
      changeCode(
          <div className='centerInfo'  >
          <div className='errorMsg'> {data.message} </div>
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
    }else if (data.status === 1000){//Victory
      hideDetails();
      var historyList = [];
      steps++;
      history+= '^' + value;
      for (let i = 0; i < history.split('^').length; i++){
        historyList.push(
            <tr key={i + 1}>
              <td> {i + 1} </td>
              <td> {history.split('^')[i]} </td>
            </tr>
        )
      }
      var grammar = (steps === 1 ? 'step' : 'steps')
      changeCode(
        <div className='centerInfo'>
        <h1> Congratulations! </h1>
        You reached {destination} from {beginning} in {steps} {grammar}.
        <br></br><br></br>
          <Button variant="dark" onClick={getWikiRacer}>Restart</Button> <br></br><br></br>
        <br></br><br></br>
          <h2> History </h2>
          <table className="table">
            <thead>
              <tr>
                <th scope='col'> Step Number </th>
                <th scope='col'> Wikipedia Article Title</th>
              </tr>
            </thead>
            <tbody>
              {historyList}
            </tbody>
          </table>
        </div>
      )
    }else if (data.status === 0){//Normal
      changeDetails( prev => {
        return{
          ...prev,
          steps: prev.steps + 1
        }
      })
      steps++;
      history += '^' + value;
      produceWikiRacerGamePage(data.current,data.links.split("^"));
    }
  })

}
function handle2PagesLinks(pos,value){
  //things to do: increase orientation, steps, and histoty
  //change current left and right, done in producegamepage
  console.log(value);
  var otherSide = (pos === "left" ? currentRight : currentLeft);
  fetch(serverLocation + "/getLinks?link=" + value + "&end=" + otherSide)
  .then(response=>response.json())
  .then(data => {
    console.log(data);
    if (data.status === 1000){//Victory
      hideDetailsPages();
      var historyList = [];
      steps++;
      history+= (history === "" || !history ? value : '^' + value);
      orientation += (orientation === "" || !orientation ? "" : "^") + (pos === "left" ? "L" : "R");
      var grammar = (steps === 1 ? 'step' : 'steps');
      var prevLeft = leftStart;
      var prevRight = rightStart;
      historyList.push(
        <tr key={0}>
        <td> 0 </td>
        <td> {prevLeft} </td>
        <td> {prevRight} </td>
        </tr>
      )
      console.log(history.split("^"));
      console.log(orientation.split("^"));
      for (let i = 0; i < history.split('^').length; i++){
        if (orientation.split('^')[i] === "L"){
          historyList.push(
            <tr key={i+1}>
            <td> {i + 1} </td>
            <td> {history.split('^')[i]} </td>
            <td> {prevRight} </td>
            </tr>
          )
          prevLeft = history.split('^')[i];
        }
        else{
          historyList.push(
            <tr key={i+1}>
            <td> {i + 1} </td>
            <td> {prevLeft} </td>
            <td> {history.split('^')[i]} </td>
            </tr>
          )
          prevRight = history.split('^')[i];
        }
      }
      changeCode(
        <div className='centerInfo'>
        <h1> Congratulations! </h1>
        You reached {value} from {leftStart} and {rightStart} in {steps} {grammar}.
        <br></br><br></br>
          <Button variant="dark" onClick={get2Pages}>Restart</Button> <br></br><br></br>
        <br></br><br></br>
        <h2> History </h2>
        <table className="table">
          <thead>
            <tr>
              <th scope='col'> Step Number </th>
              <th scope='col'> Left Article Title</th>
              <th scope='col'> Right Article Title</th>
            </tr>
          </thead>
          <tbody>
            {historyList}
          </tbody>
        </table>
        </div>
      )
    }
    else if (data.status === 0){//Successful
      changePages( prev => {
        return {
        ...prev,
        steps: prev.steps + 1
      }
      })
      steps++;
      history += (history === "" || !history ? value : "^" + value);
      orientation += (orientation === "" || !orientation ? "" : "^") + (pos === 'left' ? 'L' : 'R');
      if (pos === 'left'){
        produce2PagesGamePage(value,currentRight,data.links,prevRightList)
      }else{
        produce2PagesGamePage(currentLeft,value,prevLeftList,data.links)
      }
    }
    else if (data.status === -1){//Error
      hideDetailsPages();
      changeCode(
        <div className="centerInfo">
        <div className='errorMsg'> {data.message} </div>
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
//wikiRacer Connection Functions
function chosenTrueRandomWikiRacer(){
  fetch(serverLocation + "/check?random=true",{
    withCredentials: true, credentials:  'include'
  })
    .then(response=>response.json())
    .then(data => {
      console.log('Success:', data);
      changeDetails({
        statusHidden: false,
          start: data.current,
          current: data.current,
          end: data.end,
          steps: 0,
          history: data.start
      })
      destination = data.end;
      produceWikiRacerGamePage(data.current,data.links.split('^'));
    })
}
function chosenChaoticRandomWikiRacer(){
  fetch(serverLocation + "/check?random=softchaos",{
      withCredentials: true, credentials:  'include'
  })
  .then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    changeDetails({
              statusHidden: false,
        start: data.start,
                  current: data.current,
        end: data.end,
        steps: 0,
        history: data.start
    })
      destination = data.end;
    produceWikiRacerGamePage(data.current,data.links.split('^'));
  })
}
function chosenSoftRandomWikiRacer(){
  fetch(serverLocation + "/check?random=soft",{
      withCredentials: true, credentials:  'include'
  })
  .then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    changeDetails({
        statusHidden: false,
        start: data.start,
        current: data.current,
        end: data.end,
        steps: 0,
        history: data.start
    })
      destination = data.end;
    produceWikiRacerGamePage(data.current,data.links.split('^'));
  })
}
//2Pages Connections Functions
function chosenTrueRandom2Pages(){
  fetch(serverLocation + "/check2?random=true",{
  withCredentials: true, credentials:  'include'
  }).then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    changePages({
      statusHidden: false,
      leftCurrent: data.leftStart,
      rightCurrent: data.rightStart,
      steps: 0
    })
    produce2PagesGamePage(data.leftStart,data.rightStart,data.leftLinks,data.rightLinks);
  })
}
function chosenCuratedRandom2Pages(){
  fetch(serverLocation + "/check2?random=soft",{
  withCredentials: true, credentials:  'include'
  }).then(response=>response.json())
  .then(data => {
    console.log('Success:', data);
    changePages({
      statusHidden: false,
      leftCurrent: data.leftStart,
      rightCurrent: data.rightStart,
      steps: 0
    })
    produce2PagesGamePage(data.leftStart,data.rightStart,data.leftLinks,data.rightLinks);
  })
}
//2Pages Game Pages
function produceWikiRacerGamePage(current,links){
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
    <div className="centerInfo">
    <br></br>
    <h1> {current} </h1>
    <br></br>
    {listToUse}
    </div>
    </div>
  );
}
function produce2PagesGamePage(left,right,laLinks,raLinks){
  prevLeftList = laLinks;
  prevRightList = raLinks;
  var lLinks = laLinks.split('^');
  var rLinks = raLinks.split('^');
  currentRight = right;
  currentLeft = left;
  var lListToUse = [];
  for (let i = 0; i < lLinks.length; i++){
    lListToUse.push(<div key={lLinks[i]}><div className="pseudolink" onClick={() => handle2PagesLinks('left',lLinks[i])}>{lLinks[i]}</div><br></br></div>)
  }
  var rListToUse = [];
  for (let i = 0; i < rLinks.length; i++){
    rListToUse.push(<div key={rLinks[i]}><div className="pseudolink" onClick={() => handle2PagesLinks('right',rLinks[i])}>{rLinks[i]}</div><br></br></div>)
  }
  changeCode(
    <div>
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
//get Pages
function getHome(){
  hideDetails();
    steps = 0;
  hideDetailsPages();
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
  hideDetails();
    steps = 0;
  hideDetailsPages();
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
  hideDetails();
    steps = 0;
  hideDetailsPages();
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
  currentLeft = "";
  currentRight = "";
  hideDetails();
    steps = 0;
  hideDetailsPages();
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
    <div className='statusBar' hidden={details.statusHidden}>
      <span><b>Current:</b> {details.current}   </span>
      <span className='pseudolink' onClick={() => openInNewWindow(details.end)}><b>Destination:</b> {details.end}   </span>
      <span><b>Steps Made:</b> {details.steps} </span>
      <span><Button variant="dark" onClick={getWikiRacer}>Restart</Button></span>
    </div>
    <div className='statusBar' hidden={details2.statusHidden}>
      <span><b>Left:</b> {details2.leftCurrent}  </span>
      <span><b>Right:</b> {details2.rightCurrent}  </span>
      <span><b>Steps Made:</b> {steps}  </span>
      <span><Button variant="dark" onClick={get2Pages}>Restart</Button></span>
    </div>
      {code}
    </div>
    // <div>
    //   <Button variant="dark" onClick={button1}>Button 1</Button> <br></br><br></br>
    //   <Button variant="dark" onClick={button2}>Button 2</Button> <br></br><br></br>
    // </div>
  );
}

export default App;
