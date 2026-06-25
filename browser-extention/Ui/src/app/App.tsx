import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { Clock } from "./components/Clock";
import { Sidebar } from "./components/Sidebar";
import { SettingsPanel } from "./components/SettingsPanel";
import { WidgetsPanel } from "./components/WidgetsPanel";
import { SpotlightSearch } from "./components/SpotlightSearch";
import { SearchWidget } from "./components/SearchWidget";
import { EtherealClock } from "./components/EtherealClock";
import { GlassCalendar } from "./components/GlassCalendar";
import { ChecklistWidget } from "./components/ChecklistWidget";
import { ImageCropperModal } from "./components/ImageCropperModal";
import { Settings } from "lucide-react";
import "../styles/fonts.css";
import { safeSetItem } from "./utils/storage";

export type CropTarget = 'wallpaper' | 'command' | 'bookmark' | 'tabIcon' | 'searchLogo';

export interface CroppingContext {
  url: string;
  type: CropTarget;
  extraData?: any; 
}

import backgroundWallpaper from "../imports/background_wallpaper.jpg";

const DEFAULT_MEDIA = backgroundWallpaper;
const DEFAULT_IS_VIDEO = false;
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

const DEFAULT_SEARCH_COMMANDS: SearchCommand[] = [
  {
    id: "1",
    trigger: "yt",
    name: "YouTube Search",
    url: "https://youtube.com/results?search_query={query}"
  },
  {
    id: "2",
    trigger: "g",
    name: "Google Search",
    url: "https://google.com/search?q={query}"
  },
  {
    id: "3",
    trigger: "gh",
    name: "GitHub Search",
    url: "https://github.com/search?q={query}"
  },
  {
    id: "4",
    trigger: "reddit",
    name: "Reddit Search",
    url: "https://reddit.com/search?q={query}"
  },
];

export const FACTORY_DEFAULTS = {
  bgMedia: DEFAULT_MEDIA,
  isVideo: DEFAULT_IS_VIDEO,
  tabTitle: "New Tab",
  tabIcon: "",
  customText1: DEFAULT_TEXT_1,
  customText2: DEFAULT_TEXT_2,
  bookmarks: [],
  searchCommands: [],
  searchIconUrl: undefined as string | undefined,
  showSearchWidget: false,
  searchWidgetX: 0,
  searchWidgetY: 0,
  searchWidgetScale: 1,
  themeColor: DEFAULT_THEME,
  showEtherealClock: false,
  etherealClockX: 0,
  etherealClockY: 0,
  etherealClockScale: 1,
  etherealClockColor: DEFAULT_THEME,
  etherealClockTextColor: "#ffffff",
  etherealClockStrokeEnabled: false,
  etherealClockStrokeColor: "#c58bf2",
  etherealClockTransparent: false,
  etherealClockBgBlurEnabled: false,
  etherealClockBgBlur: 10,
  etherealClockGlowEnabled: true,
  showGlassCalendar: false,
  glassCalendarX: 0,
  glassCalendarY: 0,
  glassCalendarScale: 1,
  glassCalendarColor: DEFAULT_THEME,
  glassCalendarTextColor: "#ffffff",
  calendarStrokeEnabled: false,
  calendarStrokeColor: "#c58bf2",
  glassCalendarTransparent: false,
  glassCalendarBlur: 24,
  showChecklist: false,
  checklistX: 0,
  checklistY: 0,
  checklistScale: 1,
  checklistColor: DEFAULT_THEME,
  checklistTextColor: "#ffffff",
  checklistStrokeEnabled: false,
  checklistStrokeColor: "#c58bf2",
  checklistTransparent: false,
  checklistBlur: 24,
  searchBarOpacity: 100,
  searchBarBgOpacity: 40,
  sidebarOpacity: 100,
  sidebarBgOpacity: 30,
  spacebarSearchEnabled: false,
  gearStyle: 'ring' as const,
  gearBgOpacity: 0.15,
  gearBgBlur: 10,
  gearRingColor: '#c58bf2',
  gearIconColor: '#ffffff',
  showClock: true,
  clockColor: DEFAULT_THEME,
  clockTextColor: "#ffffff",
  clockScale: 1,
  clockBgBlurEnabled: false,
  clockBgBlur: 10,
  isMuted: true,
  volume: 0.7,
  bgFilters: {
    brightness: 100,
    contrast: 100,
    blur: 0,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    opacity: 100,
  },
  activeFilterPreset: 'original',
};

