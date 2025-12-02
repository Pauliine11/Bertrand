export function Navbar() {
  return (
    <nav className="fixed top-0 left-64 right-0 z-50 bg-gradient-to-r from-[#722f37] via-[#8b2635] to-[#722f37] border-b-2 border-[#d4af37] shadow-lg">
      {/* Navbar simplifiée - démarre après la sidebar */}
      <div className="h-16 flex items-center justify-center">
        <h1 className="text-xl font-bold font-[family-name:var(--font-cormorant)] text-[#d4af37] tracking-wider">
          BERTRAND - Votre Butler Personnel
        </h1>
      </div>
    </nav>
  );
}

