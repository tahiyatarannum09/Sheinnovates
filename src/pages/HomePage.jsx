import { useEco } from '../contexts/EcoContext'
import { Leaf, QrCode, Sprout, TrendingUp, Recycle, Award, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { ecoCredits, co2Saved, packagesScanned, plantsGrown } = useEco()

  const stats = [
    { label: 'Eco Credits', value: ecoCredits, suffix: '', icon: '🪙', gradient: 'from-amber-400 to-orange-400', bg: 'bg-amber-50', text: 'text-amber-700' },
    { label: 'CO₂ Saved', value: co2Saved, suffix: 'kg', icon: '🌍', gradient: 'from-blue-400 to-cyan-400', bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Packs Scanned', value: packagesScanned, suffix: '', icon: '📦', gradient: 'from-violet-400 to-purple-400', bg: 'bg-violet-50', text: 'text-violet-700' },
    { label: 'Plants Grown', value: plantsGrown, suffix: '', icon: '🌱', gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700' },
  ]

  const quickActions = [
    { label: 'Scan Pack', desc: 'Earn credits', to: '/scan', icon: QrCode, color: 'bg-[#1B4D3E]', textColor: 'text-white', emoji: '📦' },
    { label: 'My Garden', desc: 'Track plants', to: '/garden', icon: Sprout, color: 'bg-green-100', textColor: 'text-green-800', emoji: '🌿' },
    { label: 'Eco Market', desc: 'Shop & redeem', to: '/market', icon: Recycle, color: 'bg-amber-100', textColor: 'text-amber-800', emoji: '🛒' },
    { label: 'Impact', desc: 'Your footprint', to: '/impact', icon: TrendingUp, color: 'bg-blue-100', textColor: 'text-blue-800', emoji: '📊' },
  ]

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f3528] via-[#1B4D3E] to-[#2d7a5a] px-5 pt-14 pb-10">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-10 w-40 h-40 bg-emerald-300/15 rounded-full blur-2xl" />

        {/* Team badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
          <Sparkles size={10} className="text-green-300" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-green-200">She Innovates</span>
        </div>

        {/* Title */}
        <div className="flex items-end gap-3 mb-2">
          <div>
            <h1 className="font-display text-4xl font-black text-white leading-none tracking-tight">LeafWrap</h1>
            <p className="text-green-200 text-sm mt-1.5 leading-relaxed max-w-xs">
              Agricultural waste → smart eco packaging → scan, grow, earn
            </p>
          </div>
          <span className="text-4xl mb-1">🌿</span>
        </div>

        {/* Live dot */}
        <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-ring flex-shrink-0" />
          <span className="text-xs text-green-200 font-medium">Value Addition to Rural Waste • PS #8</span>
        </div>
      </div>

      {/* Floating stats */}
      <div className="px-4 -mt-5 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, suffix, icon, bg, text }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`${bg} w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <p className={`font-display font-black text-2xl leading-none stat-number ${text}`}>
                  {value}{suffix}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-5">
        <p className="section-title">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, desc, to, icon: Icon, color, textColor, emoji }) => (
            <Link
              key={to}
              to={to}
              className={`${color} ${textColor} rounded-3xl p-4 flex flex-col gap-2 active:scale-95 transition-all duration-150 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{emoji}</span>
                <ArrowRight size={14} className="opacity-60" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">{label}</p>
                <p className="text-xs opacity-70 font-medium">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mission card */}
      <div className="mx-4 mt-5 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f3528] to-[#1B4D3E] p-5 text-white">
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-green-400/15 rounded-full blur-2xl" />
          <div className="relative">
            <span className="text-xs font-bold tracking-widest uppercase text-green-300 mb-1 block">Our Mission</span>
            <h3 className="font-display font-bold text-lg mb-2 leading-snug">
              Turning Rural Waste<br/>into Worth 🌾
            </h3>
            <p className="text-xs text-green-100/80 leading-relaxed mb-4">
              Sugarcane bagasse, paddy straw & areca fronds transformed into seed-embedded biodegradable packaging — creating green economic value for rural communities.
            </p>
            <Link to="/waste-tracker"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-2xl px-4 py-2 text-xs font-semibold transition-colors">
              <Recycle size={12} /> Track Your Waste <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  )
}
