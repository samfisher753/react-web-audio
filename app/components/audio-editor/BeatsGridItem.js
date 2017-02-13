import React from 'react';

class BeatsGridItem extends React.Component {
  constructor(props) {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (e.target.checked) console.log('checkbox ' + e.target.id + ' checked');
    else console.log('checkbox ' + e.target.id + ' unchecked');
  }

  buildRow(bars) {
    let row = [];
    let id = 0;
    let key = 0;
    for (let i = 0; i < bars*2; ++i) {
      for (let j = 0; j < 4; ++j) {
        row.push(<input id={id++} type="checkbox" key={key++} onChange={this.onChange}/>);
      }
      row.push(<span key={key++}>&nbsp;</span>);
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
