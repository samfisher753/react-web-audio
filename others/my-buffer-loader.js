//import Base64Binary from './base64-binary';

class MyBufferLoader {
  constructor(context, samplesList, samplesData, callback) {
    this.context = context;
    this.samplesList = samplesList;
    this.samples = samplesData;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;

    this.loadBuffer = this.loadBuffer.bind(this);
    this.load = this.load.bind(this);
  }

  loadBuffer(sample, index) {
    let sound;
    switch (sample){
      case 'kick':
        sound = this.samples.kick;
        break;
      case 'snare':
        sound = this.samples.snare;
        break;
      case 'hihat':
        sound = this.samples.hihat;
        break;
      default:
        alert('error unknown sample ' + sample);
        return;
    }
    const byteArray = Base64Binary.decodeArrayBuffer(sound);

    let loader = this;

    this.context.decodeAudioData(byteArray,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + sample);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.samplesList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  load() {
    for (let i = 0; i < this.samplesList.length; ++i)
      this.loadBuffer(this.samplesList[i], i);
  }
}

export default MyBufferLoader;