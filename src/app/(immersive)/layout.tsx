import { NavbarResponsive } from '@/components/NavbarResponsive';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { LayoutContent } from '@/components/LayoutContent';

export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-950 min-h-screen">
      <NavbarResponsive variant="immersive" />
      <Sidebar variant="immersive" />
      
      <LayoutContent>
        {children}
      </LayoutContent>
      
      <Footer variant="immersive" />
    </div>
  );
}

