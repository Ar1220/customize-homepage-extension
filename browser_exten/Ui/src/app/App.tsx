import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { Clock } from "./components/Clock";
import { Sidebar } from "./components/Sidebar";
import { SettingsPanel } from "./components/SettingsPanel";
import { WidgetsPanel } from "./components/WidgetsPanel";
import { SpotlightSearch } from "./components/SpotlightSearch";
import { SearchWidget } from "./components/SearchWidget";
import { EtherealClock } from "./components/EtherealClock";
import { GlassCalendar } from "./components/GlassCalendar";
import { Settings } from "lucide-react";
import "../styles/fonts.css";
import { storageBridge } from "./utils/storage";

const DEFAULT_MEDIA = "/mylivewallpapers.com-Samurai-VS-Dragon-4K_1_.mp4";
const DEFAULT_IS_VIDEO = true;
const DEFAULT_TEXT_1 = "Tech.Links.";
const DEFAULT_TEXT_2 = "It's time for bed.I wish you nice dreams.";
const DEFAULT_THEME = "#c58bf2";

export interface Bookmark {
  id: string;
  url: string;
  name: string;
  iconUrl?: string;
}

export interface SearchCommand {
  id: string;
  trigger: string;
  name: string;
  url: string;
  iconUrl?: string;
}

const DEFAULT_SEARCH_COMMANDS: SearchCommand[] = [
  { id: "1", trigger: "yt", name: "YouTube Search", url: "https://youtube.com/results?search_query={query}" },
  { id: "2", trigger: "g", name: "Google Search", url: "https://google.com/search?q={query}" },
  { id: "3", trigger: "gh", name: "GitHub Search", url: "https://github.com/search?q={query}" },
  { id: "4", trigger: "reddit", name: "Reddit Search", url: "https://reddit.com/search?q={query}" }
];

export interface BackgroundFilters {
  brightness: number;
  contrast: number;
  blur: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  opacity: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  icon: string;
  filters: BackgroundFilters;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'original',
    name: 'Original',
    icon: '✨',
    filters: {
      brightness: 100,
      contrast: 100,
      blur: 0,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      opacity: 100,
    }
  },
  {
    id: 'vivid',
    name: 'Vivid',
    icon: '🌈',
    filters: {
      brightness: 110,
      contrast: 120,
      blur: 0,
      saturation: 140,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      opacity: 100,
    }
  },
  {
    id: 'warm',
    name: 'Warm',
    icon: '🌅',
    filters: {
      brightness: 105,
      contrast: 105,
      blur: 0,
      saturation: 110,
      grayscale: 0,
      sepia: 25,
      hueRotate: 10,
      opacity: 100,
    }
  },
  {
    id: 'cool',
    name: 'Cool',
    icon: '❄️',
    filters: {
      brightness: 100,
      contrast: 110,
      blur: 0,
      saturation: 120,
      grayscale: 0,
      sepia: 0,
      hueRotate: 200,
      opacity: 100,
    }
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    icon: '🎭',
    filters: {
      brightness: 80,
      contrast: 150,
      blur: 0,
      saturation: 130,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      opacity: 100,
    }
  },
  {
    id: 'soft',
    name: 'Soft',
    icon: '☁️',
    filters: {
      brightness: 110,
      contrast: 85,
      blur: 2,
      saturation: 90,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      opacity: 95,
    }
  },
  {
    id: 'noir',
    name: 'Noir',
    icon: '🎬',
    filters: {
      brightness: 90,
      contrast: 140,
      blur: 0,
      saturation: 0,
      grayscale: 100,
      sepia: 0,
      hueRotate: 0,
      opacity: 100,
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: '📷',
    filters: {
      brightness: 95,
      contrast: 110,
      blur: 1,
      saturation: 80,
      grayscale: 20,
      sepia: 50,
      hueRotate: 15,
      opacity: 100,
    }
  },
];

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: "1", name: "GitHub", url: "github.com" },
  { id: "2", name: "YouTube", url: "youtube.com" },
  { id: "3", name: "LinkedIn", url: "linkedin.com" },
  { id: "4", name: "Hack The Box", url: "hackthebox.com" }
];

