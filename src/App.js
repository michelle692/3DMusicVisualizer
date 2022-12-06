import React, { useState, useEffect } from "react";
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
import { BGShaderMaterial } from "./shaders/bgshader";
import { InvertShaderMaterial } from "./shaders/invert";
import { VertexDispShaderMaterial } from "./shaders/vertdisp";
import { BrandonShaderMaterial } from "./shaders/halftone";
import { FractalShaderMaterial } from "./shaders/fractal";
import './App.css';
import { Star } from './Star';

extend({ TextGeometry })
extend({ WaveShaderMaterial });
extend({ GradientShaderMaterial });
extend({ DitherShaderMaterial });
extend({ TextWaveShaderMaterial });
extend({ BGShaderMaterial });
extend({ InvertShaderMaterial});
extend({ VertexDispShaderMaterial})
extend({ BrandonShaderMaterial});
extend({ FractalShaderMaterial});


const textures = [require('./images/Dali.jpeg'), require('./images/scope.jpg'), require('./images/bg2.jpeg'), require('./images/Dali.jpeg'), require('./images/bg1.png'),];

var clock = new THREE.Clock();
const NUM_OF_BINS = 20;

const SCENE_DURATION = 12; //seconds
const NUM_OF_SCENES = 7;

const BG = (props) => {
  const texture = useTexture(textures[props.texture_id]);
  const ref = useRef();
  return (
    <mesh position={[0.0, 0.0, -5]} >
      <planeBufferGeometry args={[8, 8, 8, 8]} />
      <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref} />
    </mesh>
  )
}

const WaveSphere = (props) => {
  const ref = useRef();
  // useFrame(({clock}) => (ref.current.uTime = clock.getElapsedTime()));
  return (
    <group>
      <mesh scale={props.scale} position={[0, 0, 0]}>
        <sphereBufferGeometry args={[0.4, 16.0, 16.0]} />
        <textWaveShaderMaterial uTime={clock.getElapsedTime()} uColor={"hotpink"} ref={ref} wireframe />
      </mesh>
      <mesh scale={props.scale} position={[0, 0, 0]} >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>
    </group>
    

  )
}

const StillBG = (props) => {
  const texture = useTexture(textures[props.texture_id]);
  const ref = useRef();
  return (
    <mesh >
      <planeBufferGeometry args={[4, 4, 4, 4]} />
      <invertShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref}/>
    </mesh>
  )
}

