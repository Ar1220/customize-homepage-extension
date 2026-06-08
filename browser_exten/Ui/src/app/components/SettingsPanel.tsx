import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Image as ImageIcon, Link2, Video, Move, Upload, Palette, Volume2, VolumeX, Terminal, Trash2, Loader2 } from "lucide-react";
import { removeBackground } from '@imgly/background-removal';

import { Bookmark, BackgroundFilters, FILTER_PRESETS, SearchCommand } from "../App";
import { ImageCropperModal } from "./ImageCropperModal";
import { storageBridge } from "../utils/storage";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMedia: string;
  isCustomVideo: boolean;
  onUpdateMedia: (url: string, isVideo: boolean) => void;

  isDragMode: boolean;
  onToggleDragMode: (val: boolean) => void;

  currentTheme: string;
  onUpdateTheme: (theme: string) => void;

  bookmarks?: Bookmark[];
  onUpdateBookmarks?: (bookmarks: Bookmark[]) => void;

  customCommands?: CustomCommand[];
  onUpdateCustomCommands?: (commands: CustomCommand[]) => void;

  searchIconUrl?: string;
  onUpdateSearchIcon?: (url: string | undefined) => void;

  isMuted?: boolean;
  onToggleMute?: (val: boolean) => void;
  volume?: number;
  onUpdateVolume?: (vol: number) => void;

  bgFilters?: BackgroundFilters;
  onUpdateBgFilters?: (filters: Partial<BackgroundFilters>) => void;
  onResetBgFilters?: () => void;

  activeFilterPreset?: string;
  onApplyFilterPreset?: (presetId: string) => void;

  tabTitle?: string;
  onUpdateTabTitle?: (title: string) => void;
  tabIcon?: string;
  onUpdateTabIcon?: (iconUrl: string) => void;
}

