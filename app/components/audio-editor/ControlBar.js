import React from 'react';
import { Button } from 'react-bootstrap';

class ControlBar extends React.Component {
  constructor(props) {
    super();

    this.changeFileType = this.changeFileType.bind(this);
  }

  changeFileType(e) {
    this.props.changeFileType(e.target.value);
  }

  render() {
    let playing = 'default';
    if (this.props.playing) playing = 'primary';
    let recording = 'default';
    if (this.props.recording) recording = 'danger';
    return (
      <div style={{ marginTop: '20px', minHeight: '80px' }}>
        <h4>Control Bar</h4>
        <Button onClick={this.props.play} bsStyle={playing} style={{ marginRight: '5px' }}>Play</Button>
        <Button onClick={this.props.stop}>Stop</Button>
        <Button onClick={this.props.showSamplesList} style={{ marginLeft: '20px', marginRight: '15px' }}>Add sounds</Button>
        File type:
        <select style={{ marginLeft: '5px', marginRight: '10px' }} onChange={this.changeFileType} value={this.props.filetype}>
          <option value='wav'>WAV 16 bits</option>
          <option value='mp3'>MP3 320 kbps</option>
          <option value='ogg'>OGG</option>
        </select>
        <Button onClick={this.props.record} bsStyle={recording}>Record</Button>
      </div>
    );
  }
}

export default ControlBar;