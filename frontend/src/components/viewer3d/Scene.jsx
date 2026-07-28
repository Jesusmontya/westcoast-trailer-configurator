import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import TrailerModel from './TrailerModel'

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 1.2, 5], fov: 50 }} shadows>
      <color attach="background" args={['#e5e5e5']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={1.2} castShadow />

      <TrailerModel />

      {/* Terreno alrededor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>

      {/* Carretera — corre a lo largo del eje X, igual que el trailer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 3.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Línea central segmentada, corriendo en X */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-9 + i * 2, 0.005, 0]}
        >
          <planeGeometry args={[1, 0.1]} />
          <meshStandardMaterial color="#f1c40f" />
        </mesh>
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={10} blur={2} far={2} />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0.7, 0]}
      />

      <Environment preset="city" />
    </Canvas>
  )
}