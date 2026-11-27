import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { Droplets, Sun, CheckCircle2, Plus, Leaf, Calendar } from 'lucide-react'

const STAGES = [
  { label: 'Seed',        emoji: '🌰', color: 'bg-stone-100',   text: 'text-stone-600'   },
  { label: 'Sprout',      emoji: '🌱', color: 'bg-green-100',   text: 'text-green-700'   },
  { label: 'Young Plant', emoji: '🌿', color: 'bg-emerald-100', text: 'text-emerald-700' },
  { label: 'Flourishing', emoji: '🌳', color: 'bg-teal-100',    text: 'text-teal-700'    },
]

const INITIAL_PLANTS = [
  { id: 1, name: 'Basil', stage: 2, days: 14, health: 92, lastWatered: '2026-11-26', from: 'Bagasse Courier Box' },
  { id: 2, name: 'Mint',  stage: 1, days: 5,  health: 72, lastWatered: '2026-11-25', from: 'Banana Stem Box' },
]

function HealthBar({ value }) {
  const color = value > 80 ? 'from-green-400 to-emerald-500'
              : value > 50 ? 'from-yellow-400 to-amber-400'
              : 'from-red-400 to-rose-400'
  return (
    <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  )
}

export default function GardenPage() {
  const { recordPlant } = useEco()
  const [plants, setPlants] = useState(INITIAL_PLANTS)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', from: '' })

  const water = (id) => setPlants(ps => ps.map(p =>
    p.id === id ? { ...p, lastWatered: new Date().toISOString().slice(0,10), health: Math.min(100, p.health + 12) } : p))

  const grow = (id) => setPlants(ps => ps.map(p =>
    p.id === id && p.stage < 3 ? { ...p, stage: p.stage + 1, days: p.days + 7 } : p))

  const addPlant = (e) => {
    e.preventDefault()
    if (!form.name) return
    setPlants(ps => [...ps, { id: Date.now(), name: form.name, stage: 0, days: 0, health: 100, lastWatered: new Date().toISOString().slice(0,10), from: form.from || 'LeafWrap Package' }])
    recordPlant()
    setForm({ name: '', from: '' })
    setAdding(false)
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#134e1b] via-[#1e7a35] to-[#4CAF50] px-5 pt-14 pb-8">
        <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-green-300/20 rounded-full blur-2xl" />
        <h1 className="font-display text-3xl font-black text-white mb-1">My Garden 🌿</h1>
        <p className="text-green-100 text-sm">Plants grown from your seed-embedded packaging</p>
        <div className="mt-3 flex gap-2">
          <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
            🌱 {plants.length} growing
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
            🌳 {plants.filter(p => p.stage === 3).length} flourishing
          </div>
        </div>
      </div>

      {/* Stage guide */}
      <div className="px-4 mt-4">
        <div className="card p-3 flex justify-between">
          {STAGES.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center text-base`}>{s.emoji}</div>
              <span className={`text-[9px] font-semibold ${s.text}`}>{s.label}</span>
              {i < STAGES.length - 1 && <div className="absolute" />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {plants.map(plant => {
          const stage = STAGES[plant.stage]
          return (
            <div key={plant.id} className="card p-5">
              {/* Plant header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${stage.color} rounded-2xl flex items-center justify-center text-2xl`}>
                    {stage.emoji}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#132E25]">{plant.name}</h3>
                    <p className="text-xs text-gray-400">{plant.from}</p>
                  </div>
                </div>
                <div className={`badge ${stage.color} ${stage.text}`}>{stage.label}</div>
              </div>

              {/* Health */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400 font-medium flex items-center gap-1"><Leaf size={10} /> Health</span>
                  <span className={`font-bold ${stage.text}`}>{plant.health}%</span>
                </div>
                <HealthBar value={plant.health} />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Calendar size={10} /> {plant.days} days old</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Droplets size={10} /> {plant.lastWatered}</span>
              </div>

              {/* Stage progress */}
              <div className="flex gap-1 mb-4">
                {STAGES.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= plant.stage ? 'bg-green-400' : 'bg-gray-100'}`} />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => water(plant.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl py-2.5 text-xs font-semibold transition-colors active:scale-95">
                  <Droplets size={13} /> Water
                </button>
                {plant.stage < 3 ? (
                  <button onClick={() => grow(plant.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-2xl py-2.5 text-xs font-semibold transition-colors active:scale-95">
                    <Sun size={13} /> Next Stage
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-teal-50 text-teal-700 rounded-2xl py-2.5 text-xs font-semibold">
                    <CheckCircle2 size={13} /> Flourishing! 🎉
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Add plant */}
        {adding ? (
          <form onSubmit={addPlant} className="card p-5">
            <h3 className="font-display font-bold text-sm mb-4 text-[#132E25]">🌱 Add New Plant</h3>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Plant name (e.g. Coriander)" className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl px-4 py-3 text-sm mb-3 focus:outline-none transition-colors" />
            <input value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
              placeholder="LeafWrap package (optional)" className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl px-4 py-3 text-sm mb-4 focus:outline-none transition-colors" />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">Plant It 🌱</button>
              <button type="button" onClick={() => setAdding(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50/50 rounded-3xl py-5 flex items-center justify-center gap-2 text-sm text-green-600 font-semibold transition-all">
            <Plus size={18} /> Add Plant from Package
          </button>
        )}
      </div>
      <div className="h-24" />
    </div>
  )
}
