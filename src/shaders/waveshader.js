import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const WaveShaderMaterial = shaderMaterial(
    // Uniform
    { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0), uTexture: new THREE.Texture(), },
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
  
      varying vec2 vUv;
  
      #pragma glslify: dither = require(glsl-dither);
  
      void main() {
        vec3 texture = texture2D(uTexture, vUv).rgb;
        vec4 textCol = vec4(texture, 1.0);
  
        vec4 color = vec4(sin(uColor.x + uTime), 0.5, 1.0, 0.5);
  
        gl_FragColor = dither(gl_FragCoord.xy, textCol);
      }
    `
);
