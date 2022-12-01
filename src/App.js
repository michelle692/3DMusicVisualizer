import React from "react";
import * as THREE from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useRef, Suspense } from 'react';
import { OrbitControls, Environment } from '@react-three/drei'
import { LayerMaterial, Color, Depth, Fresnel, Noise } from 'lamina'
import { useControls } from 'leva'
import './App.css';
import AudioAnalyzer from './AudioAnalyzer';
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

var clock = new THREE.Clock();
var counter = 0;

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0) }, 
  // Vertex Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;

    uniform float uTime;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float noiseFreq = 1.5;
      float noiseAmp = 0.25;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.x += snoise3(noisePos) * noiseAmp;

      gl_Position = projectionMatrix * modelViewMatrix * vec4 (pos, 1.0);
    }
  `, 
  // Fragment shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(sin(vUv.x + uTime), 0.8, 0.7, 0.5);
    }
  `
);

const GradientShaderMaterial = shaderMaterial(
  // Uniform
  { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0) }, 
  // Vertex Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;

    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4 (position, 1.0);
    }
  `, 
  // Fragment shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(sin(uTime), 0.5, 1.0, 0.5);
    }
  `
);

const DitherShaderMaterial = shaderMaterial(
  // Uniform
  { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0) }, 
  // Vertex Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;

    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4 (position, 1.0);
    }
  `, 

  // Fragment shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;

    #pragma glslify: dither = require(glsl-dither);

    varying vec2 vUv;

    void main() {
      vec4 color = vec4(sin(uColor.x + uTime), 0.5, 1.0, 0.5);
      gl_FragColor = dither(gl_FragCoord.xy, color);
    }
  `
);

extend({ WaveShaderMaterial });
extend({ GradientShaderMaterial });
extend({ DitherShaderMaterial });

const BG = () => {
  const ref = useRef();
  return (
    <mesh position={[0.0, 0.0, -5]} >
      <planeBufferGeometry args={[8, 8, 8, 8]} />
      <ditherShaderMaterial uTime={clock.getElapsedTime()} uColor={"hotpink"} ref={ref} />
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
      <planeBufferGeometry args={[0.5, 1.2, 16, 16]} />
      <ditherShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} ref={ref} />
    </mesh>
  )
}

const SphereFrame = (props) => {
  const ref = useRef();
  return (
    <mesh position={props.position}>
      <planeBufferGeometry args={[0.5, 0.8, 16, 16]} />
      <waveShaderMaterial uTime={clock.getElapsedTime()} uColor={"green"} ref={ref} />
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
      sphereData: new Uint8Array(0),
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
      //counter++;
      


      //if (counter >= 5) {
        //this.audioAnalyzer.analyze();
        //counter = 0;
      //}

      this.audioAnalyzer.analyze();
      this.audioAnalyzer.analyzeSphere();

      //getting new data input for the sphere
      const sphereData = this.audioAnalyzer.getSphereData();
      const normalizedSphereData = sphereData;

      //input data for the mesh
      const audioData = this.audioAnalyzer.getAudioData();
      const normalizedData = audioData;


      // Do what you want here with normalized data.
      // let count = 0;
      // for (let i = 0; i < 9; i++) {
      //   let avg = 0;
      //   let sampleCnt =  (Math.pow(2, i) * 2) | 0;

      //   if (i == 8) {
      //     sampleCnt += 2;
      //   }
      //   for (let j = 0; j < sampleCnt; j++) {
      //     avg += audioData[count] * (count + 1);
      //     count++;
      //   }
      //   avg /= count;
      //   normalizedData [i] = avg * 10;

      // }

      this.setState({ audioData: audioData, normalizedData: normalizedData, sphereData:normalizedSphereData });
    }

    this.rafId = requestAnimationFrame(this.loop);
  }

  // this gets called when the frame needs to be refreshed... DRAW()
  componentDidUpdate() {

    const audioData = this.state.audioData;
    //const sphereData

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
        <div className="controls">
          <button className="btn" onClick={this.toggleMicrophone}>
            {'start'}
          </button>
        </div>
      )
    }

    const s1 = this.state.normalizedData[10] / 255.0 * 1.5; //1
    const s3 = this.state.normalizedData[15] / 255.0 * 1.5; //2
    const s5 = this.state.normalizedData[20] / 255.0 * 2.5; //3 
    const s2 = this.state.normalizedData[100] / 255.0 * 2.5; //4
    const s7 = this.state.normalizedData[150] / 255.0 * 2.5; //5
    const s4 = this.state.normalizedData[380] / 255.0 * 2.5; //6
    const s6 = this.state.normalizedData[400] / 255.0 * 1.5; //7
    const s8 = this.state.normalizedData[500] / 255.0 * 2.5; //8

    const o1 = this.state.sphereData[10]/255.0 *1.5;
    const o3 = this.state.sphereData[15] / 255.0 * 1.5; //2
    const o5 = this.state.sphereData[20] / 255.0 * 2.5; //3 
    const o2 = this.state.sphereData[100] / 255.0 * 2.5; //4
    const o7 = this.state.sphereData[150] / 255.0 * 2.5; //5
    const o4 = this.state.sphereData[380] / 255.0 * 2.5; //6
    const o6 = this.state.sphereData[400] / 255.0 * 1.5; //7
    const o8 = this.state.sphereData[500] / 255.0 * 2.5; //8

    const r = this.state.normalizedData[100] / 300.0;

    return (
      <div>

        <div >
          <Canvas style={{ height: `500px` }} dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 10, near: 0.1 }} onpmrthographic={ true }>
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

              <BG />
                
              <Sphere scale={s1}/>

              <Frames position={[-1.5, 0.0, -3]}/>
              <Frames position={[-0.95, 0.0, -3]}/>
              <Frames position={[-0.4, 0.0, -3]}/>

              <SphereFrame position={[0.8, 0.0, -3]}/>

              <mesh scale={o1} position={[0.5, 0, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              {/* <mesh scale={s7} position={[1.5, 0.4, -5]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh> */}


              {/* 1.6 */}
              {/* <mesh scale={s1} position={[Math.sin(clock.getElapsedTime()), Math.cos(clock.getElapsedTime()), 0]} rotation={[clock.getElapsedTime(), 0, 0]}>
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              <mesh scale={s2} position={[-0.5, 0.5, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              <mesh scale={s3} position={[0.5, 0.5, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              <mesh scale={s4} position={[1.6, 0.5, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              <mesh scale={s5} position={[-1.6, -0.5, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>
              
              <mesh scale={s6} position={[-0.5, -0.5, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              <mesh scale={s7} position={[0.5, -0.5, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>
              
              <mesh scale={s8} position={[1.6, -0.5, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshPhysicalMaterial color={0xaaa9ad} depthWrite={false} transmission={1} thickness={10} roughness={r} />
              </mesh>

              <mesh scale={40} position={[0, 0, 0]} >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshStandardMaterial attach="material" color="hotpink" transparent />
              </mesh>


              <mesh scale={10}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color={0xffffff} />
              </mesh>

              <mesh
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
