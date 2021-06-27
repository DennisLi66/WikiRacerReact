import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
// import logo from './logo.svg';
import './App.css';

function App() {

const [code,changeCode] = React.useState(
  <div className='centerBox'>
    <h1> Welcome to WikiRacer </h1>
    Button 1 <br></br>
    Button 2 <br></br>
    Button 3 <br></br>
  </div>
)
function getHome(){
  changeCode(
    <div className='centerBox'>
      <h1> Welcome to WikiRacer </h1>
      Button 1 <br></br>
      Button 2 <br></br>
      Button 3 <br></br>
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
          <Nav.Link href="#action1">Home</Nav.Link>
          <Nav.Link href="#action2">Link</Nav.Link>
          <NavDropdown title="Link" id="navbarScrollingDropdown">
            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="#" disabled>
            Link
          </Nav.Link>
        </Nav>
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2"
            aria-label="Search"
          />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>

      {code}
    </div>
  );
}

export default App;
