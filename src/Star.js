import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export function Star(props) {
  const { nodes, materials } = useGLTF("/mesh.gltf");
  const starMesh = useRef();
//   useFrame(() => {
//     starMesh.current.rotation.y += 0.01;
//   })

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pMesh1.geometry}
        material={nodes.pMesh1.material}
      />
    </group>
  );
}

useGLTF.preload('/mesh.gltf')