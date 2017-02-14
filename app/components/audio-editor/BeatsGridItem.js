import React from 'react';

class BeatsGridItem extends React.Component {
  constructor(props) {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (e.target.checked) this.props.addBeat(this.props.id, parseInt(e.target.id));
    else this.props.removeBeat(this.props.id, parseInt(e.target.id));
  }

  buildRow(bars) {
    let tc = this.props.tc;
    let beats = this.props.beats;
    let row = [];
    let id = 0;
    let key = 0;
    for (let i = 0; i < bars*(tc/4); ++i) {
      for (let j = 0; j < 4; ++j) {
        let checked = beats.indexOf(id) != -1;
        row.push(<input id={id++} type="checkbox" key={key++} onChange={this.onChange} checked={checked} />);
      }
      if (id%tc === 0) row.push(<span key={key++}>&nbsp;&nbsp;&nbsp;</span>);
      else row.push(<span key={key++}>&nbsp;</span>);
    }
    return row;
  }

  render() {
    return(
      <div>
        {this.props.id} {this.buildRow(this.props.bars)}
      </div>
    );
  }
}

export default BeatsGridItem;