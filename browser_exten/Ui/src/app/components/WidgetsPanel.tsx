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

                {/* Transparent Toggle */}
                <div className="flex justify-between items-center mb-6">
                  <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                    <LayoutGrid size={14} /> Transparent Bg
                  </label>
                  <button 
                    onClick={() => onToggleEtherealClockTransparent(!etherealClockTransparent)}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {etherealClockTransparent ? <ToggleRight size={24} style={{ color: currentTheme }} /> : <ToggleLeft size={24} className="text-white/30" />}
                  </button>
                </div>

                <div className="flex justify-between items-center mb-2">
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
            <p className="text-xs text-white/40 font-space mt-3 leading-relaxed mb-4">
              If enabled, the search box remains on screen and can be dragged like a widget. Otherwise, press <span className="bg-white/10 px-1 py-0.5 rounded text-white/70">SPACE</span> to open Spotlight search.
            </p>

            {showSearchWidget && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col pt-4 border-t border-white/10"
              >
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