import React from 'react';
import MixerChannel from './MixerChannel';

class Mixer extends React.Component {
  render() {
    return(
      <div>
        <h4>Mixer</h4>
        { this.props.channels.map((ch) => 
            <MixerChannel id={ch.id} key={ch.id} />
          )
        }
      </div>
    );
  }
}

export default Mixer;
