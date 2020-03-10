import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import MyBufferLoader from '../../web-audio-api/my-buffer-loader-es6';

class SampleItem extends React.Component {
  constructor(props){
    super();

    this.loadAndPlay = this.loadAndPlay.bind(this);
    this.play = this.play.bind(this);
  }

  loadAndPlay(url) {
    let context = this.props.appState.context;

    // Load sample.
    let bufferLoader = new MyBufferLoader(
      context,
      this.props.url,
      -1,
      this.play
    );
    
    bufferLoader.load();
  }

  play(channelId, buffer) {
    let context = this.props.appState.context;
    let sampleSource = this.props.appState.sampleSource;
    
    if (sampleSource !== null){
      sampleSource.stop(0);
      sampleSource.disconnect();
    }

    sampleSource = context.createBufferSource();
    sampleSource.buffer = buffer;
    sampleSource.connect(context.destination);
    let time = context.currentTime;

    this.props.setAppState({
      sampleSource: sampleSource,
    });

    sampleSource.start(time);
  }  

  render() {
    let splittedUrl = this.props.url.split('/');
    let name = splittedUrl[splittedUrl.length - 1];
    return (
      <Card style={{ fontSize: '12px', margin: '0px', marginBottom: '7px', display: 'block' }}>
        <Button variant='secondary' style={{ padding: '3px', width: '50px' }} onClick={this.loadAndPlay.bind(null, this.props.url)} >Play</Button> -> {name} 
        <Button variant='secondary' style={{ padding: '3px', float: 'right', width: '62px' }} onClick={this.props.deleteSample.bind(null, this.props.url)}>Delete</Button>
        <Button variant='secondary' style={{ padding: '3px', float: 'right', width: '50px', marginRight: '5px' }} onClick={this.props.addChannel.bind(null, this.props.url)}>Add</Button>
      </Card>
    );
  }

}

SampleItem.propTypes = {
  url: PropTypes.string.isRequired,
}

export default SampleItem;
