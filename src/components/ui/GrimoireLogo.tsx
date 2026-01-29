import Image from 'next/image';

export function GrimoireLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <Image
        src="/grimoire-logo.png"
        alt="Le Grimoire Éveillé"
        width={100}
        height={100}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}

// Export par défaut pour faciliter l'import
export default GrimoireLogo;
