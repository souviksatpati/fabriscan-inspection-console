import React from 'react';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    }
  };

  return (
    <footer className="border-t border-[#D9DEE5] bg-[#F5F7FA] text-[#475569] py-10 px-4 sm:px-6 font-sans text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-md">
            <Logo linkTo="/" />
            <p className="text-xs text-[#475569] leading-relaxed mt-1 font-normal">
              Automated optical inspection prototype for stamped automotive parts.
            </p>
          </div>

          <nav className="flex items-center gap-6 text-xs font-medium text-[#475569]">
            <a
              href="#hero"
              onClick={(e) => handleNavClick('hero', e)}
              className="hover:text-[#0F172A] transition-colors"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick('how-it-works', e)}
              className="hover:text-[#0F172A] transition-colors"
            >
              How it works
            </a>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#D9DEE5] flex items-center justify-between text-xs text-[#64748B]">
          <div>
            © 2026 Maruti FabriScan. Prototype.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
