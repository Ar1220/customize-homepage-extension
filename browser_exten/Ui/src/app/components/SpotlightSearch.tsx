import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { SearchCommand } from "../App";
import { executeSearch } from "../utils/search";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
  searchCommands?: SearchCommand[];
}

export function SpotlightSearch({ isOpen, onClose, themeColor = "#c58bf2", searchCommands = [] }: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      // Add a tiny delay to ensure the component is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      executeSearch(query, searchCommands);
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
          {/* Invisible Backdrop to close on outside click */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-transparent"
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.8 }}
            className="relative w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden"
            style={{ 
              boxShadow: `0 20px 40px -10px rgba(0,0,0,0.4), 0 0 20px rgba(${rgb}, 0.15)`
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
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the web..."
                className="w-full bg-transparent border-none outline-none text-xl text-white/90 placeholder-white/40 font-space font-light tracking-wide"
                spellCheck={false}
                autoComplete="off"
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
