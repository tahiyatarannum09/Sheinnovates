import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { Sprout, Droplets, Sun, CheckCircle2, Plus } from 'lucide-react'

const PLANT_STAGES = ['🌱 Seed', '🌿 Sprout', '🌾 Young Plant', '🌳 Flourishing']

const INITIAL_PLANTS = [
  { id: 1, name: 'Basil', stage: 2, days: 14, health: 92, lastWatered: '2026-11-26', note: 'Growing strong!', from: 'Bagasse Courier Box' },
  { id: 2, name: 'Mint', stage: 1, days: 5, health: 78, lastWatered: '2026-11-25', note: 'Needs more water.', from: 'Banana Stem Box' },
]

export default function GardenPage() {
  const { plantsGrown, recordPlant } = useEco()
  const [plants, setPlants] = useState(INITIAL_PLANTS)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', from: '' })

  const water = (id) => {
    setPlants(ps => ps.map(p => p.id === id ? { ...p, lastWatered: new Date().toISOString().slice(0, 10), health: Math.min(100, p.health + 10) } : p))
  }

  const grow = (id) => {
    setPlants(ps => ps.map(p => p.id === id && p.stage < 3 ? { ...p, stage: p.stage + 1, days: p.days + 7 } : p))
  }

  const addPlant = (e) => {
    e.preventDefault()
    if (!form.name) return
    setPlants(ps => [...ps, { id: Date.now(), name: form.name, stage: 0, days: 0, health: 100, lastWatered: new Date().toISOString().slice(0, 10), note: 'Just planted!', from: form.from || 'LeafWrap Package' }])
    recordPlant()
    setForm({ name: '', from: '' })
    setAdding(false)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#2d6b56] to-[#4CAF50] text-white px-5 pt-10 pb-6">
        <h1 className="font-display text-2xl font-extrabold mb-1">My Garden 🌿</h1>
        <p className="text-green-100 text-sm">Track plants grown from your seed-embedded eco packaging.</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-medium">
          <Sprout size={12} /> {plants.length} plants growing
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {plants.map(plant => (
          <div key={plant.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#132E25]">{plant.name}</h3>
                <p className="text-xs text-gray-400">From: {plant.from}</p>
              </div>
              <span className="text-2xl">{PLANT_STAGES[plant.stage].split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all" style={{ width: `${plant.health}%` }} />
              </div>
              <span className="text-xs font-semibold text-green-700">{plant.health}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">{PLANT_STAGES[plant.stage]}</span>
              <span>· {plant.days} days old</span>
              <span>· Watered {plant.lastWatered}</span>
            </div>
            <p className="text-xs text-gray-500 italic mb-3">"{plant.note}"</p>
            <div className="flex gap-2">
              <button onClick={() => water(plant.id)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 rounded-xl py-2 text-xs font-semibold hover:bg-blue-100 transition-colors">
                <Droplets size={14} /> Water
              </button>
              {plant.stage < 3 && (
                <button onClick={() => grow(plant.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 rounded-xl py-2 text-xs font-semibold hover:bg-green-100 transition-colors">
                  <Sun size={14} /> Next Stage
                </button>
              )}
              {plant.stage === 3 && (
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 rounded-xl py-2 text-xs font-semibold">
                  <CheckCircle2 size={14} /> Flourishing!
                </div>
              )}
            </div>
          </div>
        ))}

        {adding ? (
          <form onSubmit={addPlant} className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
            <h3 className="font-semibold text-sm mb-3 text-[#132E25]">Add New Plant</h3>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Plant name (e.g. Coriander)" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20" />
            <input value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
              placeholder="LeafWrap package (optional)" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20" />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#1B4D3E] text-white rounded-xl py-2 text-sm font-semibold">Plant It 🌱</button>
              <button type="button" onClick={() => setAdding(false)} className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-2 text-sm font-semibold">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full border-2 border-dashed border-green-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium hover:border-green-400 transition-colors">
            <Plus size={18} /> Add Plant from Package
          </button>
        )}
      </div>
      <div className="h-6" />
    </div>
  )
}
