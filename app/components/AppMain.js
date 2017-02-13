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

    this.state = {
      context: context,
      sourceList: [],
      channels: [],
    }

    this.addChannel = this.addChannel.bind(this);
    this.setState = this.setState.bind(this);
  }

  addChannel(url) {
    let channels = [
      ...this.state.channels,
      {
        id: this.state.channels.length,
        url: url,
      }
    ];

    this.setState({
      channels: channels
    });
  }

  render() {
    return (
      <Grid>
        <button onClick={() => console.log(this.state)}>Show state</button>
        <Row>
          <Col md={3}>
            <SamplesList appState={this.state} setAppState={this.setState} addChannel={this.addChannel} />
          </Col>
          <Col md={9}>
            <AudioEditor appState={this.state} setAppState={this.setState} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default AppMain;