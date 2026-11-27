import { NavLink } from 'react-router-dom'
import { Home, QrCode, Sprout, ShoppingBag, BarChart3, Recycle } from 'lucide-react'

const tabs = [
  { to: '/',             icon: Home,        label: 'Home' },
  { to: '/scan',         icon: QrCode,      label: 'Scan' },
  { to: '/garden',       icon: Sprout,      label: 'Garden' },
  { to: '/market',       icon: ShoppingBag, label: 'Market' },
  { to: '/impact',       icon: BarChart3,   label: 'Impact' },
  { to: '/waste-tracker',icon: Recycle,     label: 'Waste' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50 shadow-lg">
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 min-w-0 ` +
              (isActive
                ? 'text-[#1B4D3E] bg-green-50'
                : 'text-gray-400 hover:text-gray-600')
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

