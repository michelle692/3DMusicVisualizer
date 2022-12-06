import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const DitherShaderMaterial = shaderMaterial(
    // Uniform
    { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0), uFreq: 0.0, uBg: 1, uTexture: new THREE.Texture()},
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
    uniform int uBg;

    #pragma glslify: dither = require(glsl-dither);

    varying vec2 vUv;

    void main() {
      vec4 color = vec4(sin(uColor.x + uTime), 0.5, 1.0, 0.5);
      if (uBg == 0) {
        color = vec4(uFreq, uFreq, uFreq, 1);
      }
      gl_FragColor = dither(gl_FragCoord.xy, color);
    }
    `
);