import React from "react";
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, Suspense } from 'react';
import { OrbitControls, Environment } from '@react-three/drei'
import { LayerMaterial, Color, Depth, Fresnel, Noise } from 'lamina'
import { useControls } from 'leva'
import './App.css';
import AudioAnalyzer from './AudioAnalyzer';


//UI editor
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
      base: { value: '#ff4eb8' },
      colorA: { value: '#00FF00' },
      colorB: { value: '#ff8f00' }
    }

    this.toggleMicrophone = this.toggleMicrophone.bind(this);
  }

  // Asks the browser for access to use the microphone. When the user
  // allows, it will internally update its 'audio' variable with 
  // the microphone media device. It will be used by AudioAnalyser.
  async getMicrophone() {
    // Initially asks for permission. Next iteration calls will just 
    // access the mic without asking again.
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });

    // Internally save audio media device.
    this.setState({ audio });
  }

  // Releases the media devices so it can be paused/resumed.
  stopMicrophone() {
    this.state.audio.getTracks().forEach(track => track.stop());

    // Delete the old media device so we can re acquire the media.
    this.setState({ audio: null });
  }

  // Gets called when the user clicks the button on the screen. This is
  // not required. As the developer you can have the mic running 24/7.
  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }


  render() {
    if (this.state.audio == null) {
      return (
        <div className="controls">
            <button className="btn" onClick={this.toggleMicrophone}>
            {'start'}
          </button>
        </div>
      )
    }
    return (
      <div>
        <AudioAnalyzer audioController={this.state.audio} />


        <div >
          <Canvas style={{height: `500px`}} dpr={[1, 2]} camera={{ position: [0, -0.75, 0.75], fov: 80, near: 0.001 }}>
            <Suspense fallback={null}>
              <mesh scale={100}>
                <sphereGeometry args={[1, 64, 64]} />
                <LayerMaterial attach="material" side={THREE.BackSide}>
                  <Color color={this.state.base} alpha={1} mode="normal" />
                  <Depth colorA={this.state.colorB} colorB={this.state.colorA} alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
                  <Noise mode="subtract" alpha={0.3} mapping={"local"} type={"curl"}/>
                </LayerMaterial>
              </mesh>
              <mesh>
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial depthWrite={false} transmission={1} thickness={10} roughness={0.0} />
              </mesh>
              <OrbitControls />
              <pointLight position={[10, 10, 5]} />
              <pointLight position={[-10, -10, -5]} color={this.state.colorA} />
              <ambientLight intensity={0.4} />
              <Environment preset="warehouse" />
            </Suspense>
          </Canvas>
        </div>
      </div>
    );
  }
}


export default App;
