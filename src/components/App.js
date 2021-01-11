import React from 'react';
import AppBar from './AppBar'; 
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import SamplesList from './samples/SamplesList';
import AudioEditor from './audio-editor/AudioEditor';
import MyBufferLoader from '../web-audio-api/my-buffer-loader-es6';

import samples from './samples/data';

class App extends React.Component {
  constructor() {
    super();
    window.AudioContext =
      window.AudioContext || window.webKitAudioContext;
    let context = new AudioContext();
    let master = context.createGain();
    master.gain.value = 0.5;
    master.connect(context.destination);

    let recorder = new window.WebAudioRecorder(master, {
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
      context,
      channels: [],
      master,
      showSamplesList: false,
      recorder,
      channelNum: 0,
      loading: false,
      sampleSource: null,

      samples,

      playing: false,
      recording: false,
      bars: 4,
      bpm: 85,
      tc: 16,
      loop: false,
      loopTimes: 0, // 0 infinite
      loopCount: 1,
      filetype: 'wav',

      startBar: 1,
      endBar: 4,
    };

    this.addChannel = this.addChannel.bind(this);
    this.deleteChannel = this.deleteChannel.bind(this);
    this.bufferLoaded = this.bufferLoaded.bind(this);
    this.setState = this.setState.bind(this);
    this.disconnectAll = this.disconnectAll.bind(this);
    this.stopAllSources = this.stopAllSources.bind(this);
    this.showSamplesList = this.showSamplesList.bind(this);
    this.hideSamplesList = this.hideSamplesList.bind(this);

    this.appReset = this.appReset.bind(this);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
  }

  appReset() {
    if (this.state.playing) clearTimeout(this.state.timeout);
    this.stopAllSources();
    if (this.state.sampleSource !== null) {
      this.state.sampleSource.stop(0);
      this.state.sampleSource.disconnect();
    }
    this.disconnectAll();
    let master = this.state.master;
    master.gain.value = 0.5;

    this.setState({
      channels: [],
      master,
      showSamplesList: false,
      channelNum: 0,
      loading: false,
      sampleSource: null,
      playing: false,
      recording: false,
      bars: 4,
      bpm: 85,
      tc: 16,
      loop: false,
      loopTimes: 0,
      loopCount: 1,
      filetype: 'wav',
      startBar: 1,
      endBar: 4,
    });
  }

  disconnectAll() {
    let channels = this.state.channels;
    for (let i=0; i<channels.length; ++i)
      channels[i].gainNode.disconnect();
  }

  addChannel(url) {
    let context = this.state.context;
    let gainNode = context.createGain();
    let master = this.state.master;
    let channelId = this.state.channelNum;
    gainNode.connect(master);
    gainNode.gain.value = 0.5;

    let channels = [
      ...this.state.channels,
      {
        id: channelId,
        url: url,
        beats: [],
        gainNode: gainNode,
        sources: [],
      }
    ];

    this.setState({
      channels: channels,
      channelNum: this.state.channelNum + 1,
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
    for (let i=0; i<channels.length; ++i){
      if (channels[i].id === channelId){
        channels[i].buffer = buffer;
        break;
      }
    }
      
    this.setState({
      channels: channels,
      loading: false,
    });
  }

  stopAllSources() {
    let channels = this.state.channels;
    for (let i=0; i<channels.length; ++i){
      let sources = channels[i].sources;
      for (let j=0; j<sources.length; ++j){
        if (sources[j].source !== null){
          sources[j].source.stop(0);
          sources[j].source.disconnect();
          sources[j].source = null;
        }
      }
    }
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

  load(project) {
    this.appReset();
    let channels = [];
    let context = this.state.context;
    let master = this.state.master;
    master.gain.value = project.masterGain;
    for (let i=0; i<project.channels.length; ++i){
      let pch = project.channels[i];
      let sources = project.channels[i].sources;
      let sourcesToLoad = [];
      
      for (let j=0; j<sources.length; ++j)
        sourcesToLoad.push({ id: sources[j].id, source: null });

      let gainNode = context.createGain();
      gainNode.connect(master);
      gainNode.gain.value = pch.gain;
      channels.push({
        id: pch.id,
        gainNode: gainNode,
        sources: sourcesToLoad,
        url: pch.url,
      });
    }

    this.setState({
      channels: channels,
      master: master,
      channelNum: project.channelNum,
      bars: project.bars,
      bpm: project.bpm,
      tc: project.tc,
      loop: project.loop,
      loopTimes: project.loopTimes,
      filetype: project.filetype,
      loading: true,
      startBar: project.startBar,
      endBar: project.endBar,
    });

    for (let i=0; i<channels.length; ++i) {
      let ch = channels[i];
      let myBufferLoader = new MyBufferLoader(context, ch.url, ch.id, this.bufferLoaded);
      myBufferLoader.load();
    }
  }

  save() {
    let state = this.state;
    let channels = [];

    for (let i=0; i<state.channels.length; ++i) {
      let sources = state.channels[i].sources;
      let sourcesToSave = [];
      for (let j=0; j<sources.length; ++j) {
        let source = state.channels[i].sources[j];
        sourcesToSave.push({ id: source.id });
      }
      
      channels.push({
        id: state.channels[i].id,
        url: state.channels[i].url,
        sources: sourcesToSave,
        gain: state.channels[i].gainNode.gain.value,
      });
    }

    let project = {
      channels: channels,
      masterGain: state.master.gain.value,
      channelNum: state.channelNum,
      bars: state.bars,
      bpm: state.bpm,
      tc: state.tc,
      loop: state.loop,
      loopTimes: state.loopTimes,
      filetype: state.filetype,
      startBar: state.startBar,
      endBar: state.endBar,
    };

    window.download(JSON.stringify(project, null, 2), 'MyProject.json');
  }

  render() {
    return (
      <div>
        <AppBar new={this.appReset} load={this.load} save={this.save} />

        <Container style={{marginTop: '25px'}}>
          <Row>
            <Col>
              <AudioEditor appState={this.state} setAppState={this.setState} stopAllSources={this.stopAllSources} showSamplesList={this.showSamplesList} deleteChannel={this.deleteChannel} />
            </Col>
          </Row>
        </Container>

        { /* <button onClick={() => console.log(this.state)}>Show state</button> */ }

        <Modal show={this.state.showSamplesList} onHide={this.hideSamplesList}>
          <Modal.Header closeButton>
            <Modal.Title>Select the samples you want to use</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SamplesList appState={this.state} setAppState={this.setState} addChannel={this.addChannel} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.hideSamplesList}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;