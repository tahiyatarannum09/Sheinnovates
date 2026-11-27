import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth, getDefaultRouteForRole } from '../../contexts/AuthContext'
import AgriLoopLogo from '../ui/AgriLoopLogo'

/**
 * Route guard enforcing authentication and role-based access control.
 * Unauthenticated users are redirected to /login; authenticated users lacking
 * a required role see an explicit 403 Access Restricted view.
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallbackRoute = getDefaultRouteForRole(user.role)
    const requiredText = allowedRoles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(' or ')

    return (
      <div className="min-h-screen bg-[#F4F7F4] flex items-center justify-center px-5 py-10 page-enter">
        <div className="w-full card p-6 text-center space-y-4">
          <div className="flex justify-center">
            <AgriLoopLogo size={42} />
          </div>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <ShieldAlert size={28} />
          </div>
          <div>
            <span className="badge bg-red-100 text-red-700 uppercase tracking-wider">403 · Access Restricted</span>
            <h1 className="font-display font-black text-xl text-[#132E25] mt-2">
              Role Permission Required
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              This section is restricted to <span className="font-semibold text-[#132E25]">{requiredText}</span> accounts.
              You are currently signed in as <span className="font-semibold text-[#1B4D3E]">{user.roleLabel}</span> ({user.email}).
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigate(fallbackRoute, { replace: true })}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <ArrowLeft size={15} /> Go to {user.roleLabel} Dashboard
            </button>
            <button
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
