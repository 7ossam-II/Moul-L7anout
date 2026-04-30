'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Users, 
  Megaphone, 
  Store, 
  QrCode,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Award,
  Zap,
  Settings,
  LogOut,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/seller/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Products', href: '/seller/products', icon: <Package size={18} /> },
  { label: 'Orders', href: '/seller/orders', icon: <ShoppingBag size={18} /> },
  { label: 'LKRIDI', href: '/seller/lkridi', icon: <Zap size={18} /> },
  { label: 'LKRIDI Records', href: '/seller/lkridi/records', icon: <CreditCard size={18} /> },
  { label: 'Workers', href: '/seller/workers', icon: <Users size={18} /> },
  { label: 'Promotions', href: '/seller/promotions', icon: <Megaphone size={18} /> },
  { label: 'Stores', href: '/seller/stores', icon: <Store size={18} /> },
  { label: 'QR Scan', href: '/seller/qr-scan', icon: <QrCode size={18} /> },
];

function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <aside className="relative w-full bg-gradient-to-b from-[#0F4C81] to-[#1a5c9e] shadow-2xl overflow-visible flex flex-col min-h-full">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-32 -right-10 w-60 h-60 bg-[#FF6B35]/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Collapse Arrow Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 z-50 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 group border border-gray-200 cursor-pointer"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
      >
        <ChevronLeft 
          size={14} 
          className={`text-[#0F4C81] transition-all duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Logo / Brand */}
      <div className={`relative px-5 pt-6 pb-8 border-b border-white/10 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-5'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg shrink-0">
            <Store size={18} className="text-[#0F4C81]" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Moul L7anout</h1>
              <p className="text-[10px] text-white/50 font-medium">Seller Dashboard</p>
            </div>
          )}
        </div>
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Navigation */}
      <nav className="relative px-3 py-6 space-y-1.5 flex-1">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const hovered = isHovered === href;
          
          return (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => setIsHovered(href)}
              onMouseLeave={() => setIsHovered(null)}
              className={`group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                active
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}`}
              style={active ? { background: 'linear-gradient(135deg, #FF6B35, #ff8a5a)' } : {}}
              title={isCollapsed ? label : ''}
            >
              {!active && (
                <div 
                  className={`absolute inset-0 bg-white/10 transition-all duration-500 ${
                    hovered ? 'translate-x-0' : '-translate-x-full'
                  }`}
                />
              )}
              
              <div className={`relative transition-all duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
                {icon}
              </div>
              
              {!isCollapsed && <span className="relative">{label}</span>}
              
              {active && !isCollapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
              
              {hovered && !active && !isCollapsed && (
                <ChevronRight size={14} className="absolute right-3 text-white/50 animate-slideRight" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      {!isCollapsed && <div className="relative mx-5 my-4 h-px bg-white/10" />}

      {/* Bottom Section */}
      <div className={`relative space-y-1.5 ${!isCollapsed ? 'px-3' : 'px-2'}`}>
        {!isCollapsed ? (
          <>
            <Link
              href="/seller/analytics"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            >
              <TrendingUp size={18} />
              <span>Analytics</span>
            </Link>
            <Link
              href="/seller/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <Link
              href="/seller/help"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            >
              <HelpCircle size={18} />
              <span>Help & Support</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/seller/analytics"
              className="flex justify-center items-center py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              title="Analytics"
            >
              <TrendingUp size={18} />
            </Link>
            <Link
              href="/seller/settings"
              className="flex justify-center items-center py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              title="Settings"
            >
              <Settings size={18} />
            </Link>
            <Link
              href="/seller/help"
              className="flex justify-center items-center py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              title="Help & Support"
            >
              <HelpCircle size={18} />
            </Link>
          </>
        )}
      </div>

      {/* User Profile Section */}
      <div className={`relative mt-6 p-5 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-5'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/20 shrink-0">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Store Owner</p>
                <p className="text-[10px] text-white/40">Admin Access</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <LogOut size={16} className="text-white/50" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

// 🎬 NEW: Cinematic Welcome Component
function CinematicWelcome({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C81] via-[#FF6B35] to-[#764ba2] animate-gradient-xy" />
      
      {/* Particle effect background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content with cinematic animations */}
      <div className="relative z-10 text-center animate-cinematic-slide-up">
        <div className="mb-6 animate-cinematic-scale">
          <div className="w-32 h-32 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-2xl animate-bounce-gentle">
            <Store size={64} className="text-white" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 tracking-tight animate-cinematic-fade-in">
          Hello Seller! 👋
        </h1>
        
        <div className="overflow-hidden h-12">
          <p className="text-2xl md:text-3xl text-white/90 font-light animate-cinematic-slide-up-delayed">
            Welcome to your dashboard
          </p>
        </div>
        
        <div className="mt-8 flex justify-center gap-2 animate-cinematic-fade-in-delayed">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-150" />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-300" />
        </div>
      </div>
      
      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/50 animate-slide-down" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/50 animate-slide-up" />
    </div>
  );
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionState, setTransitionState] = useState('enter');

  // Only show welcome on the main dashboard route
  const isDashboardRoute = pathname === '/seller/dashboard';

  useEffect(() => {
    // Check if user has seen welcome screen in this session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenCinematicWelcome');
    
    if (hasSeenWelcome || !isDashboardRoute) {
      setShowWelcome(false);
    }
  }, [isDashboardRoute]);

  useEffect(() => {
    setTransitionState('exit');
    const exitTimer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionState('enter');
    }, 200);
    return () => clearTimeout(exitTimer);
  }, [children, pathname]);

  const getTransitionClass = () => {
    return transitionState === 'enter' ? 'page-transition-pop-enter' : 'page-transition-pop-exit';
  };

  // Show welcome screen only on dashboard route
  if (showWelcome && isDashboardRoute) {
    return (
      <CinematicWelcome onComplete={() => {
        setShowWelcome(false);
        sessionStorage.setItem('hasSeenCinematicWelcome', 'true');
      }} />
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Sidebar wrapper - takes full height */}
      <div className={`transition-all duration-500 ${isSidebarCollapsed ? 'w-20' : 'w-64'} relative flex`}>
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className={getTransitionClass()}>
          {displayChildren}
        </div>
      </main>
    </div>
  );
}