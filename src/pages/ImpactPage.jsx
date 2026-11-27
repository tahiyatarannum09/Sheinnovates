import { useEco } from '../contexts/EcoContext'
import { Flame, Award, Car, Leaf } from 'lucide-react'

const milestones = [
  { label: 'First Scan',      emoji: '📦', achieved: true  },
  { label: '5 Packs',         emoji: '🏅', achieved: false },
  { label: 'First Plant',     emoji: '🌱', achieved: true  },
  { label: '10kg CO₂',        emoji: '🌍', achieved: true  },
  { label: 'Eco Champion',    emoji: '🏆', achieved: false },
]

const wasteData = [
  { type: 'Sugarcane Bagasse', percent: 30, color: '#22c55e' },
  { type: 'Rice Straw',        percent: 25, color: '#16a34a' },
  { type: 'Areca Fronds',      percent: 20, color: '#15803d' },
  { type: 'Banana Stem',       percent: 15, color: '#4ade80' },
  { type: 'Other Residues',    percent: 10, color: '#86efac' },
]

function StatRing({ value, max, label, color, emoji }) {
  const pct = Math.min(100, (value / max) * 100)
  const r = 28, circ = 2 * Math.PI * r
  return (
    <div className="card p-4 flex flex-col items-center gap-2">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="text-center -mt-10 mb-2">
        <span className="text-xl">{emoji}</span>
      </div>
      <div className="text-center">
        <p className="font-display font-black text-lg text-[#132E25] leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function ImpactPage() {
  const { ecoCredits, co2Saved, packagesScanned, plantsGrown } = useEco()

  const carKm        = (co2Saved * 6.5).toFixed(1)
  const treeYears    = (co2Saved / 21.77).toFixed(2)
  const burnPrevented = (packagesScanned * 2.3).toFixed(1)

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#1a56a0] to-[#3b82f6] px-5 pt-14 pb-8">
        <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-blue-300/20 rounded-full blur-2xl" />
        <h1 className="font-display text-3xl font-black text-white mb-1">Your Impact 🌍</h1>
        <p className="text-blue-100 text-sm">The real-world difference you're making</p>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Ring stats */}
        <div className="grid grid-cols-4 gap-2">
          <StatRing value={packagesScanned} max={10}  label="Packs"   color="#22c55e" emoji="📦" />
          <StatRing value={plantsGrown}     max={10}  label="Plants"  color="#16a34a" emoji="🌱" />
          <StatRing value={ecoCredits}      max={500} label="Credits" color="#f59e0b" emoji="🪙" />
          <StatRing value={co2Saved}        max={50}  label="kg CO₂"  color="#3b82f6" emoji="💨" />
        </div>

        {/* CO2 breakdown */}
        <div className="card p-5">
          <p className="section-title flex items-center gap-2"><Leaf size={15} className="text-green-600" /> Carbon Reduction</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 rounded-2xl p-3">
              <p className="text-2xl font-display font-black text-green-700">{co2Saved}</p>
              <p className="text-xs text-green-600 font-medium">kg CO₂ saved</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-3">
              <Car size={16} className="text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-display font-black text-blue-700">{carKm}</p>
              <p className="text-xs text-blue-500 font-medium">km avoided</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3">
              <Leaf size={16} className="text-emerald-500 mx-auto mb-1" />
              <p className="text-lg font-display font-black text-emerald-700">{treeYears}</p>
              <p className="text-xs text-emerald-500 font-medium">tree-years</p>
            </div>
          </div>
        </div>

        {/* Burn prevented */}
        <div className="card p-5">
          <p className="section-title flex items-center gap-2"><Flame size={15} className="text-orange-500" /> Burn Prevented</p>
          <div className="text-center py-2">
            <p className="font-display font-black text-5xl text-orange-500 mb-1">{burnPrevented}<span className="text-2xl"> kg</span></p>
            <p className="text-sm text-gray-400">of crop residue diverted from burning</p>
            <div className="mt-3 bg-orange-50 rounded-2xl p-3 text-xs text-orange-700 leading-relaxed">
              Each LeafWrap unit prevents ~2.3 kg of agricultural waste from being burned, reducing PM2.5 pollution in rural areas.
            </div>
          </div>
        </div>

        {/* Waste composition */}
        <div className="card p-5">
          <p className="section-title">🌾 Waste Material Mix</p>
          <div className="space-y-3">
            {wasteData.map(w => (
              <div key={w.type}>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-gray-600">{w.type}</span>
                  <span className="font-bold" style={{ color: w.color }}>{w.percent}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w.percent}%`, backgroundColor: w.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="card p-5">
          <p className="section-title flex items-center gap-2"><Award size={15} className="text-amber-500" /> Milestones</p>
          <div className="flex justify-between">
            {milestones.map((m, i) => (
              <div key={m.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all ${
                  m.achieved ? 'bg-amber-50 shadow-sm shadow-amber-200 scale-105' : 'bg-gray-50 opacity-30 grayscale'}`}>
                  {m.emoji}
                </div>
                <p className="text-[9px] text-center text-gray-500 leading-tight font-medium">{m.label}</p>
                {m.achieved && <div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Summary banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f3528] to-[#1B4D3E] p-5 text-white">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'24px 24px'}} />
          <p className="font-display font-bold text-sm mb-3 text-green-200">🌿 Your Eco Summary</p>
          <div className="grid grid-cols-2 gap-3 text-center relative">
            {[
              [packagesScanned, 'Packages Scanned'],
              [plantsGrown,     'Plants Nurtured'],
              [ecoCredits,      'Eco Credits'],
              [`${co2Saved}kg`, 'CO₂ Offset'],
            ].map(([val, label]) => (
              <div key={label} className="bg-white/10 rounded-2xl p-3">
                <p className="font-display font-black text-2xl">{val}</p>
                <p className="text-xs text-green-200 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-24" />
    </div>
  )
}
