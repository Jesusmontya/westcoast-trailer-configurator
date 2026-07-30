import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const GRID_FT = 0.5
export const FT_TO_UNITS = 0.183

export const SIZES = [
  {
    id: 'small',
    label: '12 ft',
    tagline: 'Great for 1 person, tight menus',
    basePrice: 8000,
    dimensions: { width: 2.2, height: 1.4, depth: 1.2 },
    floorFt: { width: 12, depth: 6.5 },
    capacity: 3,
  },
  {
    id: 'medium',
    label: '16 ft',
    tagline: 'Great for 1-2 people, most popular',
    basePrice: 11000,
    dimensions: { width: 3.0, height: 1.4, depth: 1.5 },
    floorFt: { width: 16, depth: 8 },
    capacity: 4,
  },
  {
    id: 'large',
    label: '20 ft',
    tagline: 'Great for full crews, big menus',
    basePrice: 14500,
    dimensions: { width: 3.8, height: 1.5, depth: 1.8 },
    floorFt: { width: 20, depth: 9.5 },
    capacity: 6,
  },
]

export const INTERIOR_ITEMS = [
  { id: 'grill', label: 'Grill / Plancha', price: 900, category: 'Kitchen', icon: '🔥', footprintFt: { w: 2.5, d: 2 }, height: 0.3, color: '#7f8c8d' },
  { id: 'fryer', label: 'Fryer', price: 750, category: 'Kitchen', icon: '🍟', footprintFt: { w: 1.5, d: 1.5 }, height: 0.35, color: '#c0392b' },
  { id: 'sink', label: 'Triple Sink', price: 600, category: 'Plumbing', icon: '🚰', footprintFt: { w: 3, d: 1.5 }, height: 0.3, color: '#95a5a6' },
  { id: 'fridge', label: 'Commercial Fridge', price: 1200, category: 'Refrigeration', icon: '🧊', footprintFt: { w: 2, d: 2 }, height: 0.9, color: '#ecf0f1' },
  { id: 'ac', label: 'A/C Unit', price: 1100, category: 'Comfort', icon: '❄️', footprintFt: { w: 1.5, d: 1 }, height: 0.2, color: '#3498db' },
  { id: 'shelving', label: 'Steel Shelving', price: 300, category: 'Storage', icon: '📦', footprintFt: { w: 1.5, d: 1.5 }, height: 0.8, color: '#7f8c8d' },
]

export const EQUIPMENT_CATEGORIES = ['Kitchen', 'Refrigeration', 'Plumbing', 'Comfort', 'Storage']

const FALLBACK_PRESETS = [
  { id: 'taco-starter', name: 'Taco Trailer Starter', size: 'small', equipment: ['grill', 'fryer', 'sink'] },
  { id: 'beverage-bar', name: 'Beverage Bar', size: 'small', equipment: ['sink', 'fridge', 'ac'] },
  { id: 'food-truck-classic', name: 'Food Truck Classic', size: 'medium', equipment: ['grill', 'sink', 'fridge', 'shelving'] },
  { id: 'full-kitchen-pro', name: 'Full Kitchen Pro', size: 'large', equipment: ['grill', 'fryer', 'sink', 'fridge', 'ac', 'shelving'] },
]

function snapToGrid(value) {
  return Math.round(value / GRID_FT) * GRID_FT
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.z < b.z + b.d && a.z + a.d > b.z
}

function findFreeSpot(itemFootprint, floorFt, existingPositions, itemsMap) {
  const margin = 0.5
  for (let z = margin; z + itemFootprint.d < floorFt.depth - margin; z += GRID_FT) {
    for (let x = margin; x + itemFootprint.w < floorFt.width - margin; x += GRID_FT) {
      const candidate = { x, z, w: itemFootprint.w, d: itemFootprint.d }
      const collides = Object.entries(existingPositions).some(([id, pos]) => {
        const other = itemsMap[id]
        if (!other) return false
        return rectsOverlap(candidate, { x: pos.x, z: pos.z, w: other.footprintFt.w, d: other.footprintFt.d })
      })
      if (!collides) return { x: snapToGrid(x), z: snapToGrid(z) }
    }
  }
  return { x: margin, z: margin }
}

const ConfiguratorContext = createContext(null)

