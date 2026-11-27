import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'
import AgriLoopLogo from '../components/ui/AgriLoopLogo'
import { useAuth, getDefaultRouteForRole } from '../contexts/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, user, isAuthConfigured, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const result = login(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate(getDefaultRouteForRole(result.user.role), { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#071f14] via-[#0f3528] to-[#1B4D3E] px-5 pt-10 pb-10">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative flex items-center justify-between mb-5">
          <AgriLoopLogo size={42} showText={true} />
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
            <Sparkles size={9} className="text-green-300" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-green-200">
              She Innovates
            </span>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-display text-2xl font-black text-white leading-tight">
            Sign in to <span className="text-green-300">AgriLoop</span>
          </h1>
          <p className="text-green-200/80 text-xs mt-1.5 leading-relaxed">
            Access your role-specific dashboard for smart packaging verification or administration.
          </p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10 space-y-4">
        {!isAuthConfigured && (
          <div className="card p-4 border border-red-200 bg-red-50 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-700 leading-relaxed">
              <p className="font-bold">Environment Configuration Missing</p>
              <p className="mt-0.5">
                Copy <code className="font-mono bg-red-100 px-1 rounded">.env.example</code> to{' '}
                <code className="font-mono bg-red-100 px-1 rounded">.env.local</code> and configure the demo credentials, then restart the dev server.
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card p-5 space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-[#132E25] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-bold text-[#132E25] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl pl-10 pr-11 py-3 text-sm focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 text-red-600 text-xs bg-red-50 border border-red-100 p-3 rounded-2xl"
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>

        {/* Role Access Overview */}
        <div className="card p-4 space-y-2.5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Role Access Overview
          </p>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#132E25]">Admin Role</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Admin dashboard, package records management, and verification data & audit logs.
                </p>
              </div>
            </div>
            <div className="bg-green-50/70 border border-green-100 rounded-2xl p-3 flex items-start gap-2.5">
              <UserCheck size={16} className="text-[#1B4D3E] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#132E25]">Customer Role</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Customer dashboard, package verification, manual code entry, QR scanning, garden, market, and waste tracker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
