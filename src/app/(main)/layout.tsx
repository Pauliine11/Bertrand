import { NavbarResponsive } from '@/components/NavbarResponsive';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { BackgroundImageResponsive } from '@/components/BackgroundImageResponsive';
import { LayoutContent } from '@/components/LayoutContent';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarResponsive variant="default" />
      <Sidebar variant="default" />
      <BackgroundImageResponsive />
      
      <LayoutContent>
        {children}
      </LayoutContent>
      
      <Footer variant="default" />
    </>
  );
}

