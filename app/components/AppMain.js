import React from 'react';
import { Grid, Row, Col, Jumbotron, Panel } from 'react-bootstrap';
import SamplesList from './samples/SamplesList';
import AudioEditor from './audio-editor/AudioEditor';

class AppMain extends React.Component {
  constructor() {
    super();
    window.AudioContext =
      window.AudioContext || window.webKitAudioContext;
    let context = new AudioContext();
    let master = context.createGain();
    master.connect(context.destination);

    this.state = {
      context: context,
      sourceList: [],
      channels: [],
      master: master,
    }

    this.addChannel = this.addChannel.bind(this);
    this.setState = this.setState.bind(this);
    this.stopAllSources = this.stopAllSources.bind(this);
  }

  addChannel(url) {
    let context = this.state.context;
    let gainNode = context.createGain();
    let channels = [
      ...this.state.channels,
      {
        id: this.state.channels.length,
        url: url,
        beats: [],
        gainNode: gainNode,
      }
    ];

    this.setState({
      channels: channels
    });
  }

  // Make sure to call setState after to update sourceList with returned value.
  stopAllSources() {
    let sourceList = this.state.sourceList;
    for (let i = 0; i < sourceList.length; ++i)
      sourceList[i].stop(0);
    sourceList = [];
    return sourceList;
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={3}>
            <SamplesList appState={this.state} setAppState={this.setState} addChannel={this.addChannel} stopAllSources={this.stopAllSources} />
            <button onClick={() => console.log(this.state)}>Show state</button>
          </Col>
          <Col md={9}>
            <AudioEditor appState={this.state} setAppState={this.setState} stopAllSources={this.stopAllSources} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default AppMain;