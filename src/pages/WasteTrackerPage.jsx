import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { Plus, Award, TrendingUp } from 'lucide-react'

const WASTE_TYPES = [
  { type: 'Agricultural Residue', icon: '🌾', ratePerKg: 8,  tip: 'Rice straw, wheat stubble, crop residues' },
  { type: 'Organic Waste',        icon: '🍃', ratePerKg: 8,  tip: 'Food scraps, garden waste, compostables'  },
  { type: 'Plastic Waste',        icon: '♻️', ratePerKg: 14, tip: 'PET bottles, packaging films'              },
  { type: 'Paper & Cardboard',    icon: '📦', ratePerKg: 6,  tip: 'Boxes, newspapers, office paper'          },
  { type: 'Textile Waste',        icon: '🧵', ratePerKg: 10, tip: 'Handloom cuttings, cotton stalks'         },
  { type: 'E-Waste',              icon: '💡', ratePerKg: 20, tip: 'Old electronics, batteries, cables'       },
]

const STATUS = {
  Processed: { bg: 'bg-green-100',  text: 'text-green-700'  },
  Composted: { bg: 'bg-emerald-100',text: 'text-emerald-700'},
  Recycled:  { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  Pending:   { bg: 'bg-amber-100',  text: 'text-amber-700'  },
}

export default function WasteTrackerPage() {
  const { wasteEntries, addWasteEntry } = useEco()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ type: '', kg: '', status: 'Processed' })

  const totalKg      = wasteEntries.reduce((s, e) => s + e.kg, 0).toFixed(1)
  const totalValue   = wasteEntries.reduce((s, e) => s + e.value, 0)
  const totalCredits = wasteEntries.reduce((s, e) => s + (e.value || 0), 0)

  const selectedType   = WASTE_TYPES.find(t => t.type === form.type)
  const estimatedCred  = form.kg && selectedType ? Math.round(parseFloat(form.kg) * selectedType.ratePerKg) : 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.type || !form.kg) return
    addWasteEntry({ type: form.type, kg: parseFloat(form.kg), value: estimatedCred, status: form.status })
    setForm({ type: '', kg: '', status: 'Processed' })
    setAdding(false)
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#134e4a] via-[#0f766e] to-[#14b8a6] px-5 pt-14 pb-8">
        <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-teal-300/20 rounded-full blur-2xl" />
        <h1 className="font-display text-3xl font-black text-white mb-1">Waste Tracker ♻️</h1>
        <p className="text-teal-100 text-sm">Log rural waste you've diverted, converted or composted</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Total Waste', value: `${totalKg}kg`, emoji: '🗑️' },
            { label: 'Value Created', value: `₹${totalValue}`, emoji: '💰' },
            { label: 'Credits Earned', value: totalCredits, emoji: '🪙' },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="bg-white/15 border border-white/20 rounded-2xl p-2.5 text-center">
              <p className="text-base">{emoji}</p>
              <p className="font-display font-black text-base text-white leading-tight">{value}</p>
              <p className="text-[10px] text-teal-100 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Value guide */}
        <div className="card p-4">
          <p className="section-title">💡 Waste Value Guide</p>
          <div className="grid grid-cols-2 gap-2">
            {WASTE_TYPES.map(w => (
              <div key={w.type} className="flex items-center gap-2 bg-gray-50 rounded-2xl p-3">
                <span className="text-xl flex-shrink-0">{w.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#132E25] truncate">{w.type}</p>
                  <p className="text-xs text-teal-600 font-bold">{w.ratePerKg} cr/kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add entry */}
        {adding ? (
          <form onSubmit={handleAdd} className="card p-5">
            <p className="font-display font-bold text-sm mb-4 text-[#132E25]">📋 Log Waste Entry</p>

            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-teal-500 rounded-2xl px-4 py-3 text-sm mb-2 focus:outline-none transition-colors appearance-none">
              <option value="">Select waste type...</option>
              {WASTE_TYPES.map(w => <option key={w.type} value={w.type}>{w.icon} {w.type}</option>)}
            </select>

            {selectedType && (
              <p className="text-xs text-gray-400 italic mb-2 px-1">{selectedType.tip}</p>
            )}

            <input type="number" step="0.1" min="0.1" value={form.kg}
              onChange={e => setForm(f => ({ ...f, kg: e.target.value }))}
              placeholder="Weight in kg (e.g. 2.5)"
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-teal-500 rounded-2xl px-4 py-3 text-sm mb-2 focus:outline-none transition-colors" />

            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-teal-500 rounded-2xl px-4 py-3 text-sm mb-3 focus:outline-none transition-colors appearance-none">
              {Object.keys(STATUS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {estimatedCred > 0 && (
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-3 mb-3 flex items-center justify-between">
                <span className="text-xs text-teal-700 font-medium">You'll earn</span>
                <span className="font-display font-black text-teal-700 flex items-center gap-1">
                  <Award size={14} /> {estimatedCred} Credits
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3 text-sm font-bold active:scale-95 transition-all shadow-sm">
                Log Entry ✅
              </button>
              <button type="button" onClick={() => setAdding(false)} className="flex-1 btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full border-2 border-dashed border-teal-200 hover:border-teal-400 hover:bg-teal-50/50 rounded-3xl py-5 flex items-center justify-center gap-2 text-sm text-teal-600 font-semibold transition-all">
            <Plus size={18} /> Log New Waste Entry
          </button>
        )}

        {/* Entries */}
        <div className="space-y-3">
          <p className="section-title flex items-center gap-2"><TrendingUp size={14} className="text-teal-600" /> Recent Entries</p>
          {wasteEntries.map(e => {
            const s = STATUS[e.status] || STATUS.Pending
            const wt = WASTE_TYPES.find(w => w.type === e.type)
            return (
              <div key={e.id} className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-lg flex-shrink-0">
                  {wt?.icon || '🗑️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#132E25] truncate">{e.type}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{e.kg}kg · {e.date}</span>
                    <span className={`badge ${s.bg} ${s.text}`}>{e.status}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-black text-base text-teal-600">+{e.value}</p>
                  <p className="text-[10px] text-gray-400">credits</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="h-24" />
    </div>
  )
}
