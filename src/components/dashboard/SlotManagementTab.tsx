import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, Zap, Settings2,
  RefreshCw, BookOpen, Users,
  Video, Star, TrendingUp,
  CheckCircle2,
  Sparkles, CalendarDays, Timer, BarChart3, Shield,
  Coffee, Briefcase, FileText, MessageSquare, ChevronLeft,
  ChevronRight, ToggleLeft, ToggleRight, Info
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type AvailabilityMode = 'flexible' | 'fixed' | 'custom';

interface DaySchedule {
  enabled: boolean;
  startHour: number; // 0–23
  startMinute: number;
  endHour: number;
  endMinute: number;
}

interface MeetingType {
  id: string;
  label: string;
  duration: number; // minutes
  icon: React.ElementType;
  color: string;
  enabled: boolean;
}

interface SmartLimits {
  maxPerDay: number;
  maxPerWeek: number;
  bufferMinutes: number;
}

interface GeneratedSlot {
  id: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: 'available' | 'booked' | 'buffer';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fmt12 = (h: number, m: number): string => {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  const min = m.toString().padStart(2, '0');
  return `${hour}:${min} ${period}`;
};

const addMinutes = (h: number, m: number, mins: number): [number, number] => {
  const total = h * 60 + m + mins;
  return [Math.floor(total / 60) % 24, total % 60];
};

const generateSlots = (
  daySchedules: Record<string, DaySchedule>,
  meetingTypes: MeetingType[],
  limits: SmartLimits,
  weeksAhead: number = 4
): GeneratedSlot[] => {
  const slots: GeneratedSlot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enabledTypes = meetingTypes.filter(t => t.enabled);
  if (enabledTypes.length === 0) return [];

  // Use shortest duration among enabled types as slot size
  const slotDuration = Math.min(...enabledTypes.map(t => t.duration));

  for (let w = 0; w < weeksAhead; w++) {
    let weekCount = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + w * 7 + d);
      const dayName = DAYS[d];
      const schedule = daySchedules[dayName];

      if (!schedule || !schedule.enabled) continue;

      let curH = schedule.startHour;
      let curM = schedule.startMinute;
      let dayCount = 0;

      while (true) {
        const [endH, endM] = addMinutes(curH, curM, slotDuration);
        if (endH > schedule.endHour || (endH === schedule.endHour && endM > schedule.endMinute)) break;
        if (dayCount >= limits.maxPerDay || weekCount >= limits.maxPerWeek) break;

        // Pick a meeting type in rotation
        const typeIdx = (dayCount + w) % enabledTypes.length;
        const mType = enabledTypes[typeIdx];

        // Recalculate end based on actual meeting duration
        const [realEndH, realEndM] = addMinutes(curH, curM, mType.duration);

        slots.push({
          id: `${dayName}-${w}-${d}-${dayCount}`,
          day: dayName,
          date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          startTime: fmt12(curH, curM),
          endTime: fmt12(realEndH, realEndM),
          type: mType.label,
          status: Math.random() < 0.18 ? 'booked' : 'available',
        });

        dayCount++;
        weekCount++;

        // Advance cursor by slot duration + buffer
        [curH, curM] = addMinutes(curH, curM, slotDuration + limits.bufferMinutes);
      }
    }
  }

  return slots;
};

// ─── Default State ─────────────────────────────────────────────────────────────
const defaultSchedule = (): Record<string, DaySchedule> => ({
  Monday:    { enabled: true,  startHour: 19, startMinute: 0, endHour: 22, endMinute: 0 },
  Tuesday:   { enabled: true,  startHour: 20, startMinute: 0, endHour: 22, endMinute: 0 },
  Wednesday: { enabled: false, startHour: 19, startMinute: 0, endHour: 21, endMinute: 0 },
  Thursday:  { enabled: true,  startHour: 20, startMinute: 0, endHour: 22, endMinute: 0 },
  Friday:    { enabled: true,  startHour: 19, startMinute: 0, endHour: 22, endMinute: 0 },
  Saturday:  { enabled: true,  startHour: 14, startMinute: 0, endHour: 18, endMinute: 0 },
  Sunday:    { enabled: false, startHour: 10, startMinute: 0, endHour: 12, endMinute: 0 },
});

