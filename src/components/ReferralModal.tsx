import React from 'react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function ReferralModal({
  isOpen,
  onClose,
  title = "Request Referral",
  children,
}: ReferralModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-fade-in cursor-pointer"
      onClick={onClose}
    >
      {/* 
        Mobile: 'w-full rounded-t-2xl pb-12' makes it a bottom sheet.
        Desktop: 'md:w-[500px] md:rounded-2xl md:pb-6' makes it a centered box.
      */}
      <div 
        className="bg-gray-900 w-full md:w-[500px] rounded-t-2xl md:rounded-2xl p-6 pb-12 md:pb-6 transition-all shadow-2xl border-t border-white/5 md:border border-white/10 text-left flex flex-col max-h-[90vh] overflow-hidden animate-modal-scale-in cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 shrink-0 pb-2 border-b border-white/5">
          <h3 className="text-base font-bold text-white font-sora">{title}</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white border border-white/5 transition duration-150 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
