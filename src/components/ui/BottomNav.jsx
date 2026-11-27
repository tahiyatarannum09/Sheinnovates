import { NavLink } from 'react-router-dom'
import { Home, QrCode, Sprout, ShoppingBag, BarChart3, Recycle } from 'lucide-react'

const tabs = [
  { to: '/',              icon: Home,        label: 'Home',   emoji: '🏠' },
  { to: '/scan',          icon: QrCode,      label: 'Scan',   emoji: '📦' },
  { to: '/garden',        icon: Sprout,      label: 'Garden', emoji: '🌱' },
  { to: '/market',        icon: ShoppingBag, label: 'Market', emoji: '🛒' },
  { to: '/impact',        icon: BarChart3,   label: 'Impact', emoji: '🌍' },
  { to: '/waste-tracker', icon: Recycle,     label: 'Waste',  emoji: '♻️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      {/* Frosted glass bar */}
      <div className="mx-2 mb-2 bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-xl shadow-black/10">
        <div className="flex items-center justify-around px-2 py-2.5">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-2xl transition-all duration-200 min-w-0 ` +
                (isActive
                  ? 'bg-[#1B4D3E] text-white shadow-md shadow-green-900/30 scale-105'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[9px] font-semibold tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
