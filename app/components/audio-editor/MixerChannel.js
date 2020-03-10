import React from 'react';
import { Button } from 'react-bootstrap';

class MixerChannel extends React.Component {
  constructor(props) {
    super();

    this.onChange = this.onChange.bind(this);
    this.deleteChannel = this.deleteChannel.bind(this);
  }

  onChange(e) {
    let gainNode = this.props.gainNode;
    gainNode.gain.value = parseFloat(e.target.value);
    this.props.updateState(this.props.id);
  }

  deleteChannel() {
    this.props.deleteChannel(this.props.id);
  }

  render() {
    let text = 'Channel ' + this.props.id;
    let defaultStyle = { width: '90px', height: '230px', textAlign: 'center', borderStyle: 'solid', borderWidth: '1px', padding: '5px', float: 'left', marginRight: '5px', marginBottom: '4px' };
    let masterStyle = { width: '90px', height: '230px', textAlign: 'center', borderStyle: 'solid', borderWidth: '1px', padding: '5px', float: 'right', marginRight: '70px', marginBottom: '4px' };
    let style = defaultStyle;
    if (this.props.id === -1) style = masterStyle;
    return (
      <div style={style}>
        <div style={{ marginTop: '5px', marginBottom: '10px' }}>
          { this.props.id !== -1 ? 
            text : 'Master'
          }
        </div>
        <center>
          { this.props.id !== -1 ?
              <input onChange={this.onChange} type='range' min="0.000" max="1.000" step="0.001" value={this.props.gainNode.gain.value} style={{ width: '30px', WebkitAppearance: 'slider-vertical' }} />
            :
              <input onChange={this.onChange} type='range' min="0.000" max="1.000" step="0.001" value={this.props.gainNode.gain.value} style={{ marginTop: '10px', width: '30px', height: '165px', WebkitAppearance: 'slider-vertical' }} />
          }
        </center>
        { this.props.id !== -1 && <center><Button variant='secondary' style={{ marginTop: '3px' }} onClick={this.deleteChannel}>Delete</Button></center> }
      </div>
    );
  }
}

export default MixerChannel;
