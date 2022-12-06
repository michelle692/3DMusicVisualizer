import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const InvertShaderMaterial = shaderMaterial(
    // Uniform
    { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0), uTexture: new THREE.Texture(), uFreq: 0.0},
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
        uniform float uFreq;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        
        void main() {
            vec3 texture = vec3(uFreq, uFreq, uFreq) - texture2D(uTexture, vUv).rgb;
            gl_FragColor = vec4(texture, 1.0);
        }
    `
);