export default function App() {
  const [bgMedia, setBgMedia] = useState(DEFAULT_MEDIA);
  const [isVideo, setIsVideo] = useState(DEFAULT_IS_VIDEO);
  
  const [customText1, setCustomText1] = useState(DEFAULT_TEXT_1);
  const [customText2, setCustomText2] = useState(DEFAULT_TEXT_2);
  const [themeColor, setThemeColor] = useState(DEFAULT_THEME);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS);
  const [searchCommands, setSearchCommands] = useState<SearchCommand[]>(DEFAULT_SEARCH_COMMANDS);
  const [searchIconUrl, setSearchIconUrl] = useState<string | undefined>();
  
  const [tabTitle, setTabTitle] = useState("New Teb");
  const [tabIcon, setTabIcon] = useState("/tab_logo.png");
  
  const [isDragMode, setIsDragMode] = useState(false);
  const widgetX = useMotionValue(0);
  const widgetY = useMotionValue(0);
  const [showSearchWidget, setShowSearchWidget] = useState(false);
  const searchWidgetX = useMotionValue(0);
  const searchWidgetY = useMotionValue(0);
  const [searchWidgetScale, setSearchWidgetScale] = useState(1);

  const [showEtherealClock, setShowEtherealClock] = useState(false);
  const etherealClockX = useMotionValue(0);
  const etherealClockY = useMotionValue(0);
  const [etherealClockScale, setEtherealClockScale] = useState(1);
  const [etherealClockColor, setEtherealClockColor] = useState(DEFAULT_THEME);
  const [etherealClockTransparent, setEtherealClockTransparent] = useState(false);

  const [showGlassCalendar, setShowGlassCalendar] = useState(false);
  const glassCalendarX = useMotionValue(0);
  const glassCalendarY = useMotionValue(0);
  const [glassCalendarScale, setGlassCalendarScale] = useState(1);
  const [glassCalendarColor, setGlassCalendarColor] = useState(DEFAULT_THEME);
  const [glassCalendarTransparent, setGlassCalendarTransparent] = useState(false);
  const [glassCalendarBlur, setGlassCalendarBlur] = useState(24);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [showClock, setShowClock] = useState(true);
  const [clockColor, setClockColor] = useState(DEFAULT_THEME);
  const [clockTextColor, setClockTextColor] = useState("#ffffff");
  const [clockScale, setClockScale] = useState(1);

  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);

  const [bgFilters, setBgFilters] = useState<BackgroundFilters>({
    brightness: 100,
    contrast: 100,
    blur: 0,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    opacity: 100,
  });
  const [activeFilterPreset, setActiveFilterPreset] = useState<string>('original');

  const constraintsRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const positionSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSavePosition = (key: string, position: { x: number; y: number }) => {
    if (positionSaveTimerRef.current) {
      clearTimeout(positionSaveTimerRef.current);
    }
    positionSaveTimerRef.current = setTimeout(() => {
      storageBridge.set(key, JSON.stringify(position));
    }, 500); 
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (!showSearchWidget && e.key === ' ' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, showSearchWidget]);

  useEffect(() => {
  const loadSettings = async () => {
      
      const [
        savedMedia, savedIsVideo, savedMuted, savedVolume, savedBgFilters, savedActivePreset,
        savedT1, savedT2, savedPos, savedTheme, savedBookmarks, savedSearchIcon,
        savedShowClock, savedClockColor, savedClockTextColor, savedClockScale,
        savedShowSearchWidget, savedSearchWidgetPos, savedSearchWidgetScale,
        savedShowEtherealClock, savedEtherealClockPos, savedEtherealClockScale,
        savedEtherealClockColor, savedEtherealClockTrans, savedShowGlassCalendar,
        savedGlassCalendarPos, savedGlassCalendarScale, savedGlassCalendarColor,
        savedGlassCalendarTrans, savedGlassCalendarBlur, savedSearchCommands,
        savedTabTitle, savedTabIcon
      ] = await Promise.all([
        storageBridge.get("homepage_media", null),
        storageBridge.get("homepage_is_video", null),
        storageBridge.get("homepage_video_muted", null),
        storageBridge.get("homepage_video_volume", null),
        storageBridge.get("homepage_bg_filters", null),
        storageBridge.get("homepage_active_filter_preset", null),
        storageBridge.get("homepage_t1", null),
        storageBridge.get("homepage_t2", null),
        storageBridge.get("homepage_widget_pos", null),
        storageBridge.get("homepage_theme", null),
        storageBridge.get("homepage_bookmarks", null),
        storageBridge.get("homepage_search_icon", null),
        storageBridge.get("homepage_show_clock", null),
        storageBridge.get("homepage_clock_color", null),
        storageBridge.get("homepage_clock_text_color", null),
        storageBridge.get("homepage_clock_scale", null),
        storageBridge.get("homepage_show_search_widget", null),
        storageBridge.get("homepage_search_widget_pos", null),
        storageBridge.get("homepage_search_widget_scale", null),
        storageBridge.get("homepage_show_ethereal_clock", null),
        storageBridge.get("homepage_ethereal_clock_pos", null),
        storageBridge.get("homepage_ethereal_clock_scale", null),
        storageBridge.get("homepage_ethereal_clock_color", null),
        storageBridge.get("homepage_ethereal_clock_trans", null),
        storageBridge.get("homepage_show_glass_calendar", null),
        storageBridge.get("homepage_glass_calendar_pos", null),
        storageBridge.get("homepage_glass_calendar_scale", null),
        storageBridge.get("homepage_glass_calendar_color", null),
        storageBridge.get("homepage_glass_calendar_trans", null),
        storageBridge.get("homepage_glass_calendar_blur", null),
        storageBridge.get("homepage_search_commands", null),
        storageBridge.get("homepage_tab_title", null),
        storageBridge.get("homepage_tab_icon", null)
      ]);
  
      if (savedMedia) setBgMedia(savedMedia);
      if (savedIsVideo) setIsVideo(savedIsVideo === "true");
      if (savedMuted !== null) setIsMuted(savedMuted === "true");
      if (savedVolume !== null) setVolume(parseFloat(savedVolume));
      if (savedBgFilters) {
        try {
          setBgFilters(JSON.parse(savedBgFilters));
        } catch (e) {
          console.error('Failed to parse background filters:', e);
        }
      }
      if (savedActivePreset) {
        setActiveFilterPreset(savedActivePreset);
      }
      if (savedT1) setCustomText1(savedT1);
      if (savedT2) setCustomText2(savedT2);
      if (savedTheme) setThemeColor(savedTheme);
      if (savedSearchIcon) setSearchIconUrl(savedSearchIcon);
      if (savedTabTitle) setTabTitle(savedTabTitle);
      if (savedTabIcon) setTabIcon(savedTabIcon);
      if (savedShowClock) setShowClock(savedShowClock === "true");
      if (savedClockColor) setClockColor(savedClockColor);
      if (savedClockTextColor) setClockTextColor(savedClockTextColor);
      if (savedClockScale) setClockScale(parseFloat(savedClockScale));
      if (savedShowSearchWidget) setShowSearchWidget(savedShowSearchWidget === "true");
      if (savedSearchWidgetScale) setSearchWidgetScale(parseFloat(savedSearchWidgetScale));
  
      if (savedShowEtherealClock) setShowEtherealClock(savedShowEtherealClock === "true");
      if (savedEtherealClockScale) setEtherealClockScale(parseFloat(savedEtherealClockScale));
      if (savedEtherealClockColor) setEtherealClockColor(savedEtherealClockColor);
      if (savedEtherealClockTrans) setEtherealClockTransparent(savedEtherealClockTrans === "true");
  
      if (savedShowGlassCalendar) setShowGlassCalendar(savedShowGlassCalendar === "true");
      if (savedGlassCalendarScale) setGlassCalendarScale(parseFloat(savedGlassCalendarScale));
      if (savedGlassCalendarColor) setGlassCalendarColor(savedGlassCalendarColor);
      if (savedGlassCalendarTrans) setGlassCalendarTransparent(savedGlassCalendarTrans === "true");
      if (savedGlassCalendarBlur) setGlassCalendarBlur(parseFloat(savedGlassCalendarBlur));
  
      if (savedBookmarks) {
        try {
          setBookmarks(JSON.parse(savedBookmarks));
        } catch (e) {
          console.error("Failed to parse saved bookmarks", e);
        }
      }
      if (savedSearchCommands) {
        try {
          setSearchCommands(JSON.parse(savedSearchCommands));
        } catch (e) {}
      }
      if (savedPos) {
        try {
          const parsed = JSON.parse(savedPos);
          widgetX.set(parsed.x);
          widgetY.set(parsed.y);
        } catch (e) {
          console.error("Failed to parse saved position", e);
        }
      }
      if (savedSearchWidgetPos) {
        try {
          const parsed = JSON.parse(savedSearchWidgetPos);
          searchWidgetX.set(parsed.x);
          searchWidgetY.set(parsed.y);
        } catch (e) {
          console.error("Failed to parse saved search position", e);
        }
      }
      if (savedEtherealClockPos) {
        try {
          const parsed = JSON.parse(savedEtherealClockPos);
          etherealClockX.set(parsed.x);
          etherealClockY.set(parsed.y);
        } catch (e) {}
      }
      if (savedGlassCalendarPos) {
        try {
          const parsed = JSON.parse(savedGlassCalendarPos);
          glassCalendarX.set(parsed.x);
          glassCalendarY.set(parsed.y);
        } catch (e) {}
      }
      setIsMounted(true);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (videoRef.current && !isMuted) {
      videoRef.current.volume = volume;
    }
  }, [volume, isMuted]);

  const handleToggleSearchWidget = (val: boolean) => {
    setShowSearchWidget(val);
    storageBridge.set("homepage_show_search_widget", String(val));
  };

  const handleUpdateMedia = (url: string, isCustomVideo: boolean) => {
    setBgMedia(url);
    setIsVideo(isCustomVideo);
    storageBridge.set("homepage_media", url);
    storageBridge.set("homepage_is_video", String(isCustomVideo));
  };

  const handleUpdateTexts = (t1: string, t2: string) => {
    setCustomText1(t1);
    setCustomText2(t2);
    storageBridge.set("homepage_t1", t1);
    storageBridge.set("homepage_t2", t2);
  };

  const handleUpdateTheme = (theme: string) => {
    setThemeColor(theme);
    storageBridge.set("homepage_theme", theme);
  };

  const handleUpdateSearchIcon = (url: string | undefined) => {
    setSearchIconUrl(url);
    if (url) {
      storageBridge.set("homepage_search_icon", url);
    } else {
      try {
        storageBridge.set("homepage_search_icon");
      } catch (error) {
        console.warn("Failed to remove search icon from localStorage:", error);
      }
    }
  };

  const handleUpdateBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    storageBridge.set("homepage_bookmarks", JSON.stringify(newBookmarks));
  };

  const handleUpdateSearchCommands = (newCommands: SearchCommand[]) => {
    setSearchCommands(newCommands);
    storageBridge.set("homepage_search_commands", JSON.stringify(newCommands));
  };

  const handleToggleClock = (val: boolean) => {
    setShowClock(val);
    storageBridge.set("homepage_show_clock", String(val));
  };

  const handleUpdateClockColor = (color: string) => {
    setClockColor(color);
    storageBridge.set("homepage_clock_color", color);
  };

  const handleUpdateClockTextColor = (color: string) => {
    setClockTextColor(color);
    storageBridge.set("homepage_clock_text_color", color);
  };

  const handleUpdateClockScale = (scale: number) => {
    setClockScale(scale);
    storageBridge.set("homepage_clock_scale", scale.toString());
  };

  const handleUpdateSearchWidgetScale = (scale: number) => {
    setSearchWidgetScale(scale);
    storageBridge.set("homepage_search_widget_scale", scale.toString());
  };

  const handleToggleEtherealClock = (val: boolean) => {
    setShowEtherealClock(val);
    storageBridge.set("homepage_show_ethereal_clock", String(val));
  };

  const handleUpdateEtherealClockScale = (scale: number) => {
    setEtherealClockScale(scale);
    storageBridge.set("homepage_ethereal_clock_scale", scale.toString());
  };

  const handleUpdateEtherealClockColor = (color: string) => {
    setEtherealClockColor(color);
    storageBridge.set("homepage_ethereal_clock_color", color);
  };

  const handleToggleEtherealClockTransparent = (val: boolean) => {
    setEtherealClockTransparent(val);
    storageBridge.set("homepage_ethereal_clock_trans", String(val));
  };

  const handleToggleGlassCalendar = (val: boolean) => {
    setShowGlassCalendar(val);
    storageBridge.set("homepage_show_glass_calendar", String(val));
  };

  const handleUpdateGlassCalendarScale = (scale: number) => {
    setGlassCalendarScale(scale);
    storageBridge.set("homepage_glass_calendar_scale", scale.toString());
  };

  const handleUpdateGlassCalendarColor = (color: string) => {
    setGlassCalendarColor(color);
    storageBridge.set("homepage_glass_calendar_color", color);
  };

  const handleToggleGlassCalendarTransparent = (val: boolean) => {
    setGlassCalendarTransparent(val);
    storageBridge.set("homepage_glass_calendar_trans", String(val));
  };

  const handleUpdateGlassCalendarBlur = (blur: number) => {
    setGlassCalendarBlur(blur);
    storageBridge.set("homepage_glass_calendar_blur", blur.toString());
  };

  const handleToggleMute = (val: boolean) => {
    setIsMuted(val);
    storageBridge.set("homepage_video_muted", String(val));
  };

  const handleUpdateVolume = (vol: number) => {
    setVolume(vol);
    storageBridge.set("homepage_video_volume", vol.toString());

    if (vol > 0 && isMuted) {
      setIsMuted(false);
      storageBridge.set("homepage_video_muted", "false");
    }
  };

  const handleUpdateBgFilters = (filters: Partial<BackgroundFilters>) => {
    const newFilters = { ...bgFilters, ...filters };
    setBgFilters(newFilters);
    setActiveFilterPreset('custom');
    storageBridge.set("homepage_bg_filters", JSON.stringify(newFilters));
    storageBridge.set("homepage_active_filter_preset", 'custom');
  };

  const handleApplyFilterPreset = (presetId: string) => {
    const preset = FILTER_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setBgFilters(preset.filters);
      setActiveFilterPreset(presetId);
      storageBridge.set("homepage_bg_filters", JSON.stringify(preset.filters));
      storageBridge.set("homepage_active_filter_preset", presetId);
    }
  };

  const handleResetBgFilters = () => {
    handleApplyFilterPreset('original');
  };

  useEffect(() => {
    document.title = tabTitle;
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = tabIcon;
  }, [tabTitle, tabIcon]);

  if (!isMounted) return null;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '197, 139, 242';
  };
  const rgb = hexToRgb(themeColor);

  const buildFilterString = (filters: BackgroundFilters): string => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) blur(${filters.blur}px) saturate(${filters.saturation}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg)`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-space selection:bg-[#b682e8]/30">
      <AnimatePresence mode="wait">
        {isVideo ? (
          <motion.video
            ref={videoRef}
            key={`video-${bgMedia}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 z-0 h-full w-full object-cover"
            src={bgMedia}
            style={{
              filter: buildFilterString(bgFilters),
              opacity: bgFilters.opacity / 100,
            }}
          />
        ) : (
          <motion.div
            key={`image-${bgMedia}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bgMedia})`,
              filter: buildFilterString(bgFilters),
              opacity: bgFilters.opacity / 100,
            }}
          />
        )}
      </AnimatePresence>

      <main ref={constraintsRef} className="relative z-10 h-screen w-full overflow-hidden pointer-events-none">
        
        <motion.div
          drag={isDragMode}
          dragElastic={0}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
          animate={{ scale: clockScale }}
          onDragEnd={() => {
            debouncedSavePosition("homepage_widget_pos", { x: widgetX.get(), y: widgetY.get() });
          }}
          className={`absolute bottom-12 right-12 sm:bottom-24 sm:right-32 flex items-center transition-[background-color,box-shadow,padding,border-radius,backdrop-filter] duration-300 pointer-events-auto origin-bottom-right ${
            isDragMode
              ? "cursor-move ring-2 ring-white/50 ring-dashed bg-black/40 backdrop-blur-xl p-8 rounded-3xl z-50 shadow-2xl"
              : "p-0"
          }`}
          style={{ x: widgetX, y: widgetY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
        >
          {showClock && (
            <Clock customText1={customText1} customText2={customText2} themeColor={clockColor} textColor={clockTextColor} />
          )}
        </motion.div>

        {showSearchWidget && (
          <motion.div
            drag={isDragMode}
            dragElastic={0}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            animate={{ scale: searchWidgetScale }}
            onDragEnd={() => {
              debouncedSavePosition("homepage_search_widget_pos", { x: searchWidgetX.get(), y: searchWidgetY.get() });
            }}
            className={`absolute top-[15vh] left-0 right-0 mx-auto w-full max-w-2xl flex justify-center transition-[background-color,box-shadow,padding,border-radius,backdrop-filter] duration-300 pointer-events-auto px-4 ${
              isDragMode
                ? "cursor-move ring-2 ring-white/50 ring-dashed bg-black/40 backdrop-blur-xl py-4 rounded-3xl z-50 shadow-2xl"
                : "py-0 z-40"
            }`}
            style={{ x: searchWidgetX, y: searchWidgetY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
          >
            <SearchWidget 
            themeColor={themeColor} 
            isDragMode={isDragMode}
            searchCommands={searchCommands}
          /></motion.div>
        )}

        {showEtherealClock && (
          <motion.div
            drag={isDragMode}
            dragElastic={0}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            animate={{ scale: etherealClockScale }}
            onDragEnd={() => {
              debouncedSavePosition("homepage_ethereal_clock_pos", { x: etherealClockX.get(), y: etherealClockY.get() });
            }}
            className={`absolute top-[25vh] left-[10vw] flex justify-center items-center transition-[background-color,box-shadow,padding,border-radius,backdrop-filter] duration-300 pointer-events-auto origin-top-left ${
              isDragMode
                ? "cursor-move ring-2 ring-white/50 ring-dashed bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] z-50 shadow-2xl"
                : "p-0 z-30"
            }`}
            style={{ x: etherealClockX, y: etherealClockY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
          >
            <EtherealClock color={etherealClockColor} transparentBg={etherealClockTransparent} />
          </motion.div>
        )}

        {showGlassCalendar && (
          <motion.div
            drag={isDragMode}
            dragElastic={0}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            animate={{ scale: glassCalendarScale }}
            onDragEnd={() => {
              debouncedSavePosition("homepage_glass_calendar_pos", { x: glassCalendarX.get(), y: glassCalendarY.get() });
            }}
            className={`absolute top-[10vh] right-[10vw] flex justify-center items-center transition-[background-color,box-shadow,padding,border-radius,backdrop-filter] duration-300 origin-top-right ${
              isDragMode
                ? "cursor-move ring-2 ring-white/50 ring-dashed bg-black/40 backdrop-blur-xl p-8 rounded-[3.5rem] z-50 shadow-2xl pointer-events-auto"
                : "p-0 z-30 pointer-events-auto"
            }`}
            style={{ x: glassCalendarX, y: glassCalendarY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
          >
            <GlassCalendar color={glassCalendarColor} transparentBg={glassCalendarTransparent} blur={glassCalendarBlur} />
          </motion.div>
        )}

      </main>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <Sidebar 
          themeColor={themeColor} 
          onSearchClick={() => setIsSearchOpen(true)}
          onWidgetsClick={() => setIsWidgetsOpen(true)}
          bookmarks={bookmarks} 
          searchIconUrl={searchIconUrl}
        />
      </div>

      <button
        onClick={() => setIsSettingsOpen(true)}
        className={`absolute bottom-6 right-6 z-20 rounded-full p-3 transition-all hover:bg-white/10 hover:text-white ${isDragMode ? 'animate-pulse' : 'text-white/30'}`}
        style={isDragMode ? { color: themeColor, backgroundColor: `rgba(${rgb}, 0.2)` } : {}}
        aria-label="Personalize Homepage"
      >
        <Settings size={20} />
      </button>

      <WidgetsPanel
        isOpen={isWidgetsOpen}
        onClose={() => setIsWidgetsOpen(false)}
        showClock={showClock}
        onToggleClock={handleToggleClock}
        clockColor={clockColor}
        onUpdateClockColor={handleUpdateClockColor}
        clockTextColor={clockTextColor}
        onUpdateClockTextColor={handleUpdateClockTextColor}
        clockScale={clockScale}
        onUpdateClockScale={handleUpdateClockScale}
        isDragMode={isDragMode}
        onToggleDragMode={setIsDragMode}
        currentTheme={themeColor}
        customText1={customText1}
        customText2={customText2}
        onUpdateTexts={handleUpdateTexts}
        showSearchWidget={showSearchWidget}
        onToggleSearchWidget={handleToggleSearchWidget}
        searchWidgetScale={searchWidgetScale}
        onUpdateSearchWidgetScale={handleUpdateSearchWidgetScale}
        showEtherealClock={showEtherealClock}
        onToggleEtherealClock={handleToggleEtherealClock}
        etherealClockScale={etherealClockScale}
        onUpdateEtherealClockScale={handleUpdateEtherealClockScale}
        etherealClockColor={etherealClockColor}
        onUpdateEtherealClockColor={handleUpdateEtherealClockColor}
        etherealClockTransparent={etherealClockTransparent}
        onToggleEtherealClockTransparent={handleToggleEtherealClockTransparent}
        showGlassCalendar={showGlassCalendar}
        onToggleGlassCalendar={handleToggleGlassCalendar}
        glassCalendarScale={glassCalendarScale}
        onUpdateGlassCalendarScale={handleUpdateGlassCalendarScale}
        glassCalendarColor={glassCalendarColor}
        onUpdateGlassCalendarColor={handleUpdateGlassCalendarColor}
        glassCalendarTransparent={glassCalendarTransparent}
        onToggleGlassCalendarTransparent={handleToggleGlassCalendarTransparent}
        glassCalendarBlur={glassCalendarBlur}
        onUpdateGlassCalendarBlur={handleUpdateGlassCalendarBlur}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentMedia={bgMedia}
        isCustomVideo={isVideo}
        onUpdateMedia={handleUpdateMedia}
        isDragMode={isDragMode}
        onToggleDragMode={setIsDragMode}
        currentTheme={themeColor}
        onUpdateTheme={handleUpdateTheme}
        bookmarks={bookmarks}
        onUpdateBookmarks={handleUpdateBookmarks}
        searchIconUrl={searchIconUrl}
        onUpdateSearchIcon={handleUpdateSearchIcon}
        searchCommands={searchCommands}
        onUpdateSearchCommands={handleUpdateSearchCommands}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        volume={volume}
        onUpdateVolume={handleUpdateVolume}
        bgFilters={bgFilters}
        onUpdateBgFilters={handleUpdateBgFilters}
        onResetBgFilters={handleResetBgFilters}
        activeFilterPreset={activeFilterPreset}
        onApplyFilterPreset={handleApplyFilterPreset}
        tabTitle={tabTitle}
        onUpdateTabTitle={(title) => {
          setTabTitle(title);
          storageBridge.set("homepage_tab_title", title);
        }}
        tabIcon={tabIcon}
        onUpdateTabIcon={(iconUrl) => {
          setTabIcon(iconUrl);
          storageBridge.set("homepage_tab_icon", iconUrl);
        }}
      />
      <SpotlightSearch
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        themeColor={themeColor} 
        searchCommands={searchCommands}
      />
    </div>
  );
}