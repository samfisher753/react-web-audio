import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import BeatsGrid from './BeatsGrid';
import Mixer from './Mixer';
import ControlBar from './ControlBar';

class AudioEditor extends React.Component {
  constructor(props){
    super();
    this.state = {
      bars: 2,
      bpm: 90,
    }

    this.changeBars = this.changeBars.bind(this);
  }

  changeBars(e) {
    this.setState({
      bars: e.target.value,
    });
  }

  render() {
    return(
      <Jumbotron>
        <button onClick={() => console.log(this.state)}>Show AudioEditor state</button>
        <h3>Audio Editor</h3>
        <h5>Bars: <input type='number' min='1' defaultValue={this.state.bars} onChange={this.changeBars}/> | BPM: <input type='number' min='0' defaultValue={this.state.bpm} /></h5>
        <BeatsGrid bars={this.state.bars} channels={this.props.appState.channels} />
        <Mixer channels={this.props.appState.channels} />
        <ControlBar />
      </Jumbotron>
    );
  }
}

export default AudioEditor;
