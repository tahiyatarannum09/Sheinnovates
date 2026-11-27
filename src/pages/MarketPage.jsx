import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { Award, CheckCircle2, ShoppingCart, Tag, Leaf, Package, ChevronDown, ChevronUp } from 'lucide-react'
import LeafWrapLogo from '../components/ui/LeafWrapLogo'

// Each product uses a unique crop (cropX%, cropY%) from real prototype photos:
// biodegradable-bowls.jpg  → top-left=flat tray front | top-right=flat tray side | bottom=bowls on plate
// prototypes-collection.jpg → cups & bowls on glass table, cropped left/center/right
// prototype-evidence-pricing.jpg → labeled A/B/C sections, different X% per cup
const PRODUCTS = [
  {
    id: 'A1', name: 'Large Container A1',
    price: 3, priceRange: '₹2–3', credits: 5,
    dims: '4.8 × 11.9 × 0.2 cm', weight: '54g',
    material: 'Sugarcane bagasse + binding agents',
    desc: 'Flat tray-style container, ideal for food stalls & QSR. Compostable in 30–45 days.',
    img: '/images/biodegradable-bowls.jpg',
    cropX: '25%', cropY: '12%',   // top-left: front-facing flat tray
    badge: 'Bestseller', badgeColor: 'bg-green-100 text-green-700', series: 'A',
  },
  {
    id: 'A2', name: 'Large Container A2',
    price: 3, priceRange: '₹2–3', credits: 5,
    dims: '5.7 × 9.0 × 0.2 cm', weight: '37g',
    material: 'Rice straw + starch binder',
    desc: 'Compact flat container. Fully home-compostable.',
    img: '/images/biodegradable-bowls.jpg',
    cropX: '75%', cropY: '12%',   // top-right: side-angled flat tray
    badge: null, badgeColor: '', series: 'A',
  },
  {
    id: 'B1', name: 'Bowl Package B1',
    price: 2, priceRange: '₹1–2', credits: 4,
    dims: '2.7 × 9.5 × 0.3 cm', weight: '24g',
    material: 'Areca fronds + xanthan gum',
    desc: 'Deep bowl for street food & events. Biodegrades in soil.',
    img: '/images/prototypes-collection.jpg',
    cropX: '12%', cropY: '45%',   // leftmost bowl on glass table
    badge: 'Eco Choice', badgeColor: 'bg-teal-100 text-teal-700', series: 'B',
  },
  {
    id: 'B2', name: 'Bowl Package B2',
    price: 2, priceRange: '₹1–2', credits: 4,
    dims: '3.3 × 7.8 × 0.3 cm', weight: '43g',
    material: 'Sugarcane bagasse + gum acacia',
    desc: 'Medium bowl for single-serve meals. Home-compostable.',
    img: '/images/prototypes-collection.jpg',
    cropX: '48%', cropY: '38%',   // center-left bowl on glass table
    badge: null, badgeColor: '', series: 'B',
  },
  {
    id: 'B3', name: 'Bowl Package B3',
    price: 2, priceRange: '₹1–2', credits: 4,
    dims: '2.5 × 6.7 × 0.5 cm', weight: '27g',
    material: 'Rice straw + mycelium composite',
    desc: 'Small bowl prototype. Decomposes into nutrient-rich soil.',
    img: '/images/prototypes-collection.jpg',
    cropX: '82%', cropY: '55%',   // rightmost bowl on glass table
    badge: 'New', badgeColor: 'bg-blue-100 text-blue-700', series: 'B',
  },
  {
    id: 'C1', name: 'Formed Cup C1',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '5.0 × 5.1 × 0.2 cm', weight: '18g',
    material: 'Agricultural bran + starch',
    desc: 'Mini cup for condiments & chai. Breaks down in 30 days.',
    img: '/images/prototype-evidence-pricing.jpg',
    cropX: '8%',  cropY: '88%',   // C-section bottom-left, first cup C1
    badge: 'Most Affordable', badgeColor: 'bg-amber-100 text-amber-700', series: 'C',
  },
  {
    id: 'C2', name: 'Formed Cup C2',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '3.8 × 6.0 × 0.3 cm', weight: '1.67g',
    material: 'Paddy straw + binding agent',
    desc: 'Lightweight shot-size cup for sampling & events.',
    img: '/images/prototype-evidence-pricing.jpg',
    cropX: '20%', cropY: '90%',   // C-section, second cup C2
    badge: null, badgeColor: '', series: 'C',
  },
  {
    id: 'C3', name: 'Formed Cup C3',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '3.8 × 6.0 × 0.3 cm', weight: '1.67g',
    material: 'Corn residue + xanthan gum',
    desc: 'Corn waste-derived single-use cup — zero-burn circular model.',
    img: '/images/prototype-evidence-pricing.jpg',
    cropX: '33%', cropY: '90%',   // C-section, third cup C3
    badge: null, badgeColor: '', series: 'C',
  },
  {
    id: 'C4', name: 'Formed Cup C4',
    price: 1, priceRange: '₹0.75–1', credits: 2,
    dims: '3.8 × 6.0 × 0.3 cm', weight: '1.67g',
    material: 'Mixed agricultural residues',
    desc: 'Multi-residue blend — most sustainable in the lineup.',
    img: '/images/prototype-evidence-pricing.jpg',
    cropX: '46%', cropY: '90%',   // C-section, fourth cup C4
    badge: 'Eco Max', badgeColor: 'bg-green-100 text-green-700', series: 'C',
  },
]

