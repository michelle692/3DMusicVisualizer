import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

export const FractalShaderMaterial = shaderMaterial(
    // Uniform
    { uTime: 0, uColor: new THREE.Color(1.0,0.0,0.0) }, 
    // Vertex Shader
    glsl`
    precision mediump float;
    uniform float uTime;
    varying vec2 vUv;
  
      void main() { 
        vUv = uv; 
        mat4 transform = projectionMatrix * modelViewMatrix;
        vec3 modifiedPos = position;
        modifiedPos.z = cos(tan(sin(modifiedPos.x+uTime))); 
        gl_Position =  transform * vec4(modifiedPos, 1.0);
      }
    `, 
    // Fragment shader
    glsl`
        precision mediump float;
        uniform vec3 uColor;
        uniform float uTime;

        varying vec2 vUv;
      
      void main()
      {
        vec3 colorA = vec3(sin(vUv.x) * uColor); 
        vec3 colorB = vec3(0.32,0.53,0.83);       
        float pct = (abs(sin(uTime)))/1.4;

        vec3 color = mix(colorA, colorB, pct);
        gl_FragColor = vec4(color, 1.0);

        float r = 0.2;
        float mx = 1.0;
        float my = 0.1;
        float cx = mx + r * sin(uTime);
        float cy = my + r * cos(uTime);
        vec2 vertTexCoord = vUv;
        vec2 c = vec2(cx,cy);
        vec2 z = vec2((vertTexCoord.x * 6.28) - 3.14, (vertTexCoord.y * 6.28) - 3.14);
        for (int i = 0; i < 20; i++) {
            vec2 complexSinVec = vec2(sin(z.x)cosh(z.y),cos(z.x)sinh(z.y));
            z = vec2((c.x * complexSinVec.x) - (c.y * complexSinVec.y), (c.x * complexSinVec.y) + (c.y * complexSinVec.x));
        }
        vec4 diffuse_color = gl_FragColor;
        float val = length(z);
        if (length(z) < 2500.0) {
            diffuse_color = vec4(1.0,1.0,1.0,1.0);
        }
        gl_FragColor = vec4(diffuse_color.rgb, 1.0);
      }
    `,
  );