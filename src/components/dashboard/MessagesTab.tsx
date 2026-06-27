import React from 'react';
import {
  Calendar, Lock, Paperclip, X
} from 'lucide-react';

interface MessagesTabProps {
  activeChatId: number | null;
  alumniNetwork: any[];
  chatMessages: { [key: number]: { sender: 'seeker' | 'alumni', text: string, time: string }[] };
  handleScheduleCall: (topic?: string, duration?: string) => void;
  handleSendMessage: () => void;
  isSchedulerOpen: boolean;
  newMessageText: string;
  scheduledDate: string;
  scheduledTime: string;
  setActiveChatId: (id: number | null) => void;
  setIsSchedulerOpen: (open: boolean) => void;
  setNewMessageText: (text: string) => void;
  setScheduledDate: (date: string) => void;
  setScheduledTime: (time: string) => void;
  conversations: any[];
  role: 'seeker' | 'alumni';
  requestsList?: any[];
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  activeChatId,
  alumniNetwork,
  chatMessages,
  handleScheduleCall,
  handleSendMessage,
  isSchedulerOpen,
  newMessageText,
  scheduledDate,
  scheduledTime,
  setActiveChatId,
  setIsSchedulerOpen,
  setNewMessageText,
  setScheduledDate,
  setScheduledTime,
  conversations,
  role,
  requestsList
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [topic, setTopic] = React.useState('Referral Discussion');
  const [duration, setDuration] = React.useState('30 mins');
  const chatPartner = conversations.find(c => c.id === activeChatId) || alumniNetwork.find(a => a.id === activeChatId);
  
  // A chat is unlocked if the user is alumni, or the seeker request is accepted/referred/hired/info, or they have message history
  const isCurrentChatUnlocked = role === 'alumni' || 
    (requestsList && requestsList.some(r => r.alumniId === activeChatId && ['accepted', 'referred', 'hired', 'info'].includes(r.status))) ||
    (activeChatId && chatMessages[activeChatId] && chatMessages[activeChatId].length > 0);

  const activeMessages = activeChatId ? (chatMessages[activeChatId] || []) : [];

