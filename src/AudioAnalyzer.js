class AudioAnalyzer {
  constructor() {
    this.connected = false;
  }
  connect(audioController) {
    this.audio = audioController;

    this.mic = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.mic.createAnalyser();

    this.source = this.mic.createMediaStreamSource(this.audio);
    this.source.connect(this.analyser);

    //by adjusting the size of the bin, we can choose which set of frequencies to get
    this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
    this.sphereData = new Uint8Array(25);
    //this.audioData = new Uint8Array();
    this.connected = true;
  }

  analyze() {
    //this changes based on decibels
    this.analyser.getByteFrequencyData(this.audioData);

    //this.analyser.getByteTimeDomainData(this.sphereData);
    
  }

  analyzeSphere() {
    //this changes based on the change in music
    this.analyser.getByteTimeDomainData(this.sphereData);

    //this.analyser.getByteFrequencyData(this.sphereData);
  }

  disconnect() {
    this.audio.getTracks().forEach(track => track.stop());
    this.analyser.disconnect();
    this.source.disconnect();
  }

  getAudioData() {
    return this.audioData;
  }

  getSphereData() {
    return this.sphereData;
  }

  isConnected() {
    return this.connected;
  }
}

export default AudioAnalyzer;