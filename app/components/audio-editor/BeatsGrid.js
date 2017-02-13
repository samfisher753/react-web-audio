import React, { PropTypes } from 'react';
import BeatsGridItem from './BeatsGridItem';

class BeatsGrid extends React.Component {
  render() {
    return(
      <div>
        <h4>Beats Grid</h4>
        { this.props.channels.map((ch) => 
            <BeatsGridItem bars={this.props.bars} id={ch.id} key={ch.id} />
          )
        }
      </div>
    );
  }
}

export default BeatsGrid;