export default function App() {
  const [bgMedia, setBgMedia] = useState(DEFAULT_MEDIA);
  const [isVideo, setIsVideo] = useState(DEFAULT_IS_VIDEO);
  
  const [tabTitle, setTabTitle] = useState("New Teb");
  const [tabIcon, setTabIcon] = useState("./tab_logo.png");
  
  const [customText1, setCustomText1] = useState(DEFAULT_TEXT_1);
  const [customText2, setCustomText2] = useState(DEFAULT_TEXT_2);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS);
  const [searchCommands, setSearchCommands] = useState<SearchCommand[]>(DEFAULT_SEARCH_COMMANDS);
  const [searchIconUrl, setSearchIconUrl] = useState<string | undefined>(undefined);
  
  const [isDragMode, setIsDragMode] = useState(false);
  const widgetX = useMotionValue(0);
  const widgetY = useMotionValue(0);
  const [showSearchWidget, setShowSearchWidget] = useState(false);
  const searchWidgetX = useMotionValue(0);
  const searchWidgetY = useMotionValue(0);
  const [searchWidgetScale, setSearchWidgetScale] = useState(1);
  const [themeColor, setThemeColor] = useState(DEFAULT_THEME);

  const [showEtherealClock, setShowEtherealClock] = useState(false);
  const etherealClockX = useMotionValue(0);
  const etherealClockY = useMotionValue(0);
  const [etherealClockScale, setEtherealClockScale] = useState(1);
  const [etherealClockColor, setEtherealClockColor] = useState(DEFAULT_THEME);
  const [etherealClockTextColor, setEtherealClockTextColor] = useState("#ffffff");
  const [etherealClockStrokeEnabled, setEtherealClockStrokeEnabled] = useState(false);
  const [etherealClockStrokeColor, setEtherealClockStrokeColor] = useState("#c58bf2");
  const [etherealClockTransparent, setEtherealClockTransparent] = useState(false);
  const [etherealClockBgBlurEnabled, setEtherealClockBgBlurEnabled] = useState(false);
  const [etherealClockBgBlur, setEtherealClockBgBlur] = useState(10);
  const [etherealClockGlowEnabled, setEtherealClockGlowEnabled] = useState(true);

  const [showGlassCalendar, setShowGlassCalendar] = useState(false);
  const glassCalendarX = useMotionValue(0);
  
  const [croppingImage, setCroppingImage] = useState<CroppingContext | null>(null);
  const glassCalendarY = useMotionValue(0);
  const [glassCalendarScale, setGlassCalendarScale] = useState(1);
  const [glassCalendarColor, setGlassCalendarColor] = useState(DEFAULT_THEME);
  const [glassCalendarTextColor, setGlassCalendarTextColor] = useState("#ffffff");
  const [calendarStrokeEnabled, setCalendarStrokeEnabled] = useState(false);
  const [calendarStrokeColor, setCalendarStrokeColor] = useState("#c58bf2");
  const [glassCalendarTransparent, setGlassCalendarTransparent] = useState(false);
  const [glassCalendarBlur, setGlassCalendarBlur] = useState(24);

  const [showChecklist, setShowChecklist] = useState(false);
  const checklistX = useMotionValue(0);
  const checklistY = useMotionValue(0);
  const [checklistScale, setChecklistScale] = useState(1);
  const [checklistColor, setChecklistColor] = useState(DEFAULT_THEME);
  const [checklistTextColor, setChecklistTextColor] = useState("#ffffff");
  const [checklistStrokeEnabled, setChecklistStrokeEnabled] = useState(false);
  const [checklistStrokeColor, setChecklistStrokeColor] = useState("#c58bf2");
  const [checklistTransparent, setChecklistTransparent] = useState(false);
  const [checklistBlur, setChecklistBlur] = useState(24);

  const [searchBarOpacity, setSearchBarOpacity] = useState(100);
  const [searchBarBgOpacity, setSearchBarBgOpacity] = useState(40);
  const [sidebarOpacity, setSidebarOpacity] = useState(100);
  const [sidebarBgOpacity, setSidebarBgOpacity] = useState(30);
  const [spacebarSearchEnabled, setSpacebarSearchEnabled] = useState(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Gear icon style
  const [gearStyle, setGearStyle] = useState<'outline' | 'blurred-bg' | 'ring'>('ring');
  const [gearBgOpacity, setGearBgOpacity] = useState(0.15);
  const [gearBgBlur, setGearBgBlur] = useState(10);
  const [gearRingColor, setGearRingColor] = useState('#c58bf2');
  const [gearIconColor, setGearIconColor] = useState('#ffffff');

  const [showClock, setShowClock] = useState(true);
  const [clockColor, setClockColor] = useState(DEFAULT_THEME);
  const [clockTextColor, setClockTextColor] = useState("#ffffff");
  const [clockScale, setClockScale] = useState(1);
  const [clockBgBlurEnabled, setClockBgBlurEnabled] = useState(false);
  const [clockBgBlur, setClockBgBlur] = useState(10);

  // Video audio controls
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);

  // Background filters
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

  const handleResetAll = async () => {
    // Dual-Storage Wipe
    await new Promise<void>((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.clear(() => {
          localStorage.clear();
          resolve();
        });
      } else {
        localStorage.clear();
        resolve();
      }
    });

    // Synchronously iterate through FACTORY_DEFAULTS and set React state
    setBgMedia(FACTORY_DEFAULTS.bgMedia);
    setIsVideo(FACTORY_DEFAULTS.isVideo);
    setTabTitle(FACTORY_DEFAULTS.tabTitle);
    setTabIcon(FACTORY_DEFAULTS.tabIcon);
    setCustomText1(FACTORY_DEFAULTS.customText1);
    setCustomText2(FACTORY_DEFAULTS.customText2);
    setBookmarks(FACTORY_DEFAULTS.bookmarks);
    setSearchCommands(FACTORY_DEFAULTS.searchCommands);
    setSearchIconUrl(FACTORY_DEFAULTS.searchIconUrl);
    setShowSearchWidget(FACTORY_DEFAULTS.showSearchWidget);
    searchWidgetX.set(FACTORY_DEFAULTS.searchWidgetX);
    searchWidgetY.set(FACTORY_DEFAULTS.searchWidgetY);
    setSearchWidgetScale(FACTORY_DEFAULTS.searchWidgetScale);
    setThemeColor(FACTORY_DEFAULTS.themeColor);
    
    setShowEtherealClock(FACTORY_DEFAULTS.showEtherealClock);
    etherealClockX.set(FACTORY_DEFAULTS.etherealClockX);
    etherealClockY.set(FACTORY_DEFAULTS.etherealClockY);
    setEtherealClockScale(FACTORY_DEFAULTS.etherealClockScale);
    setEtherealClockColor(FACTORY_DEFAULTS.etherealClockColor);
    setEtherealClockTextColor(FACTORY_DEFAULTS.etherealClockTextColor);
    setEtherealClockStrokeEnabled(FACTORY_DEFAULTS.etherealClockStrokeEnabled);
    setEtherealClockStrokeColor(FACTORY_DEFAULTS.etherealClockStrokeColor);
    setEtherealClockTransparent(FACTORY_DEFAULTS.etherealClockTransparent);
    setEtherealClockBgBlurEnabled(FACTORY_DEFAULTS.etherealClockBgBlurEnabled);
    setEtherealClockBgBlur(FACTORY_DEFAULTS.etherealClockBgBlur);
    setEtherealClockGlowEnabled(FACTORY_DEFAULTS.etherealClockGlowEnabled);

    setShowGlassCalendar(FACTORY_DEFAULTS.showGlassCalendar);
    glassCalendarX.set(FACTORY_DEFAULTS.glassCalendarX);
    glassCalendarY.set(FACTORY_DEFAULTS.glassCalendarY);
    setGlassCalendarScale(FACTORY_DEFAULTS.glassCalendarScale);
    setGlassCalendarColor(FACTORY_DEFAULTS.glassCalendarColor);
    setGlassCalendarTextColor(FACTORY_DEFAULTS.glassCalendarTextColor);
    setCalendarStrokeEnabled(FACTORY_DEFAULTS.calendarStrokeEnabled);
    setCalendarStrokeColor(FACTORY_DEFAULTS.calendarStrokeColor);
    setGlassCalendarTransparent(FACTORY_DEFAULTS.glassCalendarTransparent);
    setGlassCalendarBlur(FACTORY_DEFAULTS.glassCalendarBlur);

    setShowChecklist(FACTORY_DEFAULTS.showChecklist);
    checklistX.set(FACTORY_DEFAULTS.checklistX);
    checklistY.set(FACTORY_DEFAULTS.checklistY);
    setChecklistScale(FACTORY_DEFAULTS.checklistScale);
    setChecklistColor(FACTORY_DEFAULTS.checklistColor);
    setChecklistTextColor(FACTORY_DEFAULTS.checklistTextColor);
    setChecklistStrokeEnabled(FACTORY_DEFAULTS.checklistStrokeEnabled);
    setChecklistStrokeColor(FACTORY_DEFAULTS.checklistStrokeColor);
    setChecklistTransparent(FACTORY_DEFAULTS.checklistTransparent);
    setChecklistBlur(FACTORY_DEFAULTS.checklistBlur);

    setSearchBarOpacity(FACTORY_DEFAULTS.searchBarOpacity);
    setSearchBarBgOpacity(FACTORY_DEFAULTS.searchBarBgOpacity);
    setSidebarOpacity(FACTORY_DEFAULTS.sidebarOpacity);
    setSidebarBgOpacity(FACTORY_DEFAULTS.sidebarBgOpacity);
    setSpacebarSearchEnabled(FACTORY_DEFAULTS.spacebarSearchEnabled);

    setGearStyle(FACTORY_DEFAULTS.gearStyle);
    setGearBgOpacity(FACTORY_DEFAULTS.gearBgOpacity);
    setGearBgBlur(FACTORY_DEFAULTS.gearBgBlur);
    setGearRingColor(FACTORY_DEFAULTS.gearRingColor);
    setGearIconColor(FACTORY_DEFAULTS.gearIconColor);

    setShowClock(FACTORY_DEFAULTS.showClock);
    setClockColor(FACTORY_DEFAULTS.clockColor);
    setClockTextColor(FACTORY_DEFAULTS.clockTextColor);
    setClockScale(FACTORY_DEFAULTS.clockScale);
    setClockBgBlurEnabled(FACTORY_DEFAULTS.clockBgBlurEnabled);
    setClockBgBlur(FACTORY_DEFAULTS.clockBgBlur);

    setIsMuted(FACTORY_DEFAULTS.isMuted);
    setVolume(FACTORY_DEFAULTS.volume);

    setBgFilters(FACTORY_DEFAULTS.bgFilters);
    setActiveFilterPreset(FACTORY_DEFAULTS.activeFilterPreset);

    // Re-write all key-value pairs back to persistent disk
    safeSetItem("homepage_wallpaper_url", FACTORY_DEFAULTS.bgMedia);
    safeSetItem("homepage_is_video", String(FACTORY_DEFAULTS.isVideo));
    safeSetItem("homepage_tab_title", FACTORY_DEFAULTS.tabTitle);
    safeSetItem("homepage_tab_icon", FACTORY_DEFAULTS.tabIcon);
    safeSetItem("homepage_custom_text_1", FACTORY_DEFAULTS.customText1);
    safeSetItem("homepage_custom_text_2", FACTORY_DEFAULTS.customText2);
    safeSetItem("homepage_sidebar_bookmarks", JSON.stringify(FACTORY_DEFAULTS.bookmarks));
    safeSetItem("homepage_custom_commands", JSON.stringify(FACTORY_DEFAULTS.searchCommands));
    if (FACTORY_DEFAULTS.searchIconUrl) safeSetItem("homepage_search_logo", FACTORY_DEFAULTS.searchIconUrl);

    safeSetItem("homepage_show_search_widget", String(FACTORY_DEFAULTS.showSearchWidget));
    safeSetItem("homepage_search_widget_pos", JSON.stringify({ x: 0, y: 0 }));
    safeSetItem("homepage_search_widget_scale", String(FACTORY_DEFAULTS.searchWidgetScale));
    safeSetItem("homepage_theme_color", FACTORY_DEFAULTS.themeColor);

    safeSetItem("homepage_show_ethereal_clock", String(FACTORY_DEFAULTS.showEtherealClock));
    safeSetItem("homepage_ethereal_clock_pos", JSON.stringify({ x: 0, y: 0 }));
    safeSetItem("homepage_ethereal_clock_scale", String(FACTORY_DEFAULTS.etherealClockScale));
    safeSetItem("homepage_ethereal_clock_color", FACTORY_DEFAULTS.etherealClockColor);
    safeSetItem("homepage_ethereal_clock_text_color", FACTORY_DEFAULTS.etherealClockTextColor);
    safeSetItem("homepage_ethereal_clock_stroke_enabled", String(FACTORY_DEFAULTS.etherealClockStrokeEnabled));
    safeSetItem("homepage_ethereal_clock_stroke_color", FACTORY_DEFAULTS.etherealClockStrokeColor);
    safeSetItem("homepage_ethereal_clock_transparent", String(FACTORY_DEFAULTS.etherealClockTransparent));
    safeSetItem("homepage_ethereal_clock_bg_blur_enabled", String(FACTORY_DEFAULTS.etherealClockBgBlurEnabled));
    safeSetItem("homepage_ethereal_clock_bg_blur", String(FACTORY_DEFAULTS.etherealClockBgBlur));
    safeSetItem("homepage_ethereal_clock_glow_enabled", String(FACTORY_DEFAULTS.etherealClockGlowEnabled));

    safeSetItem("homepage_show_glass_calendar", String(FACTORY_DEFAULTS.showGlassCalendar));
    safeSetItem("homepage_glass_calendar_pos", JSON.stringify({ x: 0, y: 0 }));
    safeSetItem("homepage_glass_calendar_scale", String(FACTORY_DEFAULTS.glassCalendarScale));
    safeSetItem("homepage_glass_calendar_color", FACTORY_DEFAULTS.glassCalendarColor);
    safeSetItem("homepage_calendar_text_color", FACTORY_DEFAULTS.glassCalendarTextColor);
    safeSetItem("homepage_calendar_stroke_enabled", String(FACTORY_DEFAULTS.calendarStrokeEnabled));
    safeSetItem("homepage_calendar_stroke_color", FACTORY_DEFAULTS.calendarStrokeColor);
    safeSetItem("homepage_glass_calendar_transparent", String(FACTORY_DEFAULTS.glassCalendarTransparent));
    safeSetItem("homepage_glass_calendar_blur", String(FACTORY_DEFAULTS.glassCalendarBlur));

    safeSetItem("homepage_show_checklist", String(FACTORY_DEFAULTS.showChecklist));
    safeSetItem("homepage_checklist_pos", JSON.stringify({ x: 0, y: 0 }));
    safeSetItem("homepage_checklist_scale", String(FACTORY_DEFAULTS.checklistScale));
    safeSetItem("homepage_checklist_color", FACTORY_DEFAULTS.checklistColor);
    safeSetItem("homepage_checklist_text_color", FACTORY_DEFAULTS.checklistTextColor);
    safeSetItem("homepage_checklist_stroke_enabled", String(FACTORY_DEFAULTS.checklistStrokeEnabled));
    safeSetItem("homepage_checklist_stroke_color", FACTORY_DEFAULTS.checklistStrokeColor);
    safeSetItem("homepage_checklist_transparent", String(FACTORY_DEFAULTS.checklistTransparent));
    safeSetItem("homepage_checklist_blur", String(FACTORY_DEFAULTS.checklistBlur));

    safeSetItem("homepage_search_bar_opacity", String(FACTORY_DEFAULTS.searchBarOpacity));
    safeSetItem("homepage_search_bar_bg_opacity", String(FACTORY_DEFAULTS.searchBarBgOpacity));
    safeSetItem("homepage_sidebar_opacity", String(FACTORY_DEFAULTS.sidebarOpacity));
    safeSetItem("homepage_sidebar_bg_opacity", String(FACTORY_DEFAULTS.sidebarBgOpacity));
    safeSetItem("homepage_spacebar_search_enabled", String(FACTORY_DEFAULTS.spacebarSearchEnabled));

    safeSetItem("homepage_gear_style", FACTORY_DEFAULTS.gearStyle);
    safeSetItem("homepage_gear_bg_opacity", String(FACTORY_DEFAULTS.gearBgOpacity));
    safeSetItem("homepage_gear_bg_blur", String(FACTORY_DEFAULTS.gearBgBlur));
    safeSetItem("homepage_gear_ring_color", FACTORY_DEFAULTS.gearRingColor);
    safeSetItem("homepage_gear_icon_color", FACTORY_DEFAULTS.gearIconColor);

    safeSetItem("homepage_show_clock", String(FACTORY_DEFAULTS.showClock));
    safeSetItem("homepage_clock_color", FACTORY_DEFAULTS.clockColor);
    safeSetItem("homepage_clock_text_color", FACTORY_DEFAULTS.clockTextColor);
    safeSetItem("homepage_clock_scale", String(FACTORY_DEFAULTS.clockScale));
    safeSetItem("homepage_clock_bg_blur_enabled", String(FACTORY_DEFAULTS.clockBgBlurEnabled));
    safeSetItem("homepage_clock_bg_blur", String(FACTORY_DEFAULTS.clockBgBlur));

    safeSetItem("homepage_is_muted", String(FACTORY_DEFAULTS.isMuted));
    safeSetItem("homepage_volume", String(FACTORY_DEFAULTS.volume));

    safeSetItem("homepage_bg_filters", JSON.stringify(FACTORY_DEFAULTS.bgFilters));
    safeSetItem("homepage_active_filter_preset", FACTORY_DEFAULTS.activeFilterPreset);
  };

  const constraintsRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Debounce timer for position updates
  const positionSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced position save
  const debouncedSavePosition = (key: string, position: { x: number; y: number }) => {
    if (positionSaveTimerRef.current) {
      clearTimeout(positionSaveTimerRef.current);
    }
    positionSaveTimerRef.current = setTimeout(() => {
      safeSetItem(key, JSON.stringify(position));
    }, 500); // Save 500ms after last drag
  };

  // Global spacebar listener for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is already typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (spacebarSearchEnabled && !showSearchWidget && (e.key === ' ' || e.code === "Space") && !isSearchOpen) {
        e.preventDefault(); // prevent scrolling
        setIsSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, showSearchWidget, spacebarSearchEnabled]);

  useEffect(() => {
    setIsMounted(true);
    
    // Load saved preferences
    const savedMedia = localStorage.getItem("homepage_media");
    const savedIsVideo = localStorage.getItem("homepage_is_video");
    const savedMuted = localStorage.getItem("homepage_video_muted");
    const savedVolume = localStorage.getItem("homepage_video_volume");
    const savedBgFilters = localStorage.getItem("homepage_bg_filters");
    const savedActivePreset = localStorage.getItem("homepage_active_filter_preset");
    const savedT1 = localStorage.getItem("homepage_t1");
    const savedT2 = localStorage.getItem("homepage_t2");
    const savedPos = localStorage.getItem("homepage_widget_pos");
    const savedTheme = localStorage.getItem("homepage_theme");
    const savedBookmarks = localStorage.getItem("homepage_bookmarks");
    const savedSearchCommands = localStorage.getItem("homepage_search_commands");
    const savedSearchIcon = localStorage.getItem("homepage_search_icon");
    const savedShowClock = localStorage.getItem("homepage_show_clock");
    const savedClockColor = localStorage.getItem("homepage_clock_color");
    const savedClockTextColor = localStorage.getItem("homepage_clock_text_color");
    const savedClockScale = localStorage.getItem("homepage_clock_scale");
    const savedShowSearchWidget = localStorage.getItem("homepage_show_search_widget");
    const savedSearchWidgetPos = localStorage.getItem("homepage_search_widget_pos");
    const savedSearchWidgetScale = localStorage.getItem("homepage_search_widget_scale");

    const savedShowEtherealClock = localStorage.getItem("homepage_show_ethereal_clock");
    const savedEtherealClockPos = localStorage.getItem("homepage_ethereal_clock_pos");
    const savedEtherealClockScale = localStorage.getItem("homepage_ethereal_clock_scale");
    const savedEtherealClockColor = localStorage.getItem("homepage_ethereal_clock_color");
    const savedEtherealClockTextColor = localStorage.getItem("homepage_ethereal_clock_text_color");
    const savedEtherealClockTrans = localStorage.getItem("homepage_ethereal_clock_trans");
    const savedEtherealClockBgBlurEnabled = localStorage.getItem("homepage_ethereal_clock_bg_blur_enabled");
    const savedEtherealClockBgBlur = localStorage.getItem("homepage_ethereal_clock_bg_blur");
    const savedEtherealClockGlow = localStorage.getItem("homepage_ethereal_clock_glow");
    const savedClockBgBlurEnabled = localStorage.getItem("homepage_clock_bg_blur_enabled");
    const savedClockBgBlur = localStorage.getItem("homepage_clock_bg_blur");

    const savedGearStyle = localStorage.getItem("homepage_gear_style");
    const savedGearBgOpacity = localStorage.getItem("homepage_gear_bg_opacity");
    const savedGearBgBlur = localStorage.getItem("homepage_gear_bg_blur");
    const savedGearRingColor = localStorage.getItem("homepage_gear_ring_color");
    const savedGearIconColor = localStorage.getItem("homepage_gear_icon_color");

    const savedShowGlassCalendar = localStorage.getItem("homepage_show_glass_calendar");
    const savedGlassCalendarPos = localStorage.getItem("homepage_glass_calendar_pos");
    const savedGlassCalendarScale = localStorage.getItem("homepage_glass_calendar_scale");
    const savedGlassCalendarColor = localStorage.getItem("homepage_glass_calendar_color");
    const savedGlassCalendarTextColor = localStorage.getItem("homepage_glass_calendar_text_color");
    const savedGlassCalendarTrans = localStorage.getItem("homepage_glass_calendar_trans");
    const savedGlassCalendarBlur = localStorage.getItem("homepage_glass_calendar_blur");

    const savedSearchBarOpacity = localStorage.getItem("homepage_search_bar_opacity");
    const savedSearchBarBgOpacity = localStorage.getItem("homepage_search_bar_bg_opacity");
    const savedSidebarOpacity = localStorage.getItem("homepage_sidebar_opacity");
    const savedSidebarBgOpacity = localStorage.getItem("homepage_sidebar_bg_opacity");
    const savedSpacebarSearchEnabled = localStorage.getItem("homepage_spacebar_search_enabled");

    const savedTabTitle = localStorage.getItem("homepage_tab_title");
    const savedTabIcon = localStorage.getItem("homepage_tab_icon");

    const savedEtherealClockStrokeEnabled = localStorage.getItem("homepage_ethereal_clock_stroke_enabled");
    const savedEtherealClockStrokeColor = localStorage.getItem("homepage_ethereal_clock_stroke_color");
    
    const savedCalendarStrokeEnabled = localStorage.getItem("homepage_calendar_stroke_enabled");
    const savedCalendarStrokeColor = localStorage.getItem("homepage_calendar_stroke_color");

    const savedShowChecklist = localStorage.getItem("homepage_show_checklist");
    const savedChecklistPos = localStorage.getItem("homepage_checklist_pos");
    const savedChecklistScale = localStorage.getItem("homepage_checklist_scale");
    const savedChecklistColor = localStorage.getItem("homepage_checklist_color");
    const savedChecklistTextColor = localStorage.getItem("homepage_checklist_text_color");
    const savedChecklistTrans = localStorage.getItem("homepage_checklist_trans");
    const savedChecklistBlur = localStorage.getItem("homepage_checklist_blur");
    const savedChecklistStrokeEnabled = localStorage.getItem("homepage_checklist_stroke_enabled");
    const savedChecklistStrokeColor = localStorage.getItem("homepage_checklist_stroke_color");

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
    if (savedShowClock) setShowClock(savedShowClock === "true");
    if (savedClockColor) setClockColor(savedClockColor);
    if (savedClockTextColor) setClockTextColor(savedClockTextColor);
    if (savedClockScale) setClockScale(parseFloat(savedClockScale));
    if (savedShowSearchWidget) setShowSearchWidget(savedShowSearchWidget === "true");
    if (savedSearchWidgetScale) setSearchWidgetScale(parseFloat(savedSearchWidgetScale));

    if (savedShowEtherealClock) setShowEtherealClock(savedShowEtherealClock === "true");
    if (savedEtherealClockScale) setEtherealClockScale(parseFloat(savedEtherealClockScale));
    if (savedEtherealClockColor) setEtherealClockColor(savedEtherealClockColor);
    if (savedEtherealClockTextColor) setEtherealClockTextColor(savedEtherealClockTextColor);
    if (savedEtherealClockTrans) setEtherealClockTransparent(savedEtherealClockTrans === "true");
    if (savedEtherealClockBgBlurEnabled) setEtherealClockBgBlurEnabled(savedEtherealClockBgBlurEnabled === "true");
    if (savedEtherealClockBgBlur) setEtherealClockBgBlur(parseFloat(savedEtherealClockBgBlur));
    if (savedEtherealClockGlow) setEtherealClockGlowEnabled(savedEtherealClockGlow === "true");
    if (savedEtherealClockStrokeEnabled) setEtherealClockStrokeEnabled(savedEtherealClockStrokeEnabled === "true");
    if (savedEtherealClockStrokeColor) setEtherealClockStrokeColor(savedEtherealClockStrokeColor);
    
    if (savedClockBgBlurEnabled) setClockBgBlurEnabled(savedClockBgBlurEnabled === "true");
    if (savedClockBgBlur) setClockBgBlur(parseFloat(savedClockBgBlur));

    if (savedGearStyle) setGearStyle(savedGearStyle as 'outline' | 'blurred-bg' | 'ring');
    if (savedGearBgOpacity) setGearBgOpacity(parseFloat(savedGearBgOpacity));
    if (savedGearBgBlur) setGearBgBlur(parseFloat(savedGearBgBlur));
    if (savedGearRingColor) setGearRingColor(savedGearRingColor);
    if (savedGearIconColor) setGearIconColor(savedGearIconColor);

    if (savedShowGlassCalendar) setShowGlassCalendar(savedShowGlassCalendar === "true");
    if (savedGlassCalendarScale) setGlassCalendarScale(parseFloat(savedGlassCalendarScale));
    if (savedGlassCalendarColor) setGlassCalendarColor(savedGlassCalendarColor);
    if (savedGlassCalendarTextColor) setGlassCalendarTextColor(savedGlassCalendarTextColor);
    if (savedGlassCalendarTrans) setGlassCalendarTransparent(savedGlassCalendarTrans === "true");
    if (savedGlassCalendarBlur) setGlassCalendarBlur(parseFloat(savedGlassCalendarBlur));
    if (savedCalendarStrokeEnabled) setCalendarStrokeEnabled(savedCalendarStrokeEnabled === "true");
    if (savedCalendarStrokeColor) setCalendarStrokeColor(savedCalendarStrokeColor);

    if (savedShowChecklist) setShowChecklist(savedShowChecklist === "true");
    if (savedChecklistScale) setChecklistScale(parseFloat(savedChecklistScale));
    if (savedChecklistColor) setChecklistColor(savedChecklistColor);
    if (savedChecklistTextColor) setChecklistTextColor(savedChecklistTextColor);
    if (savedChecklistTrans) setChecklistTransparent(savedChecklistTrans === "true");
    if (savedChecklistBlur) setChecklistBlur(parseFloat(savedChecklistBlur));
    if (savedChecklistStrokeEnabled) setChecklistStrokeEnabled(savedChecklistStrokeEnabled === "true");
    if (savedChecklistStrokeColor) setChecklistStrokeColor(savedChecklistStrokeColor);

    if (savedSearchBarOpacity) setSearchBarOpacity(parseFloat(savedSearchBarOpacity));
    if (savedSearchBarBgOpacity) setSearchBarBgOpacity(parseFloat(savedSearchBarBgOpacity));
    if (savedSidebarOpacity) setSidebarOpacity(parseInt(savedSidebarOpacity));
    if (savedSidebarBgOpacity) setSidebarBgOpacity(parseInt(savedSidebarBgOpacity));
    if (savedSpacebarSearchEnabled !== null) setSpacebarSearchEnabled(savedSpacebarSearchEnabled === "true");

    if (savedTabTitle) setTabTitle(savedTabTitle);
    if (savedTabIcon) setTabIcon(savedTabIcon);

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
      } catch (e) {
        console.error("Failed to parse saved search commands", e);
      }
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
    if (savedChecklistPos) {
      try {
        const parsed = JSON.parse(savedChecklistPos);
        checklistX.set(parsed.x);
        checklistY.set(parsed.y);
      } catch (e) {}
    }
  }, []);

  // Sync volume changes to video element
  useEffect(() => {
    if (videoRef.current && !isMuted) {
      videoRef.current.volume = volume;
    }
  }, [volume, isMuted]);

  const handleUpdateGearStyle = (style: 'outline' | 'blurred-bg' | 'ring') => {
    setGearStyle(style);
    safeSetItem("homepage_gear_style", style);
  };
  const handleUpdateGearBgOpacity = (val: number) => {
    setGearBgOpacity(val);
    safeSetItem("homepage_gear_bg_opacity", val.toString());
  };
  const handleUpdateGearBgBlur = (val: number) => {
    setGearBgBlur(val);
    safeSetItem("homepage_gear_bg_blur", val.toString());
  };
  const handleUpdateGearRingColor = (color: string) => {
    setGearRingColor(color);
    safeSetItem("homepage_gear_ring_color", color);
  };
  const handleUpdateGearIconColor = (color: string) => {
    setGearIconColor(color);
    safeSetItem("homepage_gear_icon_color", color);
  };

  const handleUpdateTabTitle = (title: string) => {
    setTabTitle(title);
    safeSetItem("homepage_tab_title", title);
  };

  const handleUpdateTabIcon = (icon: string) => {
    setTabIcon(icon);
    safeSetItem("homepage_tab_icon", icon);
  };

  useEffect(() => {
    document.title = tabTitle || "New Teb";
    const head = document.getElementsByTagName('head')[0];
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/png';
      link.rel = 'icon';
      head.appendChild(link);
    }
    link.href = tabIcon || './tab_logo.png';
  }, [tabTitle, tabIcon]);

  const handleToggleSearchWidget = (val: boolean) => {
    setShowSearchWidget(val);
    safeSetItem("homepage_show_search_widget", String(val));
  };

  const handleUpdateMedia = (url: string, isCustomVideo: boolean) => {
    setBgMedia(url);
    setIsVideo(isCustomVideo);
    safeSetItem("homepage_media", url);
    safeSetItem("homepage_is_video", String(isCustomVideo));
  };

  const handleUpdateTexts = (t1: string, t2: string) => {
    setCustomText1(t1);
    setCustomText2(t2);
    safeSetItem("homepage_t1", t1);
    safeSetItem("homepage_t2", t2);
  };

  const handleUpdateTheme = (theme: string) => {
    setThemeColor(theme);
    safeSetItem("homepage_theme", theme);
  };

  const handleUpdateSearchIcon = (url: string | undefined) => {
    setSearchIconUrl(url);
    if (url) {
      safeSetItem("homepage_search_icon", url);
    } else {
      try {
        localStorage.removeItem("homepage_search_icon");
      } catch (error) {
        console.warn("Failed to remove search icon from localStorage:", error);
      }
    }
  };

  const handleUpdateBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    safeSetItem("homepage_bookmarks", JSON.stringify(newBookmarks));
  };

  const handleUpdateSearchCommands = (newCommands: SearchCommand[]) => {
    setSearchCommands(newCommands);
    safeSetItem("homepage_search_commands", JSON.stringify(newCommands));
  };

  const handleToggleClock = (val: boolean) => {
    setShowClock(val);
    safeSetItem("homepage_show_clock", String(val));
  };

  const handleUpdateClockColor = (color: string) => {
    setClockColor(color);
    safeSetItem("homepage_clock_color", color);
  };

  const handleUpdateClockTextColor = (color: string) => {
    setClockTextColor(color);
    safeSetItem("homepage_clock_text_color", color);
  };

  const handleUpdateClockScale = (scale: number) => {
    setClockScale(scale);
    safeSetItem("homepage_clock_scale", scale.toString());
  };

  const handleUpdateSearchWidgetScale = (scale: number) => {
    setSearchWidgetScale(scale);
    safeSetItem("homepage_search_widget_scale", scale.toString());
  };

  const handleToggleEtherealClock = (val: boolean) => {
    setShowEtherealClock(val);
    safeSetItem("homepage_show_ethereal_clock", String(val));
  };

  const handleUpdateEtherealClockScale = (scale: number) => {
    setEtherealClockScale(scale);
    safeSetItem("homepage_ethereal_clock_scale", scale.toString());
  };

  const handleUpdateEtherealClockColor = (color: string) => {
    setEtherealClockColor(color);
    safeSetItem("homepage_ethereal_clock_color", color);
  };

  const handleUpdateEtherealClockTextColor = (color: string) => {
    setEtherealClockTextColor(color);
    safeSetItem("homepage_ethereal_clock_text_color", color);
  };

  const handleToggleEtherealClockStroke = (val: boolean) => {
    setEtherealClockStrokeEnabled(val);
    safeSetItem("homepage_ethereal_clock_stroke_enabled", String(val));
  };

  const handleUpdateEtherealClockStrokeColor = (color: string) => {
    setEtherealClockStrokeColor(color);
    safeSetItem("homepage_ethereal_clock_stroke_color", color);
  };

  const handleToggleEtherealClockTransparent = (val: boolean) => {
    setEtherealClockTransparent(val);
    safeSetItem("homepage_ethereal_clock_trans", String(val));
  };
  const handleToggleEtherealClockBgBlur = (val: boolean) => {
    setEtherealClockBgBlurEnabled(val);
    safeSetItem("homepage_ethereal_clock_bg_blur_enabled", String(val));
  };
  const handleUpdateEtherealClockBgBlur = (val: number) => {
    setEtherealClockBgBlur(val);
    safeSetItem("homepage_ethereal_clock_bg_blur", val.toString());
  };
  const handleToggleEtherealClockGlow = (val: boolean) => {
    setEtherealClockGlowEnabled(val);
    safeSetItem("homepage_ethereal_clock_glow", String(val));
  };
  const handleToggleClockBgBlur = (val: boolean) => {
    setClockBgBlurEnabled(val);
    safeSetItem("homepage_clock_bg_blur_enabled", String(val));
  };
  const handleUpdateClockBgBlur = (val: number) => {
    setClockBgBlur(val);
    safeSetItem("homepage_clock_bg_blur", val.toString());
  };

  const handleToggleGlassCalendar = (val: boolean) => {
    setShowGlassCalendar(val);
    safeSetItem("homepage_show_glass_calendar", String(val));
  };

  const handleUpdateGlassCalendarScale = (scale: number) => {
    setGlassCalendarScale(scale);
    safeSetItem("homepage_glass_calendar_scale", scale.toString());
  };

  const handleUpdateGlassCalendarColor = (color: string) => {
    setGlassCalendarColor(color);
    safeSetItem("homepage_glass_calendar_color", color);
  };

  const handleUpdateGlassCalendarTextColor = (color: string) => {
    setGlassCalendarTextColor(color);
    safeSetItem("homepage_glass_calendar_text_color", color);
  };

  const handleToggleCalendarStroke = (val: boolean) => {
    setCalendarStrokeEnabled(val);
    safeSetItem("homepage_calendar_stroke_enabled", String(val));
  };

  const handleUpdateCalendarStrokeColor = (color: string) => {
    setCalendarStrokeColor(color);
    safeSetItem("homepage_calendar_stroke_color", color);
  };

  const handleToggleGlassCalendarTransparent = (val: boolean) => {
    setGlassCalendarTransparent(val);
    safeSetItem("homepage_glass_calendar_trans", String(val));
  };

  const handleUpdateGlassCalendarBlur = (blur: number) => {
    setGlassCalendarBlur(blur);
    safeSetItem("homepage_glass_calendar_blur", blur.toString());
  };

  const handleToggleChecklist = (val: boolean) => {
    setShowChecklist(val);
    safeSetItem("homepage_show_checklist", String(val));
  };

  const handleUpdateChecklistScale = (scale: number) => {
    setChecklistScale(scale);
    safeSetItem("homepage_checklist_scale", scale.toString());
  };

  const handleUpdateChecklistColor = (color: string) => {
    setChecklistColor(color);
    safeSetItem("homepage_checklist_color", color);
  };

  const handleUpdateChecklistTextColor = (color: string) => {
    setChecklistTextColor(color);
    safeSetItem("homepage_checklist_text_color", color);
  };

  const handleToggleChecklistStroke = (val: boolean) => {
    setChecklistStrokeEnabled(val);
    safeSetItem("homepage_checklist_stroke_enabled", String(val));
  };

  const handleUpdateChecklistStrokeColor = (color: string) => {
    setChecklistStrokeColor(color);
    safeSetItem("homepage_checklist_stroke_color", color);
  };

  const handleToggleChecklistTransparent = (val: boolean) => {
    setChecklistTransparent(val);
    safeSetItem("homepage_checklist_trans", String(val));
  };

  const handleUpdateChecklistBlur = (blur: number) => {
    setChecklistBlur(blur);
    safeSetItem("homepage_checklist_blur", blur.toString());
  };

  const handleUpdateSearchBarOpacity = (val: number) => {
    setSearchBarOpacity(val);
    safeSetItem("homepage_search_bar_opacity", val.toString());
  };

  const handleUpdateSearchBarBgOpacity = (val: number) => {
    setSearchBarBgOpacity(val);
    safeSetItem("homepage_search_bar_bg_opacity", val.toString());
  };

  const handleUpdateSidebarOpacity = (val: number) => {
    setSidebarOpacity(val);
    safeSetItem("homepage_sidebar_opacity", val.toString());
  };

  const handleUpdateSidebarBgOpacity = (val: number) => {
    setSidebarBgOpacity(val);
    safeSetItem("homepage_sidebar_bg_opacity", val.toString());
  };

  const handleToggleSpacebarSearch = (val: boolean) => {
    setSpacebarSearchEnabled(val);
    safeSetItem("homepage_spacebar_search_enabled", String(val));
  };

  const handleToggleMute = (val: boolean) => {
    setIsMuted(val);
    safeSetItem("homepage_video_muted", String(val));
  };

  const handleUpdateVolume = (vol: number) => {
    setVolume(vol);
    safeSetItem("homepage_video_volume", vol.toString());

    // UX enhancement: auto-unmute when volume adjusted above 0
    if (vol > 0 && isMuted) {
      setIsMuted(false);
      safeSetItem("homepage_video_muted", "false");
    }
  };

  const handleUpdateBgFilters = (filters: Partial<BackgroundFilters>) => {
    const newFilters = { ...bgFilters, ...filters };
    setBgFilters(newFilters);
    setActiveFilterPreset('custom'); // Mark as custom when manually adjusted
    safeSetItem("homepage_bg_filters", JSON.stringify(newFilters));
    safeSetItem("homepage_active_filter_preset", 'custom');
  };

  const handleApplyFilterPreset = (presetId: string) => {
    const preset = FILTER_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setBgFilters(preset.filters);
      setActiveFilterPreset(presetId);
      safeSetItem("homepage_bg_filters", JSON.stringify(preset.filters));
      safeSetItem("homepage_active_filter_preset", presetId);
    }
  };

  const handleResetBgFilters = () => {
    handleApplyFilterPreset('original');
  };

  if (!isMounted) return null;

  // We convert hex to rgb manually or simply use the hex value for drop shadow
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '197, 139, 242';
  };
  const rgb = hexToRgb(themeColor);

  // Build CSS filter string from filter values
  const buildFilterString = (filters: BackgroundFilters): string => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) blur(${filters.blur}px) saturate(${filters.saturation}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg)`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-space selection:bg-[#b682e8]/30">
      {/* Background Media */}
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

      {/* Main Content Area */}
      <main ref={constraintsRef} className="relative z-10 h-screen w-full overflow-hidden pointer-events-none">
        
        {/* Draggable Widget Container */}
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
          style={{ opacity: sidebarOpacity / 100, x: widgetX, y: widgetY, ...(isDragMode ? { borderColor: themeColor } : {}), ...(clockBgBlurEnabled && !isDragMode ? { backdropFilter: `blur(${clockBgBlur}px)`, WebkitBackdropFilter: `blur(${clockBgBlur}px)` } as React.CSSProperties : {}) }}
        >
          {showClock && (
            <Clock customText1={customText1} customText2={customText2} themeColor={clockColor} textColor={clockTextColor} />
          )}
        </motion.div>

        {/* Draggable Search Widget Container */}
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
            style={{ opacity: sidebarOpacity / 100, x: searchWidgetX, y: searchWidgetY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
          >
            <SearchWidget themeColor={themeColor} isDragMode={isDragMode} opacity={searchBarOpacity} bgOpacity={searchBarBgOpacity} searchCommands={searchCommands} />
          </motion.div>
        )}

        {/* Draggable Ethereal Clock Container */}
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
            style={{ opacity: sidebarOpacity / 100, x: etherealClockX, y: etherealClockY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
          >
            <EtherealClock color={etherealClockColor} textColor={etherealClockTextColor} transparentBg={etherealClockTransparent} glowEnabled={etherealClockGlowEnabled} bgBlurEnabled={etherealClockBgBlurEnabled} bgBlur={etherealClockBgBlur} strokeEnabled={etherealClockStrokeEnabled} strokeColor={etherealClockStrokeColor} bgOpacity={sidebarBgOpacity} />
          </motion.div>
        )}

        {/* Draggable Glass Calendar Container */}
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
            style={{ opacity: sidebarOpacity / 100, x: glassCalendarX, y: glassCalendarY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
          >
            <GlassCalendar color={glassCalendarColor} textColor={glassCalendarTextColor} transparentBg={glassCalendarTransparent} blur={glassCalendarBlur} strokeEnabled={calendarStrokeEnabled} strokeColor={calendarStrokeColor} bgOpacity={sidebarBgOpacity} />
          </motion.div>
        )}

        {showChecklist && (
          <motion.div
            drag={isDragMode}
            dragElastic={0}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            animate={{ scale: checklistScale }}
            onDragEnd={() => {
              debouncedSavePosition("homepage_checklist_pos", { x: checklistX.get(), y: checklistY.get() });
            }}
            className={`absolute top-[40vh] right-[10vw] flex justify-center items-center transition-[background-color,box-shadow,padding,border-radius,backdrop-filter] duration-300 origin-top-right ${
              isDragMode
                ? "cursor-move ring-2 ring-white/50 ring-dashed bg-black/40 backdrop-blur-xl p-8 rounded-[3.5rem] z-50 shadow-2xl pointer-events-auto"
                : "p-0 z-30 pointer-events-auto"
            }`}
            style={{ opacity: sidebarOpacity / 100, x: checklistX, y: checklistY, ...(isDragMode ? { borderColor: themeColor } : {}) }}
          >
            <ChecklistWidget color={checklistColor} textColor={checklistTextColor} transparentBg={checklistTransparent} blur={checklistBlur} strokeEnabled={checklistStrokeEnabled} strokeColor={checklistStrokeColor} bgOpacity={sidebarBgOpacity} />
          </motion.div>
        )}

      </main>

      {/* Sidebar - Fixed to Center Right */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20" style={{ opacity: sidebarOpacity / 100 }}>
        <Sidebar 
          themeColor={themeColor} 
          onSearchClick={() => setIsSearchOpen(true)}
          onWidgetsClick={() => setIsWidgetsOpen(true)}
          bookmarks={bookmarks} 
          searchIconUrl={searchIconUrl}
          bgOpacity={sidebarBgOpacity}
        />
      </div>

      {/* Settings Button */}
      <div className="absolute bottom-6 right-6 z-20 group">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`rounded-full p-3 transition-all ${isDragMode ? 'animate-pulse' : ''}`}
          style={(() => {
            const iconColor = isDragMode ? themeColor : gearIconColor;
            if (gearStyle === 'blurred-bg') {
              return {
                color: iconColor,
                filter: `drop-shadow(0 0 4px rgba(0,0,0,0.8))`,
                backgroundColor: `rgba(255,255,255,${gearBgOpacity})`,
                backdropFilter: `blur(${gearBgBlur}px)`,
                WebkitBackdropFilter: `blur(${gearBgBlur}px)`,
              } as React.CSSProperties;
            } else if (gearStyle === 'ring') {
              return {
                color: iconColor,
                filter: `drop-shadow(0 0 4px rgba(0,0,0,0.8))`,
                border: `2px solid ${gearRingColor}`,
                boxShadow: `0 0 8px ${gearRingColor}66, 0 0 16px ${gearRingColor}33`,
              } as React.CSSProperties;
            }
            return {
              color: iconColor,
              filter: `drop-shadow(0 0 6px ${gearIconColor}cc) drop-shadow(0 0 3px rgba(0,0,0,0.9))`,
            } as React.CSSProperties;
          })()}
          aria-label="Personalize Homepage"
        >
          <Settings size={20} className="opacity-20 cursor-pointer transition-all duration-300 ease-in-out group-hover:opacity-100" />
        </button>
      </div>

      {/* Widgets Panel Modal */}
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
        etherealClockTextColor={etherealClockTextColor}
        onUpdateEtherealClockTextColor={handleUpdateEtherealClockTextColor}
        etherealClockStrokeEnabled={etherealClockStrokeEnabled}
        onToggleEtherealClockStroke={handleToggleEtherealClockStroke}
        etherealClockStrokeColor={etherealClockStrokeColor}
        onUpdateEtherealClockStrokeColor={handleUpdateEtherealClockStrokeColor}
        etherealClockTransparent={etherealClockTransparent}
        onToggleEtherealClockTransparent={handleToggleEtherealClockTransparent}
        showGlassCalendar={showGlassCalendar}
        onToggleGlassCalendar={handleToggleGlassCalendar}
        glassCalendarScale={glassCalendarScale}
        onUpdateGlassCalendarScale={handleUpdateGlassCalendarScale}
        glassCalendarColor={glassCalendarColor}
        onUpdateGlassCalendarColor={handleUpdateGlassCalendarColor}
        glassCalendarTextColor={glassCalendarTextColor}
        onUpdateGlassCalendarTextColor={handleUpdateGlassCalendarTextColor}
        calendarStrokeEnabled={calendarStrokeEnabled}
        onToggleCalendarStroke={handleToggleCalendarStroke}
        calendarStrokeColor={calendarStrokeColor}
        onUpdateCalendarStrokeColor={handleUpdateCalendarStrokeColor}
        glassCalendarTransparent={glassCalendarTransparent}
        onToggleGlassCalendarTransparent={handleToggleGlassCalendarTransparent}
        glassCalendarBlur={glassCalendarBlur}
        onUpdateGlassCalendarBlur={handleUpdateGlassCalendarBlur}
        
        showChecklist={showChecklist}
        onToggleChecklist={handleToggleChecklist}
        checklistScale={checklistScale}
        onUpdateChecklistScale={handleUpdateChecklistScale}
        checklistColor={checklistColor}
        onUpdateChecklistColor={handleUpdateChecklistColor}
        checklistTextColor={checklistTextColor}
        onUpdateChecklistTextColor={handleUpdateChecklistTextColor}
        checklistStrokeEnabled={checklistStrokeEnabled}
        onToggleChecklistStroke={handleToggleChecklistStroke}
        checklistStrokeColor={checklistStrokeColor}
        onUpdateChecklistStrokeColor={handleUpdateChecklistStrokeColor}
        checklistTransparent={checklistTransparent}
        onToggleChecklistTransparent={handleToggleChecklistTransparent}
        checklistBlur={checklistBlur}
        onUpdateChecklistBlur={handleUpdateChecklistBlur}
        
        onResetAll={handleResetAll}

        searchBarOpacity={searchBarOpacity}
        onUpdateSearchBarOpacity={handleUpdateSearchBarOpacity}
        searchBarBgOpacity={searchBarBgOpacity}
        onUpdateSearchBarBgOpacity={handleUpdateSearchBarBgOpacity}
        sidebarOpacity={sidebarOpacity}
        onUpdateSidebarOpacity={handleUpdateSidebarOpacity}
        sidebarBgOpacity={sidebarBgOpacity}
        onUpdateSidebarBgOpacity={handleUpdateSidebarBgOpacity}
        spacebarSearchEnabled={spacebarSearchEnabled}
        onToggleSpacebarSearch={handleToggleSpacebarSearch}
        gearStyle={gearStyle}
        onUpdateGearStyle={handleUpdateGearStyle}
        gearBgOpacity={gearBgOpacity}
        onUpdateGearBgOpacity={handleUpdateGearBgOpacity}
        gearBgBlur={gearBgBlur}
        onUpdateGearBgBlur={handleUpdateGearBgBlur}
        gearRingColor={gearRingColor}
        onUpdateGearRingColor={handleUpdateGearRingColor}
        gearIconColor={gearIconColor}
        onUpdateGearIconColor={handleUpdateGearIconColor}
        clockBgBlurEnabled={clockBgBlurEnabled}
        onToggleClockBgBlur={handleToggleClockBgBlur}
        clockBgBlur={clockBgBlur}
        onUpdateClockBgBlur={handleUpdateClockBgBlur}
        etherealClockBgBlurEnabled={etherealClockBgBlurEnabled}
        onToggleEtherealClockBgBlur={handleToggleEtherealClockBgBlur}
        etherealClockBgBlur={etherealClockBgBlur}
        onUpdateEtherealClockBgBlur={handleUpdateEtherealClockBgBlur}
        etherealClockGlowEnabled={etherealClockGlowEnabled}
        onToggleEtherealClockGlow={handleToggleEtherealClockGlow}
      />

      {/* Settings Panel Modal */}
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
        searchCommands={searchCommands}
        onUpdateSearchCommands={handleUpdateSearchCommands}
        searchIconUrl={searchIconUrl}
        onUpdateSearchIcon={handleUpdateSearchIcon}
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
        onUpdateTabTitle={handleUpdateTabTitle}
        tabIcon={tabIcon}
        onUpdateTabIcon={handleUpdateTabIcon}
        croppingImage={croppingImage}
        setCroppingImage={setCroppingImage}
      />
      {/* Spotlight Search Modal */}
      <SpotlightSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        themeColor={themeColor}
        searchCommands={searchCommands}
        opacity={searchBarOpacity}
        bgOpacity={searchBarBgOpacity}
      />
    </div>
  );
}