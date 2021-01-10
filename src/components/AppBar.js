import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import exampleProject from './samples/exampleProject';

class AppBar extends React.Component {
  constructor(props){
    super();

    this.showFileChooser = this.showFileChooser.bind(this);
    this.readFile = this.readFile.bind(this);
    this.loadExampleProject = this.loadExampleProject.bind(this);
  }

  showFileChooser() {
    this.refs.load.click();
  }

  readFile(e) {
    let files = e.target.files;
    if (files.length === 1) {
      let file = files[0];
      let reader = new FileReader();

      reader.onload = ((f) => {
        return (e) => {
          try {
            let project = JSON.parse(e.target.result);
            this.props.load(project);
            this.refs.load.value = '';
          } catch (ex) {
            alert('Exception when trying to parse json: ' + ex);
          }
        }
      })(file);

      reader.readAsText(file);
    }
  }

  loadExampleProject(){
    this.props.load(exampleProject);
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#">React Sequencer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <input type='file' ref='load' style={{ display: 'none' }} onChange={this.readFile} accept='.json' />
            <NavDropdown title="File" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={this.props.new.bind(null)}>New</NavDropdown.Item>
              <NavDropdown.Item onClick={this.showFileChooser}>Load</NavDropdown.Item>
              <NavDropdown.Item onClick={this.props.save.bind(null)}>Save</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={this.loadExampleProject}>Load example project</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AppBar;