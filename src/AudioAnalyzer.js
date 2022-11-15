import React, { Component } from 'react';

class AudioAnalyzer extends Component {
  constructor(props) {
    super(props);
    // Keep track of audioData and make it available for all components.
    this.state = { audioData: new Uint8Array(0) };
    
    // Binds the loop function to this component. Loop will get called 
    // internally so we can't pass the frequency array. Only way to 
    // access is by binding the function to this component.
    this.loop = this.loop.bind(this);

    // Create the canvas compnent for the audio
    this.canvas = React.createRef();
  }

  // Makes the audio frequency data available for other components.
  // Unsure of its usage rn, but it can be useful when combining with
  // 3d graphics.
  getAudioData() {
    const { audioData } = this.state;
    return audioData;
  }

  // Called after component is created. Acquires the browser microphone and
  // creates internal audio frequency analyzer. Starts the intial call to
  // the update function.
  componentDidMount() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    // When AudioAnaylzer is created by parent component, audioController is passed in
    this.source = this.audioContext.createMediaStreamSource(this.props.audioController);
    this.source.connect(this.analyser);

    // Initial call to the loop function.
    this.rafId = requestAnimationFrame(this.loop);
  }

  // Should get called about 60 times per second (60 tps/fps).
  loop() {
    // Fill the raw data array with the frequencies. 
    this.analyser.getByteTimeDomainData(this.dataArray);
    // Save the freq array as audioData available for the component. 
    this.setState({ audioData: this.dataArray });

    // Request callback to it self, aka fake while loop 
    this.rafId = requestAnimationFrame(this.loop);
  }

  // Gets internally called because we did requestAnimationFrame. Before
  // animation, react gives the developer the chance to update the frame.
  // This function calls draw() to make it easier for developer.
  componentDidUpdate() {
    this.drawCanvas();
  }

  // Called when the component is destroyed. Free's up the mic so it can
  // be accessed again by other pages or if the user refreshes.
  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  // Helper function that gets called by loop() -> requestAnimationFrame()
  // -> componentDidUpdate() -> drawCanvas() -> render() -> ... -> loop().
  drawCanvas() {
    // Access the audio frequency that is internally updated.
    const { audioData } = this.state;

    // Access the properties of the current canvas
    const canvas = this.canvas.current;
    const height = canvas.height;
    const width = canvas.width;

    // The actual context that you can draw on, like graphics.
    const context = canvas.getContext('2d');

    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);

    let x = 0;
    // audioData -> int[1024] where each item is 0 to 255.
    for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);

    context.stroke();
  }

  // Gets continously called when the developer requested a new animation
  // frame. By the time this executes, canvas should have all the graphics
  // drawn on it.
  render() {
    return <canvas width="300" height="300" ref={this.canvas} />;
  }
}

export default AudioAnalyzer;