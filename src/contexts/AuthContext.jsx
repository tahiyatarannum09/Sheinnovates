import { createContext, useContext, useState } from 'react'

const SESSION_STORAGE_KEY = 'agriloop_demo_session_v1'

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
}

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@agriloop.eco',
    password: 'admin',
    altPasswords: ['admin', 'admin123'],
    name: 'AgriLoop Operations Admin',
    role: ROLES.ADMIN,
    roleLabel: 'Admin',
    department: 'Operations & Packaging Verification',
    badge: '🛡️ Operations Admin',
    description: 'Full management over packaging registry, batch controls, and live audit verification logs.'
  },
  customer: {
    email: 'customer@agriloop.eco',
    password: 'customer123',
    altPasswords: ['customer123', 'user123', '1234'],
    name: 'Tanuja (Eco Member)',
    role: ROLES.CUSTOMER,
    roleLabel: 'Customer',
    department: 'Eco Packaging Member',
    badge: '🌱 Eco Member',
    description: 'Packaging QR scanner, Eco Credits earning, plant garden growth tracker, and waste logger.'
  },
}

function getDemoAccounts() {
  const adminEmail = (import.meta.env.VITE_DEMO_ADMIN_EMAIL || DEMO_CREDENTIALS.admin.email).trim().toLowerCase()
  const adminPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || DEMO_CREDENTIALS.admin.password
  const adminName = (import.meta.env.VITE_DEMO_ADMIN_NAME || DEMO_CREDENTIALS.admin.name).trim()

  const customerEmail = (import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || DEMO_CREDENTIALS.customer.email).trim().toLowerCase()
  const customerPassword = import.meta.env.VITE_DEMO_CUSTOMER_PASSWORD || DEMO_CREDENTIALS.customer.password
  const customerName = (import.meta.env.VITE_DEMO_CUSTOMER_NAME || DEMO_CREDENTIALS.customer.name).trim()

  return [
    {
      id: 'demo-admin-1',
      email: adminEmail,
      password: adminPassword,
      altPasswords: DEMO_CREDENTIALS.admin.altPasswords,
      name: adminName,
      role: ROLES.ADMIN,
      roleLabel: 'Admin',
      department: 'Operations & Verification',
    },
    {
      id: 'demo-customer-1',
      email: customerEmail,
      password: customerPassword,
      altPasswords: DEMO_CREDENTIALS.customer.altPasswords,
      name: customerName,
      role: ROLES.CUSTOMER,
      roleLabel: 'Customer',
      department: 'Eco Packaging Member',
    },
    // Supporting standard aliases for evaluator convenience
    {
      id: 'demo-customer-alias',
      email: 'user@agriloop.eco',
      password: 'user123',
      altPasswords: ['user123', 'customer123', '1234'],
      name: 'SheInnovates Customer',
      role: ROLES.CUSTOMER,
      roleLabel: 'Customer',
      department: 'Eco Packaging Member',
    }
  ]
}

function sanitizeUser(account) {
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    roleLabel: account.roleLabel,
    department: account.department,
    isDemo: true,
  }
}

function restoreValidatedSession(accounts) {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.email !== 'string' || typeof parsed.role !== 'string') {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }
    const matched = accounts.find(
      acc => acc.email === parsed.email.toLowerCase() && acc.role === parsed.role
    )
    if (!matched) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }
    return {
      ...sanitizeUser(matched),
      signedInAt: parsed.signedInAt || new Date().toISOString(),
    }
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export function getDefaultRouteForRole(role) {
  return role === ROLES.ADMIN ? '/admin' : '/'
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const demoAccounts = getDemoAccounts()
  const isAuthConfigured = true

  const [user, setUser] = useState(() => restoreValidatedSession(demoAccounts))

  const login = (emailInput, passwordInput) => {
    const normalizedEmail = (emailInput || '').trim().toLowerCase()
    const password = (passwordInput || '').trim()

    if (!normalizedEmail || !password) {
      return { ok: false, error: 'Please enter both your email address and password.' }
    }

    // Direct role lookup or email match
    const matchedAccount = demoAccounts.find(acc => {
      const emailMatches = acc.email.toLowerCase() === normalizedEmail ||
        (normalizedEmail.includes('admin') && acc.role === ROLES.ADMIN) ||
        (normalizedEmail.includes('customer') && acc.role === ROLES.CUSTOMER)

      const passwordMatches = acc.password === password ||
        (acc.altPasswords && acc.altPasswords.includes(password))

      return emailMatches && passwordMatches
    })

    if (!matchedAccount) {
      return {
        ok: false,
        error: 'Invalid credentials. Please use the demo credentials provided below or 1-Click login.',
      }
    }

    const sessionUser = {
      ...sanitizeUser(matchedAccount),
      signedInAt: new Date().toISOString(),
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)

    return { ok: true, user: sessionUser }
  }

  const quickLogin = (role) => {
    const account = demoAccounts.find(a => a.role === role) || demoAccounts[0]
    const sessionUser = {
      ...sanitizeUser(account),
      signedInAt: new Date().toISOString(),
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { ok: true, user: sessionUser }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setUser(null)
  }

  const hasRole = (role) => Boolean(user && user.role === role)

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthConfigured,
        login,
        quickLogin,
        logout,
        hasRole,
        getDefaultRouteForRole,
        demoAccounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return ctx
}
