import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { Award, CheckCircle2, ShoppingCart, Tag, Package, Leaf } from 'lucide-react'
import LeafWrapLogo from '../components/ui/LeafWrapLogo'

const PRODUCTS = [
  // A-series — Large containers
  {
    id: 'A1', name: 'Large Biodegradable Container A1',
    price: 3, priceRange: '₹2–3', credits: 5,
    dims: '4.8 × 11.9 × 0.2 cm', weight: '54g',
    material: 'Sugarcane bagasse + binding agents',
    desc: 'Flat tray-style container, ideal for food stalls & QSR packaging',
    emoji: '🫙', badge: 'Bestseller', badgeColor: 'bg-green-100 text-green-700', series: 'A',
  },
  {
    id: 'A2', name: 'Large Biodegradable Container A2',
    price: 3, priceRange: '₹2–3', credits: 5,
    dims: '5.7 × 9.0 × 0.2 cm', weight: '37g',
    material: 'Rice straw + starch binder',
    desc: 'Compact flat container, compostable in 30–45 days',
    emoji: '🫙', badge: null, badgeColor: '', series: 'A',
  },
  // B-series — Bowls
  {
    id: 'B1', name: 'Bowl-Shaped Package B1',
    price: 2, priceRange: '₹1–2', credits: 4,
    dims: '2.7 × 9.5 × 0.3 cm', weight: '24g',
    material: 'Areca fronds + xanthan gum',
    desc: 'Deep bowl prototype for street food & events, fully biodegradable',
    emoji: '🥣', badge: 'Eco Choice', badgeColor: 'bg-teal-100 text-teal-700', series: 'B',
  },
  {
    id: 'B2', name: 'Bowl-Shaped Package B2',
    price: 2, priceRange: '₹1–2', credits: 4,
    dims: '3.3 × 7.8 × 0.3 cm', weight: '43g',
    material: 'Sugarcane bagasse + gum acacia',
    desc: 'Medium bowl for single-serve meals, home-compostable',
    emoji: '🥣', badge: null, badgeColor: '', series: 'B',
  },
  {
    id: 'B3', name: 'Bowl-Shaped Package B3',
    price: 2, priceRange: '₹1–2', credits: 4,
    dims: '2.5 × 6.7 × 0.5 cm', weight: '27g',
    material: 'Rice straw + mycelium composite',
    desc: 'Small bowl prototype, decomposes into nutrient-rich soil',
    emoji: '🥣', badge: 'New', badgeColor: 'bg-blue-100 text-blue-700', series: 'B',
  },
  // C-series — Small cups
  {
    id: 'C1', name: 'Small Formed Cup C1',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '5.0 × 5.1 × 0.2 cm', weight: '18g',
    material: 'Agricultural bran + starch',
    desc: 'Mini cup for condiments & chai, breaks down in kitchen compost in 30 days',
    emoji: '🥤', badge: 'Most Affordable', badgeColor: 'bg-amber-100 text-amber-700', series: 'C',
  },
  {
    id: 'C2', name: 'Small Formed Cup C2',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '3.8 × 6.0 × 0.3 cm', weight: '1.67g',
    material: 'Paddy straw + binding agent',
    desc: 'Lightweight shot-size cup, perfect for sampling & events',
    emoji: '🥤', badge: null, badgeColor: '', series: 'C',
  },
  {
    id: 'C3', name: 'Small Formed Cup C3',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '3.8 × 6.0 × 0.3 cm', weight: '1.67g',
    material: 'Corn residue + xanthan gum',
    desc: 'Corn waste-derived single-use cup — zero-burn circular model',
    emoji: '🌽', badge: null, badgeColor: '', series: 'C',
  },
  {
    id: 'C4', name: 'Small Formed Cup C4',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '3.8 × 6.0 × 0.3 cm', weight: '1.67g',
    material: 'Mixed agricultural residues',
    desc: 'Multi-residue blend prototype — the most sustainable in the lineup',
    emoji: '♻️', badge: 'Eco Max', badgeColor: 'bg-green-100 text-green-700', series: 'C',
  },
]

const SERIES = [
  { key: 'all', label: 'All (9)' },
  { key: 'A',   label: '🫙 A — Trays' },
  { key: 'B',   label: '🥣 B — Bowls' },
  { key: 'C',   label: '🥤 C — Cups' },
]

const COUPONS = [
  { id: 1, label: '₹10 Off on Bulk Bowls',      cost: 50,  code: 'BOWL-BULK-10', emoji: '🥣' },
  { id: 2, label: '₹25 Off on Any 20+ Units',   cost: 100, code: 'BULK-20-25',   emoji: '📦' },
  { id: 3, label: '₹50 Off Full Prototype Set',  cost: 200, code: 'PROTO-SET-50', emoji: '🏆' },
]

