import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfigurator, FT_TO_UNITS } from '../../context/ConfiguratorContext'

function ftToScenePos(size, xFt, zFt, width, depth) {
  const halfW = size.dimensions.width / 2
  const halfD = size.dimensions.depth / 2
  const x = (xFt / size.floorFt.width) * size.dimensions.width - halfW + width / 2
  const z = (zFt / size.floorFt.depth) * size.dimensions.depth - halfD + depth / 2
  return [x, z]
}

function scenePosToFt(size, x, z) {
  const halfW = size.dimensions.width / 2
  const halfD = size.dimensions.depth / 2
  const xFt = ((x + halfW) / size.dimensions.width) * size.floorFt.width
  const zFt = ((z + halfD) / size.dimensions.depth) * size.floorFt.depth
  return [xFt, zFt]
}

// Plano grande e invisible que cubre todo el piso — así el arrastre nunca
// "se pierde" aunque el mouse se mueva rápido fuera de la pieza chiquita.
function DragPlane({ floorY }) {
  const { draggedItemId, tryMoveItem, size, setDraggedItemId, setDragInvalid } = useConfigurator()
  const { camera, raycaster, pointer, gl } = useThree()
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -floorY))

  useEffect(() => {
    plane.current.constant = -floorY
  }, [floorY])

  useEffect(() => {
    function handleWindowUp() {
      setDraggedItemId(null)
      setDragInvalid(false)
      gl.domElement.style.cursor = 'auto'
    }
    window.addEventListener('pointerup', handleWindowUp)
    return () => window.removeEventListener('pointerup', handleWindowUp)
  }, [gl, setDraggedItemId, setDragInvalid])

  function handlePointerMove(e) {
    if (!draggedItemId) return
    e.stopPropagation()

    raycaster.setFromCamera(pointer, camera)
    const point = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane.current, point)

    if (point) {
      const [xFt, zFt] = scenePosToFt(size, point.x, point.z)
      tryMoveItem(draggedItemId, xFt, zFt)
    }
  }

  return (
    <mesh
      position={[0, floorY, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDraggedItemId(null)}
    >
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

function DraggableItem({ item, position, floorY, itemHeight, width, depth }) {
  const { setDraggedItemId, draggedItemId, dragInvalid, size, gl: _gl } = useConfigurator()
  const { gl } = useThree()

  const [sceneX, sceneZ] = ftToScenePos(size, position.x, position.z, width, depth)
  const isBeingDragged = draggedItemId === item.id
  const showInvalid = isBeingDragged && dragInvalid

  function handlePointerDown(e) {
    e.stopPropagation()
    setDraggedItemId(item.id)
    gl.domElement.style.cursor = 'grabbing'
  }

  return (
    <mesh
      position={[sceneX, floorY + itemHeight / 2, sceneZ]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => (gl.domElement.style.cursor = 'grab')}
      onPointerOut={() => {
        if (!isBeingDragged) gl.domElement.style.cursor = 'auto'
      }}
    >
      <boxGeometry args={[width, itemHeight, depth]} />
      <meshStandardMaterial color={showInvalid ? '#e63946' : item.color} />
    </mesh>
  )
}

export default function TrailerModel() {
  const { size, selectedItems, positions } = useConfigurator()
  const { width, height, depth } = size.dimensions
  const bodyColor = '#3a3a3a'
  const floorY = -height / 2

  return (
    <group position={[0, height / 2 + 0.15, 0]}>
      <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      <mesh position={[-width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.15} side={2} />
      </mesh>

      <mesh position={[width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.15} side={2} />
      </mesh>

      <mesh position={[0, 0, -depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.6} side={2} />
      </mesh>

      <mesh position={[0, 0, depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.15} side={2} />
      </mesh>

      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.1} side={2} />
      </mesh>

      <DragPlane floorY={floorY} />

      {selectedItems.map((item) => {
        const pos = positions[item.id]
        if (!pos) return null
        const itemWidth = item.footprintFt.w * FT_TO_UNITS
        const itemDepth = item.footprintFt.d * FT_TO_UNITS
        return (
          <DraggableItem
            key={item.id}
            item={item}
            position={pos}
            floorY={floorY}
            width={itemWidth}
            depth={itemDepth}
            itemHeight={item.height}
          />
        )
      })}

      <mesh position={[-width / 2.5, -height / 2 - 0.15, depth / 2 + 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#1d1d1d" />
      </mesh>
      <mesh position={[width / 2.5, -height / 2 - 0.15, depth / 2 + 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#1d1d1d" />
      </mesh>
    </group>
  )
}