import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock as ClockIcon, Palette, ToggleLeft, ToggleRight, Type, LayoutGrid, Search, Move, CalendarDays } from "lucide-react";
import clockPreview from "../../imports/image-14.png";
import etherealClockPreview from "../../imports/image-3.png";
import glassCalendarPreview from "../../imports/image-4.png";

interface WidgetsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  showClock: boolean;
  onToggleClock: (val: boolean) => void;
  clockColor: string;
  onUpdateClockColor: (color: string) => void;
  clockTextColor: string;
  onUpdateClockTextColor: (color: string) => void;
  clockScale: number;
  onUpdateClockScale: (scale: number) => void;
  isDragMode: boolean;
  onToggleDragMode: (val: boolean) => void;
  currentTheme: string;
  customText1: string;
  customText2: string;
  onUpdateTexts: (t1: string, t2: string) => void;
  showSearchWidget: boolean;
  onToggleSearchWidget: (val: boolean) => void;
  searchWidgetScale: number;
  onUpdateSearchWidgetScale: (scale: number) => void;
  showEtherealClock: boolean;
  onToggleEtherealClock: (val: boolean) => void;
  etherealClockScale: number;
  onUpdateEtherealClockScale: (scale: number) => void;
  etherealClockColor: string;
  onUpdateEtherealClockColor: (color: string) => void;
  etherealClockTransparent: boolean;
  onToggleEtherealClockTransparent: (val: boolean) => void;
  showGlassCalendar: boolean;
  onToggleGlassCalendar: (val: boolean) => void;
  glassCalendarScale: number;
  onUpdateGlassCalendarScale: (scale: number) => void;
  glassCalendarColor: string;
  onUpdateGlassCalendarColor: (color: string) => void;
  glassCalendarTransparent: boolean;
  onToggleGlassCalendarTransparent: (val: boolean) => void;
  glassCalendarBlur: number;
  onUpdateGlassCalendarBlur: (blur: number) => void;
  showChecklist: boolean;
  onToggleChecklist: (val: boolean) => void;
  checklistScale: number;
  onUpdateChecklistScale: (scale: number) => void;
  checklistColor: string;
  onUpdateChecklistColor: (color: string) => void;
  checklistTextColor: string;
  onUpdateChecklistTextColor: (color: string) => void;
  checklistStrokeEnabled: boolean;
  onToggleChecklistStroke: (val: boolean) => void;
  checklistStrokeColor: string;
  onUpdateChecklistStrokeColor: (color: string) => void;
  checklistTransparent: boolean;
  onToggleChecklistTransparent: (val: boolean) => void;
  checklistBlur: number;
  onUpdateChecklistBlur: (blur: number) => void;
  clockBgBlurEnabled: boolean;
  onToggleClockBgBlur: (val: boolean) => void;
  clockBgBlur: number;
  onUpdateClockBgBlur: (val: number) => void;
  etherealClockBgBlurEnabled: boolean;
  onToggleEtherealClockBgBlur: (val: boolean) => void;
  etherealClockBgBlur: number;
  onUpdateEtherealClockBgBlur: (val: number) => void;
  etherealClockGlowEnabled: boolean;
  onToggleEtherealClockGlow: (val: boolean) => void;
  etherealClockTextColor: string;
  onUpdateEtherealClockTextColor: (color: string) => void;
  etherealClockStrokeEnabled: boolean;
  onToggleEtherealClockStroke: (val: boolean) => void;
  etherealClockStrokeColor: string;
  onUpdateEtherealClockStrokeColor: (color: string) => void;
  glassCalendarTextColor: string;
  onUpdateGlassCalendarTextColor: (color: string) => void;
  calendarStrokeEnabled: boolean;
  onToggleCalendarStroke: (val: boolean) => void;
  calendarStrokeColor: string;
  onUpdateCalendarStrokeColor: (color: string) => void;
  searchBarOpacity: number;
  onUpdateSearchBarOpacity: (val: number) => void;
  searchBarBgOpacity: number;
  onUpdateSearchBarBgOpacity: (val: number) => void;
  sidebarOpacity: number;
  onUpdateSidebarOpacity: (val: number) => void;
  sidebarBgOpacity: number;
  onUpdateSidebarBgOpacity: (val: number) => void;
  spacebarSearchEnabled: boolean;
  onToggleSpacebarSearch: (val: boolean) => void;
  gearStyle: 'outline' | 'blurred-bg' | 'ring';
  onUpdateGearStyle: (style: 'outline' | 'blurred-bg' | 'ring') => void;
  gearBgOpacity: number;
  onUpdateGearBgOpacity: (val: number) => void;
  gearBgBlur: number;
  onUpdateGearBgBlur: (val: number) => void;
  gearRingColor: string;
  onUpdateGearRingColor: (color: string) => void;
  gearIconColor: string;
  onUpdateGearIconColor: (color: string) => void;
}

