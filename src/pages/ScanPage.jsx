import { useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { QrCode, CheckCircle2, AlertCircle, Leaf, Award } from 'lucide-react'

const SAMPLE_CODES = {
  'LW-2026-INIT01': { name: 'Bagasse Courier Box', material: 'Sugarcane Bagasse 30%', seed: 'Basil', credits: 25, co2: 1.2 },
  'LW-2026-AREC02': { name: 'Areca Fiber Trio', material: 'Fallen Areca Fronds', seed: 'Wildflower', credits: 30, co2: 1.6 },
  'LW-2026-BANA03': { name: 'Banana Stem Box', material: 'Banana Stem Fiber & Bio-Carbon', seed: 'Mint', credits: 28, co2: 1.4 },
  'LW-2026-RICE04': { name: 'Rice Straw Composite', material: 'Bio-Polymer & Rice Straw', seed: 'Coriander', credits: 22, co2: 1.0 },
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
      }, 1200)
    } else {
      setError('QR code not recognized. Try one of the sample codes below.')
    }
  }

  const reset = () => { setResult(null); setCode(''); setError('') }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#1B4D3E] to-[#2d6b56] text-white px-5 pt-10 pb-6">
        <h1 className="font-display text-2xl font-extrabold mb-1">Scan Package 📦</h1>
        <p className="text-green-100 text-sm">Enter the serial code from your eco packaging to earn Eco Credits.</p>
      </div>

      <div className="px-4 mt-5">
        {!result ? (
          <>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
                  <QrCode size={40} className="text-[#1B4D3E]" />
                </div>
                <p className="text-sm text-gray-500 text-center">Enter the serial code printed on your eco smart packaging</p>
              </div>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. LW-2026-INIT01"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30 mb-3"
              />
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs mb-3 bg-red-50 p-2 rounded-lg">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <button
                type="submit"
                disabled={!code.trim() || scanning}
                className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 transition-opacity"
              >
                {scanning ? 'Verifying...' : 'Verify Package'}
              </button>
            </form>

            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-xs font-semibold text-green-800 mb-2">🧪 Sample Codes to Try:</p>
              {Object.keys(SAMPLE_CODES).map(k => (
                <button key={k} onClick={() => setCode(k)}
                  className="block text-xs text-green-700 font-mono hover:underline mb-1 text-left">
                  {k}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={24} className="text-green-600" />
              <span className="font-display font-bold text-lg text-[#132E25]">Package Verified!</span>
            </div>
            <div className="bg-green-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Product</span>
                <span className="font-semibold text-[#132E25]">{result.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Material</span>
                <span className="font-semibold text-[#132E25]">{result.material}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Embedded Seed</span>
                <span className="font-semibold text-green-700">{result.seed} 🌱</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <Award size={18} className="text-amber-600 mx-auto mb-1" />
                <p className="font-display font-bold text-xl text-amber-700">+{result.credits}</p>
                <p className="text-xs text-amber-600">Eco Credits Earned</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <Leaf size={18} className="text-green-600 mx-auto mb-1" />
                <p className="font-display font-bold text-xl text-green-700">-{result.co2}kg</p>
                <p className="text-xs text-green-600">CO₂ Offset</p>
              </div>
            </div>
            <button onClick={reset}
              className="w-full bg-[#1B4D3E] text-white rounded-xl py-3 font-semibold text-sm">
              Scan Another Package
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

