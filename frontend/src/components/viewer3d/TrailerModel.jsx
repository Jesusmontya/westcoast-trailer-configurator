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
  const { setDraggedItemId, draggedItemId, dragInvalid, size, focusedItemId, setFocusedItemId } =
    useConfigurator()
  const { gl } = useThree()
  const downPos = useRef({ x: 0, y: 0 })

  const [sceneX, sceneZ] = ftToScenePos(size, position.x, position.z, width, depth)
  const isBeingDragged = draggedItemId === item.id
  const isFocused = focusedItemId === item.id
  const showInvalid = isBeingDragged && dragInvalid

  function handlePointerDown(e) {
    e.stopPropagation()
    downPos.current = { x: e.clientX, y: e.clientY }
    setDraggedItemId(item.id)
    gl.domElement.style.cursor = 'grabbing'
  }

  function handlePointerUp(e) {
    const dx = Math.abs(e.clientX - downPos.current.x)
    const dy = Math.abs(e.clientY - downPos.current.y)
    if (dx < 5 && dy < 5) {
      // fue un click, no un arrastre → seleccionar para mostrar flechas
      setFocusedItemId(isFocused ? null : item.id)
    }
  }

  return (
    <mesh
      position={[sceneX, floorY + itemHeight / 2, sceneZ]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={() => (gl.domElement.style.cursor = 'grab')}
      onPointerOut={() => {
        if (!isBeingDragged) gl.domElement.style.cursor = 'auto'
      }}
    >
      <boxGeometry args={[width, itemHeight, depth]} />
      <meshStandardMaterial
        color={showInvalid ? '#e63946' : item.color}
        emissive={isFocused ? '#f1c40f' : '#000000'}
        emissiveIntensity={isFocused ? 0.3 : 0}
      />
    </mesh>
  )
}

// El A/C no se arrastra — va fijo en la pared trasera, en una de 3 posiciones
function WallMountedAC({ item, slot, wallWidth, wallHeight }) {
  const itemWidth = item.footprintFt.w * FT_TO_UNITS
  const slotOffsets = { left: -wallWidth * 0.3, center: 0, right: wallWidth * 0.3 }
  const x = slotOffsets[slot]
  const y = wallHeight / 2 - 0.15

  return (
    <mesh position={[x, y, -0.02]}>
      <boxGeometry args={[itemWidth, 0.25, 0.15]} />
      <meshStandardMaterial color={item.color} />
    </mesh>
  )
}

export default function TrailerModel() {
  const { size, floorItems, selectedItemIds, positions, reservedZone, acWallSlot } = useConfigurator()
  const { width, height, depth } = size.dimensions
  const bodyColor = '#3a3a3a'
  const floorY = -height / 2

  const acItem = { id: 'ac', color: '#3498db', footprintFt: { w: 1.5, d: 1 } }
  const showAC = selectedItemIds.includes('ac')

  // Zona reservada de la ventana de servicio, convertida a coordenadas de escena
  const winW = (reservedZone.w / size.floorFt.width) * width
  const winX = ((reservedZone.x + reservedZone.w / 2) / size.floorFt.width) * width - width / 2

  return (
    <group position={[0, height / 2 + 0.15, 0]}>
      <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Zona reservada de la ventana de servicio, marcada en el piso */}
      <mesh position={[winX, floorY + 0.002, depth / 2 - (reservedZone.d / size.floorFt.depth) * depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[winW, (reservedZone.d / size.floorFt.depth) * depth]} />
        <meshStandardMaterial color="#f1c40f" transparent opacity={0.25} />
      </mesh>

      <mesh position={[-width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.15} side={2} />
      </mesh>

      <mesh position={[width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.15} side={2} />
      </mesh>

      {/* Pared trasera — donde va montado el A/C */}
      <mesh position={[0, 0, -depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.6} side={2} />
      </mesh>

      {/* Pared de la puerta — aquí vive la ventana de servicio */}
      <mesh position={[0, 0, depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.15} side={2} />
      </mesh>
      {/* Recorte más claro que marca visualmente la ventana de servicio */}
      <mesh position={[winX, 0, depth / 2 - 0.01]}>
        <planeGeometry args={[winW, height * 0.5]} />
        <meshStandardMaterial color="#f1c40f" transparent opacity={0.3} side={2} />
      </mesh>

      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.1} side={2} />
      </mesh>

      <DragPlane floorY={floorY} />

      {floorItems.map((item) => {
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

      {showAC && (
        <WallMountedAC item={acItem} slot={acWallSlot} wallWidth={width} wallHeight={height} />
      )}

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