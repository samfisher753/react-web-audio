# react-web-audio

A basic audio sequencer made in React using Web Audio API with recording feature. It lets you export your mix in three different formats: wav(16 bits), mp3(320kbps) and ogg.

It uses WebAudioRecorder.js(https://github.com/higuma/web-audio-recorder-js) and download.js(http://danml.com/download.html) to save the mix.

To use it:
- Download or clone the project.
- Navigate to the root folder.
- Run "npm install".
- Run "npm start".

Now you can see the app at http://localhost:8089

Or you can try it online now at http://react-sequencer.000webhostapp.com

You will need to use the "Allow-Control-Allow-Origin: *" extension for Google Chrome in order to enable the browser to play the sounds(sorry, I'll work to avoid this). You can download it here: https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related