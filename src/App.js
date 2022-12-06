import React from "react";
import * as THREE from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useRef, Suspense } from 'react';
import { OrbitControls, Environment, useTexture } from '@react-three/drei'
import AudioAnalyzer from './AudioAnalyzer';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import inconsolata from './Inconsolata_Regular.json'
import { WaveShaderMaterial } from './shaders/waveshader'
import { GradientShaderMaterial } from "./shaders/gradient";
import { DitherShaderMaterial } from "./shaders/dither";
import { TextWaveShaderMaterial } from "./shaders/textwave";
import './App.css';

extend({ TextGeometry })
extend({ WaveShaderMaterial });
extend({ GradientShaderMaterial });
extend({ DitherShaderMaterial });
extend({ TextWaveShaderMaterial });

var clock = new THREE.Clock();
const NUM_OF_BINS = 20;

const BG = (props) => {
  const ref = useRef();
  return (
    <mesh position={[0.0, 0.0, -5]} >
      <planeBufferGeometry args={[8, 8, 8, 8]} />
      <ditherShaderMaterial uTime={clock.getElapsedTime()} uColor={"hotpink"} uFreq={props.freq} uBg={props.bg} ref={ref} />
    </mesh>
  )
}

const Sphere = (props) => {
  const ref = useRef();
  // useFrame(({clock}) => (ref.current.uTime = clock.getElapsedTime()));
  return (
    <mesh scale={props.scale} position={[0.5, 0, 0]}>
      <sphereBufferGeometry args={[0.4, 32.0, 32.0]} />
      <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"hotpink"} ref={ref} wireframe />
    </mesh>
  )
}

const Frames = (props) => {
  const ref = useRef();
  return (
    <mesh position={props.position}>
      <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
      <ditherShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} ref={ref} />
    </mesh>
  )
}


const SphereFrame = (props) => {
  const texture = useTexture(require('./Dali.jpeg'));
  const ref = useRef();
  return (
    <mesh position={props.position}>
      <planeBufferGeometry args={[2.5, 1, 8, 8]} />
      <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} ref={ref} />
    </mesh>
  )
}

function Image() {
  const texture = useTexture(require('./Dali.jpeg'));
  const ref = useRef();
  return (
    <mesh >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      {/* <sphereBufferGeometry args={[0.4, 32.0, 32.0]} /> */}
      <meshStandardMaterial map={texture} ref={ref} />
    </mesh>
  )
}


const font = new FontLoader().parse(inconsolata);

const Text = (props) => {
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));
  const ref = useRef();
  return (
    <mesh
      position={[-2, 0, 0]}
      onClick={props.click}
    >
      <textGeometry args={['Start', { font, size: 1, height: 1 }]} />
      <textWaveShaderMaterial uTime={clock.getElapsedTime()} color={"green"} ref={ref} wireframe />
    </mesh>
  )
}

