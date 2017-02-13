import React from 'react';
import { Button } from 'react-bootstrap';

//import samples from './web-audio-api/samples';
import BufferLoader from '../web-audio-api/buffer-loader-es6';

class PlayWebAudioExample extends React.Component {
  constructor() {
    super();
    this.play = this.play.bind(this);
    this.finishedLoading = this.finishedLoading.bind(this);
  }

  play() {
    window.AudioContext =
      window.AudioContext || window.webKitAudioContext;
    this.context = new AudioContext();

    let bufferLoader = new BufferLoader(
      this.context,
      [
        'http://freewavesamples.com/files/Bass-Drum-1.wav',
        'http://freewavesamples.com/files/Hip-Hop-Snare-1.wav',
        'http://freewavesamples.com/files/Closed-Hi-Hat-1.wav'
      ],
      this.finishedLoading
    );
    
    bufferLoader.load();
  }

  finishedLoading(bufferList) {
    let initTime = this.context.currentTime + 0.1;
    let bpm = 80;
    let eighthNoteTime = ( 60 / bpm ) / 2;

    let kick = bufferList[0];
    let snare = bufferList[1];
    let hihat = bufferList[2];

    for (var bar = 0; bar < 2; ++bar){
      let time = initTime + bar * 8 * eighthNoteTime;
      // kick
      this.playSound(kick, time);
      this.playSound(kick, time + 4 * eighthNoteTime);

      // snare
      this.playSound(snare, time + 2 * eighthNoteTime);
      this.playSound(snare, time + 6 * eighthNoteTime);

      // hihat
      for (let i = 0; i < 8; ++i)
        this.playSound(hihat, time + i * eighthNoteTime);
    } 
  }

  playSound(buffer, time) {
    let source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(time);
  }
  
  render() {
    return (
      <div>
        <Button onClick={this.play}>Play</Button>
      </div>
    );
  }
}

export default PlayWebAudioExample;