import React, { PropTypes } from 'react';
import { Panel, Button } from 'react-bootstrap';
import BufferLoader from '../../web-audio-api/buffer-loader-es6';

class SampleItem extends React.Component {
  constructor(props){
    super();

    this.loadAndPlay = this.loadAndPlay.bind(this);
    this.play = this.play.bind(this);
  }

  loadAndPlay(url) {
    let context = this.props.appState.context;

    // Load sample.
    let bufferLoader = new BufferLoader(
      context,
      [ this.props.url ],
      this.play
    );
    
    bufferLoader.load();
  }

  play(bufferList) {
    let context = this.props.appState.context;
    let sourceList = this.props.stopAllSources();

    let source = context.createBufferSource();
    source.buffer = bufferList[0];
    source.connect(context.destination);
    let time = context.currentTime;
    sourceList.push(source);

    this.props.setAppState({
      sourceList: sourceList,
    });

    source.start(time);
  }  

  render() {
    let splittedUrl = this.props.url.split('/');
    let name = splittedUrl[splittedUrl.length - 1];
    return (
      <Panel style={{ fontSize: '12px', margin: '0px', marginBottom: '7px', display: 'block' }}>
        <Button style={{ padding: '3px', width: '50px' }} onClick={this.loadAndPlay.bind(null, this.props.url)} >Play</Button> -> {name} 
        <Button style={{ padding: '3px', float: 'right', width: '62px' }} onClick={this.props.deleteSample.bind(null, this.props.url)}>Delete</Button>
        <Button style={{ padding: '3px', float: 'right', width: '50px', marginRight: '5px' }} onClick={this.props.addChannel.bind(null, this.props.url)}>Add</Button>
      </Panel>
    );
  }

}

SampleItem.propTypes = {
  url: PropTypes.string.isRequired,
}

export default SampleItem;
