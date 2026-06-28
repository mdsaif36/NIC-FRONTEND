import React from 'react';
import { ReportButton } from './ReportButton';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  bottomNav: React.ReactNode;
}

export default function AppLayout({ children, sidebar, bottomNav }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden w-full relative">
      
      {/* 1. The Sidebar: Hidden on mobile, narrow on tablet, wide on desktop */}
      {sidebar}

      {/* 2. The Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 w-full flex flex-col min-w-0">
        {/* pb-20 ensures content isn't hidden behind the mobile bottom nav */}
        <div className="max-w-7xl mx-auto p-4 md:p-8 w-full flex-grow">
          {children}
        </div>
      </main>

      {/* 3. The Bottom Navigation: ONLY visible on mobile */}
      {bottomNav}

      <ReportButton />
    </div>
  );
}
