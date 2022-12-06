import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const VertexDispShaderMaterial = shaderMaterial(
    // Uniform
    { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0), uFreq: 0.0, uTexture: new THREE.Texture()},
    // Vertex Shader
    glsl`
      precision mediump float;
    
      varying vec2 vUv;
      varying float noise;
      varying vec3 fNormal;
      uniform sampler2D uTexture;
      uniform float uFreq;
  
      void main() {
        vUv = uv;
        fNormal = normal;

        vec4 noiseTex = texture2D( uTexture, vUv );
        noise = noiseTex.r;

        vec3 newPosition = position + normal * noise * uFreq;
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4 (newPosition, 1.0);
      }
    `,

    // Fragment shader
    glsl`
    precision mediump float;
    varying float noise;
    varying vec3 fNormal;

    varying vec2 vUv;

    void main() {
        vec3 texture = vec3(1.0, 1.0, 1.0) - (fNormal * noise);
        gl_FragColor = vec4(texture, 1.0 );
    }
    `
);