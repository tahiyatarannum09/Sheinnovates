import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth, ROLES } from './AuthContext'

const PACKAGES_STORAGE_KEY = 'agriloop_packages_v1'
const VERIFICATIONS_STORAGE_KEY = 'agriloop_verifications_v1'

const INITIAL_PACKAGES = [
  {
    code: 'AL-2026-INIT01',
    name: 'Bagasse Courier Box',
    material: 'Sugarcane Bagasse 30%',
    seed: 'Basil',
    credits: 25,
    co2: 1.2,
    emoji: '🌾',
    batch: 'BATCH-2026-A1',
    status: 'Active',
    createdAt: '2026-11-20',
  },
  {
    code: 'AL-2026-AREC02',
    name: 'Areca Fiber Trio',
    material: 'Fallen Areca Fronds',
    seed: 'Wildflower',
    credits: 30,
    co2: 1.6,
    emoji: '🌴',
    batch: 'BATCH-2026-B2',
    status: 'Active',
    createdAt: '2026-11-21',
  },
  {
    code: 'AL-2026-BANA03',
    name: 'Banana Stem Box',
    material: 'Banana Stem Fiber & Bio-Carbon',
    seed: 'Mint',
    credits: 28,
    co2: 1.4,
    emoji: '🍌',
    batch: 'BATCH-2026-C1',
    status: 'Active',
    createdAt: '2026-11-22',
  },
  {
    code: 'AL-2026-RICE04',
    name: 'Rice Straw Composite',
    material: 'Bio-Polymer & Rice Straw',
    seed: 'Coriander',
    credits: 22,
    co2: 1.0,
    emoji: '🌾',
    batch: 'BATCH-2026-D4',
    status: 'Active',
    createdAt: '2026-11-24',
  },
]

const INITIAL_VERIFICATIONS = [
  {
    id: 'ver-1001',
    code: 'AL-2026-INIT01',
    packageName: 'Bagasse Courier Box',
    verifiedBy: 'customer-demo@agriloop.local',
    method: 'QR Scan',
    credits: 25,
    co2: 1.2,
    status: 'Verified',
    timestamp: '2026-11-25 10:15',
  },
  {
    id: 'ver-1002',
    code: 'AL-2026-AREC02',
    packageName: 'Areca Fiber Trio',
    verifiedBy: 'customer-demo@agriloop.local',
    method: 'Manual Entry',
    credits: 30,
    co2: 1.6,
    status: 'Verified',
    timestamp: '2026-11-26 14:40',
  },
  {
    id: 'ver-1003',
    code: 'AL-2026-BANA03',
    packageName: 'Banana Stem Box',
    verifiedBy: 'customer-demo@agriloop.local',
    method: 'QR Scan',
    credits: 28,
    co2: 1.4,
    status: 'Pending',
    timestamp: '2026-11-27 09:05',
  },
]

function loadStoredArray(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback
  } catch {
    return fallback
  }
}

const EcoContext = createContext(null)