export default function MarketPage() {
  const { ecoCredits, spendCredits } = useEco()
  const [cart, setCart] = useState([])
  const [redeemed, setRedeemed] = useState(null)
  const [tab, setTab] = useState('shop')
  const [series, setSeries] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const addToCart = (p) => setCart(c => {
    const ex = c.find(i => i.id === p.id)
    return ex ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }]
  })
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const filtered = series === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.series === series)

  const redeemCoupon = (c) => {
    if (ecoCredits >= c.cost) { spendCredits(c.cost); setRedeemed(c) }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#78350f] via-[#b45309] to-[#f59e0b] px-5 pt-10 pb-6">
        <div className="absolute -top-6 -right-6 w-36 h-36 bg-yellow-300/20 rounded-full blur-2xl" />
        <div className="flex items-center gap-3 mb-2">
          <LeafWrapLogo size={30} />
          <div>
            <h1 className="font-display text-2xl font-black text-white leading-none">Eco Market 🛒</h1>
            <p className="text-amber-100 text-xs mt-0.5">Our 9 biodegradable packaging prototypes</p>
          </div>
        </div>

        {/* Cost callout */}
        <div className="mt-3 bg-white/15 border border-white/20 rounded-2xl p-3">
          <p className="text-xs font-bold text-white mb-1">💰 Total Cost per Cup ≈ ₹0.75–1 &nbsp;·&nbsp; Profit Margin ~50–100%</p>
          <p className="text-[10px] text-amber-100">Raw material sourced from farmers free of cost · Locally made · Scalable production</p>
        </div>

        <div className="flex gap-2 mt-3">
          <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
            🪙 {ecoCredits} Credits
          </div>
          {cartCount > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
              <ShoppingCart size={11} /> {cartCount} units · ₹{cartTotal}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="card p-1 flex">
          {[['shop', '🛍️ Products'], ['redeem', '🎁 Redeem']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-200 ${tab === t ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-gray-400'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {tab === 'shop' && (
          <>
            {/* Series filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
              {SERIES.map(s => (
                <button key={s.key} onClick={() => setSeries(s.key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                    series === s.key ? 'bg-[#1B4D3E] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-100'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[['9', 'Prototypes'], ['208g', 'Total Wt.'], ['₹8–15', 'Set Price']].map(([v, l]) => (
                <div key={l} className="card p-3 text-center">
                  <p className="font-display font-black text-base text-[#1B4D3E]">{v}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{l}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map(p => (
                <div key={p.id} className="card overflow-hidden">
                  <div className="p-4 flex items-center gap-3">
                    {/* Product ID badge */}
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xl">{p.emoji}</span>
                      <span className="text-[9px] font-black text-amber-700">{p.id}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <h3 className="font-semibold text-sm text-[#132E25] leading-tight">{p.name}</h3>
                        {p.badge && <span className={`badge ${p.badgeColor} flex-shrink-0`}>{p.badge}</span>}
                      </div>
                      <p className="text-[10px] text-gray-400 mb-1">{p.dims} · {p.weight}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-base text-[#132E25]">{p.priceRange}</span>
                        <span className="text-xs text-amber-600 flex items-center gap-0.5 font-medium">
                          <Award size={10} /> +{p.credits} cr
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button onClick={() => addToCart(p)}
                        className="bg-[#1B4D3E] hover:bg-[#132E25] text-white rounded-xl px-3 py-2 text-xs font-bold active:scale-95 transition-all">
                        Add
                      </button>
                      <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-all">
                        {expanded === p.id ? 'Less' : 'Info'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expanded === p.id && (
                    <div className="border-t border-gray-50 px-4 py-3 bg-gray-50/50 space-y-2">
                      <div className="flex items-start gap-2">
                        <Leaf size={12} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed"><span className="font-semibold text-[#132E25]">Material:</span> {p.material}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Full set bundle */}
            <div className="mt-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f3528] to-[#1B4D3E] p-5 text-white">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <p className="font-display font-black text-base mb-1">🎁 Complete Prototype Set</p>
              <p className="text-xs text-green-200 mb-3">All 9 units (A1–C4) · 208g total · B2B bulk order available</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-black text-2xl">₹8–15</p>
                  <p className="text-xs text-green-300">Full set · +30 Eco Credits</p>
                </div>
                <button onClick={() => PRODUCTS.forEach(p => addToCart(p))}
                  className="bg-white text-[#1B4D3E] rounded-2xl px-4 py-2.5 text-sm font-black active:scale-95 transition-all shadow-md">
                  Add All 9
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'redeem' && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white text-center">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <Award size={28} className="mx-auto mb-2" />
              <p className="font-display font-black text-4xl">{ecoCredits}</p>
              <p className="text-amber-100 text-sm font-medium">Available Eco Credits</p>
            </div>

            {redeemed && (
              <div className="card p-4 flex items-center gap-3 border border-green-100">
                <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-green-800">{redeemed.label} Redeemed! 🎉</p>
                  <p className="text-xs font-mono text-green-600 mt-0.5">{redeemed.code}</p>
                </div>
              </div>
            )}

            {COUPONS.map(c => (
              <div key={c.id} className="card p-4 flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">{c.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[#132E25]">{c.label}</p>
                  <div className="flex items-center gap-1 text-amber-600 text-xs mt-0.5 font-medium">
                    <Tag size={10} /> {c.cost} Eco Credits
                  </div>
                </div>
                <button onClick={() => redeemCoupon(c)} disabled={ecoCredits < c.cost}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl px-3.5 py-2 text-xs font-bold disabled:opacity-30 active:scale-95 transition-all flex-shrink-0">
                  Redeem
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-24" />
    </div>
  )
}
