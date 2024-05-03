

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'



export function NightCity(props) {
  const { nodes, materials } = useGLTF('./models/nightCity.glb')



  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={5.538}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh geometry={nodes.Cube001_Background_Night_Buildings_0.geometry} material={materials.Background_Night_Buildings} position={[-16.698, 921.631, -719.063]} rotation={[-Math.PI / 2, 0, 0]} scale={100} >
          </mesh>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('./models/nightCity.glb')