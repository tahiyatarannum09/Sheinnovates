import { LogOut, ShieldCheck, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../../contexts/AuthContext'

/**
 * Displays the active user's profile info, role badge, and a logout action.
 * Supports dark (hero) and light (card) surfaces.
 */
export default function UserProfileBar({ variant = 'dark' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const isAdmin = user.role === ROLES.ADMIN
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (variant === 'light') {
    return (
      <div className="card p-3 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-display font-bold text-xs flex-shrink-0 ${
            isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-[#1B4D3E]'
          }`}>
            {initials || (isAdmin ? <ShieldCheck size={16} /> : <User size={16} />)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs font-bold text-[#132E25] truncate">{user.name}</p>
              <span className={`badge ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-700'}`}>
                {user.roleLabel}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          className="flex items-center gap-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-colors flex-shrink-0"
        >
          <LogOut size={12} /> Logout
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs flex-shrink-0 ${
          isAdmin ? 'bg-amber-400/20 text-amber-200 border border-amber-300/30' : 'bg-green-400/20 text-green-200 border border-green-300/30'
        }`}>
          {initials || 'AL'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-white truncate">{user.name}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
              isAdmin ? 'bg-amber-400/25 text-amber-200' : 'bg-green-400/25 text-green-200'
            }`}>
              {user.roleLabel}
            </span>
          </div>
          <p className="text-[10px] text-white/70 truncate">{user.email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        aria-label="Logout"
        className="flex items-center gap-1 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-colors active:scale-95 flex-shrink-0"
      >
        <LogOut size={12} />
        <span>Logout</span>
      </button>
    </div>
  )
}
