import React from "react";
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, Suspense } from 'react';
import { OrbitControls, Environment } from '@react-three/drei'
import { useControls } from 'leva'
import './App.css';

//UI editor
const Graph = () => {
  const props = useControls({
    base: { value: '#ff4eb8' },
    colorA: { value: '#00ffff' },
    colorB: { value: '#ff8f00' }
  })
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, -0.75, 0.75], fov: 80, near: 0.001 }}>
      <Suspense fallback={null}>
        <mesh>
          <boxGeometry args={[10, 10, 10]} />
          <meshPhysicalMaterial color={props.colorB} depthWrite={false} roughness={0.5} />
        </mesh>
        <OrbitControls />
        <pointLight position={[10, 10, 5]} />
        <pointLight position={[-10, -10, -5]} color={props.colorA} />
        <ambientLight intensity={0.4} />
        <Environment preset="warehouse" />
      </Suspense>
    </Canvas>
  
    );
};

export default Graph;