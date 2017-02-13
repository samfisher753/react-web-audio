import React from 'react';

class MixerChannel extends React.Component {
  onChange(e) {
    console.log(e.target.value);
  }
  render() {
    return (
      <div style={{ width: '70px', textAlign: 'center', borderStyle: 'solid', padding: '5px' }}>
        Channel {this.props.id} <center><input onChange={this.onChange} type='range' min="0.000" max="1.000" step="0.001" defaultValue="1.000" style={{ width: '30px', WebkitAppearance: 'slider-vertical' }} /></center>
      </div>
    );
  }
}

export default MixerChannel;
