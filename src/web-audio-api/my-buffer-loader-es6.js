
class MyBufferLoader {
  constructor(context, url, channelId, callback) {
    this.context = context;
    this.url = url;
    this.channelId = channelId;
    this.onload = callback;

    this.load = this.load.bind(this);
  }

  load() {
    // Load buffer asynchronously
    let request = new XMLHttpRequest();
    request.open("GET", this.url, true);
    request.responseType = "arraybuffer";

    let loader = this;

    request.onload = () => {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        (buffer) => {
          if (!buffer) {
            alert('error decoding file data: ' + loader.url);
            return;
          }
          loader.onload(loader.channelId, buffer);
        },
        (error) => {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = () => {
      alert('BufferLoader: XHR error');
    }

    request.send();
  }

}

export default MyBufferLoader;
