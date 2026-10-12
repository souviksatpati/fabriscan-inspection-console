import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { useRole } from '../../hooks/useRole';

interface NavItem {
  name: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', id: 'hero' },
  { name: 'How it works', id: 'how-it-works' },
];

export const PublicNavbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useRole();

  // Active section observer on home page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sectionIds = ['hero', 'how-it-works'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      // Special check for top of page
      if (window.scrollY < 100) {
        setActiveSection('hero');
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (id === 'hero') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      setActiveSection('hero');
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      {/* Floating White Rounded Pill Navbar (3-column grid: 1fr_auto_1fr, max-w-[72rem]) */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#D9DEE5] shadow-[0_4px_20px_rgba(15,23,42,0.06)] rounded-full px-6 py-2.5 max-w-[72rem] w-full grid grid-cols-[1fr_auto_1fr] items-center transition-all select-none">
        {/* Left Cell: Logo */}
        <div className="flex items-center justify-self-start shrink-0">
          <Logo linkTo="/" showSubtitle={false} />
        </div>

        {/* Center Cell: Centered in-page navigation links (Desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === '/' && activeSection === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`h-10 px-4 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 ${
                  isActive
                    ? 'text-[#1D4ED8] bg-[#EFF6FF]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F5F7FA]'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Right Cell: Login / Console actions (Desktop) + Hamburger (Mobile) */}
        <div className="flex items-center justify-self-end">
          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full px-4 h-10 text-xs font-semibold shadow-xs select-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  <Link to="/app/live-inspection">Console</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] rounded-full px-3 h-10 select-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full px-6 h-10 text-xs font-semibold shadow-xs select-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0F172A] hover:bg-[#F5F7FA] rounded-full transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed top-20 inset-x-4 bg-white border border-[#D9DEE5] rounded-2xl shadow-xl p-5 flex flex-col gap-3 md:hidden z-50 select-none">
          <div className="pb-3 border-b border-[#D9DEE5] flex items-center justify-between">
            <Logo linkTo="/" showSubtitle={false} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-[#0F172A] hover:bg-[#F5F7FA] rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === '/' && activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`h-10 px-4 flex items-center rounded-full text-sm font-semibold transition-colors font-sans select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#D9DEE5] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full h-10 text-xs font-semibold select-none"
                >
                  <Link to="/app/live-inspection" onClick={() => setMobileMenuOpen(false)}>
                    Open Station Console
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-full h-10 text-xs text-[#64748B] select-none"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full h-10 text-xs font-semibold select-none"
              >
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