export function SettingsPanel({
  isOpen, onClose,
  currentMedia, isCustomVideo, onUpdateMedia,
  isDragMode, onToggleDragMode,
  currentTheme, onUpdateTheme,
  bookmarks = [], onUpdateBookmarks,
  searchCommands = [], onUpdateSearchCommands,
  searchIconUrl, onUpdateSearchIcon,
  isMuted = true,
  onToggleMute,
  volume = 0.7,
  onUpdateVolume,
  bgFilters,
  onUpdateBgFilters,
  onResetBgFilters,
  activeFilterPreset,
  onApplyFilterPreset,
  tabTitle = "New Teb",
  onUpdateTabTitle,
  tabIcon = "/tab_logo.png",
  onUpdateTabIcon
}: SettingsPanelProps) {
  
  const [urlInput, setUrlInput] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("video");

  const [bookmarkUrlInput, setBookmarkUrlInput] = useState("");
  const [bookmarkNameInput, setBookmarkNameInput] = useState("");
  const [bookmarkIconUrl, setBookmarkIconUrl] = useState("");

  const [newCommandTrigger, setNewCommandTrigger] = useState("");
  const [newCommandName, setNewCommandName] = useState("");
  const [newCommandUrl, setNewCommandUrl] = useState("");
  const [newCommandIcon, setNewCommandIcon] = useState<string | undefined>(undefined);
  
  const [croppingImage, setCroppingImage] = useState<{url: string, type: 'command' | 'tab'} | null>(null);
  
  const [removeBgEnabled, setRemoveBgEnabled] = useState(true);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bookmarkIconInputRef = useRef<HTMLInputElement>(null);
  const searchIconInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUpdateMedia(urlInput.trim(), mediaType === "video");
      setUrlInput("");
    }
  };

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookmarkUrlInput.trim() && bookmarkNameInput.trim() && onUpdateBookmarks) {
      const newBookmark = {
        id: Date.now().toString(),
        url: bookmarkUrlInput.trim(),
        name: bookmarkNameInput.trim(),
        iconUrl: bookmarkIconUrl.trim() || undefined
      };
      onUpdateBookmarks([...bookmarks, newBookmark]);
      setBookmarkUrlInput("");
      setBookmarkNameInput("");
      setBookmarkIconUrl("");
    }
  };

  const handleRemoveBookmark = (id: string) => {
    if (onUpdateBookmarks) {
      onUpdateBookmarks(bookmarks.filter(b => b.id !== id));
    }
  };

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommandTrigger.trim() && newCommandName.trim() && newCommandUrl.trim() && onUpdateSearchCommands) {
      const cleanTrigger = newCommandTrigger.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

      if (!cleanTrigger) {
        alert("Trigger must contain letters or numbers");
        return;
      }

      const newCommand: SearchCommand = {
        id: Date.now().toString(),
        trigger: cleanTrigger,
        name: newCommandName,
        url: newCommandUrl,
        iconUrl: newCommandIcon,
      };

      onUpdateSearchCommands([...searchCommands, newCommand]);

      setNewCommandTrigger("");
      setNewCommandName("");
      setNewCommandUrl("");
      setNewCommandIcon(undefined);
    }
  };

  const handleRemoveCommand = (id: string) => {
    if (onUpdateSearchCommands) {
      onUpdateSearchCommands(searchCommands.filter(c => c.id !== id));
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleBookmarkIconInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBookmarkIconUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchIconInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && onUpdateSearchIcon) {
          onUpdateSearchIcon(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processFile = (file: File) => {
    const isVideoFile = file.type.startsWith('video/');

    // Create an object URL for immediate display
    const objectUrl = URL.createObjectURL(file);
    onUpdateMedia(objectUrl, isVideoFile);

    // Convert everything to Base64 Data URL for permanent storage
    // Now that web mode uses IndexedDB, size limits are no longer an issue
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onUpdateMedia(reader.result, isVideoFile);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all configurations? This will wipe all custom widgets, shortcuts, and themes back to factory defaults.")) {
      await storageBridge.clear();
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/20"
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 z-50 w-full max-w-sm border-l border-white/10 bg-black/90 backdrop-blur-xl p-6 overflow-y-auto shadow-2xl flex flex-col no-scrollbar"
          >
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-black/90 pb-4 z-10 border-b border-white/10">
              <h2 className="text-xl font-medium text-white flex items-center gap-2 font-space">
                <ImageIcon size={20} /> Personalize
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8 flex-1 pb-8">
              
              {/* Layout Customization */}
              <div className="space-y-4">
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
                  <p className="text-xs font-space mt-2 opacity-70" style={{ color: currentTheme }}>
                    You can now drag the clock and sidebar anywhere on the screen. Disable this when you're done.
                  </p>
                )}
              </div>

              {/* Theme Color Customization */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <label className="text-sm font-medium text-white/70 flex items-center justify-between gap-2 font-space">
                  <div className="flex items-center gap-2">
                    <Palette size={16} /> Theme Color
                  </div>
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {/* Presets */}
                    {['#c58bf2', '#60a5fa', '#4ade80', '#fb7185', '#fbbf24'].map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateTheme(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${currentTheme === color ? 'scale-110' : 'scale-100 border-transparent hover:scale-105'}`}
                        style={{ 
                          backgroundColor: color,
                          borderColor: currentTheme === color ? 'white' : 'transparent',
                          boxShadow: currentTheme === color ? `0 0 15px ${color}` : 'none'
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white/20 hover:border-white/50 transition-colors">
                      <input 
                        type="color" 
                        value={currentTheme}
                        onChange={(e) => onUpdateTheme(e.target.value)}
                        className="absolute inset-[-10px] w-16 h-16 cursor-pointer"
                        title="Pick Custom Color"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={currentTheme.toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-F]{6}$/i.test(val)) onUpdateTheme(val);
                        else onUpdateTheme(val); // will validate on blur or just let them type
                      }}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space uppercase"
                      placeholder="#HEX"
                    />
                  </div>
                </div>
              </div>

              {/* Wallpaper Filter */}
              {bgFilters && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-white/70 flex items-center gap-2 font-space">
                      <Palette className="h-4 w-4" style={{ color: currentTheme }} />
                      Wallpaper Filter
                    </label>
                    <button
                      onClick={() => onResetBgFilters?.()}
                      className="text-xs text-white/40 hover:text-white transition-colors font-space"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Filter Preset Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {FILTER_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => onApplyFilterPreset?.(preset.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all font-space ${
                          activeFilterPreset === preset.id
                            ? 'scale-105 border-white shadow-lg'
                            : 'border-white/10 hover:border-white/30 hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: activeFilterPreset === preset.id ? `${currentTheme}15` : 'rgba(255,255,255,0.05)',
                          boxShadow: activeFilterPreset === preset.id ? `0 0 20px ${currentTheme}30` : 'none',
                        }}
                      >
                        <span className="text-2xl">{preset.icon}</span>
                        <span className="text-xs text-white/90">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Customization */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <label className="text-sm font-medium text-white/70 block font-space">
                  Background Media
                </label>

                {/* Drag & Drop Local File Upload */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingFile(false); }}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${isDraggingFile ? '' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'}`}
                  style={isDraggingFile ? { borderColor: currentTheme, backgroundColor: `${currentTheme}15` } : {}}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                  />
                  <Upload className="mb-3 transition-colors" style={{ color: isDraggingFile ? currentTheme : 'rgba(255,255,255,0.5)' }} size={24} />
                  <p className="text-sm text-center text-white/80 font-space">
                    <span className="font-semibold transition-colors" style={{ color: currentTheme }}>Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-white/40 mt-1 font-space">SVG, PNG, JPG or MP4</p>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-space uppercase">Or use a URL</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>
                
                <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setMediaType("image")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-all font-space ${mediaType === "image" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"}`}
                  >
                    <ImageIcon size={16} /> Image
                  </button>
                  <button
                    onClick={() => setMediaType("video")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-all font-space ${mediaType === "video" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"}`}
                  >
                    <Video size={16} /> Video
                  </button>
                </div>

                <form onSubmit={handleMediaSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Link2 className="h-4 w-4 text-white/40" />
                    </div>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={`Paste ${mediaType} URL...`}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!urlInput.trim()}
                    className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-space"
                  >
                    Apply Media
                  </button>
                </form>
              </div>

              {/* Audio Controls - Only show when video is active */}
              {isCustomVideo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-4 pt-6 border-t border-white/10 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" style={{ color: currentTheme }} />
                      ) : (
                        <Volume2 className="h-4 w-4" style={{ color: currentTheme }} />
                      )}
                      <label className="text-sm font-medium text-white/70 font-space">
                        Video Audio
                      </label>
                    </div>
                  </div>

                  {/* Mute/Unmute Toggle */}
                  <button
                    onClick={() => onToggleMute?.(!isMuted)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all font-space text-sm group hover:scale-[1.02]"
                    style={
                      isMuted
                        ? { borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' }
                        : { borderColor: currentTheme, backgroundColor: `${currentTheme}20`, boxShadow: `0 0 20px ${currentTheme}30` }
                    }
                  >
                    <div className="flex items-center gap-3">
                      {isMuted ? (
                        <VolumeX size={20} className="text-white/50 group-hover:text-white transition-colors" />
                      ) : (
                        <Volume2 size={20} style={{ color: currentTheme }} className="group-hover:scale-110 transition-transform" />
                      )}
                      <span className={isMuted ? "text-white/70" : "text-white font-medium"}>
                        {isMuted ? 'Unmute Video' : 'Video Playing'}
                      </span>
                    </div>

                    <div
                      className="w-10 h-6 rounded-full p-1 transition-all duration-300"
                      style={{ backgroundColor: isMuted ? 'rgba(255,255,255,0.2)' : currentTheme }}
                    >
                      <motion.div
                        className="w-4 h-4 rounded-full bg-white"
                        animate={{ x: isMuted ? 0 : 16 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </button>

                  {/* Volume Slider - Only show when unmuted */}
                  <AnimatePresence>
                    {!isMuted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex flex-col gap-3 overflow-hidden"
                      >
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-white/70 flex items-center gap-2 font-space uppercase tracking-widest">
                            Volume Level
                          </label>
                          <span className="text-xs font-space text-white/50">{Math.round(volume * 100)}%</span>
                        </div>

                        <div className="relative">
                          {/* Custom slider with glassmorphic styling */}
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => onUpdateVolume?.(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 backdrop-blur-sm"
                            style={{
                              accentColor: currentTheme,
                              background: `linear-gradient(to right, ${currentTheme} 0%, ${currentTheme} ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
                            }}
                          />
                        </div>

                        {/* Visual feedback bar */}
                        <div className="flex items-center gap-2 mt-1">
                          <Volume2 size={12} className="text-white/40" />
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: currentTheme, boxShadow: `0 0 10px ${currentTheme}80` }}
                              animate={{ width: `${volume * 100}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                          <span className="text-[10px] text-white/40 font-space tabular-nums min-w-[32px]">
                            {Math.round(volume * 100)}%
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Search Icon Customization */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" style={{ color: currentTheme }} />
                    <label className="text-sm font-medium text-white/70 font-space">
                      Search Icon Logo
                    </label>
                  </div>
                  {searchIconUrl && (
                    <button 
                      onClick={() => onUpdateSearchIcon?.(undefined)}
                      className="text-xs text-white/40 hover:text-red-400 transition-colors font-space"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>

                <div 
                  onClick={() => searchIconInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5 hover:border-white/40 group relative overflow-hidden h-24"
                >
                  <input 
                    type="file" 
                    ref={searchIconInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleSearchIconInput}
                  />
                  {searchIconUrl ? (
                    <>
                      <img src={searchIconUrl} alt="Search Icon" className="w-10 h-10 object-cover rounded-md mb-2" />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={16} className="text-white mb-1" />
                        <span className="text-[10px] text-white font-space">Change</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-2 text-white/40 group-hover:text-white transition-colors" size={20} />
                      <p className="text-xs text-center text-white/60 font-space">
                        Click to upload search icon
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Customization */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white flex items-center gap-2 font-space" style={{ color: currentTheme }}>
                  <ImageIcon size={16} /> Tab Settings
                </label>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="text-xs text-white/50 font-space mb-2 block uppercase tracking-wider">Tab Title</label>
                    <input
                      type="text"
                      value={tabTitle}
                      onChange={(e) => onUpdateTabTitle?.(e.target.value)}
                      placeholder="e.g. New Teb"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                      style={{ borderBottomColor: currentTheme }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 font-space mb-2 block uppercase tracking-wider">Tab Icon</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/50 shrink-0">
                        {tabIcon ? (
                          <img src={tabIcon} alt="Tab Icon" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={16} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          disabled={isRemovingBg}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (removeBgEnabled) {
                                setIsRemovingBg(true);
                                try {
                                  const config = {
                                    publicPath: typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
                                      ? chrome.runtime.getURL('/imgly/data/')
                                      : '/imgly/data/'
                                  };
                                  const blob = await removeBackground(file, config);
                                  const url = URL.createObjectURL(blob);
                                  setCroppingImage({ url, type: 'tab' });
                                } catch (error) {
                                  console.error("Background removal failed:", error);
                                  const url = URL.createObjectURL(file);
                                  setCroppingImage({ url, type: 'tab' });
                                } finally {
                                  setIsRemovingBg(false);
                                }
                              } else {
                                const url = URL.createObjectURL(file);
                                setCroppingImage({ url, type: 'tab' });
                              }
                            }
                            e.target.value = '';
                          }}
                        />
                        <button 
                          disabled={isRemovingBg}
                          className={`w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 font-space ${isRemovingBg ? 'text-white/50 cursor-wait' : 'text-white'}`}
                        >
                          {isRemovingBg ? (
                            <><Loader2 size={14} className="animate-spin" /> Processing...</>
                          ) : (
                            <><Upload size={14} /> Upload Icon</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-space">Auto-Remove Background</span>
                      <span className="text-xs text-white/50 font-space mt-1">Automatically isolates subjects from solid backgrounds using local AI</span>
                    </div>
                    <button
                      onClick={() => setRemoveBgEnabled(!removeBgEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${removeBgEnabled ? 'bg-white' : 'bg-white/20'}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-black transition-transform ${removeBgEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bookmarks Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="h-4 w-4" style={{ color: currentTheme }} />
                  <label className="text-sm font-medium text-white/70 font-space">
                    Sidebar Bookmarks
                  </label>
                </div>
                
                {/* List Existing Bookmarks */}
                {bookmarks.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {bookmarks.map((bookmark) => {
                      // Try to get hostname for fallback logo
                      let domain = bookmark.url;
                      let domainName = "link";
                      try {
                        const urlObj = new URL(bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`);
                        domain = urlObj.hostname.replace('www.', '');
                        domainName = domain.split('.')[0];
                      } catch (e) {
                        // Ignore
                      }
                      
                      const iconifyUrl = `https://api.iconify.design/simple-icons:${domainName}.svg?color=white`;
                      const clearbitUrl = `https://logo.clearbit.com/${domain}`;
                      const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                      const previewUrl = bookmark.iconUrl || iconifyUrl;

                      return (
                        <div key={bookmark.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 group">
                          <div className="flex items-center gap-3 flex-grow truncate mr-3">
                            <div className="w-8 h-8 rounded bg-black/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              <img 
                                src={previewUrl} 
                                alt={bookmark.name} 
                                className="w-full h-full object-contain p-1" 
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  if (!bookmark.iconUrl) {
                                    if (img.src.includes('iconify')) {
                                      img.src = clearbitUrl;
                                      img.className = "w-full h-full object-cover";
                                    } else if (img.src.includes('clearbit')) {
                                      img.src = googleFaviconUrl;
                                      img.className = "w-full h-full object-contain p-1";
                                    } else {
                                      img.style.display = 'none';
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="flex flex-col flex-grow truncate">
                              <span className="text-sm text-white font-medium font-space truncate">{bookmark.name || bookmark.url}</span>
                              <span className="text-xs text-white/50 font-space truncate">{bookmark.url}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveBookmark(bookmark.id)}
                            className="text-white/30 hover:text-red-400 transition-colors"
                            title="Remove bookmark"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add New Bookmark */}
                <form onSubmit={handleAddBookmark} className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div 
                      onClick={() => bookmarkIconInputRef.current?.click()}
                      className="w-12 h-12 flex-shrink-0 border border-white/20 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden group relative"
                    >
                      <input 
                        type="file" 
                        ref={bookmarkIconInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleBookmarkIconInput}
                      />
                      {bookmarkIconUrl ? (
                        <>
                          <img src={bookmarkIconUrl} alt="Icon" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={14} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <Upload size={16} className="text-white/40 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                      <input
                        type="text"
                        value={bookmarkNameInput}
                        onChange={(e) => setBookmarkNameInput(e.target.value)}
                        placeholder="Name (e.g. YouTube)"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space"
                      />
                      <input
                        type="text"
                        value={bookmarkUrlInput}
                        onChange={(e) => setBookmarkUrlInput(e.target.value)}
                        placeholder="URL (e.g. youtube.com)"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!bookmarkUrlInput.trim() || !bookmarkNameInput.trim()}
                    className="rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed font-space w-full"
                  >
                    Add Bookmark
                  </button>
                </form>
              </div>

              {/* Custom Search Commands Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-5 w-5" style={{ color: currentTheme }} />
                  <label className="text-base font-semibold text-white font-space">
                    Custom Search Commands
                  </label>
                </div>
                
                <p className="text-sm text-white/50 leading-relaxed font-space mb-4">
                  Add quick commands for your Spotlight Search.
                  <br/>
                  Type <code className="px-1.5 py-0.5 bg-white/10 rounded">/yt query</code> to search YouTube, <code className="px-1.5 py-0.5 bg-white/10 rounded">/g query</code> for Google, etc.
                </p>

                {/* List Existing Commands */}
                {searchCommands.length > 0 && (
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto no-scrollbar pr-1">
                    {searchCommands.map((cmd) => (
                      <div key={cmd.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg group hover:bg-white/10 transition-colors">
                        {cmd.iconUrl ? (
                          <img src={cmd.iconUrl} alt={cmd.name} className="w-5 h-5 rounded object-cover" />
                        ) : (
                          <Terminal size={16} className="text-white/50" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-space text-white truncate font-medium">
                            <span className="text-white/50">/</span>{cmd.trigger} - {cmd.name}
                          </p>
                          <p className="text-xs text-white/30 truncate mt-0.5">{cmd.url}</p>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveCommand(cmd.id)}
                          className="text-white/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Command */}
                <form onSubmit={handleAddCommand} className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 flex-shrink-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setCroppingImage({ url, type: 'command' });
                          }
                          e.target.value = '';
                        }}
                      />
                      {newCommandIcon ? (
                        <img src={newCommandIcon} alt="Icon" className="w-full h-full object-cover" />
                      ) : (
                        <Terminal size={18} className="text-white/40" />
                      )}
                    </div>
                    <input
                      value={newCommandTrigger}
                      onChange={(e) => setNewCommandTrigger(e.target.value)}
                      placeholder="Trigger (e.g., yt)"
                      maxLength={20}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space"
                    />
                  </div>

                  <input
                    value={newCommandName}
                    onChange={(e) => setNewCommandName(e.target.value)}
                    placeholder="Name (e.g., YouTube Search)"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space"
                  />

                  <input
                    value={newCommandUrl}
                    onChange={(e) => setNewCommandUrl(e.target.value)}
                    placeholder="URL with {query} placeholder"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-white/10 font-space"
                  />
                  
                  <p className="text-xs text-white/50 leading-relaxed font-space">
                    <span className="text-white/70">Optional:</span> Use <code className="text-white/70">{'{query}'}</code> where search term goes. Example:
                    <br/>
                    <span className="opacity-75">https://youtube.com/results?search_query={'{query}'}</span>
                  </p>

                  <button
                    type="submit"
                    disabled={!newCommandTrigger.trim() || !newCommandName.trim() || !newCommandUrl.trim()}
                    className="mt-2 rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-white/80 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed font-space tracking-wider uppercase"
                  >
                    Add Command
                  </button>
                </form>
              </div>

              {/* Reset Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <p className="text-sm text-white/50 leading-relaxed font-space">
                  Warning: This will wipe all custom widgets, shortcuts, and themes back to factory defaults.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] font-space tracking-wide text-center"
                >
                  Reset All Settings
                </button>
              </div>
            </div>
            
            <div className="mt-auto pt-6 text-xs text-white/30 text-center font-space">
              Made with precision.
            </div>

            {/* GitHub Support Section */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
              <a
                href="https://github.com/Ar1220/customize-homepage-extension"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-2 w-full h-12 border border-white/10 bg-neutral-900/60 text-gray-50 text-xs font-bold uppercase tracking-widest rounded-lg overflow-hidden transition-all duration-500 hover:border-red-500/50 hover:text-red-200 before:absolute before:w-12 before:h-12 before:content-[''] before:right-1 before:top-1 before:z-0 before:bg-red-800 before:rounded-full before:blur-lg before:duration-500 after:absolute after:z-0 after:w-20 after:h-20 after:content-[''] after:bg-red-500 after:right-8 after:top-3 after:rounded-full after:blur-lg after:duration-500 hover:before:right-12 hover:before:-bottom-8 hover:after:-right-8 hover:before:[box-shadow:_20px_20px_20px_30px_#7f1d1d] group-hover:before:duration-500 group-hover:after:duration-500 transition-all duration-500"
              >
                {/* GitHub SVG Icon */}
                <svg 
                  height="14" 
                  width="14" 
                  viewBox="0 0 16 16" 
                  fill="currentColor" 
                  className="relative z-10 text-white group-hover:text-red-300 transition-colors duration-300"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                
                {/* Label */}
                <span className="relative z-10 text-white group-hover:text-red-200 transition-colors duration-300">
                  Support on GitHub
                </span>
              </a>
            </div>
          </motion.div>
          
          <ImageCropperModal
            isOpen={!!croppingImage}
            imageSrc={croppingImage?.url || null}
            onClose={() => setCroppingImage(null)}
            onCropComplete={(base64) => {
              if (croppingImage?.type === 'command') {
                setNewCommandIcon(base64);
              } else if (croppingImage?.type === 'tab' && onUpdateTabIcon) {
                onUpdateTabIcon(base64);
              }
            }}
            themeColor={currentTheme}
          />
        </>
      )}
    </AnimatePresence>
  );
}