import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import { Footer } from '../components/navigation/Footer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const PublicLayout: React.FC = () => {
  useDocumentTitle();

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans">
      {/* Floating White Rounded Pill Navbar over Hero */}
      <PublicNavbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
