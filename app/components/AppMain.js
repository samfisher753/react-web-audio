import React from 'react';
import { Grid, Row, Col, Jumbotron, Panel, Modal, Button } from 'react-bootstrap';
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

    let recorder = new WebAudioRecorder(master, {
      workerDir: '../lib/',     // must end with slash
      options: {
        ogg: {
          quality: 1,
        },
        mp3: {
          bitRate: 320,
        },
      },
    });

    this.state = {
      context: context,
      sourceList: [],
      channels: [],
      master: master,
      showSamplesList: false,
      recorder: recorder,
    };

    this.addChannel = this.addChannel.bind(this);
    this.setState = this.setState.bind(this);
    this.stopAllSources = this.stopAllSources.bind(this);
    this.showSamplesList = this.showSamplesList.bind(this);
    this.hideSamplesList = this.hideSamplesList.bind(this);
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

  showSamplesList() {
    this.setState({
      showSamplesList: true,
    });
  }

  hideSamplesList() {
    this.setState({
      showSamplesList: false,
    });
  }

  render() {
    return (
      <div>
      <Grid>
        <Row>
          <Col>
            <AudioEditor appState={this.state} setAppState={this.setState} stopAllSources={this.stopAllSources} showSamplesList={this.showSamplesList} />
          </Col>
        </Row>
      </Grid>

      { /* <button onClick={() => console.log(this.state)}>Show state</button> */ }

      <Modal show={this.state.showSamplesList} onHide={this.hideSamplesList}>
        <Modal.Header closeButton>
          <Modal.Title>Select the samples you want or add new ones to the list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SamplesList appState={this.state} setAppState={this.setState} addChannel={this.addChannel} stopAllSources={this.stopAllSources} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideSamplesList}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      </div>
    );
  }
}

export default AppMain;