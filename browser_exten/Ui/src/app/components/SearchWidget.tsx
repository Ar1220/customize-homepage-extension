import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { SearchCommand } from "../App";
import { executeSearch } from "../utils/search";

interface SearchWidgetProps {
  themeColor?: string;
  isDragMode?: boolean;
  searchCommands?: SearchCommand[];
}

export function SearchWidget({ themeColor = "#c58bf2", isDragMode = false, searchCommands = [] }: SearchWidgetProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      executeSearch(query, searchCommands);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '197, 139, 242';
  };
  const rgb = hexToRgb(themeColor);

  const matchingCommand = searchCommands.find(c => {
    const trimmedQuery = query.trim().toLowerCase();
    return trimmedQuery.startsWith('/' + c.trigger + ' ') || trimmedQuery === '/' + c.trigger;
  });

  return (
    <div
      className={`relative w-full max-w-2xl bg-white/5 backdrop-blur-2xl border rounded-2xl overflow-hidden pointer-events-auto transition-colors duration-300 ${isDragMode ? 'border-white/50' : 'border-white/10'}`}
      style={{ 
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.4), 0 0 20px rgba(${rgb}, 0.15)`
      }}
      onPointerDown={(e) => {
        // Allow input to be focused without dragging
        if (!isDragMode && (e.target as HTMLElement).tagName !== 'INPUT') {
          e.stopPropagation();
        }
      }}
    >
      <form onSubmit={handleSubmit} className="flex items-center px-5 py-4 sm:px-6 sm:py-5">
        {matchingCommand && matchingCommand.iconUrl ? (
          <img 
            src={matchingCommand.iconUrl} 
            alt={matchingCommand.name} 
            className="mr-4 shrink-0 w-[22px] h-[22px] rounded-md object-cover shadow-sm opacity-90 transition-all"
          />
        ) : (
          <Search 
            size={22} 
            className="mr-4 shrink-0 transition-colors duration-300 opacity-80" 
            style={{ color: themeColor }} 
          />
        )}
        
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
