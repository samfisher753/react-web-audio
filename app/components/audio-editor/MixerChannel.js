import React from 'react';

class MixerChannel extends React.Component {
  constructor(props) {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    //console.log(e.target.value);
    let gainNode = this.props.gainNode;
    gainNode.gain.value = parseFloat(e.target.value);
  }

  render() {
    let text = 'Channel ' + this.props.id;
    let float = 'left';
    if (this.props.id === -1) float = 'right';
    return (
      <div style={{ width: '90px', height: '190px', textAlign: 'center', borderStyle: 'solid', borderWidth: '1px', padding: '5px', float: float, marginRight: '5px' }}>
        <div style={{ marginTop: '5px', marginBottom: '10px' }}>
          { this.props.id !== -1 ? 
            text : 'Master'
          }
        </div>
        <center><input onChange={this.onChange} type='range' min="0.000" max="1.000" step="0.001" defaultValue="1.000" style={{ width: '30px', WebkitAppearance: 'slider-vertical' }} /></center>
      </div>
    );
  }
}

export default MixerChannel;