const defaultMeetingTypes = (): MeetingType[] => [
  { id: 'resume',   label: 'Resume Review',      duration: 15, icon: FileText,      color: 'blue',    enabled: true  },
  { id: 'career',   label: 'Career Guidance',    duration: 30, icon: Briefcase,     color: 'emerald', enabled: true  },
  { id: 'mock',     label: 'Mock Interview',      duration: 45, icon: Users,         color: 'purple',  enabled: true  },
  { id: 'referral', label: 'Referral Discussion', duration: 15, icon: MessageSquare, color: 'amber',   enabled: false },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES_OPTIONS = [0, 15, 30, 45];

// ─── Sub-components ────────────────────────────────────────────────────────────
const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/25',    glow: 'rgba(59,130,246,0.12)' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', glow: 'rgba(16,185,129,0.12)' },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/25',  glow: 'rgba(168,85,247,0.12)' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   glow: 'rgba(245,158,11,0.12)' },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/25',    glow: 'rgba(244,63,94,0.12)' },
};

const TimeSelect: React.FC<{
  hour: number; minute: number;
  onHourChange: (h: number) => void; onMinuteChange: (m: number) => void;
}> = ({ hour, minute, onHourChange, onMinuteChange }) => (
  <div className="flex items-center gap-1">
    <select
      value={hour}
      onChange={e => onHourChange(Number(e.target.value))}
      className="bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg px-2 py-1.5 appearance-none cursor-pointer hover:border-white/20 transition focus:outline-none focus:border-emerald-500/50"
    >
      {HOURS.map(h => (
        <option key={h} value={h} className="bg-[#0a0a0f]">
          {h.toString().padStart(2, '0')}
        </option>
      ))}
    </select>
    <span className="text-slate-500 font-bold text-xs">:</span>
    <select
      value={minute}
      onChange={e => onMinuteChange(Number(e.target.value))}
      className="bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg px-2 py-1.5 appearance-none cursor-pointer hover:border-white/20 transition focus:outline-none focus:border-emerald-500/50"
    >
      {MINUTES_OPTIONS.map(m => (
        <option key={m} value={m} className="bg-[#0a0a0f]">
          {m.toString().padStart(2, '0')}
        </option>
      ))}
    </select>
    <span className="text-slate-500 text-xs font-semibold ml-1">{hour >= 12 ? 'PM' : 'AM'}</span>
  </div>
);

