import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import BeatsGrid from './BeatsGrid';
import Mixer from './Mixer';
import ControlBar from './ControlBar';
import BufferLoader from '../../web-audio-api/buffer-loader-es6';

class AudioEditor extends React.Component {
  constructor(props){
    super();
    this.state = {
      playing: false,
      recording: false,
      bars: 4,
      bpm: 85,
      tc: 16,
      loop: false,
      filetype: 'wav',
    }

    this.changeBars = this.changeBars.bind(this);
    this.changeBPM = this.changeBPM.bind(this);
    this.changeTC = this.changeTC.bind(this);
    this.addBeat = this.addBeat.bind(this);
    this.removeBeat = this.removeBeat.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.record = this.record.bind(this);
    this.onChangeLoop = this.onChangeLoop.bind(this);
    this.changeFileType = this.changeFileType.bind(this);
    this.endPlayHandler = this.endPlayHandler.bind(this);
  }

  changeBars(e) {
    let oldBars = this.state.bars;
    let newBars = parseInt(e.target.value);
    let channels = this.props.appState.channels;

    if (newBars < oldBars) {
      let maxBeats = newBars * this.state.tc;
      for (let i=0; i<channels.length; ++i) {
        let beats = channels[i].beats;
        for (let j=0; j<beats.length; ++j) {
          if (beats[j] >= maxBeats) 
            beats.splice(j--, 1);
        }
      }
    }

    this.setState({
      channels: channels,
      bars: newBars,
    });
  }

  changeBPM(e) {
    this.setState({
      bpm: parseInt(e.target.value),
    });
  }

  changeTC(e) {
    // Beats reset
    let channels = this.props.appState.channels;
    for (let i=0; i<channels.length; ++i)
      channels[i].beats = [];

    this.setState({
      channels: channels,
      tc: parseInt(e.target.value),
    });
  }

  addBeat(ch, id) {
    let channels = this.props.appState.channels;
    let beats = channels[ch].beats;
    beats.push(id);
    channels[ch].beats = beats;

    this.props.setAppState({
      channels: channels,
    });
  }

  removeBeat(ch, id) {
    let channels = this.props.appState.channels;
    let beats = channels[ch].beats;
    let index = beats.indexOf(id);
    beats.splice(index, 1);
    channels[ch].beats = beats;

    this.props.setAppState({
      channels: channels,
    });
  }

  play() {
    let appState = this.props.appState;

    if (!appState.loading) {
      this.setState({
        playing: true,
      });
    
      let sourceList = this.props.stopAllSources();
      this.props.setAppState({
        sourceList: sourceList,
      });

      let context = appState.context;
      let channels = appState.channels;
      let master = appState.master;

      let initTime = context.currentTime;
      let bars = this.state.bars;
      let bpm = this.state.bpm;
      let tc = this.state.tc;
      let noteTime = (60 / bpm) / (tc / 4);

      for (let i=0; i<channels.length; ++i) {
        let buffer = channels[i].buffer;
        let beats = channels[i].beats;
        let gainNode = channels[i].gainNode;
        let chSourceList = [];

        for (let j=0; j<beats.length; ++j) {
          let source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(gainNode);
          gainNode.connect(master);
          let time = initTime + beats[j] * noteTime;
          chSourceList.push(source);
          source.start(time);
        }

        channels[i] = Object.assign({}, channels[i], { sourceList: chSourceList });
        sourceList = [
          ...sourceList,
          ...chSourceList,
        ];
      }

      this.props.setAppState({
        channels: channels,
        sourceList: sourceList,
      });

      let duration = 240 / bpm * bars * 1000;
      let timeout = setTimeout(() => {
        this.endPlayHandler();
      }, duration);

      this.setState({
        timeout: timeout,
      });
    }
  }

  endPlayHandler(){
    if (this.state.loop && !this.state.recording){
      this.play();
    }
    else {
      this.setState({
        playing: false,
      });
    }
  }

  stop() {
    if (this.state.playing) {
      clearTimeout(this.state.timeout);
      this.setState({
        playing: false,
      });
    }
    let sourceList = this.props.stopAllSources();
    this.props.setAppState({
      sourceList: sourceList,
    });
    this.setState({
      playing: false,
    });
  }

  record() {
    if (!this.props.appState.loading) {
      let bars = this.state.bars;
      let bpm = this.state.bpm;
      let recorder = this.props.appState.recorder;
      let duration = (( 240 * bars ) / bpm);
      let type = this.state.filetype;

      recorder.setOptions({ timeLimit: duration });
      recorder.onComplete = (rec, blob) => {
        download(blob, 'mixdown.' + type);
        this.setState({
          recording: false,
        });
      };
      
      this.setState({
        recording: true,
      });
      
      recorder.startRecording();
      this.play();
    }
  }

  onChangeLoop(e) {
    this.setState({
      loop: e.target.checked,
    });
  }

  changeFileType(type) {
    let recorder = this.props.appState.recorder;
    if (!recorder.isRecording()) {
      recorder.setEncoding(type);

      this.setState({
        filetype: type,
      });
    }
  }

  render() {
    return(
      <Jumbotron style={{ padding: '10px 30px', paddingBottom: '30px' }}>
        <h2>Audio Editor</h2>
        <h5 style={{ marginTop: '20px' }} >
          Bars: <input type='number' min='1' defaultValue={this.state.bars} onChange={this.changeBars} style={{ width: '50px', textAlign: 'center', marginRight: '10px' }} /> 
          BPM: <input type='number' min='0' defaultValue={this.state.bpm} onChange={this.changeBPM} style={{ width: '60px', textAlign: 'center', marginRight: '10px' }} />
          Time Correct: 
            <select defaultValue={this.state.tc} onChange={this.changeTC} ref="select" style={{ width: '50px', marginLeft: '5px', marginRight: '10px' }}>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
              <option value="64">64</option> 
            </select>
          Loop: <input type="checkbox" onChange={this.onChangeLoop} checked={this.state.loop} />
        </h5>
        <BeatsGrid bars={this.state.bars} tc={this.state.tc} channels={this.props.appState.channels} addBeat={this.addBeat} removeBeat={this.removeBeat} />
        <Mixer channels={this.props.appState.channels} master={this.props.appState.master} deleteChannel={this.props.deleteChannel} />
        <ControlBar play={this.play} stop={this.stop} record={this.record} playing={this.state.playing} recording={this.state.recording} filetype={this.state.filetype} changeFileType={this.changeFileType} showSamplesList={this.props.showSamplesList} />
        { /* <button onClick={() => console.log(this.state)} >Show AudioEditor state</button> */ }
      </Jumbotron>
    );
  }
}

export default AudioEditor;
