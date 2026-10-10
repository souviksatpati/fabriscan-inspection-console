import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopBar } from '../components/navigation/TopBar';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useDocumentTitle();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#0F172A] font-sans antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[15rem] bg-white border-r border-[#D9DEE5]">
          <Sidebar
            collapsed={false}
            onToggleCollapse={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Control Room Column */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopBar onToggleSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[#F5F7FA] p-3 sm:p-5">
          <div className="max-w-[107.5rem] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
