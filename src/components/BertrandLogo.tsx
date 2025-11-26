export function BertrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cercle de fond avec dégradé or */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="burgundyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#722f37', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b2635', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Fond circulaire */}
      <circle cx="100" cy="100" r="95" fill="url(#burgundyGradient)" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />

      {/* Lettre B stylisée en majuscule élégante */}
      <text
        x="100"
        y="135"
        fontFamily="serif"
        fontSize="110"
        fontWeight="700"
        fill="url(#goldGradient)"
        textAnchor="middle"
        style={{ fontStyle: 'italic' }}
      >
        B
      </text>

      {/* Noeud papillon du majordome sous le B */}
      <g transform="translate(100, 160)">
        {/* Partie gauche du noeud */}
        <path
          d="M -20,-5 L -35,-15 L -35,5 Z"
          fill="url(#goldGradient)"
        />
        {/* Partie droite du noeud */}
        <path
          d="M 20,-5 L 35,-15 L 35,5 Z"
          fill="url(#goldGradient)"
        />
        {/* Centre du noeud */}
        <rect
          x="-5"
          y="-8"
          width="10"
          height="16"
          fill="url(#burgundyGradient)"
          stroke="url(#goldGradient)"
          strokeWidth="1"
        />
      </g>

      {/* Petite couronne/chapeau au-dessus */}
      <g transform="translate(100, 35)">
        <path
          d="M -15,0 L -10,-10 L -5,0 L 0,-12 L 5,0 L 10,-10 L 15,0 L 10,5 L -10,5 Z"
          fill="url(#goldGradient)"
          stroke="url(#burgundyGradient)"
          strokeWidth="1"
        />
      </g>

      {/* Bordure extérieure décorative */}
      <circle 
        cx="100" 
        cy="100" 
        r="95" 
        fill="none" 
        stroke="url(#goldGradient)" 
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.5"
      />
    </svg>
  );
}