const PRESET_COLORS = ['#c58bf2', '#60a5fa', '#4ade80', '#fb7185', '#fbbf24'];

export function WidgetsPanel({ 
  isOpen, 
  onClose,
  showClock,
  onToggleClock,
  clockColor,
  onUpdateClockColor,
  clockTextColor,
  onUpdateClockTextColor,
  clockScale,
  onUpdateClockScale,
  isDragMode,
  onToggleDragMode,
  currentTheme,
  customText1,
  customText2,
  onUpdateTexts,
  showSearchWidget,
  onToggleSearchWidget,
  searchWidgetScale,
  onUpdateSearchWidgetScale,
  showEtherealClock,
  onToggleEtherealClock,
  etherealClockScale,
  onUpdateEtherealClockScale,
  etherealClockColor,
  onUpdateEtherealClockColor,
  etherealClockTransparent,
  onToggleEtherealClockTransparent,
  showGlassCalendar,
  onToggleGlassCalendar,
  glassCalendarScale,
  onUpdateGlassCalendarScale,
  glassCalendarColor,
  onUpdateGlassCalendarColor,
  glassCalendarTransparent,
  onToggleGlassCalendarTransparent,
  glassCalendarBlur,
  onUpdateGlassCalendarBlur,
  showChecklist,
  onToggleChecklist,
  checklistScale,
  onUpdateChecklistScale,
  checklistColor,
  onUpdateChecklistColor,
  checklistTextColor,
  onUpdateChecklistTextColor,
  checklistStrokeEnabled,
  onToggleChecklistStroke,
  checklistStrokeColor,
  onUpdateChecklistStrokeColor,
  checklistTransparent,
  onToggleChecklistTransparent,
  checklistBlur,
  onUpdateChecklistBlur,
  clockBgBlurEnabled,
  onToggleClockBgBlur,
  clockBgBlur,
  onUpdateClockBgBlur,
  etherealClockBgBlurEnabled,
  onToggleEtherealClockBgBlur,
  etherealClockBgBlur,
  onUpdateEtherealClockBgBlur,
  etherealClockGlowEnabled,
  onToggleEtherealClockGlow,
  etherealClockTextColor,
  onUpdateEtherealClockTextColor,
  etherealClockStrokeEnabled,
  onToggleEtherealClockStroke,
  etherealClockStrokeColor,
  onUpdateEtherealClockStrokeColor,
  glassCalendarTextColor,
  onUpdateGlassCalendarTextColor,
  calendarStrokeEnabled,
  onToggleCalendarStroke,
  calendarStrokeColor,
  onUpdateCalendarStrokeColor,
  searchBarOpacity,
  onUpdateSearchBarOpacity,
  searchBarBgOpacity,
  onUpdateSearchBarBgOpacity,
  sidebarOpacity,
  onUpdateSidebarOpacity,
  sidebarBgOpacity,
  onUpdateSidebarBgOpacity,
  spacebarSearchEnabled,
  onToggleSpacebarSearch,
  gearStyle,
  onUpdateGearStyle,
  gearBgOpacity,
  onUpdateGearBgOpacity,
  gearBgBlur,
  onUpdateGearBgBlur,
  gearRingColor,
  onUpdateGearRingColor,
  gearIconColor,
  onUpdateGearIconColor,
}: WidgetsPanelProps) {

  const [t1Input, setT1Input] = useState(customText1);
  const [t2Input, setT2Input] = useState(customText2);

  useEffect(() => {
    setT1Input(customText1);
    setT2Input(customText2);
  }, [customText1, customText2, isOpen]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTexts(t1Input, t2Input);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="absolute right-0 top-0 h-full w-[400px] bg-black/80 backdrop-blur-3xl border-l border-white/10 z-50 flex flex-col p-6 overflow-y-auto no-scrollbar text-white"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-sm font-space tracking-[0.2em] uppercase">Widgets</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Layout Customization */}
          <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <label className="text-sm font-medium text-white flex items-center gap-2 font-space" style={{ color: currentTheme }}>
              <Move size={16} /> Layout Mode
            </label>
            <button
              onClick={() => onToggleDragMode(!isDragMode)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all font-space text-sm ${isDragMode ? 'text-white' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}
              style={isDragMode ? { borderColor: currentTheme, backgroundColor: `${currentTheme}20` } : {}}
            >
              <span>{isDragMode ? 'Dragging Enabled' : 'Enable Dragging'}</span>
              <div className="w-10 h-6 rounded-full p-1 transition-colors" style={{ backgroundColor: isDragMode ? currentTheme : 'rgba(255,255,255,0.2)' }}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDragMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
            {isDragMode && (
              <p className="text-xs font-space mt-1 opacity-70" style={{ color: currentTheme }}>
                You can now drag widgets and the sidebar anywhere on the screen. Disable this when you're done.
              </p>
            )}
          </div>

          {/* Sidebar Transparency */}
          <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white flex items-center gap-2 font-space" style={{ color: currentTheme }}>
                <LayoutGrid size={16} /> Sidebar Transparency
              </label>
              <span className="text-xs font-space text-white/50">{sidebarBgOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={sidebarBgOpacity}
              onChange={(e) => onUpdateSidebarBgOpacity(parseFloat(e.target.value))}
              className="w-full accent-white"
              style={{ accentColor: currentTheme }}
            />
          </div>

          {/* Clock Widget Card */}
          <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <ClockIcon size={20} />
                </div>
                <span className="font-space tracking-wider text-sm">Cinematic Clock</span>
              </div>
              <button 
                onClick={() => onToggleClock(!showClock)}
                className="text-white hover:text-white/80 transition-colors"
              >
                {showClock ? <ToggleRight size={28} className="text-[#c58bf2]" /> : <ToggleLeft size={28} className="text-white/30" />}
              </button>
            </div>

            {/* Widget Preview Image */}
            <div className="w-full rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden bg-black">
                <img src={clockPreview} alt="Cinematic Clock Preview" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
            </div>

            {showClock && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col pt-4 border-t border-white/10 mt-2"
              >
                {/* Clock Accent Color */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Clock Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => onUpdateClockColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${clockColor === color ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                        style={{ 
                          backgroundColor: color,
                          borderColor: clockColor === color ? 'white' : 'transparent',
                          boxShadow: clockColor === color ? `0 0 10px ${color}` : 'none'
                        }}
                        aria-label={`Set clock color to ${color}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input 
                        type="color" 
                        value={clockColor}
                        onChange={(e) => onUpdateClockColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={clockColor.toUpperCase()}
                      onChange={(e) => onUpdateClockColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Clock Text Color */}
                <div className="flex flex-col gap-3 mt-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Type size={14} /> Text & Numbers Color
                  </label>
                  <div className="flex items-center gap-3">
                    {['#ffffff', ...PRESET_COLORS.slice(0, 4)].map(color => (
                      <button
                        key={`txt-${color}`}
                        onClick={() => onUpdateClockTextColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${clockTextColor === color ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                        style={{ 
                          backgroundColor: color,
                          borderColor: clockTextColor === color ? 'white' : 'transparent',
                          boxShadow: clockTextColor === color ? `0 0 10px ${color}` : 'none'
                        }}
                        aria-label={`Set text color to ${color}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input 
                        type="color" 
                        value={clockTextColor}
                        onChange={(e) => onUpdateClockTextColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={clockTextColor.toUpperCase()}
                      onChange={(e) => onUpdateClockTextColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Background Blur */}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <Palette size={14} /> Background Blur
                    </label>
                    <button onClick={() => onToggleClockBgBlur(!clockBgBlurEnabled)} className="text-white hover:text-white/80 transition-colors">
                      {clockBgBlurEnabled ? <ToggleRight size={28} style={{ color: clockColor }} /> : <ToggleLeft size={28} className="text-white/30" />}
                    </button>
                  </div>
                  {clockBgBlurEnabled && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-space text-white/40 uppercase tracking-widest">Intensity</span>
                        <span className="text-xs font-space text-white/50">{clockBgBlur}px</span>
                      </div>
                      <input type="range" min="0" max="40" step="1" value={clockBgBlur}
                        onChange={(e) => onUpdateClockBgBlur(parseFloat(e.target.value))}
                        className="w-full accent-white" style={{ accentColor: clockColor }} />
                    </motion.div>
                  )}
                </div>

                {/* Clock Size Slider */}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <LayoutGrid size={14} /> Widget Size
                    </label>
                    <span className="text-xs font-space text-white/50">{Math.round(clockScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={clockScale}
                    onChange={(e) => onUpdateClockScale(parseFloat(e.target.value))}
                    className="w-full accent-white"
                    style={{ accentColor: clockColor }}
                  />
                </div>

                {/* Text Customization */}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Type size={14} /> Custom Text
                  </label>
                  <form onSubmit={handleTextSubmit} className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={t1Input}
                      onChange={(e) => setT1Input(e.target.value)}
                      placeholder="E.g. Yolo Life.."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space"
                    />
                    <textarea
                      value={t2Input}
                      onChange={(e) => setT2Input(e.target.value)}
                      placeholder="E.g. IT'S TIME TO BUILD..."
                      className="w-full min-h-[80px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space resize-none whitespace-pre overflow-x-auto custom-scrollbar"
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const target = e.target as HTMLTextAreaElement;
                          const start = target.selectionStart;
                          const end = target.selectionEnd;
                          setT2Input(t2Input.substring(0, start) + '\t' + t2Input.substring(end));
                          // Give React time to update state before moving cursor
                          setTimeout(() => {
                            target.selectionStart = target.selectionEnd = start + 1;
                          }, 0);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/20 font-space uppercase tracking-widest mt-1"
                    >
                      Save Text
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>

          {/* Ethereal Clock Widget Toggle */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <Type size={20} />
                </div>
                <span className="font-space tracking-wider text-sm">Ethereal Glass Clock</span>
              </div>
              <button 
                onClick={() => onToggleEtherealClock(!showEtherealClock)}
                className="text-white hover:text-white/80 transition-colors"
              >
                {showEtherealClock ? <ToggleRight size={28} className="text-[#c58bf2]" style={{ color: currentTheme }} /> : <ToggleLeft size={28} className="text-white/30" />}
              </button>
            </div>

            {/* Widget Preview Image */}
            <div className="w-full rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden bg-black mt-4">
              <img src={etherealClockPreview} alt="Ethereal Glass Clock Preview" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
            </div>

            {showEtherealClock && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col pt-4 border-t border-white/10 mt-4"
              >
                {/* Glow Color */}
                <div className="flex flex-col gap-3 mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Inner Glow Color
                  </label>
                  <div className="flex items-center gap-3">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={`ethereal-${color}`}
                        onClick={() => onUpdateEtherealClockColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${etherealClockColor === color ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                        style={{
                          backgroundColor: color,
                          borderColor: etherealClockColor === color ? 'white' : 'transparent',
                          boxShadow: etherealClockColor === color ? `0 0 10px ${color}` : 'none'
                        }}
                        aria-label={`Set ethereal glow color to ${color}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input
                        type="color"
                        value={etherealClockColor}
                        onChange={(e) => onUpdateEtherealClockColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={etherealClockColor.toUpperCase()}
                      onChange={(e) => onUpdateEtherealClockColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Numbers Text Color */}
                <div className="flex flex-col gap-3 mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Numbers Text Color
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input
                        type="color"
                        value={etherealClockTextColor}
                        onChange={(e) => onUpdateEtherealClockTextColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={etherealClockTextColor.toUpperCase()}
                      onChange={(e) => onUpdateEtherealClockTextColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Stroke/Outline Effect Toggle */}
                <div className="flex justify-between items-center mb-4 pt-3 border-t border-white/10">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Text Outline Border
                  </label>
                  <button onClick={() => onToggleEtherealClockStroke(!etherealClockStrokeEnabled)} className="text-white hover:text-white/80 transition-colors">
                    {etherealClockStrokeEnabled ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                  </button>
                </div>

                {etherealClockStrokeEnabled && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-3 mb-6">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <Palette size={14} /> Outline Border Color
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                        <input
                          type="color"
                          value={etherealClockStrokeColor}
                          onChange={(e) => onUpdateEtherealClockStrokeColor(e.target.value)}
                          className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={etherealClockStrokeColor.toUpperCase()}
                        onChange={(e) => onUpdateEtherealClockStrokeColor(e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                        placeholder="#HEX"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Transparent Toggle */}
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Transparent Bg
                  </label>
                  <button onClick={() => onToggleEtherealClockTransparent(!etherealClockTransparent)} className="text-white hover:text-white/80 transition-colors">
                    {etherealClockTransparent ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                  </button>
                </div>

                {/* Glow Effect Toggle */}
                <div className="flex justify-between items-center mb-4 pt-3 border-t border-white/10">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Glow Effect
                  </label>
                  <button onClick={() => onToggleEtherealClockGlow(!etherealClockGlowEnabled)} className="text-white hover:text-white/80 transition-colors">
                    {etherealClockGlowEnabled ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                  </button>
                </div>

                {/* Background Blur */}
                <div className="flex flex-col gap-3 pt-3 border-t border-white/10 mb-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <Palette size={14} /> Background Blur
                    </label>
                    <button onClick={() => onToggleEtherealClockBgBlur(!etherealClockBgBlurEnabled)} className="text-white hover:text-white/80 transition-colors">
                      {etherealClockBgBlurEnabled ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                    </button>
                  </div>
                  {etherealClockBgBlurEnabled && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-space text-white/40 uppercase tracking-widest">Intensity</span>
                        <span className="text-xs font-space text-white/50">{etherealClockBgBlur}px</span>
                      </div>
                      <input type="range" min="0" max="40" step="1" value={etherealClockBgBlur}
                        onChange={(e) => onUpdateEtherealClockBgBlur(parseFloat(e.target.value))}
                        className="w-full accent-white" style={{ accentColor: currentTheme }} />
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-2 pt-3 border-t border-white/10">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Widget Size
                  </label>
                  <span className="text-xs font-space text-white/50">{Math.round(etherealClockScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2"
                  step="0.05"
                  value={etherealClockScale}
                  onChange={(e) => onUpdateEtherealClockScale(parseFloat(e.target.value))}
                  className="w-full accent-white"
                  style={{ accentColor: currentTheme }}
                />
              </motion.div>
            )}
          </div>

          {/* Glass Calendar Widget Toggle */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <CalendarDays size={20} />
                </div>
                <span className="font-space tracking-wider text-sm">Glass Calendar & Notes</span>
              </div>
              <button 
                onClick={() => onToggleGlassCalendar(!showGlassCalendar)}
                className="text-white hover:text-white/80 transition-colors"
              >
                {showGlassCalendar ? <ToggleRight size={28} className="text-[#c58bf2]" style={{ color: currentTheme }} /> : <ToggleLeft size={28} className="text-white/30" />}
              </button>
            </div>

            {/* Widget Preview Image */}
            <div className="w-full rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden bg-black mt-4">
              <img src={glassCalendarPreview} alt="Glass Calendar & Notes Preview" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
            </div>

            {showGlassCalendar && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col pt-4 border-t border-white/10 mt-4"
              >
                {/* Accent Color */}
                <div className="flex flex-col gap-3 mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Calendar Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={`cal-${color}`}
                        onClick={() => onUpdateGlassCalendarColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${glassCalendarColor === color ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                        style={{
                          backgroundColor: color,
                          borderColor: glassCalendarColor === color ? 'white' : 'transparent',
                          boxShadow: glassCalendarColor === color ? `0 0 10px ${color}` : 'none'
                        }}
                        aria-label={`Set calendar accent color to ${color}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input
                        type="color"
                        value={glassCalendarColor}
                        onChange={(e) => onUpdateGlassCalendarColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={glassCalendarColor.toUpperCase()}
                      onChange={(e) => onUpdateGlassCalendarColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Text & Numbers Color */}
                <div className="flex flex-col gap-3 mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Text Color Override
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input
                        type="color"
                        value={glassCalendarTextColor}
                        onChange={(e) => onUpdateGlassCalendarTextColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={glassCalendarTextColor.toUpperCase()}
                      onChange={(e) => onUpdateGlassCalendarTextColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Enable Text Outlines Toggle */}
                <div className="flex justify-between items-center mb-4 pt-3 border-t border-white/10">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Enable Text Outlines
                  </label>
                  <button onClick={() => onToggleCalendarStroke(!calendarStrokeEnabled)} className="text-white hover:text-white/80 transition-colors">
                    {calendarStrokeEnabled ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                  </button>
                </div>

                {calendarStrokeEnabled && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-3 mb-6">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <Palette size={14} /> Outline Border Color
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                        <input
                          type="color"
                          value={calendarStrokeColor}
                          onChange={(e) => onUpdateCalendarStrokeColor(e.target.value)}
                          className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={calendarStrokeColor.toUpperCase()}
                        onChange={(e) => onUpdateCalendarStrokeColor(e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                        placeholder="#HEX"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Transparent Toggle */}
                <div className="flex justify-between items-center mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Transparent Bg
                  </label>
                  <button
                    onClick={() => onToggleGlassCalendarTransparent(!glassCalendarTransparent)}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {glassCalendarTransparent ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                  </button>
                </div>

                {/* Background Blur Slider */}
                <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <LayoutGrid size={14} /> Background Blur
                    </label>
                    <span className="text-xs font-space text-white/50">{glassCalendarBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={glassCalendarBlur}
                    onChange={(e) => onUpdateGlassCalendarBlur(parseFloat(e.target.value))}
                    className="w-full accent-white"
                    style={{ accentColor: glassCalendarColor }}
                  />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Widget Size
                  </label>
                  <span className="text-xs font-space text-white/50">{Math.round(glassCalendarScale * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.05"
                  value={glassCalendarScale}
                  onChange={(e) => onUpdateGlassCalendarScale(parseFloat(e.target.value))}
                  className="w-full accent-white"
                  style={{ accentColor: currentTheme }}
                />
              </motion.div>
            )}
          </div>

          {/* Checklist Widget Toggle */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <LayoutGrid size={20} />
                </div>
                <span className="font-space tracking-wider text-sm">To Do List</span>
              </div>
              <button 
                onClick={() => onToggleChecklist(!showChecklist)}
                className="text-white hover:text-white/80 transition-colors"
              >
                {showChecklist ? <ToggleRight size={28} style={{ color: currentTheme }} /> : <ToggleLeft size={28} className="text-white/30" />}
              </button>
            </div>

            {showChecklist && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col pt-4 border-t border-white/10 mt-4"
              >
                {/* Accent Color */}
                <div className="flex flex-col gap-3 mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Widget Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={`chk-${color}`}
                        onClick={() => onUpdateChecklistColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${checklistColor === color ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                        style={{
                          backgroundColor: color,
                          borderColor: checklistColor === color ? 'white' : 'transparent',
                          boxShadow: checklistColor === color ? `0 0 10px ${color}` : 'none'
                        }}
                        aria-label={`Set checklist accent color to ${color}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input
                        type="color"
                        value={checklistColor}
                        onChange={(e) => onUpdateChecklistColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={checklistColor.toUpperCase()}
                      onChange={(e) => onUpdateChecklistColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="flex flex-col gap-3 mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <Palette size={14} /> Text Color
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input
                        type="color"
                        value={checklistTextColor}
                        onChange={(e) => onUpdateChecklistTextColor(e.target.value)}
                        className="absolute inset-[-10px] w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={checklistTextColor.toUpperCase()}
                      onChange={(e) => onUpdateChecklistTextColor(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>

                {/* Transparent Toggle */}
                <div className="flex justify-between items-center mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Transparent Bg
                  </label>
                  <button
                    onClick={() => onToggleChecklistTransparent(!checklistTransparent)}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {checklistTransparent ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                  </button>
                </div>

                {/* Background Blur Slider */}
                <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <LayoutGrid size={14} /> Background Blur
                    </label>
                    <span className="text-xs font-space text-white/50">{checklistBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={checklistBlur}
                    onChange={(e) => onUpdateChecklistBlur(parseFloat(e.target.value))}
                    className="w-full accent-white"
                    style={{ accentColor: checklistColor }}
                  />
                </div>

                {/* Widget Size Slider */}
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Widget Size
                  </label>
                  <span className="text-xs font-space text-white/50">{Math.round(checklistScale * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.05"
                  value={checklistScale}
                  onChange={(e) => onUpdateChecklistScale(parseFloat(e.target.value))}
                  className="w-full accent-white"
                  style={{ accentColor: currentTheme }}
                />
              </motion.div>
            )}
          </div>

            {/* Search Box Widget Toggle */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="text-white/70" size={20} />
                <span className="font-space tracking-wider text-sm">Always Show Search Box</span>
              </div>
              <button 
                onClick={() => onToggleSearchWidget(!showSearchWidget)}
                className="text-white hover:text-white/80 transition-colors"
              >
                {showSearchWidget ? <ToggleRight size={28} className="text-[#c58bf2]" style={{ color: currentTheme }} /> : <ToggleLeft size={28} className="text-white/30" />}
              </button>
            </div>
            
            {/* Spacebar Summon Toggle */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <LayoutGrid className="text-white/70" size={16} />
                <span className="font-space tracking-wider text-xs text-white/70">Summon Search via Spacebar</span>
              </div>
              <button 
                onClick={() => onToggleSpacebarSearch(!spacebarSearchEnabled)}
                className="text-white hover:text-white/80 transition-colors"
              >
                {spacebarSearchEnabled ? <ToggleRight size={24} className="text-[#c58bf2]" style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
              </button>
            </div>
            
            <p className="text-xs text-white/40 font-space mt-3 leading-relaxed mb-4">
              If enabled, the search box remains on screen and can be dragged like a widget. Otherwise, press <span className="bg-white/10 px-1 py-0.5 rounded text-white/70">SPACE</span> to open Spotlight search.
            </p>

            {showSearchWidget && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col pt-4 border-t border-white/10"
              >
                {/* Search Base Transparency Slider */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <LayoutGrid size={14} /> Search Box Transparency
                    </label>
                    <span className="text-xs font-space text-white/50">{searchBarBgOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={searchBarBgOpacity}
                    onChange={(e) => onUpdateSearchBarBgOpacity(parseFloat(e.target.value))}
                    className="w-full accent-white"
                    style={{ accentColor: currentTheme }}
                  />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Widget Size
                  </label>
                  <span className="text-xs font-space text-white/50">{Math.round(searchWidgetScale * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.05"
                  value={searchWidgetScale}
                  onChange={(e) => onUpdateSearchWidgetScale(parseFloat(e.target.value))}
                  className="w-full accent-white"
                  style={{ accentColor: currentTheme }}
                />
              </motion.div>
            )}
          </div>

          {/* Right Sidebar Opacity Slider */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: `${currentTheme}22`, color: currentTheme }}>
                <LayoutGrid size={12} />
              </div>
              <span className="text-xs font-space uppercase tracking-widest text-white/70 font-medium">Sidebar Transparency</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                  Sidebar Tint Darkness
                </label>
                <span className="text-xs font-space text-white/50">{sidebarBgOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={sidebarBgOpacity}
                onChange={(e) => onUpdateSidebarBgOpacity(parseFloat(e.target.value))}
                className="w-full accent-white"
                style={{ accentColor: currentTheme }}
              />
            </div>
            
            {/* Master Opacity Slider (legacy) */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                  Master Element Opacity
                </label>
                <span className="text-xs font-space text-white/50">{sidebarOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={sidebarOpacity}
                onChange={(e) => onUpdateSidebarOpacity(parseFloat(e.target.value))}
                className="w-full accent-white"
                style={{ accentColor: currentTheme }}
              />
            </div>
          </div>

          {/* Settings Button Style */}
          <div className="flex flex-col gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: `${currentTheme}22`, color: currentTheme }}>⚙</div>
              <span className="text-xs font-space uppercase tracking-widest text-white/70 font-medium">Settings Button Style</span>
            </div>

            {/* Mode selector */}
            <div className="flex gap-2">
              {(['outline', 'blurred-bg', 'ring'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdateGearStyle(mode)}
                  className="flex-1 py-2 px-1 rounded-lg text-xs font-space uppercase tracking-wide transition-all border"
                  style={{
                    backgroundColor: gearStyle === mode ? `${currentTheme}22` : 'rgba(255,255,255,0.05)',
                    borderColor: gearStyle === mode ? currentTheme : 'rgba(255,255,255,0.1)',
                    color: gearStyle === mode ? currentTheme : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {mode === 'outline' ? 'Glow' : mode === 'blurred-bg' ? 'Frosted' : 'Ring'}
                </button>
              ))}
            </div>

            {/* Icon Color — shown for all modes */}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                <Palette size={14} /> Icon Color
              </label>
              <div className="flex items-center gap-3">
                {['#ffffff', ...PRESET_COLORS].map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateGearIconColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${gearIconColor === c ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                    style={{
                      backgroundColor: c,
                      borderColor: gearIconColor === c ? 'white' : 'transparent',
                      boxShadow: gearIconColor === c ? `0 0 10px ${c}` : 'none',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                  <input type="color" value={gearIconColor} onChange={(e) => onUpdateGearIconColor(e.target.value)} className="absolute inset-[-10px] w-12 h-12 cursor-pointer" />
                </div>
                <input
                  type="text"
                  value={gearIconColor.toUpperCase()}
                  onChange={(e) => onUpdateGearIconColor(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                  placeholder="#HEX"
                />
              </div>
            </div>

            {/* Frosted mode — opacity + blur sliders */}
            {gearStyle === 'blurred-bg' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col gap-4 pt-3 border-t border-white/10"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <Palette size={14} /> Background Opacity
                    </label>
                    <span className="text-xs font-space text-white/50">{Math.round(gearBgOpacity * 100)}%</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={gearBgOpacity}
                    onChange={(e) => onUpdateGearBgOpacity(parseFloat(e.target.value))}
                    className="w-full accent-white" style={{ accentColor: currentTheme }} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                      <Palette size={14} /> Blur Intensity
                    </label>
                    <span className="text-xs font-space text-white/50">{gearBgBlur}px</span>
                  </div>
                  <input type="range" min="0" max="40" step="1" value={gearBgBlur}
                    onChange={(e) => onUpdateGearBgBlur(parseFloat(e.target.value))}
                    className="w-full accent-white" style={{ accentColor: currentTheme }} />
                </div>
              </motion.div>
            )}

            {/* Ring mode — ring color picker */}
            {gearStyle === 'ring' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col gap-3 pt-3 border-t border-white/10"
              >
                <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                  <Palette size={14} /> Ring Color
                </label>
                <div className="flex items-center gap-3">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateGearRingColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${gearRingColor === c ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                      style={{
                        backgroundColor: c,
                        borderColor: gearRingColor === c ? 'white' : 'transparent',
                        boxShadow: gearRingColor === c ? `0 0 10px ${c}` : 'none',
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                    <input type="color" value={gearRingColor} onChange={(e) => onUpdateGearRingColor(e.target.value)} className="absolute inset-[-10px] w-12 h-12 cursor-pointer" />
                  </div>
                  <input
                    type="text"
                    value={gearRingColor.toUpperCase()}
                    onChange={(e) => onUpdateGearRingColor(e.target.value)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                    placeholder="#HEX"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Placeholder for future widgets */}
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 bg-white/5 border border-white/5 border-dashed rounded-xl text-white/30">
            <LayoutGrid size={24} />
            <p className="text-xs font-space tracking-wider uppercase text-center">More widgets coming soon</p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}