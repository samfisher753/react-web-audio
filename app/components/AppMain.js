import React from 'react';
import AppBar from './AppBar'; 
import { Grid, Row, Col, Jumbotron, Panel, Modal, Button } from 'react-bootstrap';
import SamplesList from './samples/SamplesList';
import AudioEditor from './audio-editor/AudioEditor';
import MyBufferLoader from '../web-audio-api/my-buffer-loader-es6';

import samples from './samples/data';

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
      channelNum: 0,
      loading: false,
      sampleSource: null,

      samples: samples,

      playing: false,
      recording: false,
      bars: 4,
      bpm: 85,
      tc: 16,
      loop: false,
      loopTimes: 0, // 0 infinite
      loopCount: 0,
      filetype: 'wav',
    };

    this.addChannel = this.addChannel.bind(this);
    this.deleteChannel = this.deleteChannel.bind(this);
    this.bufferLoaded = this.bufferLoaded.bind(this);
    this.setState = this.setState.bind(this);
    this.disconnectAll = this.disconnectAll.bind(this);
    this.stopAllSources = this.stopAllSources.bind(this);
    this.showSamplesList = this.showSamplesList.bind(this);
    this.hideSamplesList = this.hideSamplesList.bind(this);

    this.save = this.save.bind(this);
  }

  disconnectAll() {
    let channels = this.state.channels;
    for (let i=0; i<channels.length; ++i)
      channels[i].gainNode.disconnect();
    let master = this.state.master;
    master.disconnect();
  }

  addChannel(url) {
    let context = this.state.context;
    let gainNode = context.createGain();
    let channelId = this.state.channelNum;
    let channels = [
      ...this.state.channels,
      {
        id: channelId,
        url: url,
        beats: [],
        gainNode: gainNode,
        sourceList: [],
      }
    ];

    this.setState({
      channels: channels,
      channelNum: ++this.state.channelNum,
      loading: true,
    });

    let myBufferLoader = new MyBufferLoader(context, url, channelId, this.bufferLoaded);
    myBufferLoader.load();
  }

  deleteChannel(id) {
    let channels = this.state.channels;
    for (let i=0; i<channels.length; ++i){
      if (channels[i].id === id){
        channels.splice(i, 1);
        break;
      }
    }

    this.setState({
      channels: channels,
    });
  }

  bufferLoaded(channelId, buffer){
    let channels = this.state.channels;
    for (let i=0; i<channels.length; ++i)
      if (channels[i].id === channelId)
        channels[i].buffer = buffer;
      
    this.setState({
      channels: channels,
      loading: false,
    });
  }

  // Make sure to call setState after to update sourceList with returned value.
  stopAllSources() {
    let sourceList = this.state.sourceList;
    for (let i = 0; i < sourceList.length; ++i) {
      sourceList[i].stop(0);
      sourceList[i].disconnect();
    }
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

  save() {
    let state = this.state;
    let channels = [];

    for (let i=0; i<state.channels.length; ++i) {
      channels.push({
        id: state.channels[i].id,
        url: state.channels[i].url,
        beats: state.channels[i].beats,
        gain: state.channels[i].gainNode.gain.value,
      });
    }

    let project = {
      channels: channels,
      masterGain: state.master.gain.value,
      channelNum: state.channelNum,
      samples: state.samples,
      bars: state.bars,
      bpm: state.bpm,
      tc: state.tc,
      loop: state.loop,
      loopTimes: state.loopTimes,
      filetype: state.filetype,
    };

    download(JSON.stringify(project, null, 2), 'MyProject.json');
  }

  render() {
    return (
      <div>
        <AppBar save={this.save} />
        <div>
        <Grid>
          <Row>
            <Col>
              <AudioEditor appState={this.state} setAppState={this.setState} stopAllSources={this.stopAllSources} showSamplesList={this.showSamplesList} deleteChannel={this.deleteChannel} />
            </Col>
          </Row>
        </Grid>

        <button onClick={() => console.log(this.state)}>Show state</button>

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
      </div>
    );
  }
}

export default AppMain;