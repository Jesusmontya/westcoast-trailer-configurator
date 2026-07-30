import { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import TrailerModel from './TrailerModel'
import { useConfigurator } from '../../context/ConfiguratorContext'

function CameraRig() {
  const { viewMode } = useConfigurator()
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!controlsRef.current) return
    if (viewMode === 'top') {
      camera.position.set(0, 6, 0.01)
      controlsRef.current.target.set(0, 0.7, 0)
    } else {
      camera.position.set(0, 1.2, 5)
      controlsRef.current.target.set(0, 0.7, 0)
    }
    controlsRef.current.update()
  }, [viewMode, camera])

  const { isDragging } = useConfigurator()

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isDragging}
      enablePan={false}
      minDistance={3}
      maxDistance={9}
      minPolarAngle={viewMode === 'top' ? 0.01 : Math.PI / 2.3}
      maxPolarAngle={viewMode === 'top' ? 0.01 : Math.PI / 2.3}
      target={[0, 0.7, 0]}
    />
  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 1.2, 5], fov: 50 }} shadows>
      <color attach="background" args={['#e5e5e5']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={1.2} castShadow />

      <TrailerModel />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 3.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-9 + i * 2, 0.005, 0]}>
          <planeGeometry args={[1, 0.1]} />
          <meshStandardMaterial color="#f1c40f" />
        </mesh>
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={10} blur={2} far={2} />

      <CameraRig />

      <Environment preset="city" />
    </Canvas>
  )
}