// ─── Calendar Grid ─────────────────────────────────────────────────────────────
const CalendarGrid: React.FC<{ slots: GeneratedSlot[] }> = ({ slots }) => {
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());

  const firstDay = new Date(displayYear, displayMonth, 1);
  const lastDay  = new Date(displayYear, displayMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = lastDay.getDate();
  const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7;

  const monthName = firstDay.toLocaleString('en', { month: 'long', year: 'numeric' });

  // Build a lookup: "DD Mon YYYY" -> slot stats
  const slotByDate: Record<string, { avail: number; booked: number }> = {};
  slots.forEach(s => {
    if (!slotByDate[s.date]) slotByDate[s.date] = { avail: 0, booked: 0 };
    if (s.status === 'available') slotByDate[s.date].avail++;
    else if (s.status === 'booked') slotByDate[s.date].booked++;
  });

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startDow + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    const d = new Date(displayYear, displayMonth, dayNum);
    const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const isToday = d.toDateString() === today.toDateString();
    const stats = slotByDate[key];
    return { dayNum, key, isToday, stats };
  });

  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-sora text-sm font-extrabold text-white">{monthName}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (displayMonth === 0) { setDisplayMonth(11); setDisplayYear(y => y - 1); }
              else setDisplayMonth(m => m - 1);
            }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (displayMonth === 11) { setDisplayMonth(0); setDisplayYear(y => y + 1); }
              else setDisplayMonth(m => m + 1);
            }}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-slate-600 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const { dayNum, isToday, stats } = cell;
          const hasSlots = stats && (stats.avail > 0 || stats.booked > 0);
          return (
            <div
              key={i}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-default
                ${isToday ? 'border border-emerald-500/40 bg-emerald-500/10' : hasSlots ? 'border border-white/5 bg-white/[0.02] hover:border-white/10' : ''}
              `}
            >
              <span className={`text-[11px] font-bold ${isToday ? 'text-emerald-400' : hasSlots ? 'text-white' : 'text-slate-700'}`}>
                {dayNum}
              </span>
              {stats && stats.avail > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title={`${stats.avail} available`} />
                  {stats.booked > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title={`${stats.booked} booked`} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-slate-500 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-slate-500 font-medium">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/30 border border-emerald-500/40" />
          <span className="text-[10px] text-slate-500 font-medium">Today</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const SlotManagementTab: React.FC = () => {
  const [mode, setMode] = useState<AvailabilityMode>('fixed');
  const [daySchedules, setDaySchedules] = useState<Record<string, DaySchedule>>(defaultSchedule);
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>(defaultMeetingTypes);
  const [limits, setLimits] = useState<SmartLimits>({ maxPerDay: 3, maxPerWeek: 10, bufferMinutes: 15 });
  const [generatedSlots, setGeneratedSlots] = useState<GeneratedSlot[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('schedule');
  const [savedNotice, setSavedNotice] = useState(false);

  // Auto-generate on mount
  useEffect(() => {
    const slots = generateSlots(daySchedules, meetingTypes, limits);
    setGeneratedSlots(slots);
    setIsGenerated(true);
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const slots = generateSlots(daySchedules, meetingTypes, limits);
    setGeneratedSlots(slots);
    setIsGenerated(true);
    setIsGenerating(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }, [daySchedules, meetingTypes, limits]);

  const availableCount = generatedSlots.filter(s => s.status === 'available').length;
  const bookedCount    = generatedSlots.filter(s => s.status === 'booked').length;
  const totalCount     = generatedSlots.length;

  const updateDaySchedule = (day: string, updates: Partial<DaySchedule>) => {
    setDaySchedules(prev => ({ ...prev, [day]: { ...prev[day], ...updates } }));
  };

  const toggleMeetingType = (id: string) => {
    setMeetingTypes(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const sections = [
    { id: 'schedule', label: 'Weekly Schedule', icon: CalendarDays },
    { id: 'meetings', label: 'Meeting Types',   icon: BookOpen },
    { id: 'limits',   label: 'Smart Limits',    icon: Shield },
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in-up font-inter">

      {/* ── Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-violet-950/30 via-[#07070a] to-emerald-950/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-sora text-xl font-extrabold text-white">Slot Management</h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Alumni · Smart Scheduling</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Define your availability once — the system auto-generates hundreds of bookable meeting slots, enforces buffer times, and applies weekly limits automatically.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold animate-fade-in-up">
                <CheckCircle2 className="w-3 h-3" /> Slots regenerated!
              </span>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-sora font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition disabled:opacity-60"
            >
              {isGenerating ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> Auto Generate</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      {isGenerated && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Slots',      value: totalCount,     icon: Calendar,    color: 'blue'    },
            { label: 'Available',         value: availableCount, icon: CheckCircle2, color: 'emerald' },
            { label: 'Booked',            value: bookedCount,    icon: Users,       color: 'amber'   },
            { label: 'Meeting Types',     value: meetingTypes.filter(t => t.enabled).length, icon: BookOpen, color: 'purple' },
          ].map(stat => {
            const Icon = stat.icon;
            const c = colorMap[stat.color];
            return (
              <div key={stat.label} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl pointer-events-none" style={{ background: c.glow }} />
                <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <span className="block font-sora text-2xl font-extrabold text-white">{stat.value}</span>
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left: Settings Panel ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Mode Selector */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-sora text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-violet-400" />
              Availability Mode
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'flexible', label: 'Flexible',        sub: 'Ad-hoc scheduling',   icon: Coffee },
                { id: 'fixed',    label: 'Fixed Schedule',  sub: 'Same times each week', icon: Timer },
                { id: 'custom',   label: 'Custom Schedule', sub: 'Per-day configuration', icon: CalendarDays },
              ].map(opt => {
                const Icon = opt.icon;
                const isActive = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMode(opt.id as AvailabilityMode)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-300 ${
                      isActive
                        ? 'border-violet-500/40 bg-violet-500/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold">{opt.label}</div>
                      <div className="text-[9px] text-slate-600 font-medium mt-0.5 leading-tight">{opt.sub}</div>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/5">
            {sections.map(s => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.05] border border-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Section: Weekly Schedule */}
          {activeSection === 'schedule' && (
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-400" />
                  Weekly Availability
                </h3>
                <span className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider">
                  {Object.values(daySchedules).filter(d => d.enabled).length} days active
                </span>
              </div>
              {DAYS.map(day => {
                const sched = daySchedules[day];
                return (
                  <div
                    key={day}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                      sched.enabled
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-white/5 bg-white/[0.01] opacity-60'
                    }`}
                  >
                    {/* Toggle + Day */}
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <button
                        type="button"
                        onClick={() => updateDaySchedule(day, { enabled: !sched.enabled })}
                        className="shrink-0"
                      >
                        {sched.enabled
                          ? <ToggleRight className="w-8 h-8 text-emerald-400 hover:text-emerald-300 transition" />
                          : <ToggleLeft  className="w-8 h-8 text-slate-600 hover:text-slate-400 transition" />
                        }
                      </button>
                      <span className={`text-xs font-bold ${sched.enabled ? 'text-white' : 'text-slate-600'}`}>
                        {day}
                      </span>
                    </div>

                    {sched.enabled ? (
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-semibold">
                        <span className="text-[9px] text-slate-600 uppercase tracking-wider">From</span>
                        <TimeSelect
                          hour={sched.startHour} minute={sched.startMinute}
                          onHourChange={h => updateDaySchedule(day, { startHour: h })}
                          onMinuteChange={m => updateDaySchedule(day, { startMinute: m })}
                        />
                        <span className="text-[9px] text-slate-600 uppercase tracking-wider">To</span>
                        <TimeSelect
                          hour={sched.endHour} minute={sched.endMinute}
                          onHourChange={h => updateDaySchedule(day, { endHour: h })}
                          onMinuteChange={m => updateDaySchedule(day, { endMinute: m })}
                        />
                        <span className="text-[9px] text-emerald-400/70 font-bold ml-1">
                          {fmt12(sched.startHour, sched.startMinute)} – {fmt12(sched.endHour, sched.endMinute)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-semibold italic">Not Available</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Section: Meeting Types */}
          {activeSection === 'meetings' && (
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Meeting Types &amp; Durations
              </h3>
              <div className="space-y-3">
                {meetingTypes.map(type => {
                  const Icon = type.icon;
                  const c = colorMap[type.color];
                  return (
                    <div
                      key={type.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                        type.enabled
                          ? `${c.border} ${c.bg}`
                          : 'border-white/5 bg-white/[0.01] opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${c.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${type.enabled ? 'text-white' : 'text-slate-500'}`}>
                            {type.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${c.bg} ${c.text} border ${c.border}`}>
                            {type.duration} min
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-medium">
                          Generates {type.duration}-minute slots
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleMeetingType(type.id)}
                        className="shrink-0"
                      >
                        {type.enabled
                          ? <ToggleRight className={`w-8 h-8 ${c.text} transition`} />
                          : <ToggleLeft  className="w-8 h-8 text-slate-600 hover:text-slate-400 transition" />
                        }
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-4 rounded-xl border border-blue-500/15 bg-blue-500/5">
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Different meeting types generate slots of their respective duration. Enabling multiple types will rotate slot assignments automatically across your available hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Smart Limits */}
          {activeSection === 'limits' && (
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-amber-400" />
                Smart Limits &amp; Buffer Control
              </h3>
              <div className="space-y-5">
                {[
                  {
                    key: 'maxPerDay',
                    label: 'Max Meetings Per Day',
                    sub: 'Prevents back-to-back overloading',
                    icon: Calendar,
                    color: 'blue',
                    min: 1, max: 10, step: 1
                  },
                  {
                    key: 'maxPerWeek',
                    label: 'Max Meetings Per Week',
                    sub: 'Controls total weekly commitment',
                    icon: BarChart3,
                    color: 'emerald',
                    min: 1, max: 40, step: 1
                  },
                  {
                    key: 'bufferMinutes',
                    label: 'Buffer Between Meetings',
                    sub: 'Break time between consecutive sessions',
                    icon: Coffee,
                    color: 'amber',
                    min: 0, max: 60, step: 5
                  },
                ].map(opt => {
                  const Icon = opt.icon;
                  const c = colorMap[opt.color];
                  const val = limits[opt.key as keyof SmartLimits];
                  return (
                    <div key={opt.key} className={`p-4 rounded-xl border ${c.border} ${c.bg}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${c.text}`} />
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${c.text}`}>{opt.label}</div>
                            <div className="text-[9px] text-slate-600 font-medium">{opt.sub}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setLimits(prev => ({ ...prev, [opt.key]: Math.max(opt.min, val - opt.step) }))}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition text-sm font-bold"
                          >−</button>
                          <span className="w-10 text-center font-sora font-extrabold text-white text-base">
                            {val}{opt.key === 'bufferMinutes' ? 'm' : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => setLimits(prev => ({ ...prev, [opt.key]: Math.min(opt.max, val + opt.step) }))}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition text-sm font-bold"
                          >+</button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={opt.min}
                        max={opt.max}
                        step={opt.step}
                        value={val}
                        onChange={e => setLimits(prev => ({ ...prev, [opt.key]: Number(e.target.value) }))}
                        className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-emerald-500"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Buffer preview */}
              <div className="mt-5 p-4 rounded-xl border border-white/5 bg-black/30">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">
                  Buffer Preview (30-min example)
                </p>
                <div className="space-y-1.5">
                  {[
                    { time: '7:00 PM – 7:30 PM', type: 'Career Guidance', active: true  },
                    { time: `(${limits.bufferMinutes} min buffer)`,       type: '',                active: false },
                    { time: `7:${30 + limits.bufferMinutes === 60 ? '00' : (30 + limits.bufferMinutes).toString().padStart(2, '0')} PM – 8:${limits.bufferMinutes.toString().padStart(2, '0')} PM`, type: 'Resume Review', active: true  },
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${row.active ? 'bg-emerald-500/5 border border-emerald-500/15' : 'border border-dashed border-slate-800'}`}>
                      <span className={`text-[10px] font-bold ${row.active ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {row.time}
                      </span>
                      {row.type && (
                        <span className="text-[9px] text-slate-500 font-medium">{row.type}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 text-white font-sora font-extrabold text-sm tracking-wider hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-violet-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Slots…</>
            ) : (
              <><Zap className="w-4 h-4" /> Auto-Generate {totalCount > 0 ? `${totalCount}+` : '100+'} Slots</>
            )}
          </button>
        </div>

        {/* ── Right: Calendar + Slot Preview ── */}
        <div className="space-y-4">

          {/* Calendar */}
          <CalendarGrid slots={generatedSlots} />

          {/* Slot Preview */}
          {isGenerated && (
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Slot Preview
                </h3>
                <span className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider">
                  Next 5 slots
                </span>
              </div>
              <div className="space-y-2">
                {generatedSlots.slice(0, 5).map(slot => {
                  const mType = defaultMeetingTypes().find(m => m.label === slot.type);
                  const c = mType ? colorMap[mType.color] : colorMap.blue;
                  return (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        slot.status === 'booked'
                          ? 'border-amber-500/20 bg-amber-500/5'
                          : `${c.border} ${c.bg}`
                      }`}
                    >
                      <div>
                        <div className={`text-[10px] font-bold ${slot.status === 'booked' ? 'text-amber-400' : c.text}`}>
                          {slot.startTime} – {slot.endTime}
                        </div>
                        <div className="text-[9px] text-slate-600 font-medium">{slot.day} · {slot.type}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-wider ${
                        slot.status === 'booked'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coming Soon Features */}
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-3">
            <h3 className="font-sora text-xs font-extrabold text-white mb-3 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Premium Integrations
            </h3>
            {[
              { icon: CalendarDays, label: 'Google Calendar Sync',   sub: 'Auto-block when busy',      soon: true  },
              { icon: Video,         label: 'Google Meet Links',       sub: 'Auto-generated per slot',   soon: true  },
              { icon: TrendingUp,    label: 'Booking Analytics',       sub: 'Slot utilisation trends',   soon: false },
              { icon: MessageSquare, label: 'Reminder Notifications',  sub: '24h before each meeting',   soon: true  },
            ].map(feat => {
              const Icon = feat.icon;
              return (
                <div key={feat.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-white">{feat.label}</div>
                    <div className="text-[9px] text-slate-600 font-medium">{feat.sub}</div>
                  </div>
                  {feat.soon ? (
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
                      Soon
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      Live
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Full Slot Table ── */}
      {isGenerated && generatedSlots.length > 0 && (
        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Generated Slots — Next 4 Weeks
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-semibold">
                {availableCount} available · {bookedCount} booked
              </span>
            </div>
          </div>

          <div className="space-y-1 max-h-[480px] overflow-y-auto no-scrollbar pr-1">
            {generatedSlots.map(slot => {
              const mType = defaultMeetingTypes().find(m => m.label === slot.type);
              const c = mType ? colorMap[mType.color] : colorMap.blue;
              return (
                <div
                  key={slot.id}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    slot.status === 'booked'
                      ? 'border-amber-500/15 bg-amber-500/5'
                      : 'border-transparent bg-white/[0.015] hover:border-white/5'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${slot.status === 'booked' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <div className="w-24 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400">{slot.day}</span>
                  </div>
                  <div className="w-36 shrink-0">
                    <span className="text-[10px] text-slate-500 font-medium">{slot.date}</span>
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs font-bold ${slot.status === 'booked' ? 'text-amber-400' : 'text-white'}`}>
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${c.bg} ${c.text} border ${c.border} uppercase tracking-wider`}>
                      {slot.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                      slot.status === 'booked'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
