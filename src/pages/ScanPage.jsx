import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { QrCode, CheckCircle2, AlertCircle, Award, Leaf, ChevronRight, Sparkles } from 'lucide-react'

const SAMPLE_CODES = {
  'LW-2026-INIT01': { name: 'Bagasse Courier Box', material: 'Sugarcane Bagasse 30%', seed: 'Basil', credits: 25, co2: 1.2, emoji: '🌾' },
  'LW-2026-AREC02': { name: 'Areca Fiber Trio', material: 'Fallen Areca Fronds', seed: 'Wildflower', credits: 30, co2: 1.6, emoji: '🌴' },
  'LW-2026-BANA03': { name: 'Banana Stem Box', material: 'Banana Stem Fiber & Bio-Carbon', seed: 'Mint', credits: 28, co2: 1.4, emoji: '🍌' },
  'LW-2026-RICE04': { name: 'Rice Straw Composite', material: 'Bio-Polymer & Rice Straw', seed: 'Coriander', credits: 22, co2: 1.0, emoji: '🌾' },
}

export default function ScanPage() {
  const { recordScan } = useEco()
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const trimmed = code.trim().toUpperCase()
    if (SAMPLE_CODES[trimmed]) {
      setScanning(true)
      setTimeout(() => {
        setResult(SAMPLE_CODES[trimmed])
        recordScan()
        setScanning(false)
      }, 1400)
    } else {
      setError('Code not recognized. Try a sample code below.')
    }
  }

  const reset = () => { setResult(null); setCode(''); setError('') }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-5 pt-14 pb-8">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        <h1 className="font-display text-3xl font-black text-white mb-1">Scan Pack 📦</h1>
        <p className="text-blue-200 text-sm">Enter your packaging serial code to verify & earn Eco Credits</p>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {!result ? (
          <>
            {/* Scanner card */}
            <div className="card p-5">
              {/* QR visual */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1B4D3E] to-[#2d7a5a] flex items-center justify-center shadow-lg shadow-green-900/30 mb-3">
                    <QrCode size={42} className="text-white" />
                  </div>
                  {scanning && (
                    <div className="absolute inset-0 rounded-3xl border-2 border-green-400 animate-ping opacity-60" />
                  )}
                </div>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  Enter the serial code printed on your eco smart packaging box
                </p>
              </div>

              {/* Input */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="e.g. LW-2026-INIT01"
                  className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl px-4 py-3.5 text-sm font-mono focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs mb-3 bg-red-50 border border-red-100 p-3 rounded-2xl">
                  <AlertCircle size={14} className="flex-shrink-0" /> {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!code.trim() || scanning}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {scanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying Package...
                  </>
                ) : (
                  <><Sparkles size={15} /> Verify Package</>
                )}
              </button>
            </div>

            {/* Sample codes */}
            <div className="card p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🧪 Try a sample code</p>
              <div className="space-y-2">
                {Object.entries(SAMPLE_CODES).map(([key, val]) => (
                  <button key={key} onClick={() => setCode(key)}
                    className="w-full flex items-center justify-between bg-gray-50 hover:bg-green-50 rounded-2xl px-3 py-2.5 transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{val.emoji}</span>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-[#132E25]">{val.name}</p>
                        <p className="text-[10px] font-mono text-gray-400">{key}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="space-y-4 page-enter">
            {/* Celebration banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white text-center">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize:'30px 30px'}} />
              <CheckCircle2 size={40} className="mx-auto mb-2" />
              <h2 className="font-display font-black text-2xl">Package Verified!</h2>
              <p className="text-green-100 text-sm mt-1">{result.name}</p>
            </div>

            {/* Details */}
            <div className="card p-4 space-y-3">
              {[
                { label: 'Material', value: result.material },
                { label: 'Embedded Seed', value: `${result.seed} 🌱` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400 font-medium">{label}</span>
                  <span className="text-sm font-semibold text-[#132E25]">{value}</span>
                </div>
              ))}
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center">
                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Award size={20} className="text-amber-600" />
                </div>
                <p className="font-display font-black text-2xl text-amber-600">+{result.credits}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Eco Credits</p>
              </div>
              <div className="card p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Leaf size={20} className="text-green-600" />
                </div>
                <p className="font-display font-black text-2xl text-green-600">-{result.co2}kg</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">CO₂ Offset</p>
              </div>
            </div>

            <button onClick={reset} className="w-full btn-primary">
              Scan Another Package 📦
            </button>
          </div>
        )}
      </div>
      <div className="h-24" />
    </div>
  )
}
