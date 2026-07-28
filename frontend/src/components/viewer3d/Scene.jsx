import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import TrailerModel from './TrailerModel'

export default function Scene() {
  return (
    <Canvas camera={{ position: [4, 2, 4], fov: 50 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <TrailerModel />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      <Environment preset="city" />
    </Canvas>
  )
}