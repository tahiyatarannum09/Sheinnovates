import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import AgriLoopLogo from '../components/ui/AgriLoopLogo'
import { useAuth, getDefaultRouteForRole, ROLES, DEMO_CREDENTIALS } from '../contexts/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, user, login, quickLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate(getDefaultRouteForRole(result.user.role), { replace: true })
  }

  const handle1ClickLogin = (role) => {
    setError('')
    setLoading(true)
    const result = quickLogin(role)
    setLoading(false)
    if (result.ok) {
      navigate(getDefaultRouteForRole(role), { replace: true })
    }
  }

  const fillFormCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter pb-12 font-sans">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#071f14] via-[#0f3528] to-[#1B4D3E] px-5 pt-8 pb-10 shadow-lg">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative flex items-center justify-between mb-4">
          <AgriLoopLogo size={38} showText={true} />
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-2.5 py-1">
            <Sparkles size={11} className="text-emerald-300 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-200">
              She Innovates 2026
            </span>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-display text-2xl font-black text-white leading-tight">
            Sign in to <span className="text-emerald-300">AgriLoop</span>
          </h1>
          <p className="text-emerald-100/80 text-xs mt-1 leading-relaxed">
            Smart rural waste packaging & decentralized Eco-Credit reward portal.
          </p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10 space-y-4">
        {/* Hackathon Fast 1-Click Entry Bar */}
        <div className="card p-4 border border-emerald-200/80 bg-white/95 shadow-md">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-black uppercase text-[#1B4D3E] tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-600" />
              ⚡ Hackathon Evaluator 1-Click Login
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Quick Admin */}
            <button
              type="button"
              onClick={() => handle1ClickLogin(ROLES.ADMIN)}
              disabled={loading}
              className="py-2.5 px-3 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-all"
            >
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>Admin Login</span>
              </div>
              <span className="text-[9px] font-normal text-amber-100 opacity-90">
                Operations & Verifications
              </span>
            </button>

            {/* Quick Customer */}
            <button
              type="button"
              onClick={() => handle1ClickLogin(ROLES.CUSTOMER)}
              disabled={loading}
              className="py-2.5 px-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#143B30] active:scale-95 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-all"
            >
              <div className="flex items-center gap-1">
                <UserCheck size={14} />
                <span>Customer Login</span>
              </div>
              <span className="text-[9px] font-normal text-emerald-100 opacity-90">
                Packaging QR & Eco Credits
              </span>
            </button>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <form onSubmit={handleManualSubmit} className="card p-5 space-y-3.5 shadow-sm bg-white" noValidate>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-email" className="block text-xs font-bold text-[#132E25]">
                Email Address
              </label>
              <span className="text-[10px] text-gray-400 font-mono">Demo: admin@agriloop.eco</span>
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email e.g. customer@agriloop.eco"
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-bold text-[#132E25]">
                Password
              </label>
              <span className="text-[10px] text-gray-400 font-mono">Demo: admin / customer123</span>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl pl-10 pr-11 py-2.5 text-xs focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Demo Credentials Reference Cards */}
        <div className="card p-4 space-y-3 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
              📋 Official Demo Credentials
            </p>
            <span className="text-[10px] text-gray-400">Click to autofill</span>
          </div>

          {/* Admin Credentials Row */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-900">Admin Account</span>
                <span className="text-[10px] bg-amber-200/60 text-amber-800 px-1.5 py-0.2 rounded-full font-semibold">
                  Dashboard &amp; Packaging Ops
                </span>
              </div>
              <button
                type="button"
                onClick={() => fillFormCredentials(DEMO_CREDENTIALS.admin.email, DEMO_CREDENTIALS.admin.password)}
                className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1"
              >
                <CheckCircle2 size={11} /> Fill Admin
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/70 p-2 rounded-xl border border-amber-200/50">
              <div>
                <span className="text-gray-400 text-[10px] block">EMAIL:</span>
                <strong className="text-amber-900 select-all">{DEMO_CREDENTIALS.admin.email}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">PASSWORD:</span>
                <strong className="text-amber-900 select-all">{DEMO_CREDENTIALS.admin.password}</strong>
              </div>
            </div>
            <p className="text-[10px] text-amber-800/80 leading-tight">
              Unlocks Admin Dashboard, package inventory CRUD, verification records, and live audit log controls.
            </p>
          </div>

          {/* Customer Credentials Row */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-[#132E25]">Customer / User Account</span>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded-full font-semibold">
                  Consumer Portal
                </span>
              </div>
              <button
                type="button"
                onClick={() => fillFormCredentials(DEMO_CREDENTIALS.customer.email, DEMO_CREDENTIALS.customer.password)}
                className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1"
              >
                <CheckCircle2 size={11} /> Fill Customer
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/70 p-2 rounded-xl border border-emerald-200/50">
              <div>
                <span className="text-gray-400 text-[10px] block">EMAIL:</span>
                <strong className="text-[#1B4D3E] select-all">{DEMO_CREDENTIALS.customer.email}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">PASSWORD:</span>
                <strong className="text-[#1B4D3E] select-all">{DEMO_CREDENTIALS.customer.password}</strong>
              </div>
            </div>
            <p className="text-[10px] text-emerald-800/80 leading-tight">
              Unlocks consumer Home, Packaging QR scanner, Eco-Credits rewards, 3D Plant Garden, and Waste Tracker.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
