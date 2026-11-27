import { NavLink } from 'react-router-dom'
import { Home, QrCode, Sprout, ShoppingBag, BarChart3, Recycle } from 'lucide-react'
import AgriLoopLogo from './AgriLoopLogo'

const tabs = [
  { to: '/',               icon: Home,        label: 'Home'   },
  { to: '/scan',           icon: QrCode,      label: 'Scan'   },
  { to: '/garden',         icon: Sprout,      label: 'Garden' },
  { to: '/market',         icon: ShoppingBag, label: 'Market' },
  { to: '/impact',         icon: BarChart3,   label: 'Impact' },
  { to: '/waste-tracker',  icon: Recycle,     label: 'Waste'  },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div className="mx-2 mb-2 bg-white/92 backdrop-blur-xl rounded-3xl border border-gray-100/80 shadow-2xl shadow-black/10">
        <div className="flex items-center justify-around px-1 py-2">
          {/* Logo pill on the left */}
          <NavLink to="/" end className="flex flex-col items-center px-1">
            {({ isActive }) => (
              <div className={`transition-all duration-200 ${isActive ? 'scale-110' : 'opacity-50 scale-90'}`}>
                <AgriLoopLogo size={28} />
              </div>
            )}
          </NavLink>

          {/* Other tabs */}
          {tabs.slice(1).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-2xl transition-all duration-200 ` +
                (isActive
                  ? 'bg-[#1B4D3E] text-white shadow-md shadow-green-900/30 scale-105'
                  : 'text-gray-400 hover:text-gray-600')
              }>
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[9px] font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
