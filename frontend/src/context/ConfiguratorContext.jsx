import { createContext, useContext, useState, useMemo } from 'react'

export const SIZES = [
  { id: 'small', label: '12 ft', basePrice: 8000, dimensions: { width: 2.2, height: 1.4, depth: 1.2 } },
  { id: 'medium', label: '16 ft', basePrice: 11000, dimensions: { width: 3.0, height: 1.4, depth: 1.5 } },
  { id: 'large', label: '20 ft', basePrice: 14500, dimensions: { width: 3.8, height: 1.5, depth: 1.8 } },
]

export const INTERIOR_ITEMS = [
  { id: 'grill', label: 'Plancha/Grill', price: 900, position: { x: -0.8, z: -0.3 }, size: { w: 0.5, h: 0.3, d: 0.4 }, color: '#7f8c8d' },
  { id: 'fryer', label: 'Freidora', price: 750, position: { x: -0.2, z: -0.3 }, size: { w: 0.35, h: 0.35, d: 0.35 }, color: '#c0392b' },
  { id: 'sink', label: 'Fregadero triple', price: 600, position: { x: 0.6, z: -0.3 }, size: { w: 0.7, h: 0.3, d: 0.35 }, color: '#95a5a6' },
  { id: 'fridge', label: 'Refrigerador comercial', price: 1200, position: { x: -0.9, z: 0.3 }, size: { w: 0.5, h: 0.9, d: 0.4 }, color: '#ecf0f1' },
  { id: 'ac', label: 'Aire acondicionado', price: 1100, position: { x: 0, z: 0.4 }, size: { w: 0.4, h: 0.2, d: 0.2 }, color: '#3498db' },
  { id: 'shelving', label: 'Repisas de acero', price: 300, position: { x: 0.8, z: 0.3 }, size: { w: 0.3, h: 0.8, d: 0.3 }, color: '#7f8c8d' },
]

const ConfiguratorContext = createContext(null)

export function ConfiguratorProvider({ children }) {
  const [sizeId, setSizeId] = useState('medium')
  const [selectedItemIds, setSelectedItemIds] = useState([])

  const size = SIZES.find((s) => s.id === sizeId)

  const selectedItems = useMemo(
    () => INTERIOR_ITEMS.filter((item) => selectedItemIds.includes(item.id)),
    [selectedItemIds]
  )

  const totalPrice = useMemo(() => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.price, 0)
    return size.basePrice + itemsTotal
  }, [size, selectedItems])

  function toggleItem(itemId) {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const value = {
    sizeId,
    setSizeId,
    size,
    selectedItemIds,
    selectedItems,
    toggleItem,
    totalPrice,
  }

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  )
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext)
  if (!ctx) throw new Error('useConfigurator debe usarse dentro de ConfiguratorProvider')
  return ctx
}