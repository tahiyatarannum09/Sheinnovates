export default function LeafWrapLogo({ size = 40, showText = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle */}
        <circle cx="40" cy="40" r="38" fill="url(#logoGrad)" />

        {/* Shine overlay */}
        <ellipse cx="30" cy="22" rx="16" ry="8" fill="white" opacity="0.12" />

        {/* Leaf shape - main */}
        <path
          d="M40 14 C40 14, 62 22, 62 42 C62 56 52 65 40 65 C40 65 40 42 24 34 C18 30 16 24 20 20 C26 14 40 14 40 14Z"
          fill="white" opacity="0.95"
        />
        {/* Leaf vein center */}
        <path d="M40 64 C40 64 40 38 32 26" stroke="#1B4D3E" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        {/* Leaf veins */}
        <path d="M37 50 C34 46 30 44 27 44" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
        <path d="M39 42 C36 36 31 33 28 33" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
        <path d="M40 34 C38 28 35 24 33 22" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>

        {/* Wrap arc — the "W" idea, curved line around leaf */}
        <path
          d="M20 56 Q28 70 40 68 Q55 66 62 55"
          stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75"
        />
        {/* Wrap dots */}
        <circle cx="20" cy="56" r="2.5" fill="white" opacity="0.8"/>
        <circle cx="62" cy="55" r="2.5" fill="white" opacity="0.8"/>

        {/* Defs */}
        <defs>
          <radialGradient id="logoGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2d7a5a" />
            <stop offset="60%" stopColor="#1B4D3E" />
            <stop offset="100%" stopColor="#0f3528" />
          </radialGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-black text-[#1B4D3E]" style={{ fontSize: size * 0.4 }}>
            LeafWrap
          </span>
          <span className="font-semibold text-green-500 tracking-widest uppercase" style={{ fontSize: size * 0.18 }}>
            Eco Packaging
          </span>
        </div>
      )}
    </div>
  )
}
