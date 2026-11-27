import { useEffect, useRef, useState } from 'react'
import { useEco } from '../contexts/EcoContext'
import { CheckCircle2, AlertCircle, Award, Leaf, ChevronRight, Sparkles, QrCode, Keyboard, Camera, StopCircle } from 'lucide-react'
import AgriLoopLogo from '../components/ui/AgriLoopLogo'

function Cube3D({ scanning }) {
  return (
    <div className="cube-scene flex items-center justify-center h-32">
      <div className="cube" style={{ animationPlayState: scanning ? 'running' : 'paused' }}>
        <div className="face front">📦</div>
        <div className="face back">🌿</div>
        <div className="face left">♻️</div>
        <div className="face right">🌱</div>
        <div className="face top" style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>AL</div>
        <div className="face bottom" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>2026</div>
      </div>
    </div>
  )
}

export default function ScanPage() {
  const { packageRecords, findPackageByCode, recordScan } = useEco()
  const [mode, setMode] = useState('manual')
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraNotice, setCameraNotice] = useState('')

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const scanTimerRef = useRef(null)

  const activePackages = packageRecords.filter(p => p.status === 'Active')

  const stopCamera = () => {
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current)
      scanTimerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const verifyCode = (rawCode, method = 'Manual Entry') => {
    setError('')
    const pkg = findPackageByCode(rawCode)
    if (!pkg) {
      setError('Code not recognized. Try an active sample code below.')
      return
    }
    if (pkg.status !== 'Active') {
      setError(`Package ${pkg.code} is currently inactive and cannot be verified.`)
      return
    }

    stopCamera()
    setScanning(true)
    setTimeout(() => {
      setResult({ ...pkg, method })
      recordScan(pkg, method)
      setScanning(false)
    }, 1200)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    verifyCode(code, 'Manual Entry')
  }

  const startCameraScanner = async () => {
    setCameraNotice('')
    setError('')

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraNotice('Camera access is not available in this browser. Use a simulated QR scan below or switch to Manual Entry.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      setCameraActive(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 50)

      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        scanTimerRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return
          try {
            const barcodes = await detector.detect(videoRef.current)
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              verifyCode(barcodes[0].rawValue, 'QR Scan')
            }
          } catch {
            // Keep polling frame until valid QR detected
          }
        }, 500)
      } else {
        setCameraNotice('Live camera preview started. Automatic QR decoding requires BarcodeDetector; use a quick QR demo scan below.')
      }
    } catch {
      setCameraNotice('Camera permission was denied or unavailable. Use a quick QR demo scan below or Manual Entry.')
    }
  }

  const reset = () => {
    stopCamera()
    setResult(null)
    setCode('')
    setError('')
    setCameraNotice('')
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-5 pt-10 pb-6">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 mb-3">
          <AgriLoopLogo size={30} />
          <div>
            <h1 className="font-display text-2xl font-black text-white leading-none">Scan Pack</h1>
            <p className="text-blue-200 text-xs mt-0.5">Verify packaging & earn Eco Credits</p>
          </div>
        </div>

        {/* 3D Cube */}
        <Cube3D scanning={scanning || true} />

        {scanning && (
          <div className="text-center -mt-2">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-xs text-blue-200 font-medium">
              <div className="w-3 h-3 border-2 border-blue-300/40 border-t-blue-300 rounded-full animate-spin" />
              Verifying package authenticity...
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mt-5 space-y-4">
        {!result ? (
          <>
            {/* Mode Switcher */}
            <div className="card p-1 flex">
              <button
                type="button"
                onClick={() => {
                  stopCamera()
                  setMode('manual')
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'manual' ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-gray-400'
                }`}
              >
                <Keyboard size={14} /> Manual Code Entry
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('qr')
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'qr' ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-gray-400'
                }`}
              >
                <QrCode size={14} /> QR Code Scan
              </button>
            </div>

            {mode === 'manual' ? (
              <form onSubmit={handleSubmit} className="card p-5">
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Enter code  e.g. AL-2026-INIT01"
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#1B4D3E] rounded-2xl px-4 py-3.5 text-sm font-mono focus:outline-none transition-colors"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-xs mb-3 bg-red-50 border border-red-100 p-3 rounded-2xl">
                    <AlertCircle size={14} className="flex-shrink-0" /> {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!code.trim() || scanning}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {scanning
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                    : <><Sparkles size={15} /> Verify Package</>}
                </button>
              </form>
            ) : (
              <div className="card p-5 space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-800">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <QrCode size={36} className="text-green-400 mx-auto mb-2 opacity-80" />
                      <p className="text-xs text-slate-300 font-medium">
                        Point camera at an AgriLoop QR label
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Or simulate a QR scan using active packages below
                      </p>
                    </div>
                  )}
                </div>

                {cameraNotice && (
                  <div className="text-xs text-amber-800 bg-amber-50 border border-amber-100 p-3 rounded-2xl">
                    {cameraNotice}
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 p-3 rounded-2xl">
                    <AlertCircle size={14} className="flex-shrink-0" /> {error}
                  </div>
                )}

                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startCameraScanner}
                    disabled={scanning}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Camera size={15} /> Start Camera QR Scanner
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="w-full btn-secondary flex items-center justify-center gap-2 text-red-700 bg-red-50 border-red-100"
                  >
                    <StopCircle size={15} /> Stop Camera
                  </button>
                )}
              </div>
            )}

            {/* Active sample / registered codes */}
            <div className="card p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {mode === 'qr' ? '📷 Simulate QR scan for active package' : '🧪 Try a sample code'}
              </p>
              <div className="space-y-2">
                {activePackages.map((pkg) => (
                  <button
                    key={pkg.code}
                    type="button"
                    onClick={() => {
                      if (mode === 'qr') {
                        verifyCode(pkg.code, 'QR Scan')
                      } else {
                        setCode(pkg.code)
                      }
                    }}
                    className="w-full flex items-center justify-between bg-gray-50 hover:bg-green-50 rounded-2xl px-3 py-2.5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{pkg.emoji}</span>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-[#132E25]">{pkg.name}</p>
                        <p className="text-[10px] font-mono text-gray-400">{pkg.code}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4 page-enter">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white text-center">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <CheckCircle2 size={40} className="mx-auto mb-2" />
              <h2 className="font-display font-black text-2xl">Verified! ✅</h2>
              <p className="text-green-100 text-sm mt-1">{result.name}</p>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2.5 py-0.5">
                {result.method}
              </span>
            </div>
            <div className="card p-4 space-y-3">
              {[
                ['Package Code', result.code],
                ['Material', result.material],
                ['Embedded Seed', `${result.seed} 🌱`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400 font-medium">{l}</span>
                  <span className="text-sm font-semibold text-[#132E25]">{v}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center card-3d">
                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2"><Award size={20} className="text-amber-600" /></div>
                <p className="font-display font-black text-2xl text-amber-600">+{result.credits}</p>
                <p className="text-xs text-gray-400 mt-0.5">Eco Credits</p>
              </div>
              <div className="card p-4 text-center card-3d">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2"><Leaf size={20} className="text-green-600" /></div>
                <p className="font-display font-black text-2xl text-green-600">-{result.co2}kg</p>
                <p className="text-xs text-gray-400 mt-0.5">CO₂ Offset</p>
              </div>
            </div>
            <button onClick={reset} className="w-full btn-primary">Scan Another 📦</button>
          </div>
        )}
      </div>
      <div className="h-24" />
    </div>
  )
}