const Bubble = (props) => {
  return (
    <mesh scale={props.scale} position={[0, 0, 0]} >
        <sphereGeometry args={[0.1, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
    </mesh>
  )
}

const RotatingSpheres = (props) => {
  const ref = useRef();
  return (
    <group>
      {/* center */}
      <mesh scale={props.scale} position={[0, 0, 0]} >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      {/* inner circle */}
      <mesh
        scale={props.scale1}
        position={[Math.sin(clock.getElapsedTime()) * 0.5, Math.cos(clock.getElapsedTime()) * 0.5, 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale1}
        position={[Math.sin(clock.getElapsedTime() - 5) * 0.5 , Math.cos(clock.getElapsedTime() - 5) * 0.5 , 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale1}
        position={[Math.sin(clock.getElapsedTime() - 10) * 0.5 , Math.cos(clock.getElapsedTime() - 10) * 0.5 , 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale1}
        position={[Math.sin(clock.getElapsedTime() - 15) * 0.5 , Math.cos(clock.getElapsedTime() - 15) * 0.5 , 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale1}
        position={[Math.sin(clock.getElapsedTime() - 20) * 0.5 , Math.cos(clock.getElapsedTime() - 20) * 0.5 , 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      {/* outer circle */}
      <mesh
        scale={props.scale2}
        position={[Math.cos(clock.getElapsedTime()) * 0.9, Math.sin(clock.getElapsedTime()) * 0.9, 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale2}
        position={[Math.cos(clock.getElapsedTime() - 5) * 0.9, Math.sin(clock.getElapsedTime() - 5) * 0.9, 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale2}
        position={[Math.cos(clock.getElapsedTime() - 10) * 0.9, Math.sin(clock.getElapsedTime() - 10) * 0.9, 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale2}
        position={[Math.cos(clock.getElapsedTime() - 15) * 0.9, Math.sin(clock.getElapsedTime() - 15) * 0.9, 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh
        scale={props.scale2}
        position={[Math.cos(clock.getElapsedTime() - 20) * 0.9, Math.sin(clock.getElapsedTime() - 20) * 0.9, 0]} 
        >
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

    </group>
  )

}

const RippleSphere = (props) => {
  return (
    <group>
      {/* middle */}
      <mesh scale={props.scale} position={[0, 0, 0]} >
        <sphereGeometry args={[0.1, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh scale={props.scale} position={[0, 0, 0]} >
        <torusGeometry args={[0.2, 0.03, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh scale={props.scale} position={[0, 0, 0]} >
        <torusGeometry args={[0.4, 0.03, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      {/* top right */}
      <mesh scale={props.scale1} position={[1, 0.5, 0]} >
        <sphereGeometry args={[0.1, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh scale={props.scale1} position={[1, 0.5, 0]} >
        <torusGeometry args={[0.2, 0.03, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh scale={props.scale1} position={[1, 0.5, 0]} >
        <torusGeometry args={[0.4, 0.03, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      {/* bottom right */}
      <mesh scale={props.scale2} position={[-1, -0.5, 0]} >
        <sphereGeometry args={[0.1, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh scale={props.scale2} position={[-1, -0.5, 0]} >
        <torusGeometry args={[0.2, 0.03, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>

      <mesh scale={props.scale2} position={[-1, -0.5, 0]} >
        <torusGeometry args={[0.4, 0.03, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>
    </group>
  )
}

const Frames = (props) => {
  const texture = useTexture(textures[props.texture_id]);
  const ref = useRef();
  return (
    <group>
      <mesh position={[-1.16, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <invertShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref}/>
      </mesh>
      
      <mesh position={[-0.58, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <invertShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq1} ref={ref}/>
      </mesh>

      <mesh position={[0, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <invertShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq2} ref={ref}/>
      </mesh>

      <mesh position={[0.58, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <invertShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq3} ref={ref}/>
      </mesh>

      <mesh position={[1.16, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <invertShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq4} ref={ref}/>
      </mesh>
    </group>
    
  )
}


const WaveFrames = (props) => {
  const texture = useTexture(textures[props.texture_id]);
  const ref = useRef();
  return (
    <group>  
      <mesh position={[-0.68, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref} />
      </mesh>

      <mesh position={[0.68, 0, 0]}>
        <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
        <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref} />
      </mesh>
    </group>
    
  )
}

const WavePannel = (props) => {
  const texture = useTexture(textures[props.texture_id]);
  const ref = useRef();
  return (
    <mesh position={[0, 0, 0]}>
      <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
      <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref} />
    </mesh>
  )
}

const RandMesh = (props) => {
  return (
    <group>
      <Star scale={Math.sin(props.scale)} position={[-0.8, Math.sin(clock.getElapsedTime()) + 0.4, 0]}/>
      <Star scale={props.scale} position={[0, Math.cos(clock.getElapsedTime()), 0]}/>
      <Star scale={props.scale} position={[0.8,Math.sin(clock.getElapsedTime()) - 0.4, 0]}/>
    </group>
  )
}

const TorusKnot = (props) => {
  const texture = useTexture(textures[1]);
  const ref = useRef();
  return (
    <group>
      <mesh scale={props.scale} position={[0, 0, 0]} >
        <sphereGeometry args={[0.1, 64, 64]} />
        <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={props.roughness} />
      </mesh>
      
      <mesh scale={1.5} position={[0, 0, 0]}>
      <sphereGeometry args={[0.2, 64, 64]} />
      <vertexDispShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} uTexture={texture} uFreq={props.freq} ref={ref}/>
    </mesh>
    </group>
    
  )
}

const BrandonMesh = (props) => {
  return (
    <mesh position={[0, 0, -10]}>
      <boxGeometry args={[3, 3, 3]} />
      <brandonShaderMaterial uTime={clock.getElapsedTime()} colorA={[1.0, 1.0, 1.0]} colorB={[1.0, 0.0, 0.0]}/>
    </mesh>
  )
}

const Test = (props) => {
  const ref = useRef();
  return (
    <mesh position={[0, 0, -10]}>
      <planeBufferGeometry args={[0.5, 1.2, 8, 8]} />
      <fractalShaderMaterial uTime={clock.getElapsedTime()} uColor="hotpink" ref={ref}/>
    </mesh>
  )
}

const font = new FontLoader().parse(inconsolata);

const Text = (props) => {
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));
  const ref = useRef();
  return (
    <mesh
      position={[-2, 0, 0]}
      onClick={props.click}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
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

    this.lastScene = -1;
    this.texture_id = 0;
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
    document.body.style.cursor = 'auto';
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

  init_scene() {
    var new_background = Math.floor(Math.random() * textures.length);
    while (new_background === this.texture_id) {
      new_background = Math.floor(Math.random() * textures.length);
    }
    this.texture_id = new_background;

  }

  scene_calculator() {
    const scene_number = Math.floor(clock.getElapsedTime() / SCENE_DURATION) % NUM_OF_SCENES;

    if (scene_number !== this.lastScene) {
      this.init_scene();
      this.lastScene = scene_number;
    }

    return scene_number;
  }

  render() {
    if (!this.audioAnalyzer.isConnected()) {
      return (
        <div>
          <Canvas style={{ height: `100vh`, width: '100vw'}} >
            <Text click={this.toggleMicrophone} />
            <pointLight position={[500, 500, 0]} />
            <ambientLight intensity={0.4} />
          </Canvas>
        </div>
      )
    }

    const scene_number = this.scene_calculator();
    console.log("scene: ", scene_number);

    const s1 = this.state.normalizedData[1] / 255.0 * 1.8; 
    const s2 = this.state.normalizedData[5] / 255.0 * 1.8;
    const s3 = this.state.normalizedData[10] / 255.0 * 1.8;
    const s4 = this.state.normalizedData[10] / 255.0 * 0.2;

    const s5 = this.state.normalizedData[9] / 255.0 * 10.0; 
    const s6 = this.state.normalizedData[10] / 255.0 * 10.0;

    const r = this.state.normalizedData[3] / 300.0;

    const f = this.state.normalizedData[1] / 255.0; 
    const f1 = this.state.normalizedData[2] / 255.0;
    const f2 = this.state.normalizedData[4] / 255.0;
    const f3 = this.state.normalizedData[8] / 255.0;
    const f4 = this.state.normalizedData[10] / 255.0;

    return (
      <div style={{ width: "100vw", height: "100vh" }}>

        <div style={{ width: "100vw", height: "100vh" }}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 10, near: 0.1 }} onpmrthographic={true}>
            <Suspense fallback={null}>
              

              {/* <mesh>
                <planeBufferGeometry args={[3, 5]}/>
                <waveShaderMaterial uColor={"hotpink"}/>
              </mesh> */}

              {/* <BG texture_id={this.texture_id} freq={f}/> */}


              {/* <StillBG texture_id={this.texture_id} freq={f}/> */}
              {/* {scene_number === 0 &&  <SphereFrame position={[0, 0, 0]} texture_id={this.texture_id} />} */}

              {scene_number === 0 &&  <TorusKnot texture_id={this.texture_id} freq={f}/>}
              {scene_number === 0 &&  <BrandonMesh/>}
              {scene_number === 1 &&  <RotatingSpheres scale={s2} scale1={s1} scale2={s3} roughness={r}/>}
              {scene_number === 1 &&  <WavePannel texture_id={this.texture_id} freq={f}/>}
              {scene_number === 2 &&  <RippleSphere scale={s2} scale1={s2} scale2={s1} roughness={r}/>}
              {scene_number === 2 &&  <WavePannel texture_id={this.texture_id} freq={f}/>}
              {scene_number === 3 &&  <Frames texture_id={this.texture_id} freq={f} freq1={f1} freq2={f2} freq3={f3} freq4={f4}/>}
              {scene_number === 4 &&  <RandMesh scale={0.1} move={f}/>}
              {scene_number === 4 &&  <Frames texture_id={this.texture_id} freq={f} freq1={f1} freq2={f2} freq3={f3} freq4={f4}/>}
              {scene_number === 5 &&  <WaveFrames texture_id={this.texture_id} freq={f}/>}
              {scene_number === 6 &&  <WaveSphere scale={s1} roughness={r}/>}
              {scene_number === 6 &&  <WavePannel texture_id={this.texture_id} freq={f}/>}

              {/* <Test /> */}
  
              {/* <TorusKnot texture_id={this.texture_id} freq={f}/> */}
  
              {/* <RotatingSpheres scale={s2} scale1={s1} scale2={s3} roughness={r}/> */}

              {/* <RippleSphere scale={s2} scale1={s2} scale2={s1} roughness={r}/> */}

              {/* <Frames texture_id={this.texture_id}/> */}

              {/* <RandMesh scale={0.1} move={f}/> */}

              {/* <WaveFrames texture_id={this.texture_id}/> */}

              {/* <TorusKnot p={s5} q={s6}/> */}

              {/* <WaveSphere scale={s2} roughness={r}/> */}

              {/* <WavePannel texture_id={this.texture_id} freq={f}/> */}

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
