import React from 'react';
import { ReportButton } from './ReportButton';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  mobileNav: React.ReactNode;
}

export default function AppLayout({ children, sidebar, mobileNav }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden w-full relative">
      
      {/* 1. The Sidebar: Hidden on mobile, narrow on tablet, wide on desktop */}
      {sidebar}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile Top Navigation (Hamburger Menu) */}
        {mobileNav}

        {/* 2. The Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full flex flex-col min-w-0 relative">
          <div className="max-w-7xl mx-auto p-4 md:p-8 w-full flex-grow pb-10">
            {children}
          </div>
        </main>
      </div>

      <ReportButton />
    </div>
  );
}
