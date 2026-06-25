import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { SearchCommand } from "../App";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
  searchCommands?: SearchCommand[];
  opacity?: number;
  bgOpacity?: number;
}

export function SpotlightSearch({ isOpen, onClose, themeColor = "#c58bf2", searchCommands = [], opacity = 100, bgOpacity = 40 }: SpotlightSearchProps) {
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
    if (!query.trim()) return;

    // Check if query starts with command syntax (/)
    if (query.startsWith('/')) {
      const parts = query.slice(1).split(' '); // Remove / and split
      const trigger = parts[0].toLowerCase();
      const searchQuery = parts.slice(1).join(' ');

      // Find matching command
      const command = searchCommands.find(cmd => cmd.trigger === trigger);

      if (command) {
        if (command.url.includes('{query}')) {
          if (searchQuery) {
            const url = command.url.replace('{query}', encodeURIComponent(searchQuery));
            window.location.href = url;
            setQuery("");
            onClose();
            return;
          }
        } else {
          // Static navigational shortcut
          window.location.href = command.url;
          setQuery("");
          onClose();
          return;
        }
      }
    }

    // Default: Google search
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    setQuery("");
    onClose();
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
            animate={{ opacity: opacity / 100, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.8 }}
            className="relative w-full max-w-2xl backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden"
            style={{ 
              boxShadow: `0 20px 40px -10px rgba(0,0,0,0.4), 0 0 20px rgba(${rgb}, 0.15)`,
              backgroundColor: `rgba(20, 20, 20, ${bgOpacity / 100})`
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
