import React, { PropTypes } from 'react';
import BeatsGridItem from './BeatsGridItem';

class BeatsGrid extends React.Component {
  render() {
    return(
      <div style={{ minHeight: '160px', overflow: 'auto', whiteSpace: 'nowrap' }}>
        <h4>Beats Grid</h4>
        <table>
          <tbody>
            { this.props.channels.length === 0 ?
                <tr><td><span style={{ marginLeft: '20px', fontStyle: 'italic' }}>- No sounds were added yet. Add some new sounds, use the "Add sounds" button below.</span></td></tr>
              :
              this.props.channels.map((ch) => 
                <BeatsGridItem bars={this.props.bars} tc={this.props.tc} url={ch.url} id={ch.id} key={ch.id} beats={ch.beats} addBeat={this.props.addBeat} removeBeat={this.props.removeBeat} />
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default BeatsGrid;
