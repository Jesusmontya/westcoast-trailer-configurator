import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function TrailerModel() {
  const bodyRef = useRef()
  const [color, setColor] = useState('#e63946')

  // pequeña rotación automática, además del control manual con el mouse
  useFrame(() => {
    bodyRef.current.rotation.y += 0.002
  })

  return (
    <group ref={bodyRef}>
      {/* Cuerpo principal del trailer */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Ventana lateral (pieza intercambiable a futuro) */}
      <mesh position={[0.5, 0.7, 0.76]}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#a8dadc" />
      </mesh>

      {/* Ruedas */}
      <mesh position={[-1, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1d1d1d" />
      </mesh>
      <mesh position={[1, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1d1d1d" />
      </mesh>
    </group>
  )
}