import { createContext, useContext, useState } from 'react'

const SESSION_STORAGE_KEY = 'agriloop_demo_session_v1'

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
}

function getDemoAccounts() {
  const adminEmail = (import.meta.env.VITE_DEMO_ADMIN_EMAIL || '').trim().toLowerCase()
  const adminPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || ''
  const adminName = (import.meta.env.VITE_DEMO_ADMIN_NAME || 'AgriLoop Admin').trim()

  const customerEmail = (import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || '').trim().toLowerCase()
  const customerPassword = import.meta.env.VITE_DEMO_CUSTOMER_PASSWORD || ''
  const customerName = (import.meta.env.VITE_DEMO_CUSTOMER_NAME || 'AgriLoop Customer').trim()

  const accounts = []

  if (adminEmail && adminPassword) {
    accounts.push({
      id: 'demo-admin-1',
      email: adminEmail,
      password: adminPassword,
      name: adminName,
      role: ROLES.ADMIN,
      roleLabel: 'Admin',
      department: 'Operations & Verification',
    })
  }

  if (customerEmail && customerPassword) {
    accounts.push({
      id: 'demo-customer-1',
      email: customerEmail,
      password: customerPassword,
      name: customerName,
      role: ROLES.CUSTOMER,
      roleLabel: 'Customer',
      department: 'Eco Packaging Member',
    })
  }

  return accounts
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
    // Verify the stored session still matches a valid configured account & role
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

/**
 * Provides demo-only local authentication and role-based session state.
 * Credentials are read from environment variables (VITE_DEMO_*) and never
 * hardcoded in source files. Not intended for production authentication.
 */
export function AuthProvider({ children }) {
  const demoAccounts = getDemoAccounts()
  const isAuthConfigured =
    demoAccounts.some(a => a.role === ROLES.ADMIN) &&
    demoAccounts.some(a => a.role === ROLES.CUSTOMER)

  const [user, setUser] = useState(() => restoreValidatedSession(demoAccounts))

  const login = (emailInput, passwordInput) => {
    const normalizedEmail = (emailInput || '').trim().toLowerCase()
    const password = passwordInput || ''

    if (!normalizedEmail || !password) {
      return { ok: false, error: 'Please enter both your email address and password.' }
    }

    if (!isAuthConfigured) {
      return {
        ok: false,
        error: 'Demo credentials are not configured in environment variables (.env.local).',
      }
    }

    const matchedAccount = demoAccounts.find(
      acc => acc.email === normalizedEmail && acc.password === password
    )

    if (!matchedAccount) {
      return {
        ok: false,
        error: 'Invalid email or password. Please verify your demo credentials and try again.',
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
        logout,
        hasRole,
        getDefaultRouteForRole,
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
