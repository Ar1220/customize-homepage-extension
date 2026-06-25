import { motion } from "motion/react";
import { Search, LayoutGrid } from "lucide-react";

import { Bookmark } from "../App";

const SIDEBAR_ITEMS = [
  { name: "Search", icon: Search },
  { name: "Widgets", icon: LayoutGrid },
];

interface SidebarProps {
  themeColor?: string;
  onSearchClick?: () => void;
  onWidgetsClick?: () => void;
  bookmarks?: Bookmark[];
  searchIconUrl?: string;
  bgOpacity?: number;
}

export function Sidebar({ themeColor = "#c58bf2", onSearchClick, onWidgetsClick, bookmarks = [], searchIconUrl, bgOpacity = 30 }: SidebarProps) {
  // We convert hex to rgb manually or simply use the hex value for drop shadow
  // Tailwind Arbitrary values don't dynamically interpolate `box-shadow` well if we want opacity.
  // Instead we can use inline styles for the complex shadows that require opacity.

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '197, 139, 242';
  };

  const rgb = hexToRgb(themeColor);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="flex flex-col items-center py-6 px-3 rounded-full backdrop-blur-xl border border-white/10 pointer-events-auto"
      style={{ 
        backgroundColor: `rgba(15, 15, 15, ${bgOpacity / 100})`,
        boxShadow: `0 0 20px rgba(${rgb}, 0.15), inset 0 0 20px rgba(${rgb}, 0.1)` 
      }}
    >
      <div className="flex flex-col gap-6 w-full">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSearch = item.name === "Search";
          const isWidgets = item.name === "Widgets";
          return (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.2, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={isSearch ? onSearchClick : (isWidgets ? onWidgetsClick : undefined)}
              className="relative group w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              {isSearch && searchIconUrl ? (
                <img 
                  src={searchIconUrl} 
                  alt="Search" 
                  className="w-full h-full object-cover rounded-md opacity-70 group-hover:opacity-100 transition-opacity" 
                />
              ) : (
                <Icon size={22} strokeWidth={isSearch ? 2.5 : 1.5} />
              )}
              
              {/* Tooltip on hover */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[0.65rem] tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.name}
              </div>
            </motion.button>
          );
        })}
        
        {/* Dynamic Bookmarks */}
        {bookmarks.length > 0 && (
          <div className="flex flex-col gap-6 w-full items-center">
            <div className="w-8 h-[1px] bg-white/10 my-2"></div>
            {bookmarks.map((bookmark) => {
              // Try to get hostname for tooltip and icon extraction
              let domain = bookmark.url;
              let domainName = "link";
              try {
                const urlObj = new URL(bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`);
                domain = urlObj.hostname.replace('www.', '');
                domainName = domain.split('.')[0];
              } catch (e) {
                // Ignore error and use raw url
              }
              
              // First attempt: Iconify Simple Icons for popular brands (matches minimal white aesthetic)
              const iconifyUrl = `https://api.iconify.design/simple-icons:${domainName}.svg?color=white`;
              // Second attempt: Fetch high-quality logo from Clearbit
              const clearbitUrl = `https://logo.clearbit.com/${domain}`;
              // Third attempt: Google Favicon fallback
              const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
              
              const initialUrl = bookmark.iconUrl || iconifyUrl;

              return (
                <motion.a
                  key={bookmark.id}
                  href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative group w-6 h-6 flex items-center justify-center transition-all duration-300"
                >
                  <img 
                    src={initialUrl} 
                    alt={bookmark.name} 
                    className={`w-full h-full opacity-70 group-hover:opacity-100 transition-opacity object-contain`}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!bookmark.iconUrl) {
                        if (img.src.includes('iconify')) {
                          img.src = clearbitUrl;
                          img.className = "w-full h-full opacity-70 group-hover:opacity-100 transition-opacity object-cover rounded-md";
                        } else if (img.src.includes('clearbit')) {
                          // Fallback from Clearbit to Google Favicon
                          img.src = googleFaviconUrl;
                          img.className = "w-full h-full opacity-70 group-hover:opacity-100 transition-opacity object-contain";
                        } else {
                          img.style.display = 'none';
                        }
                      }
                    }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[0.65rem] tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {bookmark.name || domain}
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>

      {/* Decorative vertical lines / rings equivalent */}
      <div className="mt-8 flex flex-col gap-2 items-center">
        <div className="w-[1px] h-8 bg-white/20"></div>
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor, boxShadow: `0 0 8px ${themeColor}` }}></div>
        <div className="w-[1px] h-8 bg-white/20"></div>
      </div>
    </motion.div>
  );
}
