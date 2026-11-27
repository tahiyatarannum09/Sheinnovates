import { useEco } from '../contexts/EcoContext'
import { ArrowRight, Recycle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import LeafWrapLogo from '../components/ui/LeafWrapLogo'

function Leaf3D() {
  return (
    <div className="scene-3d flex items-center justify-center">
      <div className="leaf-3d-wrapper">
        <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
          {/* Shadow */}
          <ellipse cx="65" cy="118" rx="35" ry="6" fill="rgba(0,0,0,0.18)" />

          {/* Main leaf body */}
          <path
            d="M65 10 C65 10, 108 28, 108 65 C108 92 90 108 65 112 C65 112 65 68 38 55 C26 50 22 38 28 30 C38 18 65 10 65 10Z"
            fill="url(#leaf3dGrad)"
          />
          {/* Highlight sheen */}
          <path
            d="M65 10 C65 10, 90 22, 100 45 C88 32 72 25 65 10Z"
            fill="rgba(255,255,255,0.3)"
          />
          {/* Vein */}
          <path d="M65 110 C65 110 65 55 48 36" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M60 85 C55 78 46 76 42 76" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M63 70 C57 61 50 58 46 58" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M65 54 C61 44 56 38 53 34" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>

          {/* Small sparkle dots */}
          <circle cx="90" cy="38" r="3" fill="rgba(255,255,255,0.6)" />
          <circle cx="98" cy="55" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="85" cy="28" r="1.5" fill="rgba(255,255,255,0.5)" />

          <defs>
            <radialGradient id="leaf3dGrad" cx="60%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="80%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { ecoCredits, co2Saved, packagesScanned, plantsGrown } = useEco()

  const stats = [
    { label: 'Eco Credits',   value: ecoCredits,     suffix: '',   emoji: '🪙', bg: 'bg-amber-50',   text: 'text-amber-700'   },
    { label: 'CO₂ Saved',     value: co2Saved,       suffix: 'kg', emoji: '🌍', bg: 'bg-blue-50',    text: 'text-blue-700'    },
    { label: 'Packs Scanned', value: packagesScanned, suffix: '',  emoji: '📦', bg: 'bg-violet-50',  text: 'text-violet-700'  },
    { label: 'Plants Grown',  value: plantsGrown,    suffix: '',   emoji: '🌱', bg: 'bg-green-50',   text: 'text-green-700'   },
  ]

  const quickActions = [
    { label: 'Scan Pack',  desc: 'Earn credits',  to: '/scan',          color: 'bg-[#1B4D3E]',  textColor: 'text-white',      emoji: '📦' },
    { label: 'My Garden',  desc: 'Track plants',  to: '/garden',        color: 'bg-green-100',  textColor: 'text-green-800',  emoji: '🌿' },
    { label: 'Eco Market', desc: 'Shop & redeem', to: '/market',        color: 'bg-amber-100',  textColor: 'text-amber-800',  emoji: '🛒' },
    { label: 'Impact',     desc: 'Your footprint',to: '/impact',        color: 'bg-blue-100',   textColor: 'text-blue-800',   emoji: '📊' },
  ]

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* ── Hero with 3D leaf ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#071f14] via-[#0f3528] to-[#1B4D3E] px-5 pt-10 pb-6">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Orbit ring decoration */}
        <div className="absolute top-6 right-6 w-40 h-40 opacity-30">
          <div className="orbit-ring"><div className="orbit-dot" /></div>
        </div>

        {/* Logo + team */}
        <div className="relative flex items-center justify-between mb-4">
          <LeafWrapLogo size={42} showText={true} />
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
            <Sparkles size={9} className="text-green-300" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-green-200">She Innovates</span>
          </div>
        </div>

        {/* 3D Leaf + text side by side */}
        <div className="relative flex items-center gap-4 mb-5">
          <div className="flex-1">
            <h2 className="font-display text-2xl font-black text-white leading-tight mb-2">
              Waste becomes<br/>
              <span className="text-green-300">living packaging</span> 🌾
            </h2>
            <p className="text-green-200/80 text-xs leading-relaxed">
              Agricultural residues → smart seed-embedded eco packaging → scan, grow & earn
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-ring flex-shrink-0" />
              <span className="text-xs text-green-200 font-medium">PS #8 · Rural Waste</span>
            </div>
          </div>
          {/* 3D Leaf */}
          <div className="flex-shrink-0 -mr-2">
            <Leaf3D />
          </div>
        </div>
      </div>

      {/* ── Floating stats ── */}
      <div className="px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, suffix, emoji, bg, text }) => (
            <div key={label} className="card card-3d p-4 flex items-center gap-3">
              <div className={`${bg} w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>
                {emoji}
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

      {/* ── Quick actions ── */}
      <div className="px-4 mt-5">
        <p className="section-title">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, desc, to, color, textColor, emoji }) => (
            <Link key={to} to={to}
              className={`${color} ${textColor} rounded-3xl p-4 flex flex-col gap-2 active:scale-95 transition-all duration-150 shadow-sm card-3d`}>
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

      {/* ── Mission card ── */}
      <div className="mx-4 mt-5 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071f14] to-[#1B4D3E] p-5 text-white">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <span className="text-xs font-bold tracking-widest uppercase text-green-300 mb-1 block">Our Mission</span>
            <h3 className="font-display font-bold text-lg mb-2 leading-snug">
              Turning Rural Waste<br/>into Worth 🌾
            </h3>
            <p className="text-xs text-green-100/80 leading-relaxed mb-4">
              Sugarcane bagasse, paddy straw & areca fronds transformed into seed-embedded biodegradable packaging — creating green economic value.
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