const SERIES_FILTERS = [
  { key: 'all', label: 'All (9)' },
  { key: 'A',   label: '🗂️ A — Trays' },
  { key: 'B',   label: '🥣 B — Bowls' },
  { key: 'C',   label: '🥤 C — Cups' },
]

const COUPONS = [
  { id: 1, label: '₹10 Off on Bulk Bowls',     cost: 50,  code: 'BOWL-BULK-10', emoji: '🥣' },
  { id: 2, label: '₹25 Off on Any 20+ Units',  cost: 100, code: 'BULK-20-25',   emoji: '📦' },
  { id: 3, label: '₹50 Off Full Prototype Set', cost: 200, code: 'PROTO-SET-50', emoji: '🏆' },
]

export default function MarketPage() {
  const { ecoCredits, spendCredits } = useEco()
  const [cart, setCart]           = useState([])
  const [redeemed, setRedeemed]   = useState(null)
  const [tab, setTab]             = useState('shop')
  const [series, setSeries]       = useState('all')
  const [expanded, setExpanded]   = useState(null)

  const addToCart = (p) => setCart(c => {
    const ex = c.find(i => i.id === p.id)
    return ex ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }]
  })
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const filtered  = series === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.series === series)

  const redeemCoupon = (c) => {
    if (ecoCredits >= c.cost) { spendCredits(c.cost); setRedeemed(c) }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#78350f] via-[#b45309] to-[#f59e0b] px-5 pt-10 pb-5">
        <div className="absolute -top-6 -right-6 w-36 h-36 bg-yellow-300/20 rounded-full blur-2xl" />

        {/* Real product hero image */}
        <div className="relative rounded-2xl overflow-hidden mb-4 shadow-xl shadow-black/30 border border-white/20">
          <img
            src="/images/prototype-evidence-pricing.jpg"
            alt="She Innovates Prototypes A1–C4"
            className="w-full h-36 object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3">
            <p className="text-white font-display font-black text-sm">9 Prototypes · A1 → C4</p>
            <p className="text-white/70 text-xs">She Innovates · 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <LeafWrapLogo size={28} />
          <div>
            <h1 className="font-display text-xl font-black text-white leading-none">Eco Market 🛒</h1>
            <p className="text-amber-100 text-xs mt-0.5">Cost ≈ ₹0.75–1 · Margin ~50–100%</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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

      {/* ── Tabs ── */}
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

        {/* ── SHOP TAB ── */}
        {tab === 'shop' && (
          <>
            {/* Series filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
              {SERIES_FILTERS.map(s => (
                <button key={s.key} onClick={() => setSeries(s.key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                    series === s.key ? 'bg-[#1B4D3E] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-100'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[['9', 'Prototypes'], ['208g', 'Total Wt.'], ['₹8–15', 'Set Price']].map(([v, l]) => (
                <div key={l} className="card p-3 text-center">
                  <p className="font-display font-black text-base text-[#1B4D3E]">{v}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{l}</p>
                </div>
              ))}
            </div>

            {/* Product cards with real images */}
            <div className="space-y-3">
              {filtered.map(p => (
                <div key={p.id} className="card overflow-hidden">
                  {/* Image + content row */}
                  <div className="flex items-stretch">
                    {/* Real product photo — unique crop per product */}
                    <div className="w-28 flex-shrink-0 relative overflow-hidden">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        style={{ minHeight: '100px', objectPosition: `${p.cropX} ${p.cropY}` }}
                      />
                      {/* Series ID overlay */}
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-black rounded-lg px-1.5 py-0.5">
                        {p.id}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h3 className="font-semibold text-sm text-[#132E25] leading-tight">{p.name}</h3>
                          {p.badge && <span className={`badge ${p.badgeColor} flex-shrink-0 text-[9px]`}>{p.badge}</span>}
                        </div>
                        <p className="text-[10px] text-gray-400 mb-1.5">{p.dims} · {p.weight}</p>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-black text-base text-[#132E25]">{p.priceRange}</span>
                          <span className="text-xs text-amber-600 flex items-center gap-0.5 font-medium">
                            <Award size={9} /> +{p.credits}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">{p.material}</p>
                      </div>

                      <div className="flex gap-1.5 mt-2">
                        <button onClick={() => addToCart(p)}
                          className="flex-1 bg-[#1B4D3E] hover:bg-[#132E25] text-white rounded-xl py-2 text-xs font-bold active:scale-95 transition-all">
                          Add to Cart
                        </button>
                        <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl px-2.5 py-2 transition-all">
                          {expanded === p.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expanded === p.id && (
                    <div className="border-t border-gray-50 px-4 py-3 bg-green-50/40 space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Leaf size={12} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600"><span className="font-semibold">Material:</span> {p.material}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">{p.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Full set bundle */}
            <div className="mt-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f3528] to-[#1B4D3E] overflow-hidden">
              <img src="/images/prototypes-collection.jpg" alt="Full Set"
                className="w-full h-28 object-cover opacity-40" />
              <div className="absolute inset-0 p-4 flex items-center justify-between">
                <div>
                  <p className="font-display font-black text-white text-base">🎁 Complete Set</p>
                  <p className="text-green-200 text-xs">All 9 · A1–C4 · 208g total</p>
                  <p className="font-display font-black text-white text-xl mt-1">₹8–15 <span className="text-sm font-normal text-green-200">+30 credits</span></p>
                </div>
                <button onClick={() => PRODUCTS.forEach(p => addToCart(p))}
                  className="bg-white text-[#1B4D3E] rounded-2xl px-4 py-2.5 text-sm font-black active:scale-95 transition-all shadow-md flex-shrink-0">
                  Add All 9
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── REDEEM TAB ── */}
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
