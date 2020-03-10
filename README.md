# react-web-audio

A basic audio sequencer made in React using Web Audio API with recording feature. It lets you export your mix in three different formats: wav(16 bits), mp3(320kbps) and ogg.

You will need to use the "Allow CORS: Access-Control-Allow-Origin" extension for Google Chrome in order to enable the browser to load the sounds. Once installed you will need to activate it clicking on the grey C letter, it will turn to orange. Remember to deactivate it if a webpage is not loading. You can download it here: https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf

It uses WebAudioRecorder.js(https://github.com/higuma/web-audio-recorder-js) and download.js(http://danml.com/download.html) to save the mix.

To use it:
- Download or clone the project.
- Navigate to the root folder.
- Run "npm install".
- Run "npm start".

Now you can see the app at http://localhost:8089

Or you can try it online now at http://react-sequencer-test.000webhostapp.com