  React.useEffect(() => {
    if (isCurrentChatUnlocked) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, isCurrentChatUnlocked]);

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[72vh] border border-white/5 bg-[#08080b]/90 rounded-2xl overflow-hidden animate-fade-in-up text-left relative z-20">
              
              {/* Left pane: lists active conversations */}
              <div className="lg:col-span-4 border-r border-white/5 flex flex-col h-full min-h-0 bg-black/40">
                <div className="p-4 border-b border-white/5">
                  <h3 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk">Outreach Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {conversations.map((chat) => {
                    const isAccepted = role === 'alumni' || 
                      (requestsList && requestsList.some(r => r.alumniId === chat.id && ['accepted', 'referred', 'hired', 'info'].includes(r.status))) ||
                      (chatMessages[chat.id] && chatMessages[chat.id].length > 0);
                    
                    return (
                      <div 
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className={`p-4 border-b border-white/5 cursor-pointer transition flex items-center justify-between gap-3 ${
                          activeChatId === chat.id ? 'bg-purple-950/15' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 font-inter">
                            <span className="font-bold text-white text-xs truncate">{chat.name}</span>
                            {!isAccepted && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          </div>
                          <span className="block text-[10px] text-slate-400 mt-0.5 font-inter truncate">
                            {chat.role === 'alumni' ? `${chat.jobTitle || 'Alumni'} · ${chat.company}` : `${chat.college} Student`}
                          </span>
                          <span className="block text-[10px] text-slate-550 mt-1.5 italic max-w-[180px] overflow-hidden text-nowrap font-inter truncate">
                            {chat.lastMessage}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 shrink-0 font-medium font-inter">
                          {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  {conversations.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No active conversations. Reach out to an alumni mentor or review your pending requests to start a chat.
                    </div>
                  )}
                </div>
              </div>

              {/* Right pane: displays current chat */}
              <div className="lg:col-span-8 flex flex-col h-full min-h-0 justify-between bg-slate-950/10">
                {activeChatId === null ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 font-inter text-slate-500">
                    <Calendar className="w-10 h-10 text-slate-700 mb-3" />
                    <h4 className="font-bold text-white text-xs font-sora">No Chat Selected</h4>
                    <p className="text-[10px] text-slate-550 max-w-xs mt-1">
                      Choose an alumni mentor from the outreach listing or start one via the referral request status drawer.
                    </p>
                  </div>
                ) : isCurrentChatUnlocked ? (
                  <>
                    {/* Chat headers */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40 font-inter">
                      <div>
                        <h4 className="font-bold text-white text-xs">{chatPartner?.name || 'Chat Partner'}</h4>
                        <span className="block text-[10px] text-slate-500">
                          {chatPartner?.role === 'alumni' 
                            ? `${chatPartner?.jobTitle || 'Alumni'} at ${chatPartner?.company} · ${chatPartner?.responseRate || '90%'} response rate`
                            : `${chatPartner?.college} Student`
                          }
                        </span>
                      </div>
                      
                      {role === 'alumni' && (
                        <button
                          type="button"
                          onClick={() => setIsSchedulerOpen(true)}
                          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-semibold text-[10px] uppercase tracking-wider transition shadow-md flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Schedule Meeting
                        </button>
                      )}
                    </div>

                    {/* Messages feed */}
                    <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4 flex flex-col bg-slate-950/10 font-inter">
                      {(chatMessages[activeChatId] || []).map((msg, index) => {
                        const isSelf = msg.sender === 'seeker';
                        const isMeeting = msg.text.startsWith('📅 Scheduled a meeting') || msg.text.startsWith('📅 Scheduled a call');
                        
                        return (
                          <div 
                            key={index}
                            className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}
                          >
                            {isMeeting ? (
                              <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] text-left space-y-2">
                                <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
                                  <Calendar className="w-4 h-4 text-purple-400" />
                                  Meeting Scheduled
                                </div>
                                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                                  {msg.text.split('(')[0]}
                                </p>
                              </div>
                            ) : (
                              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                                isSelf 
                                  ? 'bg-purple-650 text-white rounded-tr-none shadow-md' 
                                  : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                            )}
                            <span className="text-[8px] text-slate-500 mt-1 font-semibold">{msg.time}</span>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Smart Quick Prompts */}
                    <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-black/20 font-inter">
                      {[
                        'Thanks for accepting! Can we schedule a call?',
                        'What skills should I highlight?',
                        'Is the role still open?'
                      ].map((prompt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewMessageText(prompt)}
                          className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[9px] font-semibold whitespace-nowrap transition"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    {/* Footer input row */}
                    <div className="p-4 border-t border-white/5 flex items-center gap-3 shrink-0 bg-black/40 font-inter">
                      <button className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white border border-white/5 transition">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                        placeholder={`Write a message to ${chatPartner?.name || 'your mentor'}...`}
                        className="flex-1 px-4 py-2.5 bg-black border border-white/10 rounded-full text-white text-xs placeholder-slate-550 focus:outline-none focus:border-purple-500/40"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 rounded-full bg-purple-650 hover:bg-purple-600 text-white font-sora font-semibold text-[10px] uppercase tracking-wider transition"
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  /* Locked chats for pending/declined */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950/20 font-inter">
                    <div className="w-12 h-12 rounded-full border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white text-xs font-sora">Chat Locked</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed mt-1">
                      Chat is only activated after the alumnus mentor accepts your referral request. This prevents spam and protects mentor time.
                    </p>
                  </div>
                )}

              </div>

              {/* Calendly Call Scheduler Modal Overlay */}
              {isSchedulerOpen && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-55 flex items-center justify-center p-4">
                  <div className="w-full max-w-sm bg-[#08080b] border border-white/10 p-6 rounded-2xl shadow-2xl relative text-left">
                    <button 
                      onClick={() => setIsSchedulerOpen(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Schedule Meeting
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-1 font-space-grotesk">Meeting Date</label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full px-4 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-1 font-space-grotesk">Meeting Time (IST)</label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full px-4 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-1 font-space-grotesk">Meeting Topic</label>
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="w-full px-4 py-2 bg-[#08080b] border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500/40 font-inter"
                        >
                          <option value="Referral Discussion" className="bg-[#0a0a0f] text-white">Referral Discussion</option>
                          <option value="Mock Interview" className="bg-[#0a0a0f] text-white">Mock Interview</option>
                          <option value="Resume Review" className="bg-[#0a0a0f] text-white">Resume Review</option>
                          <option value="General Coffee Chat" className="bg-[#0a0a0f] text-white">General Coffee Chat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-1 font-space-grotesk">Duration</label>
                        <select
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-4 py-2 bg-[#08080b] border border-white/15 rounded-xl text-white text-xs focus:outline-none font-inter"
                        >
                          <option value="15 mins" className="bg-[#0a0a0f] text-white">15 mins</option>
                          <option value="30 mins" className="bg-[#0a0a0f] text-white">30 mins</option>
                          <option value="45 mins" className="bg-[#0a0a0f] text-white">45 mins</option>
                          <option value="60 mins" className="bg-[#0a0a0f] text-white">60 mins</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setIsSchedulerOpen(false)}
                        className="w-full py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-200 uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScheduleCall(topic, duration)}
                        className="w-full py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-650 text-white font-sora font-bold text-[9px] uppercase tracking-wider"
                      >
                        Confirm Slot
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
  );
};
