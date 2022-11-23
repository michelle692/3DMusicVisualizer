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

    this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
    this.connected = true;
  }

  analyze() {
    this.analyser.getByteFrequencyData(this.audioData);
  }

  disconnect() {
    this.audio.getTracks().forEach(track => track.stop());
    this.analyser.disconnect();
    this.source.disconnect();
  }

  getAudioData() {
    return this.audioData;
  }

  isConnected() {
    return this.connected;
  }
}

export default AudioAnalyzer;