export function ConfiguratorProvider({ children }) {
  const [step, setStep] = useState(1)
  const [presets, setPresets] = useState(FALLBACK_PRESETS)
  const [selectedPresetId, setSelectedPresetId] = useState(null)

  const [sizeId, setSizeId] = useState('medium')
  const [selectedItemIds, setSelectedItemIds] = useState([])
  const [positions, setPositions] = useState({})
  const [notes, setNotes] = useState('')

  const [draggedItemId, setDraggedItemId] = useState(null)
  const [dragInvalid, setDragInvalid] = useState(false)
  const isDragging = !!draggedItemId

  const [viewMode, setViewMode] = useState('side') // 'side' | 'top'

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    async function loadPresets() {
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error && data && data.length > 0) {
        const sizeMap = { '12ft': 'small', '16ft': 'medium', '20ft': 'large' }
        setPresets(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            size: sizeMap[p.size] || 'medium',
            equipment: p.equipment,
          }))
        )
      }
    }
    loadPresets()
  }, [])

  const size = SIZES.find((s) => s.id === sizeId)
  const itemsMap = useMemo(() => Object.fromEntries(INTERIOR_ITEMS.map((i) => [i.id, i])), [])

  const selectedItems = useMemo(
    () => INTERIOR_ITEMS.filter((item) => selectedItemIds.includes(item.id)),
    [selectedItemIds]
  )

  const totalPrice = useMemo(() => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.price, 0)
    return size.basePrice + itemsTotal
  }, [size, selectedItems])

  const isOverCapacity = selectedItemIds.length > size.capacity

  function autoPlace(itemId, currentPositions) {
    const item = itemsMap[itemId]
    return findFreeSpot(item.footprintFt, size.floorFt, currentPositions, itemsMap)
  }

  function applyPreset(preset) {
    setSelectedPresetId(preset.id)
    setSizeId(preset.size)
    setSelectedItemIds(preset.equipment)

    const newPositions = {}
    preset.equipment.forEach((id) => {
      newPositions[id] = autoPlace(id, newPositions)
    })
    setPositions(newPositions)
  }

  function startFromScratch() {
    setSelectedPresetId(null)
    setSizeId('medium')
    setSelectedItemIds([])
    setPositions({})
  }

  function toggleItem(itemId) {
    setSelectedItemIds((prev) => {
      const isRemoving = prev.includes(itemId)
      const next = isRemoving ? prev.filter((id) => id !== itemId) : [...prev, itemId]

      setPositions((prevPos) => {
        if (isRemoving) {
          const { [itemId]: _, ...rest } = prevPos
          return rest
        }
        return { ...prevPos, [itemId]: autoPlace(itemId, prevPos) }
      })

      return next
    })
  }

  // Intenta mover una pieza; siempre reporta si la posición candidata es válida,
  // y solo confirma el movimiento si sí lo es.
  function tryMoveItem(itemId, xFt, zFt) {
    const item = itemsMap[itemId]
    if (!item) return

    const snappedX = Math.max(0, Math.min(snapToGrid(xFt), size.floorFt.width - item.footprintFt.w))
    const snappedZ = Math.max(0, Math.min(snapToGrid(zFt), size.floorFt.depth - item.footprintFt.d))
    const candidate = { x: snappedX, z: snappedZ, w: item.footprintFt.w, d: item.footprintFt.d }

    const collides = Object.entries(positions).some(([id, pos]) => {
      if (id === itemId) return false
      const other = itemsMap[id]
      return rectsOverlap(candidate, { x: pos.x, z: pos.z, w: other.footprintFt.w, d: other.footprintFt.d })
    })

    setDragInvalid(collides)

    if (!collides) {
      setPositions((prev) => ({ ...prev, [itemId]: { x: snappedX, z: snappedZ } }))
    }
  }

  function goToStep(n) {
    setStep(n)
  }
  function nextStep() {
    setStep((s) => Math.min(s + 1, 4))
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 1))
  }

  async function submitLead() {
    setSubmitting(true)
    setSubmitError(false)

    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert({ name, phone, source: 'configurator', language: 'en' })
      .select()
      .single()

    if (leadError || !leadData) {
      console.error(leadError)
      setSubmitError(true)
      setSubmitting(false)
      return
    }

    const isRealPreset = typeof selectedPresetId === 'string' && selectedPresetId.length > 20

    const { error: buildError } = await supabase.from('builds').insert({
      lead_id: leadData.id,
      preset_id: isRealPreset ? selectedPresetId : null,
      size: size.label,
      equipment: selectedItemIds,
      total_price: totalPrice,
    })

    setSubmitting(false)

    if (buildError) {
      console.error(buildError)
      setSubmitError(true)
      return
    }

    setSubmitted(true)
  }

  const value = {
    step, goToStep, nextStep, prevStep,
    presets, selectedPresetId, applyPreset, startFromScratch,
    sizeId, setSizeId, size,
    selectedItemIds, selectedItems, toggleItem, isOverCapacity,
    positions, tryMoveItem,
    draggedItemId, setDraggedItemId, dragInvalid, setDragInvalid, isDragging,
    viewMode, setViewMode,
    notes, setNotes, totalPrice,
    name, setName, phone, setPhone,
    submitting, submitted, submitError, submitLead,
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