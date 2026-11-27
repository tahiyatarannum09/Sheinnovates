import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { Recycle, Plus, Leaf, Award, TrendingUp, Trash2 } from 'lucide-react'

const WASTE_TYPES = [
  { type: 'Agricultural Residue', icon: '🌾', ratePerKg: 8, tip: 'Rice straw, wheat stubble, crop residues' },
  { type: 'Organic Waste', icon: '🍃', ratePerKg: 8, tip: 'Food scraps, garden waste, compostables' },
  { type: 'Plastic Waste', icon: '♻️', ratePerKg: 14, tip: 'PET bottles, packaging films, single-use plastics' },
  { type: 'Paper & Cardboard', icon: '📦', ratePerKg: 6, tip: 'Boxes, newspapers, office paper' },
  { type: 'Textile Waste', icon: '🧵', ratePerKg: 10, tip: 'Handloom cuttings, cotton stalks' },
  { type: 'E-Waste', icon: '💡', ratePerKg: 20, tip: 'Old electronics, batteries, cables' },
]

const STATUS_COLORS = {
  Processed: 'bg-green-100 text-green-700',
  Composted: 'bg-emerald-100 text-emerald-700',
  Recycled: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
}

export default function WasteTrackerPage() {
  const { wasteEntries, addWasteEntry } = useEco()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ type: '', kg: '', status: 'Processed' })

  const totalKg = wasteEntries.reduce((s, e) => s + e.kg, 0).toFixed(1)
  const totalValue = wasteEntries.reduce((s, e) => s + e.value, 0)
  const totalCredits = wasteEntries.reduce((s, e) => s + (e.value || 0), 0)

  const selectedType = WASTE_TYPES.find(t => t.type === form.type)
  const estimatedCredits = form.kg && selectedType ? Math.round(parseFloat(form.kg) * selectedType.ratePerKg) : 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.type || !form.kg) return
    addWasteEntry({
      type: form.type,
      kg: parseFloat(form.kg),
      value: estimatedCredits,
      status: form.status,
    })
    setForm({ type: '', kg: '', status: 'Processed' })
    setAdding(false)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-teal-800 to-teal-600 text-white px-5 pt-10 pb-6">
        <h1 className="font-display text-2xl font-extrabold mb-1">Waste Tracker ♻️</h1>
        <p className="text-teal-100 text-sm">Log rural waste you've diverted, converted, or composted for Eco Credits.</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/15 rounded-xl p-2 text-center">
            <p className="font-display font-bold text-lg">{totalKg}kg</p>
            <p className="text-xs text-teal-100">Total Waste</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2 text-center">
            <p className="font-display font-bold text-lg">₹{totalValue}</p>
            <p className="text-xs text-teal-100">Value Created</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2 text-center">
            <Award size={14} className="mx-auto mb-0.5" />
            <p className="font-display font-bold text-lg">{totalCredits}</p>
            <p className="text-xs text-teal-100">Credits Earned</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Waste type guide */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-sm text-[#132E25] mb-3">Waste Value Guide</h2>
          <div className="grid grid-cols-2 gap-2">
            {WASTE_TYPES.map(w => (
              <div key={w.type} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                <span className="text-lg">{w.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#132E25] truncate">{w.type}</p>
                  <p className="text-xs text-teal-600 font-medium">{w.ratePerKg} credits/kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Log new waste */}
        {adding ? (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl p-4 shadow-sm border border-teal-100">
            <h3 className="font-semibold text-sm mb-3 text-[#132E25]">Log Waste Entry</h3>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400/30 bg-white">
              <option value="">Select waste type...</option>
              {WASTE_TYPES.map(w => <option key={w.type} value={w.type}>{w.icon} {w.type}</option>)}
            </select>
            {selectedType && <p className="text-xs text-gray-400 mb-2 italic">{selectedType.tip}</p>}
            <input type="number" step="0.1" min="0.1" value={form.kg} onChange={e => setForm(f => ({ ...f, kg: e.target.value }))}
              placeholder="Weight in kg (e.g. 2.5)" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400/30" />
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal-400/30 bg-white">
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {estimatedCredits > 0 && (
              <div className="bg-teal-50 rounded-xl p-2 mb-3 text-center">
                <p className="text-xs text-teal-700">You'll earn <span className="font-bold">{estimatedCredits} Eco Credits</span></p>
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-teal-700 text-white rounded-xl py-2 text-sm font-semibold">Log Entry ✅</button>
              <button type="button" onClick={() => setAdding(false)} className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-2 text-sm font-semibold">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full border-2 border-dashed border-teal-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm text-teal-600 font-medium hover:border-teal-400 transition-colors">
            <Plus size={18} /> Log New Waste Entry
          </button>
        )}

        {/* Entries list */}
        <div className="space-y-3">
          {wasteEntries.map(e => (
            <div key={e.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#132E25] mb-1">{e.type}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{e.kg}kg</span>
                  <span>· {e.date}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[e.status] || STATUS_COLORS.Pending}`}>{e.status}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display font-bold text-sm text-teal-700">+{e.value}</p>
                <p className="text-xs text-gray-400">credits</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-6" />
    </div>
  )
}
