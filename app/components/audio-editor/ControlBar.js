import React from 'react';
import { Button } from 'react-bootstrap';

class ControlBar extends React.Component {
  render() {
    return (
      <div style={{ minHeight: '80px' }}>
        <h4>Control Bar</h4>
        <Button onClick={this.props.play}>Play</Button>
        <Button onClick={this.props.stop}>Stop</Button>
        <Button onClick={this.props.record}>Record</Button>
        <Button onClick={this.props.showSamplesList}>Add sounds</Button>
      </div>
    );
  }
}

export default ControlBar;