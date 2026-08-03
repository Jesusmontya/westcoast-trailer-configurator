import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei'
import * as THREE from 'three'

function ScannedTrailer({ url, rotationFix, onBoundsReady }) {
  const { scene } = useGLTF(url)
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    const box = new THREE.Box3().setFromObject(ref.current)
    const size = new THREE.Vector3()
    box.getSize(size)
    onBoundsReady({ size, radius: Math.max(size.x, size.y, size.z) })
  }, [scene, onBoundsReady])

  return (
    <Center>
      <primitive ref={ref} object={scene} rotation={rotationFix} />
    </Center>
  )
}

function CameraRig({ bounds, angle, cameraAngles }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!bounds || !controlsRef.current) return
    const r = bounds.radius
    const factors = cameraAngles[angle] || cameraAngles.front
    camera.position.set(factors[0] * r, factors[1] * r, factors[2] * r)
    controlsRef.current.target.set(0, 0, 0)
    controlsRef.current.update()
  }, [angle, bounds, camera, cameraAngles])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={bounds ? bounds.radius * 0.05 : 0.5}
      maxDistance={bounds ? bounds.radius * 2.5 : 10}
    />
  )
}

const DEFAULT_ANGLES = {
  front: [0, 0.15, 1.4],
  side: [1.4, 0.15, 0],
  interior: [0, 0.05, 0.15],
}

export default function TrailerScanViewer({
  modelUrl,
  rotationFix = [0, 0, 0],
  cameraAngles = DEFAULT_ANGLES,
  showAngleButtons = true,
}) {
  const [bounds, setBounds] = useState(null)
  const [angle, setAngle] = useState('front')

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas camera={{ fov: 45 }} shadows>
        <color attach="background" args={['#e5e5e5']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>
          <ScannedTrailer url={modelUrl} rotationFix={rotationFix} onBoundsReady={setBounds} />
          <Environment preset="city" />
        </Suspense>

        <CameraRig bounds={bounds} angle={angle} cameraAngles={cameraAngles} />
      </Canvas>

      {showAngleButtons && (
        <div style={styles.buttonRow}>
          {Object.keys(cameraAngles).map((a) => (
            <button
              key={a}
              onClick={() => setAngle(a)}
              style={{
                ...styles.angleButton,
                background: angle === a ? '#e63946' : 'rgba(30,30,30,0.7)',
              }}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  buttonRow: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
  },
  angleButton: {
    padding: '9px 16px',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
  },
}