import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import SampleItem from './SampleItem';

class SamplesList extends React.Component {
  constructor(props) {
    super();

    this.gainNode = props.appState.context.createGain();
    this.gainNode.gain.value = 0.25;
    this.gainNode.connect(props.appState.context.destination);
  }

  render() {
    return (
      <Jumbotron style={{ padding: '10px' }}>
        <h3 style={{ textAlign: 'center' }}>Samples List</h3>
        { this.props.appState.samples.map((url, key) => 
          <SampleItem
            url={url}
            key={key}
            appState={this.props.appState}
            setAppState={this.props.setAppState}
            addChannel={this.props.addChannel}
            gainNode={this.gainNode}
          />
          )
        }
      </Jumbotron>
    );
  }
}

export default SamplesList;
