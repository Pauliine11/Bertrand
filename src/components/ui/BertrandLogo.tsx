export function BertrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient minimal - noir à gris */}
        <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#111827', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#374151', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Gradient accent indigo subtil */}
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Cercle de fond minimaliste */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="none" 
        stroke="#e5e7eb" 
        strokeWidth="1.5"
      />

      {/* Cercle intérieur avec gradient */}
      <circle 
        cx="100" 
        cy="100" 
        r="75" 
        fill="white" 
        stroke="url(#minimalGradient)" 
        strokeWidth="2"
      />

      {/* Lettre B élégante et moderne */}
      <text
        x="100"
        y="128"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="90"
        fontWeight="300"
        fill="url(#minimalGradient)"
        textAnchor="middle"
        letterSpacing="-2"
      >
        B
      </text>

      {/* Petit accent indigo en haut - minimaliste */}
      <circle 
        cx="100" 
        cy="40" 
        r="4" 
        fill="url(#accentGradient)"
      />

      {/* Ligne décorative simple sous le B */}
      <line
        x1="70"
        y1="145"
        x2="130"
        y2="145"
        stroke="url(#accentGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Détail géométrique minimaliste - petit carré */}
      <rect
        x="96"
        y="155"
        width="8"
        height="8"
        fill="none"
        stroke="url(#minimalGradient)"
        strokeWidth="1"
        transform="rotate(45, 100, 159)"
      />
    </svg>
  );
}
