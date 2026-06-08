import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit3, X, Check } from "lucide-react";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday, 
  addDays, parseISO, startOfDay, isAfter
} from "date-fns";

export interface GlassCalendarProps {
  color?: string;
  transparentBg?: boolean;
  blur?: number;
}

export function GlassCalendar({ color = "#c58bf2", transparentBg = false, blur = 24 }: GlassCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [draftNote, setDraftNote] = useState("");

  // Load notes from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("homepage_calendar_notes");
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load notes", e);
    }
  }, []);

  const saveNote = () => {
    if (!selectedDate) return;
    const key = format(selectedDate, 'yyyy-MM-dd');
    const newNotes = { ...notes };

    if (draftNote.trim() === "") {
      delete newNotes[key];
    } else {
      newNotes[key] = draftNote;
    }

    setNotes(newNotes);
    try {
      localStorage.setItem("homepage_calendar_notes", JSON.stringify(newNotes));
    } catch (error) {
      console.warn("Failed to save calendar notes to localStorage:", error);
    }
    setIsEditing(false);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair italic font-medium tracking-wide text-white flex items-center gap-3">
          <CalendarIcon size={24} style={{ color }} />
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-[10px] uppercase tracking-[0.2em] font-space text-white/40 mb-2">
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dateKey = format(cloneDay, 'yyyy-MM-dd');
        const hasNote = !!notes[dateKey];
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const today = isToday(day);
        const inMonth = isSameMonth(day, monthStart);

        days.push(
          <button
            key={day.toString()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setSelectedDate(cloneDay);
              setDraftNote(notes[dateKey] || "");
              setIsEditing(true);
            }}
            className={`
              relative h-10 w-full flex flex-col items-center justify-center rounded-xl transition-all
              font-space text-sm
              ${!inMonth ? "text-white/20 hover:text-white/40" : "text-white/80 hover:bg-white/10 hover:text-white"}
              ${today ? "font-bold text-white bg-white/5 ring-1 ring-white/20" : ""}
              ${isSelected ? "shadow-lg scale-105 z-10" : ""}
            `}
            style={isSelected ? { 
              backgroundColor: color, 
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              boxShadow: `0 4px 15px ${color}60`
            } : {}}
          >
            <span>{formattedDate}</span>
            {hasNote && (
              <span 
                className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? "bg-white" : ""}`}
                style={!isSelected ? { backgroundColor: color, boxShadow: `0 0 5px ${color}` } : {}}
              />
            )}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  // Get upcoming notes
  const getUpcomingNotes = () => {
    const today = startOfDay(new Date());
    return Object.entries(notes)
      .map(([dateStr, note]) => ({
        date: parseISO(dateStr),
        note,
        dateStr
      }))
      .filter((item) => !isAfter(today, item.date))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 4); // Show top 4 upcoming
  };

  const upcomingNotes = getUpcomingNotes();

  const glassStyle: React.CSSProperties = transparentBg ? {} : {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)',
    backdropFilter: `blur(${blur}px)`,
    // @ts-ignore - WebkitBackdropFilter is valid but not in types
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderTop: '1px solid rgba(255,255,255,0.4)',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 30px 60px -10px rgba(0,0,0,0.6), inset 0 1px 20px rgba(255,255,255,0.08)',
  };

  return (
    <div
      key={`calendar-blur-${blur}`}
      className={`relative flex flex-row p-8 rounded-[3rem] overflow-hidden pointer-events-auto group min-w-[700px] ${transparentBg ? '' : 'shadow-2xl'}`}
      style={glassStyle}
    >
      {/* Soft inner glow matching the color */}
      {!transparentBg && (
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none mix-blend-screen opacity-20 blur-[80px]"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Left Pane: Calendar Grid */}
      <div className="flex-1 pr-8 border-r border-white/10 relative z-10">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Right Pane: Notes & Reminders */}
      <div className="flex-1 pl-8 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {isEditing && selectedDate ? (
            <motion.div 
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-space font-medium text-white flex items-center gap-2">
                  <Edit3 size={18} style={{ color }} />
                  {format(selectedDate, "MMM d, yyyy")}
                </h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <textarea
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="What's happening on this day?"
                className="flex-1 bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-space text-white/90 focus:outline-none focus:ring-1 resize-none mb-4"
                style={{ focusRingColor: color }} // using inline style won't trigger tailwind ring color, but we'll add inline boxShadow
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 1px ${color}`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
              
              <button
                onClick={saveNote}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full py-3 rounded-xl font-space text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: color, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
              >
                <Check size={16} /> Save Note
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col h-full"
            >
              <h3 className="text-lg font-space font-medium text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                Upcoming Notes
              </h3>
              
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 no-scrollbar">
                {upcomingNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/30 font-space text-sm">
                    <CalendarIcon size={32} className="mb-2 opacity-50" />
                    <p>No upcoming reminders.</p>
                    <p className="text-xs mt-1">Select a date to add one.</p>
                  </div>
                ) : (
                  upcomingNotes.map((item, idx) => {
                    const isTom = isSameDay(item.date, addDays(new Date(), 1));
                    const isTod = isToday(item.date);
                    
                    return (
                      <div 
                        key={idx}
                        className="group flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          setSelectedDate(item.date);
                          setDraftNote(item.note);
                          setIsEditing(true);
                          setCurrentMonth(item.date); // switch calendar to that month
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span 
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color }}
                          >
                            {isTod ? "Today" : isTom ? "Tomorrow" : format(item.date, "MMM d")}
                          </span>
                        </div>
                        <p className="text-sm font-space text-white/80 line-clamp-2">
                          {item.note}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
