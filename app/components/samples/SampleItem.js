import React, { PropTypes } from 'react';
import { Panel, Button } from 'react-bootstrap';
import BufferLoader from '../../web-audio-api/buffer-loader-es6';

class SampleItem extends React.Component {
  constructor(props){
    super();

    this.loadAndPlay = this.loadAndPlay.bind(this);
    this.play = this.play.bind(this);
    // this.stopAllSources = this.stopAllSources.bind(this);
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
    let sourceList = this.stopAllSources();

    let source = context.createBufferSource();
    source.buffer = bufferList[0];
    source.connect(context.destination);
    let time = context.currentTime + 0.1;
    sourceList.push(source);

    this.props.setAppState({
      sourceList: sourceList,
    });

    source.start(time);
  }  

  // Make sure to call setState after to update sourceList with returned value.
  stopAllSources() {
    let sourceList = this.props.appState.sourceList;
    for (let i = 0; i < sourceList.length; ++i)
      sourceList[i].stop(0);
    sourceList = [];
    return sourceList;
  }

  render() {
    let splittedUrl = this.props.url.split('/');
    let name = splittedUrl[splittedUrl.length - 1];
    return (
      <Panel style={{ fontSize: '12px', margin: '0px' }}>
        <Button style={{ padding: '3px' }} onClick={this.loadAndPlay.bind(null, this.props.url)} >Play</Button> -> {name} <Button style={{ padding: '3px' }} onClick={this.props.addChannel.bind(null, this.props.url)}>Add</Button>
      </Panel>
    );
  }

}

SampleItem.propTypes = {
  url: PropTypes.string.isRequired,
}

export default SampleItem;
