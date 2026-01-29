'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GrimoireLogo } from '@/components/ui/GrimoireLogo';
import { useSidebar } from '@/hooks/useSidebar';
import { useLanguage } from '@/context/LanguageContext';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
}

interface SidebarProps {
  variant?: 'default' | 'immersive';
}

export function Sidebar({ variant = 'default' }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle, isMobile } = useSidebar();
  const { t } = useLanguage();
  
  const isRPG = variant === 'immersive';
  
  // Styles conditionnels pour le thème sobre (RPG)
  const theme = {
    bg: isRPG 
      ? 'bg-gray-900' 
      : 'bg-white dark:bg-gray-900',
    border: isRPG ? 'border-gray-700/50' : 'border-gray-200 dark:border-gray-800',
    text: isRPG ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300',
    activeBg: isRPG 
      ? 'bg-indigo-900/40 text-indigo-200 border-l-2 border-indigo-500' 
      : 'bg-gray-900 text-white dark:bg-gray-800',
    hoverBg: isRPG 
      ? 'hover:bg-gray-800 hover:text-gray-100' 
      : 'hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100',
    iconActive: isRPG ? 'text-indigo-400' : '',
    badge: isRPG 
      ? 'bg-gray-800 text-indigo-300 border border-gray-700' 
      : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300',
    footer: isRPG 
      ? 'bg-gray-900 border-gray-700/50 text-gray-400' 
      : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800',
    toggle: isRPG 
      ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
  };

  const navItems: NavItem[] = [
    { 
      label: t('sidebar.rpg'), 
      href: '/immersive/immersive-rpg', 
      icon: '​🪄​',
      description: t('sidebar.rpg')
    },
    { 
      label: t('sidebar.admin'), 
      href: '/admin/levels/new', 
      icon: '🛠️',
      description: t('sidebar.admin')
    },
  ];

  return (
    <>
      {/* Backdrop pour mobile quand sidebar ouverte */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-fade-in"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 ${theme.bg} border-r ${theme.border} shadow-lg transition-all duration-300 ease-in-out ${
        isMobile 
          ? `z-50 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}` // Mobile: overlay avec slide
          : `z-40 ${isOpen ? 'w-64' : 'w-16'}` // Desktop: comportement normal
      }`}>
      
      {/* Bouton Toggle - Centré verticalement */}
      <button
        onClick={toggle}
        className={`absolute top-1/2 -translate-y-1/2 -right-3 rounded-full p-1.5 transition-all hover:scale-105 shadow-sm z-50 group border ${theme.toggle}`}
        title={isOpen ? 'Réduire la sidebar' : 'Agrandir la sidebar'}
        aria-label={isOpen ? 'Réduire la sidebar' : 'Agrandir la sidebar'}
      >
        <svg
          className={`w-4 h-4 transition-all duration-300 ${isOpen ? '' : 'rotate-180'}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      {/* Logo */}
      <div className={`p-4 border-b ${theme.border}`}>
        {isOpen ? (
          <div className="flex flex-col items-center gap-2">
            <GrimoireLogo className="h-10 w-10" />
            <p className="text-xs text-gray-400">
              {t('nav.title')}
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <GrimoireLogo className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {/* @ts-ignore */}
          {navItems.map((item: NavItem) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={`
                    group relative flex items-center rounded-lg transition-all duration-200
                    ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'}
                    ${
                      isActive
                        ? `${theme.activeBg} font-medium shadow-sm`
                        : `${theme.text} ${theme.hoverBg}`
                    }
                  `}
                  title={!isOpen ? item.label : undefined}
                >
                  {/* Barre de sélection à gauche */}
                  {isActive && isOpen && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-lg"></div>
                  )}
                  
                  <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${isActive ? theme.iconActive : ''}`}>
                    {item.icon}
                  </span>
                  
                  {isOpen && (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && !isActive && (
                          <div className={`text-xs mt-0.5 ${isRPG ? 'text-gray-500' : 'text-gray-500'}`}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      
                      {item.badge && (
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full font-semibold transition-all
                          ${
                            isActive
                              ? (isRPG ? 'bg-indigo-900 text-indigo-200' : 'bg-white text-indigo-600')
                              : theme.badge
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Badge en petit quand sidebar fermée */}
                  {!isOpen && item.badge && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-indigo-600 rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section supplémentaire - visible seulement quand ouvert */}
      {isOpen && (
        <div className="p-4 mt-8">
          <div className={`${
            isRPG 
              ? 'bg-indigo-900/20 border-indigo-800/50' 
              : 'bg-indigo-50 border-indigo-100'
          } border rounded-lg p-3`}>
            <h3 className={`text-xs font-semibold ${
              isRPG ? 'text-indigo-300' : 'text-gray-900'
            } mb-1 flex items-center gap-1`}>
              💡 {t('sidebar.tip.title')}
            </h3>
            <p className={`text-xs ${
              isRPG ? 'text-gray-400' : 'text-gray-600'
            } leading-relaxed`}>
              {t('sidebar.tip.content')}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${theme.footer}`}>
        {isOpen ? (
          <div className="text-center space-y-2">
            <p className={`text-xs ${isRPG ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('sidebar.footer.powered')}
            </p>
            <p className={`text-xs ${
              isRPG ? 'text-gray-400 font-semibold' : 'text-gray-900 font-semibold'
            }`}>
              {t('sidebar.footer.version')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className={`text-xs ${isRPG ? 'text-gray-400' : 'text-gray-900'} font-semibold`}>
              v2
            </span>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
