import { useEco } from '../contexts/EcoContext'
import { Flame, Award, Car, Leaf } from 'lucide-react'
import LeafWrapLogo from '../components/ui/AgriLoopLogo'

const milestones = [
  { label: 'First Scan',   emoji: '📦', achieved: true  },
  { label: '5 Packs',      emoji: '🏅', achieved: false },
  { label: 'First Plant',  emoji: '🌱', achieved: true  },
  { label: '10kg CO₂',     emoji: '🌍', achieved: true  },
  { label: 'Eco Champion', emoji: '🏆', achieved: false },
]

const wasteData = [
  { type: 'Sugarcane Bagasse', percent: 30, color: '#22c55e' },
  { type: 'Rice Straw',        percent: 25, color: '#16a34a' },
  { type: 'Areca Fronds',      percent: 20, color: '#15803d' },
  { type: 'Banana Stem',       percent: 15, color: '#4ade80' },
  { type: 'Other Residues',    percent: 10, color: '#86efac' },
]

function Earth3D() {
  return (
    <div className="relative flex items-center justify-center py-2">
      {/* Atmosphere */}
      <div className="earth-glow" />
      {/* Planet */}
      <div className="earth-3d z-10">
        {/* Continents overlay */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '35%', height: '40%',
          background: 'rgba(74,222,128,0.3)',
          borderRadius: '40% 60% 55% 45% / 50% 40% 60% 50%',
          filter: 'blur(2px)'
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '55%',
          width: '30%', height: '30%',
          background: 'rgba(34,197,94,0.25)',
          borderRadius: '60% 40% 50% 50% / 40% 60% 40% 60%',
          filter: 'blur(2px)'
        }} />
      </div>
    </div>
  )
}

function StatRing({ value, max, label, color, emoji }) {
  const pct = Math.min(100, (value / max) * 100)
  const r = 28, circ = 2 * Math.PI * r
  return (
    <div className="card card-3d p-4 flex flex-col items-center gap-1">
      <div className="relative">
        <svg width="72" height="72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl">{emoji}</span>
      </div>
      <p className="font-display font-black text-base text-[#132E25] leading-none">{value}</p>
      <p className="text-[10px] text-gray-400 text-center font-medium">{label}</p>
    </div>
  )
}

export default function ImpactPage() {
  const { ecoCredits, co2Saved, packagesScanned, plantsGrown } = useEco()
  const carKm         = (co2Saved * 6.5).toFixed(1)
  const treeYears     = (co2Saved / 21.77).toFixed(2)
  const burnPrevented = (packagesScanned * 2.3).toFixed(1)

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header with 3D Earth */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-[#1e3a5f] to-[#1a56a0] px-5 pt-10 pb-4">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 mb-2">
          <LeafWrapLogo size={30} />
          <div>
            <h1 className="font-display text-2xl font-black text-white leading-none">Your Impact</h1>
            <p className="text-blue-200 text-xs mt-0.5">Real-world environmental difference</p>
          </div>
        </div>

        {/* 3D Earth */}
        <Earth3D />

        <div className="text-center -mt-1 pb-2">
          <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1 text-xs text-green-200 font-medium">
            🌱 {co2Saved}kg CO₂ saved so far
          </span>
        </div>
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
              <p className="text-xs text-green-600 font-medium">kg CO₂</p>
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
                  <div className="h-full rounded-full" style={{ width: `${w.percent}%`, backgroundColor: w.color, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="card p-5">
          <p className="section-title flex items-center gap-2"><Award size={15} className="text-amber-500" /> Milestones</p>
          <div className="flex justify-between">
            {milestones.map(m => (
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
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="flex items-center gap-2 mb-3">
            <LeafWrapLogo size={24} />
            <p className="font-display font-bold text-sm text-green-200">Eco Summary</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center relative">
            {[[packagesScanned,'Packages Scanned'],[plantsGrown,'Plants Nurtured'],[ecoCredits,'Eco Credits'],[`${co2Saved}kg`,'CO₂ Offset']].map(([val, label]) => (
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
