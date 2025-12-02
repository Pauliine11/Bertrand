import Image from 'next/image';

export function BackgroundImage() {
  return (
    <div className="fixed left-64 top-16 bottom-0 right-1/2 opacity-75 pointer-events-none z-0">
      {/* 
        Position pour une image grande et bien visible :
        - left-64: commence juste après la sidebar (256px)
        - top-16: sous la navbar (64px) pour ne pas être coupée
        - right-1/2: s'étend jusqu'à la moitié de l'espace restant
        - z-0: derrière tout le contenu
        - opacity-75: bien visible
        - pointer-events-none: n'interfère pas avec les clics
      */}
      <div className="relative w-full h-full">
        <Image 
          src="/bertrand.png" 
          alt="Bertrand - Votre majordome personnel" 
          fill
          style={{ 
            objectFit: 'contain',
            objectPosition: 'left center'
          }}
          priority
          className="drop-shadow-2xl"
        />
      </div>
    </div>
  );
}

