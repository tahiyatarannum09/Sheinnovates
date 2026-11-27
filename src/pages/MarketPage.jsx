import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { ShoppingBag, Award, Leaf, ChevronRight, CheckCircle2 } from 'lucide-react'

const PRODUCTS = [
  { id: 1, name: 'Biodegradable Seed Pod Dishes', price: 149, credits: 15, unit: '3-Piece Set', material: 'Rice straw & basil seeds', emoji: '🌿', badge: 'Bestseller' },
  { id: 2, name: 'Areca Fiber Trio', price: 199, credits: 20, unit: 'Set of 3', material: 'Fallen areca fronds', emoji: '🌴', badge: 'Eco Choice' },
  { id: 3, name: 'Deep Root Planting Pots', price: 249, credits: 25, unit: 'Pack of 2', material: 'Sugarcane bagasse', emoji: '🪴', badge: 'New' },
  { id: 4, name: 'Myco-Carbon Nursery Cup', price: 99, credits: 10, unit: 'Single', material: 'Agricultural bran & mycelium', emoji: '🍄', badge: null },
  { id: 5, name: 'EcoDelivery Box Pro', price: 299, credits: 30, unit: 'Box', material: 'Banana stem fiber & biocarbon', emoji: '📦', badge: 'Premium' },
]

const COUPONS = [
  { id: 1, label: '₹10 Off Seed Pod Dishes', cost: 50, code: 'LEAF-PODS-10' },
  { id: 2, label: '₹25 Off Planting Pots', cost: 100, code: 'LEAF-POTS-25' },
  { id: 3, label: '₹50 Off Master Collection', cost: 200, code: 'LEAF-MAST-50' },
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
    if (ecoCredits >= c.cost) {
      spendCredits(c.cost)
      setRedeemed(c)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-amber-700 to-amber-500 text-white px-5 pt-10 pb-6">
        <h1 className="font-display text-2xl font-extrabold mb-1">Eco Market 🛒</h1>
        <p className="text-amber-100 text-sm">Shop seed-embedded packaging made from rural agricultural waste.</p>
        <div className="flex gap-3 mt-3">
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-medium">
            <Award size={12} /> {ecoCredits} Credits
          </div>
          {cartCount > 0 && (
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-medium">
              <ShoppingBag size={12} /> {cartCount} items · ₹{cartTotal}
            </div>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-100 mt-1 px-4">
        {['shop', 'redeem'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'border-b-2 border-[#1B4D3E] text-[#1B4D3E]' : 'text-gray-400'}`}>
            {t === 'shop' ? '🛍️ Products' : '🎁 Redeem Credits'}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        {tab === 'shop' && (
          <div className="space-y-3">
            {PRODUCTS.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm text-[#132E25] truncate">{p.name}</h3>
                    {p.badge && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">{p.badge}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{p.material} · {p.unit}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#132E25]">₹{p.price}</span>
                    <span className="text-xs text-amber-600 flex items-center gap-0.5"><Award size={10} /> +{p.credits} credits</span>
                  </div>
                </div>
                <button onClick={() => addToCart(p)}
                  className="bg-[#1B4D3E] text-white rounded-xl px-3 py-2 text-xs font-semibold hover:bg-[#132E25] transition-colors flex-shrink-0">
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'redeem' && (
          <div className="space-y-3">
            {redeemed && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-green-800">{redeemed.label} Redeemed!</p>
                  <p className="text-xs font-mono text-green-600">{redeemed.code}</p>
                </div>
              </div>
            )}
            {COUPONS.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-[#132E25] mb-1">{c.label}</p>
                  <div className="flex items-center gap-1 text-amber-600 text-xs">
                    <Award size={12} /> {c.cost} Eco Credits
                  </div>
                </div>
                <button
                  onClick={() => redeemCoupon(c)}
                  disabled={ecoCredits < c.cost}
                  className="bg-amber-100 text-amber-700 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-40 hover:bg-amber-200 transition-colors flex-shrink-0">
                  Redeem
                </button>
              </div>
            ))}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
              <Award size={24} className="text-amber-500 mx-auto mb-2" />
              <p className="font-display font-bold text-xl text-amber-700">{ecoCredits}</p>
              <p className="text-xs text-amber-600">Available Eco Credits</p>
            </div>
          </div>
        )}
      </div>
      <div className="h-6" />
    </div>
  )
}
