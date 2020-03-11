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
    this.changeStartBar = this.changeStartBar.bind(this);
    this.changeEndBar = this.changeEndBar.bind(this);
  }

  changeBars(e) {
    let oldBars = this.props.appState.bars;
    let newBars = parseInt(e.target.value);
    let channels = this.props.appState.channels;

    if (newBars < oldBars) {
      let maxBeats = newBars * this.props.appState.tc;
      for (let i=0; i<channels.length; ++i) {
        let sources = channels[i].sources;
        for (let j=0; j<sources.length; ++j) {
          if (sources[j].id >= maxBeats) {
            if (sources[j].source !== null) {
              sources[j].source.stop(0);
              sources[j].source.disconnect();
            }
            sources.splice(j--, 1);
          }
        }
      }
    }

    let endBar = this.props.appState.endBar;
    if (newBars < endBar) endBar = newBars;
    let startBar = this.props.appState.startBar;
    if (startBar > endBar) startBar = endBar;

    this.props.setAppState({
      channels: channels,
      bars: newBars,
      startBar: startBar,
      endBar: endBar,
    });
  }

  changeBPM(e) {
    this.props.setAppState({
      bpm: parseFloat(e.target.value),
    });
  }

  changeTC(e) {
    // Beats reset
    this.props.stopAllSources();
    let channels = this.props.appState.channels;
    for (let i=0; i<channels.length; ++i)
      channels[i].sources = [];

    this.props.setAppState({
      channels: channels,
      tc: parseInt(e.target.value),
    });
  }

  addBeat(ch, id) {
    let appState = this.props.appState;
    let channels = appState.channels;
    let i = 0;
    while (channels[i].id !== ch) ++i;


    let j = 0;
    while (j < channels[i].sources.length && channels[i].sources[j].id < id) ++j;

    channels[i].sources.splice(j, 0, { id: id, source: null });

    this.props.setAppState({
      channels: channels,
    });
  }

  removeBeat(ch, id) {
    let channels = this.props.appState.channels;
    let i = 0;
    while (channels[i].id !== ch) ++i;

    let j = 0;
    while (channels[i].sources[j].id !== id) ++j;

    channels[i].sources.splice(j, 1);

    this.props.setAppState({
      channels: channels,
    });
  }

  play() {
    let appState = this.props.appState;

    if (!appState.playing && !appState.loading && appState.channels.length > 0) {
      if (!appState.playing) {
        this.props.setAppState({
          playing: true,
        });
      }

      let context = appState.context;
      let channels = appState.channels;

      let initTime = context.currentTime;
      let bpm = appState.bpm;
      let tc = appState.tc;
      let noteTime = 240 / (bpm * tc);

      let startBeat = (appState.startBar - 1) * tc;
      let endBeat = appState.endBar * tc;
      let startBeatTime = startBeat * noteTime;

      for (let i=0; i<channels.length; ++i) {
        let buffer = channels[i].buffer;
        let sources = channels[i].sources;
        let gainNode = channels[i].gainNode;

        let j = 0;
        while (j < sources.length && sources[j].id < startBeat) ++j;

        while (j < sources.length && sources[j].id < endBeat) {
          let source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(gainNode);
          let time = initTime + sources[j].id * noteTime - startBeatTime;
          sources[j].source = source;
          source.start(time);
          ++j;
        }
      }

      let duration = 240 / bpm * (appState.endBar - appState.startBar + 1) * 1000;
      let timeout = setTimeout(() => {
        this.endPlayHandler();
      }, duration);

      this.props.setAppState({
        channels: channels,
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
          // As we are not using loopCount in anything related to the UI 
          // we don't need to update the UI when modifying it, 
          // so we don't need to call setState().
          ++this.props.appState.loopCount;
          this.play();
        }
        // If not remaining times
        else {
          this.props.setAppState({
            playing: false,
            loopCount: 1,
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
        else {
          this.play();
        }
      }
    }
    else {
      this.props.setAppState({
        playing: false,
      });
    }
  }

  stop() {
    if (this.props.appState.playing) {
      if (this.props.appState.recorder.isRecording()) this.props.appState.recorder.cancelRecording();
      clearTimeout(this.props.appState.timeout);
      this.props.stopAllSources();
      this.props.setAppState({
        recording: false,
        playing: false,
        loopCount: 1,
      });
    }
  }

  record() {
    let appState = this.props.appState;
    if (!appState.recording && !appState.loading && appState.channels.length > 0) {
      let bars = appState.endBar - appState.startBar + 1;
      let bpm = appState.bpm;
      let recorder = appState.recorder;
      let duration = (( 240 * bars ) / bpm);
      if (appState.loop && appState.loopTimes !== 0) duration = (( 240 * bars ) / bpm) * appState.loopTimes;
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
        loopCount: 1,
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

  changeStartBar(e) {
    let newStartBar = parseInt(e.target.value);
    this.props.setAppState({
      startBar: newStartBar,
    });
  }

  changeEndBar(e) {
    let newEndBar = parseInt(e.target.value);
    this.props.setAppState({
      endBar: newEndBar,
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
        <h3>Audio Editor</h3>
        <h5 style={{ marginTop: '20px', marginLeft: '25px' }} >
          Bars: <input type='number' min='1' value={appState.bars} onChange={this.changeBars} style={{ width: '50px', textAlign: 'center', marginRight: '10px' }} /> 
          BPM: <input type='number' min='0' value={appState.bpm} onChange={this.changeBPM} style={{ width: '60px', textAlign: 'center', marginRight: '10px' }} />
          Time Correct: 
            <select value={appState.tc} onChange={this.changeTC} style={{ width: '50px', marginLeft: '5px', marginRight: '10px' }}>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
              <option value="64">64</option> 
            </select>
          Loop: <input type="checkbox" onChange={this.onChangeLoop} checked={appState.loop} style={{ marginRight: '10px' }} />
          Times: <input type='number' min='0' value={appState.loopTimes} onChange={this.changeLoopTimes} disabled={!appState.loop} style={{ width: '50px', textAlign: 'center' }} /> <small>(0 infinite)</small>
        </h5>
        <h5 style={{ marginLeft: '25px' }} >
          Initial bar: <input type='number' min='1' max={appState.endBar} value={appState.startBar} onChange={this.changeStartBar} style={{ width: '50px', textAlign: 'center', marginRight: '10px' }} />
          Ending bar: <input type='number' min={appState.startBar} max={appState.bars} value={appState.endBar} onChange={this.changeEndBar} style={{ width: '50px', textAlign: 'center', marginRight: '10px' }} />
        </h5>
        <BeatsGrid bars={appState.bars} tc={appState.tc} channels={appState.channels} addBeat={this.addBeat} removeBeat={this.removeBeat} />
        <Mixer channels={appState.channels} master={appState.master} deleteChannel={this.props.deleteChannel} setAppState={this.props.setAppState} />
        <ControlBar play={this.play} stop={this.stop} record={this.record} playing={appState.playing} recording={appState.recording} filetype={appState.filetype} changeFileType={this.changeFileType} showSamplesList={this.props.showSamplesList} />
      </Jumbotron>
    );
  }
}

export default AudioEditor;
