import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import SampleItem from './SampleItem';
import samples from './data.js';
import { Button } from 'react-bootstrap';

class SamplesList extends React.Component {
  constructor(props) {
    super();

    this.state = {
      samples: samples,
    };

    this.addSample = this.addSample.bind(this);
  }

  addSample() {
    let samples = this.state.samples;
    samples.push(this.refs.url.value);
    
    this.setState({
      samples: samples,
    });
  }

  render() {
    return (
      <Jumbotron style={{ padding: '10px' }}>
        <h3 style={{ textAlign: 'center' }}>Samples List</h3>
        <div style={{ display: 'block' }}>
          <b>Url:</b> <input ref='url' type='text'style={{ width: '430px', marginTop: '3px', marginRight: '10px', marginBottom: '20px' }}/>
          <Button onClick={this.addSample} style={{ width: '70px', float: 'right', marginRight: '5px' }} >Add</Button>
        </div>
        { this.state.samples.map((url, key) => 
          <SampleItem url={url} key={key} appState={this.props.appState} setAppState={this.props.setAppState} addChannel={this.props.addChannel} stopAllSources={this.props.stopAllSources} />
          )
        }
      </Jumbotron>
    );
  }
}

export default SamplesList;
