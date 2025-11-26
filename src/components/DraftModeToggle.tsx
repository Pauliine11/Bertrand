interface DraftModeToggleProps {
  isDraftMode: boolean;
  onToggle: () => void;
}

export function DraftModeToggle({ isDraftMode, onToggle }: DraftModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border-2 ${
        isDraftMode
          ? 'bg-[#d4af37] text-[#722f37] border-[#d4af37] font-bold shadow-lg shadow-[#d4af37]/50 animate-pulse'
          : 'bg-[#722f37] text-[#fdf6e3] border-[#d4af37] hover:bg-[#8b2635]'
      }`}
      title={
        isDraftMode
          ? 'Mode Draft activé : les réponses vont dans l\'éditeur'
          : 'Activer le mode Draft pour modifier le document'
      }
    >
      <span className="flex items-center gap-2">
        {isDraftMode ? (
          <>
            <span className="text-lg">✨</span>
            <span>Mode Draft</span>
          </>
        ) : (
          <>
            <span className="text-lg">📝</span>
            <span>Mode Draft</span>
          </>
        )}
      </span>
    </button>
  );
}

