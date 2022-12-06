import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const WaveShaderMaterial = shaderMaterial(
    // Uniform
    { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0), uFreq: 0.0, uTexture: new THREE.Texture(), },
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
      uniform sampler2D uTexture;
      uniform float uFreq;
  
      varying vec2 vUv;
  
      #pragma glslify: dither = require(glsl-dither);
  
      void main() {
        vec3 texture = vec3(uFreq, uFreq, uFreq) - texture2D(uTexture, vUv).rgb;
        gl_FragColor = vec4(texture, 1.0);
      }
    `
);
