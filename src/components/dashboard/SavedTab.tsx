import React from 'react';
import {
  Bookmark
} from 'lucide-react';

interface SavedTabProps {
  alumniNetwork: any[];
  openRequestModal: (alumni: any) => void;
  savedAlumniIds: number[];
  setSavedAlumniIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedAlumni: (alumni: any | null) => void;
}

export const SavedTab: React.FC<SavedTabProps> = ({
  alumniNetwork,
  openRequestModal,
  savedAlumniIds,
  setSavedAlumniIds,
  setSelectedAlumni
}) => {
  return (
    <div className="space-y-6 animate-fade-in-up text-left">
              <h3 className="font-sora text-white text-sm font-extrabold tracking-tight pb-3 border-b border-white/5">
                Saved Alumni Mentors ({savedAlumniIds.length})
              </h3>
              
              {savedAlumniIds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alumniNetwork
                    .filter(a => savedAlumniIds.includes(a.id))
                    .map((alumni) => (
                      <div 
                        key={alumni.id}
                        className="p-5 rounded-2xl border border-white/5 bg-[#08080b]/90 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${alumni.color} flex items-center justify-center font-bold text-white text-[10px] uppercase shadow-md`}>
                              {alumni.initial}
                            </div>
                            <button
                              type="button"
                              onClick={() => setSavedAlumniIds(prev => prev.filter(id => id !== alumni.id))}
                              className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/35 text-purple-400 transition"
                            >
                              <Bookmark className="w-3.5 h-3.5" fill="currentColor" />
                            </button>
                          </div>
                          
                          <h4 className="font-sora text-xs font-bold text-white">{alumni.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1 font-semibold">{alumni.role} · {alumni.company}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{alumni.college}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-5">
                          <button
                            type="button"
                            onClick={() => setSelectedAlumni(alumni)}
                            className="w-full py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-200 uppercase tracking-wider transition"
                          >
                            View Bio
                          </button>
                          <button
                            type="button"
                            onClick={() => openRequestModal(alumni)}
                            className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-bold text-[9px] uppercase tracking-wider transition shadow-md"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <Bookmark className="w-10 h-10 text-slate-655 mb-3" />
                  <span className="block text-xs text-slate-400 font-bold">No saved mentors</span>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Bookmark alumni from the discover catalog to keep track of their availability profiles here.
                  </p>
                </div>
              )}
            </div>
  );
};
