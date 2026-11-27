import { useEco } from '../contexts/EcoContext'
import { Leaf, QrCode, Sprout, TrendingUp, Recycle, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { ecoCredits, co2Saved, packagesScanned, plantsGrown } = useEco()

  const stats = [
    { label: 'Eco Credits', value: ecoCredits, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'CO₂ Saved (kg)', value: co2Saved, icon: TrendingUp, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Packs Scanned', value: packagesScanned, icon: QrCode, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Plants Grown', value: plantsGrown, icon: Sprout, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  ]

  const quickActions = [
    { label: 'Scan Pack', to: '/scan', icon: QrCode, color: 'bg-[#1B4D3E] text-white' },
    { label: 'My Garden', to: '/garden', icon: Sprout, color: 'bg-green-100 text-green-800' },
    { label: 'Eco Market', to: '/market', icon: Recycle, color: 'bg-amber-100 text-amber-800' },
    { label: 'Impact', to: '/impact', icon: TrendingUp, color: 'bg-blue-100 text-blue-800' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1B4D3E] via-[#2d6b56] to-[#4CAF50] text-white px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <Leaf key={i} className={`absolute text-white w-16 h-16`}
              style={{ top: `${10 + i * 15}%`, left: `${i % 2 === 0 ? 70 + i * 3 : -5 + i}%`, transform: `rotate(${i * 30}deg)`, opacity: 0.3 }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-green-200">She Innovates</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight mb-1">LeafWrap 🌿</h1>
          <p className="text-green-100 text-sm leading-relaxed mb-4">
            Turning rural agricultural waste into smart, seed-embedded eco packaging — scan, grow, and earn rewards.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
            Value Addition to Rural Waste
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 -mt-5">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3">
              <div className={`${bg} p-2.5 rounded-xl`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="font-display font-bold text-xl text-[#132E25]">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-5">
        <h2 className="font-display font-bold text-base text-[#132E25] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, to, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className={`${color} rounded-2xl p-4 flex items-center gap-3 font-semibold text-sm shadow-sm transition-transform active:scale-95`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Problem statement banner */}
      <div className="mx-4 mt-5 rounded-2xl bg-gradient-to-r from-green-800 to-[#1B4D3E] p-4 text-white">
        <p className="text-xs font-semibold text-green-300 mb-1 uppercase tracking-wider">Our Mission</p>
        <h3 className="font-display font-bold text-sm mb-2">Value Addition to Rural Waste</h3>
        <p className="text-xs text-green-100 leading-relaxed">
          Converting agricultural residues, organic waste, and plastics from rural areas into reusable
          seed-embedded packaging, organic fertilizers, and recycled materials — creating economic value
          and preventing environmental pollution.
        </p>
        <Link to="/waste-tracker" className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/30 transition-colors">
          <Recycle size={12} /> Track Waste →
        </Link>
      </div>

      {/* Spacer for nav */}
      <div className="h-6" />
    </div>
  )
}
