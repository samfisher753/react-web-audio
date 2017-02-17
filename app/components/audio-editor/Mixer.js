import React from 'react';
import MixerChannel from './MixerChannel';

class Mixer extends React.Component {
  render() {
    return(
      <div style={{ display: 'inline-block', width: '100%', minHeight: '250px', marginTop: '5px' }}>
        <h4>Mixer</h4>
        <div style={{ display: 'block' }}>
          { this.props.channels.length === 0 ?
                <span style={{ marginLeft: '20px', fontStyle: 'italic' }}>- No sounds were added yet. Add some new sounds, use the "Add sounds" button below.</span>
            :
            this.props.channels.map((ch) => 
              <MixerChannel id={ch.id} key={ch.id} gainNode={ch.gainNode} deleteChannel={this.props.deleteChannel} />
            )
          }
          <MixerChannel id={-1} gainNode={this.props.master} />
        </div>
      </div>
    );
  }
}

export default Mixer;
