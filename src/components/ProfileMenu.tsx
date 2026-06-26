import React from 'react';

interface ProfileMenuProps {
  profileName: string;
  profileSub?: string;
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function ProfileMenu({
  profileName,
  profileSub = '',
  onLogout,
  children,
}: ProfileMenuProps) {
  return (
    <div className="bg-gray-900 border border-gray-850 rounded-2xl p-6 shadow-xl relative text-left">
      <h2 className="text-xl font-bold font-sora text-white">{profileName}</h2>
      {profileSub && <p className="text-gray-400 text-xs mt-1 mb-6">{profileSub}</p>}

      {/* Custom/Desktop Profile content or settings */}
      <div className="space-y-4">
        {children}
      </div>

      {/* Mobile-Only Logout Button */}
      <div className="block md:hidden mt-8 border-t border-gray-800 pt-6">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-500 font-bold bg-red-500/10 hover:bg-red-500/15 active:bg-red-500/20 transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
