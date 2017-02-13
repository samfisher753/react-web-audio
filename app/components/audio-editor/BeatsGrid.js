import React, { PropTypes } from 'react';
import BeatsGridItem from './BeatsGridItem';

class BeatsGrid extends React.Component {
  render() {
    return(
      <div style={{ marginTop: '20px', minHeight: '200px', overflow: 'auto', whiteSpace: 'nowrap' }}>
        <h4>Beats Grid</h4>
        { this.props.channels.map((ch) => 
            <BeatsGridItem bars={this.props.bars} tc={this.props.tc} id={ch.id} key={ch.id} beats={ch.beats} addBeat={this.props.addBeat} removeBeat={this.props.removeBeat} />
          )
        }
      </div>
    );
  }
}

export default BeatsGrid;
