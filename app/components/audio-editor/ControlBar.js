import React from 'react';
import { Button } from 'react-bootstrap';

class ControlBar extends React.Component {
  render() {
    return (
      <div style={{ minHeight: '110px' }}>
        <h4>Control Bar</h4>
        <Button onClick={this.props.play} >Play</Button><Button onClick={this.props.stop} >Stop</Button>
      </div>
    );
  }
}

export default ControlBar;