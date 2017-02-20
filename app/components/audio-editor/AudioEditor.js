import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import BeatsGrid from './BeatsGrid';
import Mixer from './Mixer';
import ControlBar from './ControlBar';

class AudioEditor extends React.Component {
  constructor(props){
    super();

    this.changeBars = this.changeBars.bind(this);
    this.changeBPM = this.changeBPM.bind(this);
    this.changeTC = this.changeTC.bind(this);
    this.addBeat = this.addBeat.bind(this);
    this.removeBeat = this.removeBeat.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.record = this.record.bind(this);
    this.onChangeLoop = this.onChangeLoop.bind(this);
    this.changeLoopTimes = this.changeLoopTimes.bind(this);
    this.changeFileType = this.changeFileType.bind(this);
    this.endPlayHandler = this.endPlayHandler.bind(this);
  }

  changeBars(e) {
    let oldBars = this.props.appState.bars;
    let newBars = parseInt(e.target.value);
    let channels = this.props.appState.channels;

    if (newBars < oldBars) {
      let maxBeats = newBars * this.props.appState.tc;
      for (let i=0; i<channels.length; ++i) {
        let beats = channels[i].beats;
        for (let j=0; j<beats.length; ++j) {
          if (beats[j] >= maxBeats) 
            beats.splice(j--, 1);
        }
      }
    }

    this.props.setAppState({
      channels: channels,
      bars: newBars,
    });
  }

  changeBPM(e) {
    this.props.setAppState({
      bpm: parseInt(e.target.value),
    });
  }

  changeTC(e) {
    // Beats reset
    let channels = this.props.appState.channels;
    for (let i=0; i<channels.length; ++i)
      channels[i].beats = [];

    this.props.setAppState({
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
      let sourceList = this.props.stopAllSources();
      this.props.setAppState({
        playing: true,
        sourceList: sourceList,
      });

      let context = appState.context;
      let channels = appState.channels;
      let master = appState.master;

      let initTime = context.currentTime;
      let bars = appState.bars;
      let bpm = appState.bpm;
      let tc = appState.tc;
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

      let duration = 240 / bpm * bars * 1000;
      let timeout = setTimeout(() => {
        this.endPlayHandler();
      }, duration);

      this.props.setAppState({
        channels: channels,
        sourceList: sourceList,
        timeout: timeout,
      });
    }
  }

  endPlayHandler(){
    let appState = this.props.appState;
    if (appState.loop){
      // If finite loop
      if (appState.loopTimes !== 0) {
        // If remaining times
        if (appState.loopCount < appState.loopTimes) {
          this.props.setAppState({
            loopCount: ++appState.loopCount,
          });
          this.play();
        }
        // If not remaining times
        else {
          this.props.setAppState({
            playing: false,
            loopCount: 0,
          });
        }
      }
      // If infinite loop
      else {
        // If recording
        if (appState.recording){
          this.props.setAppState({
            playing: false,
          });
        }
        // If not recording
        else this.play();
      }
    }
    else {
      this.props.setAppState({
        playing: false,
      });
    }
  }

  stop() {
    if (this.props.appState.playing) clearTimeout(this.props.appState.timeout);
    let sourceList = this.props.stopAllSources();
    this.props.setAppState({
      sourceList: sourceList,
      playing: false,
    });
  }

  record() {
    let appState = this.props.appState;
    if (!appState.recording && !appState.loading) {
      let bars = appState.bars;
      let bpm = appState.bpm;
      let recorder = appState.recorder;
      let duration = (( 240 * bars ) / bpm);
      if (appState.loop && appState.loopTimes !== 0) duration = (( 240 * bars ) / bpm) * (appState.loopTimes + 1);
      let type = appState.filetype;

      recorder.setOptions({ timeLimit: duration });
      recorder.onComplete = (rec, blob) => {
        download(blob, 'mixdown.' + type);
        this.props.setAppState({
          recording: false,
        });
      };
      
      this.props.setAppState({
        recording: true,
      });
      
      recorder.startRecording();
      this.play();
    }
  }

  onChangeLoop(e) {
    if (!e.target.checked){
      this.props.setAppState({
        loop: e.target.checked,
        loopTimes: 0,
        loopCount: 0,
      });
    }
    else {
      this.props.setAppState({
        loop: e.target.checked,
      });
    }
  }

  changeLoopTimes(e) {
    this.props.setAppState({
      loopTimes: parseInt(e.target.value),
    });
  }

  changeFileType(type) {
    let recorder = this.props.appState.recorder;
    if (!recorder.isRecording()) {
      recorder.setEncoding(type);

      this.props.setAppState({
        filetype: type,
      });
    }
  }

  render() {
    let appState = this.props.appState;
    return(
      <Jumbotron style={{ padding: '10px 30px', paddingBottom: '30px' }}>
        <h2>Audio Editor</h2>
        <h5 style={{ marginTop: '20px' }} >
          Bars: <input type='number' min='1' value={appState.bars} onChange={this.changeBars} style={{ width: '50px', textAlign: 'center', marginRight: '10px' }} /> 
          BPM: <input type='number' min='0' value={appState.bpm} onChange={this.changeBPM} style={{ width: '60px', textAlign: 'center', marginRight: '10px' }} />
          Time Correct: 
            <select value={appState.tc} onChange={this.changeTC} ref="select" style={{ width: '50px', marginLeft: '5px', marginRight: '10px' }}>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
              <option value="64">64</option> 
            </select>
          Loop: <input type="checkbox" onChange={this.onChangeLoop} checked={appState.loop} style={{ marginRight: '10px' }} />
          Times: <input type='number' min='0' value={appState.loopTimes} onChange={this.changeLoopTimes} disabled={!appState.loop} style={{ width: '50px', textAlign: 'center' }} /> <small>(0 infinite)</small>
        </h5>
        <BeatsGrid bars={appState.bars} tc={appState.tc} channels={appState.channels} addBeat={this.addBeat} removeBeat={this.removeBeat} />
        <Mixer channels={appState.channels} master={appState.master} deleteChannel={this.props.deleteChannel} setAppState={this.props.setAppState} />
        <ControlBar play={this.play} stop={this.stop} record={this.record} playing={appState.playing} recording={appState.recording} filetype={appState.filetype} changeFileType={this.changeFileType} showSamplesList={this.props.showSamplesList} />
      </Jumbotron>
    );
  }
}

export default AudioEditor;
