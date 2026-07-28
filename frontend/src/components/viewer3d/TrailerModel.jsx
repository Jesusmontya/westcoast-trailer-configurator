import { useConfigurator } from '../../context/ConfiguratorContext'

export default function TrailerModel() {
  const { size, selectedItems } = useConfigurator()
  const { width, height, depth } = size.dimensions
  const bodyColor = '#3a3a3a'

  return (
    <group position={[0, height / 2 + 0.15, 0]}>
      <mesh position={[0, -height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

      {/* Items interiores seleccionados */}
      {selectedItems.map((item) => (
        <mesh
          key={item.id}
          position={[item.position.x, -height / 2 + item.size.h / 2, item.position.z]}
        >
          <boxGeometry args={[item.size.w, item.size.h, item.size.d]} />
          <meshStandardMaterial color={item.color} />
        </mesh>
      ))}

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