import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { SearchCommand } from "../App";

interface SearchWidgetProps {
  themeColor?: string;
  isDragMode?: boolean;
  opacity?: number;
  bgOpacity?: number;
  searchCommands?: SearchCommand[];
}

export function SearchWidget({ themeColor = "#c58bf2", isDragMode = false, opacity = 100, bgOpacity = 40, searchCommands = [] }: SearchWidgetProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (query.startsWith('/')) {
      const parts = query.slice(1).split(' ');
      const trigger = parts[0].toLowerCase();
      const searchQuery = parts.slice(1).join(' ');

      const command = searchCommands.find(cmd => cmd.trigger === trigger);

      if (command) {
        if (command.url.includes('{query}')) {
          if (searchQuery) {
            window.location.href = command.url.replace('{query}', encodeURIComponent(searchQuery));
            return;
          }
        } else {
          window.location.href = command.url;
          return;
        }
      }
    }

    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '197, 139, 242';
  };
  const rgb = hexToRgb(themeColor);

  return (
    <div
      className={`relative w-full max-w-2xl backdrop-blur-2xl border rounded-2xl overflow-hidden pointer-events-auto transition-colors duration-300 ${isDragMode ? 'border-white/50' : 'border-white/10'}`}
      style={{ 
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.4), 0 0 20px rgba(${rgb}, 0.15)`,
        backgroundColor: `rgba(20, 20, 20, ${bgOpacity / 100})`,
        opacity: opacity / 100
      }}
      onPointerDown={(e) => {
        // Allow input to be focused without dragging
        if (!isDragMode && (e.target as HTMLElement).tagName !== 'INPUT') {
          e.stopPropagation();
        }
      }}
    >
      <form onSubmit={handleSubmit} className="flex items-center px-5 py-4 sm:px-6 sm:py-5">
        {(() => {
          let activeIcon = null;
          if (query.startsWith('/')) {
            const trigger = query.slice(1).split(' ')[0].toLowerCase();
            const cmd = searchCommands.find(c => c.trigger === trigger);
            if (cmd && cmd.iconUrl) {
              activeIcon = cmd.iconUrl;
            }
          }
          
          return activeIcon ? (
            <img 
              src={activeIcon} 
              className="w-5 h-5 object-contain rounded-md animate-fade-in mr-4 shrink-0" 
              alt="command-logo" 
            />
          ) : (
            <Search 
              size={22} 
              className="mr-4 shrink-0 transition-colors duration-300 opacity-80" 
              style={{ color: themeColor }} 
            />
          );
        })()}
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web..."
          className="w-full bg-transparent border-none outline-none text-xl text-white/90 placeholder-white/40 font-space font-light tracking-wide"
          spellCheck={false}
          autoComplete="off"
          disabled={isDragMode}
        />

        {/* Action Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: query.length > 0 ? 1 : 0 }}
          className="hidden sm:flex items-center justify-center px-2.5 py-1 rounded-md bg-white/5 text-white/40 text-[0.65rem] font-space tracking-widest shrink-0 ml-3 border border-white/5"
        >
          ENTER ↵
        </motion.div>
      </form>
    </div>
  );
}