export function EcoProvider({ children }) {
  const { user } = useAuth()

  const [ecoCredits, setEcoCredits] = useState(120)
  const [co2Saved, setCo2Saved] = useState(14.7)
  const [packagesScanned, setPackagesScanned] = useState(3)
  const [plantsGrown, setPlantsGrown] = useState(2)
  const [wasteEntries, setWasteEntries] = useState([
    { id: 1, type: 'Agricultural Residue', kg: 5.2, date: '2026-11-25', value: 42, status: 'Processed' },
    { id: 2, type: 'Organic Waste', kg: 2.8, date: '2026-11-26', value: 22, status: 'Composted' },
    { id: 3, type: 'Plastic Waste', kg: 1.1, date: '2026-11-27', value: 15, status: 'Recycled' },
  ])

  const [packageRecords, setPackageRecords] = useState(() =>
    loadStoredArray(PACKAGES_STORAGE_KEY, INITIAL_PACKAGES)
  )
  const [verificationLogs, setVerificationLogs] = useState(() =>
    loadStoredArray(VERIFICATIONS_STORAGE_KEY, INITIAL_VERIFICATIONS)
  )

  useEffect(() => {
    try {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packageRecords))
    } catch {
      // Ignore storage quota errors in demo mode
    }
  }, [packageRecords])

  useEffect(() => {
    try {
      localStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(verificationLogs))
    } catch {
      // Ignore storage quota errors in demo mode
    }
  }, [verificationLogs])

  const addCredits = (amount) => setEcoCredits(c => c + amount)
  const spendCredits = (amount) => setEcoCredits(c => Math.max(0, c - amount))

  const recordScan = (pkg = null, method = 'Manual Entry') => {
    const credits = pkg?.credits ?? 25
    const co2 = pkg?.co2 ?? 1.2

    setPackagesScanned(n => n + 1)
    addCredits(credits)
    setCo2Saved(c => +(c + co2).toFixed(1))

    if (pkg) {
      const now = new Date()
      const stamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`
      setVerificationLogs(prev => [
        {
          id: `ver-${Date.now()}`,
          code: pkg.code,
          packageName: pkg.name,
          verifiedBy: user?.email || 'demo-customer',
          method,
          credits,
          co2,
          status: 'Verified',
          timestamp: stamp,
        },
        ...prev,
      ])
    }
  }

  const findPackageByCode = (rawCode) => {
    const normalized = (rawCode || '').trim().toUpperCase()
    return packageRecords.find(p => p.code.toUpperCase() === normalized) || null
  }

  const recordPlant = () => setPlantsGrown(n => n + 1)

  const addWasteEntry = (entry) => {
    setWasteEntries(entries => [
      { id: Date.now(), ...entry, date: new Date().toISOString().slice(0, 10) },
      ...entries,
    ])
    addCredits(entry.value || 10)
  }

  // ── Role-guarded Admin Actions ──
  const requireAdmin = () => {
    if (!user || user.role !== ROLES.ADMIN) {
      return { ok: false, error: 'Forbidden: Admin privileges are required for this action.' }
    }
    return null
  }

  const addPackageRecord = (newPkg) => {
    const denied = requireAdmin()
    if (denied) return denied

    const normalizedCode = (newPkg.code || '').trim().toUpperCase()
    if (!normalizedCode || !newPkg.name?.trim()) {
      return { ok: false, error: 'Package code and name are required.' }
    }
    if (packageRecords.some(p => p.code.toUpperCase() === normalizedCode)) {
      return { ok: false, error: `Package code ${normalizedCode} already exists.` }
    }

    const record = {
      code: normalizedCode,
      name: newPkg.name.trim(),
      material: (newPkg.material || 'Agricultural Fiber Composite').trim(),
      seed: (newPkg.seed || 'Basil').trim(),
      credits: Number(newPkg.credits) > 0 ? Number(newPkg.credits) : 20,
      co2: Number(newPkg.co2) > 0 ? Number(newPkg.co2) : 1.0,
      emoji: newPkg.emoji || '📦',
      batch: (newPkg.batch || `BATCH-${new Date().getFullYear()}`).trim(),
      status: newPkg.status || 'Active',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    setPackageRecords(prev => [record, ...prev])
    return { ok: true, record }
  }

  const updatePackageRecord = (code, updates) => {
    const denied = requireAdmin()
    if (denied) return denied

    setPackageRecords(prev =>
      prev.map(p =>
        p.code === code
          ? {
              ...p,
              ...updates,
              credits: updates.credits !== undefined ? Number(updates.credits) : p.credits,
              co2: updates.co2 !== undefined ? Number(updates.co2) : p.co2,
            }
          : p
      )
    )
    return { ok: true }
  }

  const togglePackageStatus = (code) => {
    const denied = requireAdmin()
    if (denied) return denied

    setPackageRecords(prev =>
      prev.map(p =>
        p.code === code
          ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' }
          : p
      )
    )
    return { ok: true }
  }

  const deletePackageRecord = (code) => {
    const denied = requireAdmin()
    if (denied) return denied

    setPackageRecords(prev => prev.filter(p => p.code !== code))
    return { ok: true }
  }

  const updateVerificationStatus = (id, status) => {
    const denied = requireAdmin()
    if (denied) return denied

    setVerificationLogs(prev =>
      prev.map(v => (v.id === id ? { ...v, status } : v))
    )
    return { ok: true }
  }

  return (
    <EcoContext.Provider
      value={{
        ecoCredits,
        co2Saved,
        packagesScanned,
        plantsGrown,
        wasteEntries,
        packageRecords,
        verificationLogs,
        addCredits,
        spendCredits,
        recordScan,
        findPackageByCode,
        recordPlant,
        addWasteEntry,
        addPackageRecord,
        updatePackageRecord,
        togglePackageStatus,
        deletePackageRecord,
        updateVerificationStatus,
      }}
    >
      {children}
    </EcoContext.Provider>
  )
}

export function useEco() {
  return useContext(EcoContext)
}