//UI editor
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioData: new Uint8Array(0),
      normalizedData: new Uint8Array(0),
      base: { value: '#ff4eb8' },
      colorA: { value: '#00ffff' },
      colorB: { value: '#ff8f00' }
    }

    this.toggleMicrophone = this.toggleMicrophone.bind(this);

    this.audioAnalyzer = new AudioAnalyzer();

    this.canvas = React.createRef();

    // react thing, idk why it is needed.
    this.loop = this.loop.bind(this);
  }

  // Asks the browser for access to use the microphone. When the user
  // allows, it will internally update its 'audio' variable with 
  // the microphone media device. It will be used by AudioAnalyser.
  async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });

    if (audio) {
      this.audioAnalyzer.connect(audio);
      this.rafId = requestAnimationFrame(this.loop);
    }
  }

  stopMicrophone() {
    this.audioAnalyzer.disconnect();
    cancelAnimationFrame(this.rafId);
  }

  // Gets called when the user clicks the button on the screen. This is
  // not required. As the developer you can have the mic running 24/7.
  toggleMicrophone() {
    if (this.audioAnalyzer.isConnected()) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }

  loop() {
    if (this.audioAnalyzer.isConnected()) {
      this.audioAnalyzer.analyze();

      const audioData = this.audioAnalyzer.getAudioData();

      const buffer = new ArrayBuffer(NUM_OF_BINS);
      const normalizedData = new Uint8Array(buffer);

      const size = audioData.length;
      const bucket_size = Math.floor(size / NUM_OF_BINS);

      for (var i = 0; i < NUM_OF_BINS; i++) {
        const start = bucket_size * i;

        // in case the last bucket does not divide evenly
        const end = bucket_size * (i + 1) > audioData.length ? audioData.length : bucket_size * (i + 1);

        var sum = 0;
        for (var j = start; j < end; j++) {
          var freq = audioData[j];
          sum += freq;
        }
        var avg = sum / (end - start);

        normalizedData[i] = avg;
      }

      this.setState({ audioData: audioData, normalizedData: normalizedData });
    }

    this.rafId = requestAnimationFrame(this.loop);
  }

  // this gets called when the frame needs to be refreshed... DRAW()
  componentDidUpdate() {

    const audioData = this.state.normalizedData;

    const canvas = this.canvas.current;
    const height = canvas.height;
    const width = canvas.width;

    // The actual context that you can draw on, like graphics.
    const context = canvas.getContext('2d');

    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = '#ffffff';
    context.clearRect(0, 0, width, height);

    let x = 0;
    for (const item of audioData) {
      const h = (item / 255.0) * height;
      const y = height - h;
      context.strokeRect(x, y, sliceWidth, h);
      x += sliceWidth;
    }

    context.stroke();
  }



  render() {
    if (!this.audioAnalyzer.isConnected()) {
      return (
        <div>
          <Canvas style={{ height: `100vh`, width: '100vw' }} >
            <Text click={this.toggleMicrophone} />
            <pointLight position={[500, 500, 0]} />
            <ambientLight intensity={0.4} />
          </Canvas>
        </div>
      )
    }

    const s1 = this.state.normalizedData[2] / 255.0 * 1.5; //1

    const r = this.state.normalizedData[3] / 300.0;
    const f = this.state.normalizedData[4] / 255.0; //2

    return (
      <div style={{ width: "100vw", height: "100vh" }}>

        <div style={{ width: "100vw", height: "100vh" }}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 10, near: 0.1 }} onpmrthographic={true}>
            <Suspense fallback={null}>
              {/* <mesh scale={5}>
                <sphereGeometry args={[1, 64, 64]} />
                <LayerMaterial attach="material" side={THREE.BackSide}>
                  <Color color={0xff4eb8} alpha={1} mode="normal" />
                  <Depth colorA={0xff8f00} colorB={0x00ffff} alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
                </LayerMaterial>
              </mesh> */}

              {/* <mesh>
                <planeBufferGeometry args={[3, 5]}/>
                <waveShaderMaterial uColor={"hotpink"}/>
              </mesh> */}

              <BG freq={f} bg={0} />
              {/* <Frames position={[-1.5, 0.0, -3]} freq={cum} bg={0} /> */}

              {/* <Sphere scale={s1}/>

              <Frames position={[-1.5, 0.0, -3]}/>
              <Frames position={[-0.95, 0.0, -3]}/>
              <Frames position={[-0.4, 0.0, -3]}/> */}

              <SphereFrame position={[0, 0, 0]} />

              {/* <Star scale={0.5} position={[0, 0, 0]} /> */}

              <mesh scale={s1} position={[0, 0, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              {/* <Image scale={1} position={[1, 1, 1]}/> */}


              <mesh
                scale={s1}
                position={[Math.sin(clock.getElapsedTime()) * 0.3, Math.cos(clock.getElapsedTime()) * 0.3, 0]} 
                >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>


              {/* <mesh
                scale={2}
                position={[1.6, -0.5, -10.0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <sphereGeometry attach="geometry" args={[1, 16, 16]} />
                <meshStandardMaterial attach="material" color="hotpink" transparent />
              </mesh> */}

              <OrbitControls />
              {/* <pointLight position={[10, 10, 5]} /> */}
              <pointLight position={[500, 500, 0]} />
              {/* <pointLight position={[-10, -10, -5]} color={this.state.colorA} /> */}
              <ambientLight intensity={0.4} />
              <Environment preset="warehouse" />
            </Suspense>
          </Canvas>
        </div>

        <div>
          <canvas width="1350" height="300" ref={this.canvas} />;
        </div>

      </div>
    );
  }
}


export default App;
