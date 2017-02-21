import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class AppBar extends React.Component {
  constructor(props){
    super();

    this.showFileChooser = this.showFileChooser.bind(this);
    this.readFile = this.readFile.bind(this);
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

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">React-Web-Audio</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <input type='file' ref='load' style={{ display: 'none' }} onChange={this.readFile} />
          <Nav>
            <NavItem eventKey={1} href="#" onClick={this.props.new.bind(null)}>New</NavItem>
            <NavItem eventKey={2} href="#" onClick={this.showFileChooser}>Load</NavItem>
            <NavItem eventKey={3} href="#" onClick={this.props.save.bind(null)}>Save</NavItem>
            <NavDropdown eventKey={4} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={4.1}>Action</MenuItem>
              <MenuItem eventKey={4.2}>Another action</MenuItem>
              <MenuItem eventKey={4.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={4.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Link Right</NavItem>
            <NavItem eventKey={2} href="#">Link Right</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AppBar;