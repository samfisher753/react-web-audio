import React from 'react';
import { Button } from 'react-bootstrap';

class ControlBar extends React.Component {
  render() {
    return (
      <div>
        <h4>Control Bar</h4>
        <Button>Play</Button><Button>Stop</Button>
      </div>
    );
  }
}

export default ControlBar;