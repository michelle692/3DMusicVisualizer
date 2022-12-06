import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const BrandonShaderMaterial = shaderMaterial(
    // Uniform
    { uTime: 0, colorA: new THREE.Color(0.0, 0.0, 0.0), colorB: new THREE.Color(0.0, 0.0, 0.0) }, 
    // Vertex Shader
    glsl`
      varying vec3 color;
  
      void main() { 
        color = normalize(normalMatrix * normal);
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
      }
    `, 
    // Fragment shader
    glsl`
      precision highp float;
      varying vec3 color;
      uniform float uTime;

      #pragma glslify: dither = require(glsl-dither);
      
      void main()
      {
        float theta = uTime * 2.0;
    
        vec3 dir1 = vec3(cos(theta),0,sin(theta)); 
        vec3 dir2 = vec3(sin(theta),0,cos(theta));
        
        float diffuse1 = pow(dot(color,dir1),2.0);
        float diffuse2 = pow(dot(color,dir2),2.0);
        
        vec3 col1 = diffuse1 * vec3(0.8, 0.56, 0.73);
        vec3 col2 = diffuse2 * vec3(0.9, 0.8, 0.7);
        
        vec4 finColor = vec4(col1 + col2, 1.0);

        gl_FragColor = dither(gl_FragCoord.xy, finColor);
      }
    `,
  );