import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import SampleItem from './SampleItem';
import samples from './data.js';

class SamplesList extends React.Component {
  render() {
    return (
      <Jumbotron style={{ padding: '10px' }}>
        <h3 style={{ textAlign: 'center' }}>Samples List</h3>
        { samples.map((url, key) => 
          <SampleItem url={url} key={key} appState={this.props.appState} setAppState={this.props.setAppState} addChannel={this.props.addChannel} />
          )
        }
      </Jumbotron>
    );
  }
}

export default SamplesList;
