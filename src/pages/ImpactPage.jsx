import { useEco } from '../contexts/EcoContext'
import { TrendingUp, Leaf, Award, Car, Flame, Recycle } from 'lucide-react'

const milestones = [
  { label: 'First Scan', icon: '📦', achieved: true },
  { label: '5 Packs Scanned', icon: '🏅', achieved: false },
  { label: 'First Plant Grown', icon: '🌱', achieved: true },
  { label: '10kg CO₂ Saved', icon: '🌍', achieved: true },
  { label: 'Eco Champion', icon: '🏆', achieved: false },
]

const wasteData = [
  { type: 'Sugarcane Bagasse', percent: 30, color: '#4CAF50' },
  { type: 'Rice Straw', percent: 25, color: '#8BC34A' },
  { type: 'Areca Fronds', percent: 20, color: '#CDDC39' },
  { type: 'Banana Stem', percent: 15, color: '#FFC107' },
  { type: 'Other Residues', percent: 10, color: '#FF9800' },
]

export default function ImpactPage() {
  const { ecoCredits, co2Saved, packagesScanned, plantsGrown } = useEco()

  const carKm = (co2Saved * 6.5).toFixed(1)
  const treeYears = (co2Saved / 21.77).toFixed(2)
  const burnPrevented = (packagesScanned * 2.3).toFixed(1)

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white px-5 pt-10 pb-6">
        <h1 className="font-display text-2xl font-extrabold mb-1">Your Impact 🌍</h1>
        <p className="text-blue-100 text-sm">Track the real-world environmental difference you're making.</p>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* CO2 Impact */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-sm text-[#132E25] mb-4 flex items-center gap-2">
            <Leaf className="text-green-600" size={16} /> Carbon Reduction Impact
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="font-display font-bold text-xl text-green-700">{co2Saved}kg</p>
              <p className="text-xs text-green-600">CO₂ Saved</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <Car size={16} className="text-blue-600 mx-auto mb-1" />
              <p className="font-display font-bold text-sm text-blue-700">{carKm}km</p>
              <p className="text-xs text-blue-600">Car travel avoided</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <Leaf size={16} className="text-emerald-600 mx-auto mb-1" />
              <p className="font-display font-bold text-sm text-emerald-700">{treeYears}</p>
              <p className="text-xs text-emerald-600">Tree-years</p>
            </div>
          </div>
        </div>

        {/* Burn Prevented */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-sm text-[#132E25] mb-4 flex items-center gap-2">
            <Flame className="text-orange-500" size={16} /> Stubble Burn Prevented
          </h2>
          <div className="text-center py-2">
            <p className="font-display font-extrabold text-4xl text-orange-500 mb-1">{burnPrevented} kg</p>
            <p className="text-sm text-gray-500">of crop residue diverted from burning</p>
            <div className="mt-3 bg-orange-50 rounded-xl p-3">
              <p className="text-xs text-orange-700">Every LeafWrap package prevents ~2.3kg of agricultural waste from being burned in the field, reducing PM2.5 pollution in rural areas.</p>
            </div>
          </div>
        </div>

        {/* Waste composition */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-sm text-[#132E25] mb-4 flex items-center gap-2">
            <Recycle className="text-blue-600" size={16} /> Waste Material Mix
          </h2>
          <div className="space-y-2">
            {wasteData.map(w => (
              <div key={w.type}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{w.type}</span>
                  <span className="font-semibold">{w.percent}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${w.percent}%`, backgroundColor: w.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-sm text-[#132E25] mb-4 flex items-center gap-2">
            <Award className="text-amber-500" size={16} /> Milestones
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {milestones.map(m => (
              <div key={m.label} className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-xl mb-1 ${m.achieved ? 'bg-green-50' : 'bg-gray-50 opacity-40 grayscale'}`}>
                  {m.icon}
                </div>
                <p className="text-[9px] text-gray-500 leading-tight">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d6b56] rounded-2xl p-5 text-white">
          <p className="font-display font-bold text-base mb-3">Your Eco Summary</p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="font-display font-extrabold text-2xl">{packagesScanned}</p>
              <p className="text-xs text-green-200">Packages Scanned</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl">{plantsGrown}</p>
              <p className="text-xs text-green-200">Plants Nurtured</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl">{ecoCredits}</p>
              <p className="text-xs text-green-200">Eco Credits</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl">{co2Saved}kg</p>
              <p className="text-xs text-green-200">CO₂ Offset</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-6" />
    </div>
  )
}
