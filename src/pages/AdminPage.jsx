import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
  ArrowRight,
  QrCode,
} from 'lucide-react'
import AgriLoopLogo from '../components/ui/AgriLoopLogo'
import UserProfileBar from '../components/auth/UserProfileBar'
import { useEco } from '../contexts/EcoContext'

const EMPTY_FORM = {
  code: '',
  name: '',
  material: '',
  seed: '',
  credits: '25',
  co2: '1.2',
  batch: '',
  emoji: '📦',
  status: 'Active',
}

const VERIFICATION_BADGES = {
  Verified: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Flagged: 'bg-red-100 text-red-700',
}

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const {
    packageRecords,
    verificationLogs,
    wasteEntries,
    addPackageRecord,
    updatePackageRecord,
    togglePackageStatus,
    deletePackageRecord,
    updateVerificationStatus,
  } = useEco()

  const [search, setSearch] = useState('')
  const [pkgStatusFilter, setPkgStatusFilter] = useState('all')
  const [verStatusFilter, setVerStatusFilter] = useState('all')

  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [feedback, setFeedback] = useState(null)

  const setTab = (tab) => {
    if (tab === 'overview') {
      setSearchParams({})
    } else {
      setSearchParams({ tab })
    }
  }

  const activePackagesCount = useMemo(
    () => packageRecords.filter(p => p.status === 'Active').length,
    [packageRecords]
  )

  const totalVerifiedCo2 = useMemo(
    () =>
      verificationLogs
        .filter(v => v.status === 'Verified')
        .reduce((sum, v) => sum + Number(v.co2 || 0), 0)
        .toFixed(1),
    [verificationLogs]
  )

  const totalCreditsIssued = useMemo(
    () =>
      verificationLogs
        .filter(v => v.status === 'Verified')
        .reduce((sum, v) => sum + Number(v.credits || 0), 0),
    [verificationLogs]
  )

  const filteredPackages = useMemo(() => {
    const q = search.trim().toLowerCase()
    return packageRecords.filter(p => {
      const matchesStatus = pkgStatusFilter === 'all' || p.status === pkgStatusFilter
      const matchesQuery =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.seed.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [packageRecords, search, pkgStatusFilter])

  const filteredVerifications = useMemo(() => {
    return verificationLogs.filter(
      v => verStatusFilter === 'all' || v.status === verStatusFilter
    )
  }, [verificationLogs, verStatusFilter])

  const openCreateForm = () => {
    setEditingCode(null)
    setForm(EMPTY_FORM)
    setFeedback(null)
    setShowForm(true)
  }

  const openEditForm = (pkg) => {
    setEditingCode(pkg.code)
    setForm({
      code: pkg.code,
      name: pkg.name,
      material: pkg.material,
      seed: pkg.seed,
      credits: String(pkg.credits),
      co2: String(pkg.co2),
      batch: pkg.batch || '',
      emoji: pkg.emoji || '📦',
      status: pkg.status || 'Active',
    })
    setFeedback(null)
    setShowForm(true)
  }

  const handleSavePackage = (e) => {
    e.preventDefault()
    setFeedback(null)

    if (editingCode) {
      const res = updatePackageRecord(editingCode, {
        name: form.name,
        material: form.material,
        seed: form.seed,
        credits: form.credits,
        co2: form.co2,
        batch: form.batch,
        emoji: form.emoji,
        status: form.status,
      })
      if (!res.ok) {
        setFeedback({ type: 'error', text: res.error })
        return
      }
      setFeedback({ type: 'success', text: `Updated package ${editingCode}.` })
    } else {
      const res = addPackageRecord(form)
      if (!res.ok) {
        setFeedback({ type: 'error', text: res.error })
        return
      }
      setFeedback({ type: 'success', text: `Created package ${res.record.code}.` })
    }

    setShowForm(false)
    setEditingCode(null)
    setForm(EMPTY_FORM)
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#071f14] via-[#0f3528] to-[#1B4D3E] px-5 pt-9 pb-6">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <AgriLoopLogo size={36} />
            <div>
              <h1 className="font-display text-xl font-black text-white leading-none">
                Admin Console
              </h1>
              <p className="text-green-200/80 text-xs mt-0.5">
                Package records & verification control
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-300/30 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
            <ShieldCheck size={11} /> Admin
          </span>
        </div>

        <div className="relative">
          <UserProfileBar variant="dark" />
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="px-4 -mt-3 relative z-10 space-y-2">
        <div className="card p-1 flex gap-1">
          {[
            ['overview', 'Overview'],
            ['packages', 'Packages'],
            ['verifications', 'Verifications'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-xs font-bold rounded-2xl transition-all ${
                activeTab === key
                  ? 'bg-[#1B4D3E] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#132E25]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Quick jump to Consumer QR scan experience */}
        <Link
          to="/scan"
          className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-[#1B4D3E] transition-colors"
        >
          <div className="flex items-center gap-2">
            <QrCode size={15} className="text-emerald-700" />
            <span>Switch to Consumer Packaging QR Scanner</span>
          </div>
          <ArrowRight size={14} className="text-emerald-700" />
        </Link>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs flex items-center justify-between gap-2 border ${
              feedback.type === 'error'
                ? 'bg-red-50 border-red-100 text-red-700'
                : 'bg-green-50 border-green-100 text-green-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Package Records', value: packageRecords.length, emoji: '📦', bg: 'bg-violet-50', text: 'text-violet-700' },
                { label: 'Active Codes', value: activePackagesCount, emoji: '✅', bg: 'bg-green-50', text: 'text-green-700' },
                { label: 'Verifications', value: verificationLogs.length, emoji: '🔍', bg: 'bg-blue-50', text: 'text-blue-700' },
                { label: 'Verified CO₂', value: `${totalVerifiedCo2}kg`, emoji: '🌍', bg: 'bg-amber-50', text: 'text-amber-700' },
              ].map(({ label, value, emoji, bg, text }) => (
                <div key={label} className="card p-4 flex items-center gap-3">
                  <div className={`${bg} w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0`}>
                    {emoji}
                  </div>
                  <div>
                    <p className={`font-display font-black text-xl leading-none stat-number ${text}`}>
                      {value}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 font-medium">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="section-title mb-0">Recent Verification Activity</p>
                <button
                  onClick={() => setTab('verifications')}
                  className="text-xs font-semibold text-[#1B4D3E] hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {verificationLogs.slice(0, 3).map(v => (
                  <div key={v.id} className="bg-gray-50 rounded-2xl p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#132E25] truncate">
                        {v.packageName} <span className="font-mono text-gray-400">({v.code})</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {v.verifiedBy} · {v.method} · {v.timestamp}
                      </p>
                    </div>
                    <span className={`badge flex-shrink-0 ${VERIFICATION_BADGES[v.status] || 'bg-gray-100 text-gray-600'}`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="section-title mb-0">Operations Summary</p>
                <span className="badge bg-green-100 text-green-700">Demo State</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-400">Credits Issued</p>
                  <p className="font-display font-black text-lg text-[#1B4D3E]">{totalCreditsIssued}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-400">Waste Logs</p>
                  <p className="font-display font-black text-lg text-teal-700">{wasteEntries.length} entries</p>
                </div>
              </div>
              <button
                onClick={() => setTab('packages')}
                className="w-full btn-primary mt-2 flex items-center justify-center gap-2"
              >
                <Package size={15} /> Manage Package Records
              </button>
            </div>
          </>
        )}

        {/* PACKAGES TAB */}
        {activeTab === 'packages' && (
          <>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search code, name, seed..."
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>
              <button
                onClick={openCreateForm}
                className="bg-[#1B4D3E] text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform flex-shrink-0"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="flex gap-2">
              {['all', 'Active', 'Inactive'].map(status => (
                <button
                  key={status}
                  onClick={() => setPkgStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                    pkgStatusFilter === status
                      ? 'bg-[#1B4D3E] text-white'
                      : 'bg-white text-gray-500 border border-gray-100'
                  }`}
                >
                  {status === 'all' ? `All (${packageRecords.length})` : status}
                </button>
              ))}
            </div>

            {showForm && (
              <form onSubmit={handleSavePackage} className="card p-4 space-y-3 border border-green-100">
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-sm text-[#132E25]">
                    {editingCode ? `Edit ${editingCode}` : 'New Package Record'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={form.code}
                    disabled={Boolean(editingCode)}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="Code (e.g. AL-2026-HEMP05)"
                    className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono disabled:opacity-60"
                    required
                  />
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Package name"
                    className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                  <input
                    value={form.material}
                    onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
                    placeholder="Material composition"
                    className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    value={form.seed}
                    onChange={e => setForm(f => ({ ...f, seed: e.target.value }))}
                    placeholder="Embedded seed"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    value={form.batch}
                    onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                    placeholder="Batch ID"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    min="1"
                    value={form.credits}
                    onChange={e => setForm(f => ({ ...f, credits: e.target.value }))}
                    placeholder="Credits"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={form.co2}
                    onChange={e => setForm(f => ({ ...f, co2: e.target.value }))}
                    placeholder="CO₂ (kg)"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 btn-primary py-2.5 text-xs">
                    {editingCode ? 'Save Changes' : 'Create Package'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 btn-secondary py-2.5 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {filteredPackages.map(pkg => (
                <div key={pkg.code} className="card p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                        {pkg.emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-[#132E25] truncate">{pkg.name}</p>
                        <p className="text-[11px] font-mono text-gray-400">{pkg.code}</p>
                      </div>
                    </div>
                    <span
                      className={`badge flex-shrink-0 ${
                        pkg.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 grid grid-cols-2 gap-1 bg-gray-50 rounded-2xl p-2.5">
                    <span>Material: <strong className="text-[#132E25]">{pkg.material}</strong></span>
                    <span>Seed: <strong className="text-[#132E25]">{pkg.seed}</strong></span>
                    <span>Reward: <strong className="text-amber-700">+{pkg.credits} cr</strong></span>
                    <span>CO₂ Offset: <strong className="text-green-700">{pkg.co2} kg</strong></span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(pkg)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => togglePackageStatus(pkg.code)}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-[#1B4D3E] rounded-xl py-2 text-xs font-semibold"
                    >
                      {pkg.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deletePackageRecord(pkg.code)}
                      aria-label={`Delete ${pkg.code}`}
                      className="bg-red-50 hover:bg-red-100 text-red-600 rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-center"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VERIFICATIONS TAB */}
        {activeTab === 'verifications' && (
          <>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['all', 'Verified', 'Pending', 'Flagged'].map(st => (
                <button
                  key={st}
                  onClick={() => setVerStatusFilter(st)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                    verStatusFilter === st
                      ? 'bg-[#1B4D3E] text-white'
                      : 'bg-white text-gray-500 border border-gray-100'
                  }`}
                >
                  {st === 'all' ? `All (${verificationLogs.length})` : st}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredVerifications.map(v => (
                <div key={v.id} className="card p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <ClipboardCheck size={14} className="text-[#1B4D3E] flex-shrink-0" />
                        <p className="font-bold text-sm text-[#132E25] truncate">{v.packageName}</p>
                      </div>
                      <p className="text-[11px] font-mono text-gray-400 mt-0.5">{v.code}</p>
                    </div>
                    <span className={`badge flex-shrink-0 ${VERIFICATION_BADGES[v.status] || 'bg-gray-100 text-gray-600'}`}>
                      {v.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 bg-gray-50 rounded-2xl p-2.5 space-y-1">
                    <p>Customer: <strong className="text-[#132E25]">{v.verifiedBy}</strong></p>
                    <p>
                      Method: <strong className="text-[#132E25]">{v.method}</strong> ·{' '}
                      Time: <strong className="text-[#132E25]">{v.timestamp}</strong>
                    </p>
                    <p>
                      Impact: <strong className="text-amber-700">+{v.credits} cr</strong> ·{' '}
                      <strong className="text-green-700">-{v.co2} kg CO₂</strong>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {['Verified', 'Pending', 'Flagged'].map(nextStatus => (
                      <button
                        key={nextStatus}
                        disabled={v.status === nextStatus}
                        onClick={() => updateVerificationStatus(v.id, nextStatus)}
                        className={`flex-1 rounded-xl py-1.5 text-[11px] font-semibold transition-all disabled:opacity-40 ${
                          nextStatus === 'Verified'
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : nextStatus === 'Flagged'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {nextStatus}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="h-24" />
    </div>
  )
}
