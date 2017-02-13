import React from 'react';
import ReactDOM from 'react-dom';

import AppBar from './components/AppBar'; 
// import PlayWebAudioExample from './components/PlayWebAudioExample';
import AppMain from './components/AppMain';

class App extends React.Component {
  render() {
    return(
      <div>
        <AppBar />
        <AppMain />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));