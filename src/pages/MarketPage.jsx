import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { Award, CheckCircle2, ShoppingCart, Tag } from 'lucide-react'

const PRODUCTS = [
  { id: 1, name: 'Biodegradable Seed Pod Dishes', price: 149, credits: 15, unit: '3-Piece Set', material: 'Rice straw & basil seeds', emoji: '🌿', badge: 'Bestseller', badgeColor: 'bg-green-100 text-green-700' },
  { id: 2, name: 'Areca Fiber Trio',              price: 199, credits: 20, unit: 'Set of 3',    material: 'Fallen areca fronds',          emoji: '🌴', badge: 'Eco Choice', badgeColor: 'bg-teal-100 text-teal-700' },
  { id: 3, name: 'Deep Root Planting Pots',       price: 249, credits: 25, unit: 'Pack of 2',   material: 'Sugarcane bagasse',            emoji: '🪴', badge: 'New',        badgeColor: 'bg-blue-100 text-blue-700' },
  { id: 4, name: 'Myco-Carbon Nursery Cup',       price: 99,  credits: 10, unit: 'Single',      material: 'Agricultural bran & mycelium', emoji: '🍄', badge: null,        badgeColor: '' },
  { id: 5, name: 'EcoDelivery Box Pro',           price: 299, credits: 30, unit: 'Box',         material: 'Banana stem fiber & biocarbon', emoji: '📦', badge: 'Premium',   badgeColor: 'bg-violet-100 text-violet-700' },
]

const COUPONS = [
  { id: 1, label: '₹10 Off Seed Pod Dishes', cost: 50,  code: 'LEAF-PODS-10', emoji: '🌿' },
  { id: 2, label: '₹25 Off Planting Pots',   cost: 100, code: 'LEAF-POTS-25', emoji: '🪴' },
  { id: 3, label: '₹50 Off Master Collection',cost: 200, code: 'LEAF-MAST-50', emoji: '🏆' },
]

export default function MarketPage() {
  const { ecoCredits, spendCredits } = useEco()
  const [cart, setCart] = useState([])
  const [redeemed, setRedeemed] = useState(null)
  const [tab, setTab] = useState('shop')

  const addToCart = (p) => setCart(c => {
    const ex = c.find(i => i.id === p.id)
    return ex ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }]
  })
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const redeemCoupon = (c) => {
    if (ecoCredits >= c.cost) { spendCredits(c.cost); setRedeemed(c) }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#78350f] via-[#b45309] to-[#f59e0b] px-5 pt-14 pb-8">
        <div className="absolute -top-6 -right-6 w-36 h-36 bg-yellow-300/20 rounded-full blur-2xl" />
        <h1 className="font-display text-3xl font-black text-white mb-1">Eco Market 🛒</h1>
        <p className="text-amber-100 text-sm">Shop seed-embedded packaging from rural agricultural waste</p>
        <div className="flex gap-2 mt-3">
          <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
            🪙 {ecoCredits} Credits
          </div>
          {cartCount > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white">
              <ShoppingCart size={11} /> {cartCount} · ₹{cartTotal}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="card p-1 flex">
          {[['shop', '🛍️ Products'], ['redeem', '🎁 Redeem']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                tab === t ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-gray-400'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {tab === 'shop' && (
          <div className="space-y-3">
            {PRODUCTS.map(p => (
              <div key={p.id} className="card p-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm text-[#132E25] leading-tight">{p.name}</h3>
                    {p.badge && <span className={`badge ${p.badgeColor} flex-shrink-0`}>{p.badge}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-1.5">{p.material} · {p.unit}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-base text-[#132E25]">₹{p.price}</span>
                    <span className="text-xs text-amber-600 flex items-center gap-0.5 font-medium">
                      <Award size={10} /> +{p.credits}
                    </span>
                  </div>
                </div>
                <button onClick={() => addToCart(p)}
                  className="bg-[#1B4D3E] hover:bg-[#132E25] text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold active:scale-95 transition-all shadow-sm shadow-green-900/20 flex-shrink-0">
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'redeem' && (
          <div className="space-y-4">
            {/* Credits balance */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white text-center">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'20px 20px'}} />
              <Award size={28} className="mx-auto mb-2" />
              <p className="font-display font-black text-4xl">{ecoCredits}</p>
              <p className="text-amber-100 text-sm font-medium">Available Eco Credits</p>
            </div>

            {redeemed && (
              <div className="card p-4 flex items-center gap-3 border-green-100">
                <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-green-800">{redeemed.label} Redeemed! 🎉</p>
                  <p className="text-xs font-mono text-green-600 mt-0.5">{redeemed.code}</p>
                </div>
              </div>
            )}

            {COUPONS.map(c => (
              <div key={c.id} className="card p-4 flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  {c.emoji}
                </div>
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
