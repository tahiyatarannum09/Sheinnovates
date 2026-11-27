import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEco } from '../contexts/EcoContext'
import { 
  CheckCircle2, AlertCircle, Award, Leaf, ChevronRight, Sparkles, 
  QrCode, Keyboard, Camera, StopCircle, Maximize2, X, RefreshCw, Sprout, ArrowRight
} from 'lucide-react'
import AgriLoopLogo from '../components/ui/AgriLoopLogo'
import QRCode from 'qrcode'

// Web Audio API feedback for scan confirmation
function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, now) // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12) // G5
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  } catch {
    // Ignore audio autoplay restrictions
  }
}

function Cube3D({ scanning }) {
  return (
    <div className="cube-scene flex items-center justify-center h-28">
      <div className="cube" style={{ animationPlayState: scanning ? 'running' : 'paused' }}>
        <div className="face front">📦</div>
        <div className="face back">🌿</div>
        <div className="face left">♻️</div>
        <div className="face right">🌱</div>
        <div className="face top" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 800 }}>AL</div>
        <div className="face bottom" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 800 }}>2026</div>
      </div>
    </div>
  )
}

export default function ScanPage() {
  const { packageRecords, findPackageByCode, recordScan, ecoCredits, co2Saved } = useEco()

  // Mode: 'dummy-qr' | 'camera' | 'manual'
  const [mode, setMode] = useState('dummy-qr')
  const [selectedPkgCode, setSelectedPkgCode] = useState('AL-2026-INIT01')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrModalOpen, setQrModalOpen] = useState(false)

  // Manual entry code
  const [manualCode, setManualCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)

  // Camera state
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraNotice, setCameraNotice] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const scanTimerRef = useRef(null)

  const activePackages = packageRecords.filter(p => p.status === 'Active')
  const currentPackage = activePackages.find(p => p.code === selectedPkgCode) || activePackages[0] || packageRecords[0]

  // Generate crisp QR Data URL whenever active package changes
  useEffect(() => {
    if (!currentPackage) return
    QRCode.toDataURL(currentPackage.code, {
      width: 260,
      margin: 1,
      color: {
        dark: '#132E25',
        light: '#FFFFFF',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate packaging QR code', err))
  }, [currentPackage])

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

  const verifyAndAddPoints = (rawCode, method = 'Dummy Packaging QR') => {
    setError('')
    const pkg = findPackageByCode(rawCode)
    if (!pkg) {
      setError('Code not recognized. Please choose or enter an active sample package code.')
      return
    }
    if (pkg.status !== 'Active') {
      setError(`Package ${pkg.code} is currently inactive and cannot be verified.`)
      return
    }

    stopCamera()
    setScanning(true)

    // Realistic scanning duration + ledger verification
    setTimeout(() => {
      playSuccessChime()
      setResult({ ...pkg, method })
      recordScan(pkg, method)
      setScanning(false)
    }, 1200)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    verifyAndAddPoints(manualCode, 'Manual Code Entry')
  }

  const handleScanDummyQr = () => {
    if (!currentPackage) return
    verifyAndAddPoints(currentPackage.code, 'Packaging QR Scan')
  }

  const startCameraScanner = async () => {
    setCameraNotice('')
    setError('')

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraNotice('Camera access is not available in this browser. Use the Dummy Packaging QR scanner above.')
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
      }, 80)

      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        scanTimerRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return
          try {
            const barcodes = await detector.detect(videoRef.current)
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              verifyAndAddPoints(barcodes[0].rawValue, 'Live Camera QR Scan')
            }
          } catch {
            // Keep polling
          }
        }, 500)
      } else {
        setCameraNotice('Live camera active. Point your camera at a packaging QR code, or click Simulate Scan below.')
      }
    } catch {
      setCameraNotice('Camera permission was denied. You can test instantly with the Dummy Packaging QR tab.')
    }
  }

  const reset = () => {
    stopCamera()
    setResult(null)
    setManualCode('')
    setError('')
    setCameraNotice('')
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] page-enter font-sans pb-10">
      {/* Top Banner with Eco Points Telemetry */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#071f14] via-[#0f3528] to-[#1B4D3E] px-5 pt-8 pb-6 shadow-md">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <AgriLoopLogo size={32} />
            <div>
              <h1 className="font-display text-xl font-black text-white leading-tight">
                Scan Packaging
              </h1>
              <p className="text-emerald-200/80 text-[11px]">
                Verify bio-packaging &amp; earn Eco-Credits
              </p>
            </div>
          </div>

          {/* Live Eco Credits Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-1.5 text-right flex items-center gap-2 shadow-sm">
            <Award size={16} className="text-amber-400" />
            <div>
              <div className="font-display font-black text-sm text-white leading-none">
                {ecoCredits} <span className="text-[10px] font-normal text-emerald-200">PTS</span>
              </div>
              <div className="text-[9px] text-emerald-300 font-medium">
                {co2Saved}kg CO₂
              </div>
            </div>
          </div>
        </div>

        {/* 3D Cube */}
        <Cube3D scanning={scanning} />

        {scanning && (
          <div className="text-center -mt-1">
            <div className="inline-flex items-center gap-2 bg-emerald-500/25 border border-emerald-400/40 rounded-full px-3.5 py-1 text-xs text-emerald-100 font-bold shadow-sm animate-pulse">
              <div className="w-3.5 h-3.5 border-2 border-emerald-300/40 border-t-emerald-300 rounded-full animate-spin" />
              Scanning &amp; Verifying Packaging QR...
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mt-4 space-y-4">
        {!result ? (
          <>
            {/* Mode Switcher */}
            <div className="card p-1 flex bg-white/95 border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  stopCamera()
                  setMode('dummy-qr')
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'dummy-qr'
                    ? 'bg-[#1B4D3E] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#1B4D3E]'
                }`}
              >
                <QrCode size={14} /> Dummy Packaging QR
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('camera')
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'camera'
                    ? 'bg-[#1B4D3E] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#1B4D3E]'
                }`}
              >
                <Camera size={14} /> Camera Scan
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera()
                  setMode('manual')
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'manual'
                    ? 'bg-[#1B4D3E] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#1B4D3E]'
                }`}
              >
                <Keyboard size={14} /> Manual Code
              </button>
            </div>

            {/* MODE 1: DUMMY PACKAGING QR CODE */}
            {mode === 'dummy-qr' && (
              <div className="space-y-4">
                {/* Packaging Box / Label Mockup Card */}
                <div className="card p-5 bg-gradient-to-b from-[#FAF7F0] to-[#F3EEE3] border-2 border-[#D9CEBA] shadow-md relative overflow-hidden">
                  {/* Bio Packaging Tag Header */}
                  <div className="flex items-center justify-between border-b border-[#D9CEBA] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentPackage.emoji}</span>
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#8C7A5E] tracking-widest block">
                          AgriLoop™ Smart Packaging
                        </span>
                        <h2 className="font-display font-black text-sm text-[#3E3224]">
                          {currentPackage.name}
                        </h2>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold bg-[#E8DEC9] text-[#594833] px-2 py-0.5 rounded-lg border border-[#D9CEBA]">
                      {currentPackage.code}
                    </span>
                  </div>

                  {/* QR Code Container with Laser Scanning Line Effect */}
                  <div className="relative mx-auto my-2 w-48 h-48 bg-white p-2.5 rounded-2xl border-2 border-[#D9CEBA] shadow-inner flex items-center justify-center group">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR Code for ${currentPackage.code}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    )}

                    {/* Laser Scanning Animation overlay when scanning is triggered */}
                    {scanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 shadow-[0_0_12px_#10B981] animate-bounce" />
                    )}

                    {/* Enlarge Button */}
                    <button
                      type="button"
                      onClick={() => setQrModalOpen(true)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-xl bg-white/90 hover:bg-white text-gray-700 shadow-md border border-gray-200 transition-all active:scale-95"
                      title="Enlarge QR Code for phone scan"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>

                  {/* Packaging Bio-Specs Pill */}
                  <div className="mt-3 p-2.5 rounded-2xl bg-white/80 border border-[#D9CEBA] text-[11px] space-y-1.5 text-[#594833]">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Material Source:</span>
                      <strong className="text-[#3E3224]">{currentPackage.material}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Embedded Seed:</span>
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        {currentPackage.seed} 🌱
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Scan Reward:</span>
                      <span className="font-bold text-amber-700">
                        +{currentPackage.credits} Eco Credits · -{currentPackage.co2}kg CO₂
                      </span>
                    </div>
                  </div>

                  {/* Primary Trigger Button: Scan This Dummy QR */}
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={handleScanDummyQr}
                      disabled={scanning}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#1B4D3E] hover:bg-[#143B30] active:scale-95 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {scanning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Verifying &amp; Crediting Points...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="text-emerald-300" />
                          <span>Scan Packaging QR &amp; Claim +{currentPackage.credits} Pts</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setQrModalOpen(true)}
                      className="w-full py-2 px-3 rounded-xl bg-white/70 hover:bg-white text-gray-700 text-xs font-semibold border border-[#D9CEBA] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Maximize2 size={13} />
                      <span>Display Large QR for Smartphone Camera Scan</span>
                    </button>
                  </div>
                </div>

                {/* Sample Packaging Selectors */}
                <div className="card p-4 bg-white border border-gray-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
                      📦 Select Prototype Packaging Label
                    </p>
                    <span className="text-[10px] text-gray-400">4 Active Prototypes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {activePackages.map((pkg) => {
                      const isSelected = pkg.code === selectedPkgCode
                      return (
                        <button
                          key={pkg.code}
                          type="button"
                          onClick={() => {
                            setSelectedPkgCode(pkg.code)
                            setError('')
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">{pkg.emoji}</span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded-md">
                              +{pkg.credits} pts
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#132E25] truncate">{pkg.name}</p>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">{pkg.code}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: CAMERA SCANNER */}
            {mode === 'camera' && (
              <div className="card p-5 space-y-3.5 bg-white border border-gray-200">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-800 shadow-inner">
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
                      <QrCode size={40} className="text-emerald-400 mx-auto mb-2 opacity-80" />
                      <p className="text-xs text-slate-200 font-bold">
                        Point device camera at AgriLoop Packaging QR
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                        Or simulate camera detection for active package <span className="font-mono text-emerald-300">{currentPackage.code}</span>
                      </p>
                    </div>
                  )}

                  {/* Target Crosshair */}
                  <div className="absolute inset-8 border border-white/20 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-emerald-400/60 rounded-lg animate-pulse" />
                  </div>
                </div>

                {cameraNotice && (
                  <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                    {cameraNotice}
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 p-3 rounded-2xl">
                    <AlertCircle size={14} className="flex-shrink-0" /> {error}
                  </div>
                )}

                <div className="space-y-2">
                  {!cameraActive ? (
                    <button
                      type="button"
                      onClick={startCameraScanner}
                      disabled={scanning}
                      className="w-full btn-primary py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold"
                    >
                      <Camera size={15} /> Start Live Camera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="w-full py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                    >
                      <StopCircle size={15} /> Stop Camera
                    </button>
                  )}

                  {/* Simulated Camera Detection Button */}
                  <button
                    type="button"
                    onClick={() => verifyAndAddPoints(currentPackage.code, 'Camera Viewfinder Detection')}
                    disabled={scanning}
                    className="w-full py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#1B4D3E] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>Detect QR Code in Viewfinder ({currentPackage.code})</span>
                  </button>
                </div>
              </div>
            )}

            {/* MODE 3: MANUAL CODE ENTRY */}
            {mode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="card p-5 space-y-3.5 bg-white border border-gray-200">
                <div>
                  <label htmlFor="package-code" className="block text-xs font-bold text-[#132E25] mb-1.5">
                    Enter Packaging Serial Code
                  </label>
                  <input
                    id="package-code"
                    type="text"
                    value={manualCode}
                    onChange={e => setManualCode(e.target.value)}
                    placeholder="e.g. AL-2026-INIT01"
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#1B4D3E] rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none transition-colors"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 p-3 rounded-2xl">
                    <AlertCircle size={14} className="flex-shrink-0" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!manualCode.trim() || scanning}
                  className="w-full btn-primary py-3 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 font-bold text-xs"
                >
                  {scanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Verifying on Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Verify Code &amp; Claim Credits</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        ) : (
          /* RESULT VERIFICATION CELEBRATION VIEW */
          <div className="space-y-4 page-enter">
            {/* Header Celebration Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-[#1B4D3E] to-[#0f3528] p-6 text-white text-center shadow-xl">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 size={32} className="text-emerald-300" />
              </div>
              <h2 className="font-display font-black text-2xl">Verified Authentic! ✅</h2>
              <p className="text-emerald-100 text-sm mt-1 font-medium">{result.name}</p>
              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-3 py-1 font-mono">
                  {result.code}
                </span>
                <span className="text-[10px] font-bold bg-amber-400 text-amber-950 rounded-full px-2.5 py-0.5">
                  {result.method}
                </span>
              </div>
            </div>

            {/* Reward Points Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center bg-white border border-amber-200 shadow-sm">
                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Award size={20} className="text-amber-600" />
                </div>
                <p className="font-display font-black text-2xl text-amber-600 leading-none">
                  +{result.credits}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-semibold">Eco Credits Added</p>
                <p className="text-[10px] text-amber-700 mt-0.5 font-bold">
                  New Balance: {ecoCredits} pts
                </p>
              </div>

              <div className="card p-4 text-center bg-white border border-emerald-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Leaf size={20} className="text-emerald-600" />
                </div>
                <p className="font-display font-black text-2xl text-emerald-600 leading-none">
                  -{result.co2}kg
                </p>
                <p className="text-xs text-gray-500 mt-1 font-semibold">CO₂ Offset</p>
                <p className="text-[10px] text-emerald-700 mt-0.5 font-bold">
                  Lifetime: {co2Saved}kg
                </p>
              </div>
            </div>

            {/* Packaging Circular Information */}
            <div className="card p-4 space-y-2.5 bg-white border border-gray-200 shadow-sm">
              <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                🌱 Circular Packaging Lifecycle
              </p>
              {[
                ['Material Composition', result.material],
                ['Embedded Seed Species', `${result.seed} Seed 🌱`],
                ['Feedstock Origin', 'Post-Harvest Agricultural Residue'],
                ['Decomposition Time', '30–60 Days in Soil / Compost'],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-xs"
                >
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="font-bold text-[#132E25] text-right">{val}</span>
                </div>
              ))}
            </div>

            {/* Garden Action Navigation */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                  <Sprout size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#132E25]">Plant your {result.seed} Seed!</h4>
                  <p className="text-[11px] text-emerald-800">
                    Bury this packaging in soil and track growth stages.
                  </p>
                </div>
              </div>
              <Link
                to="/garden"
                className="text-xs font-bold bg-[#1B4D3E] text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-[#143B30] transition-colors"
              >
                <span>Garden</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="flex-1 btn-primary py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Scan Another Packaging</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: LARGE ENLARGED DUMMY QR CODE FOR PHONE SCANNING */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-sm bg-white border border-gray-200 shadow-2xl p-5 rounded-3xl text-center space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <AgriLoopLogo size={24} />
                <h3 className="text-sm font-bold text-[#132E25]">
                  Packaging QR Label ({currentPackage.code})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#FAF7F0] p-4 rounded-2xl border-2 border-[#D9CEBA] inline-block shadow-inner">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${currentPackage.name}`}
                  className="w-56 h-56 mx-auto object-contain bg-white p-2 rounded-xl"
                />
              )}
              <div className="mt-2 text-xs font-bold text-[#3E3224]">
                {currentPackage.name}
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                Reward: +{currentPackage.credits} Eco Credits · {currentPackage.seed}
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-tight">
              📸 Point your iPhone, Android, or Google Lens camera directly at this QR code on screen.
            </p>

            <button
              type="button"
              onClick={() => {
                setQrModalOpen(false)
                handleScanDummyQr()
              }}
              className="w-full btn-primary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Directly Scan &amp; Add +{currentPackage.credits} Points Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
