import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface ClockProps {
  customText1: string;
  customText2: string;
  themeColor?: string;
  textColor?: string;
}

export function Clock({ customText1, customText2, themeColor = "#c58bf2", textColor = "#ffffff" }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDay = (date: Date) => date.getDate().toString().padStart(2, '0');
  const formatMonth = (date: Date) => date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const formatDayOfWeek = (date: Date) => date.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good night,";
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '197, 139, 242';
  };
  const rgb = hexToRgb(themeColor);

  return (
    <div className="relative flex flex-col pointer-events-none select-none">
      
      {/* Main Number Container */}
      <div className="relative inline-block py-4">
        
        {/* Giant Number with vertical gradient fading to transparent */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[16rem] sm:text-[18rem] font-bebas leading-[1] tracking-tight bg-clip-text text-transparent pb-4 transition-colors duration-500"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, ${themeColor}, rgba(${rgb}, 0.5) 60%, transparent)`,
            filter: `drop-shadow(0px 10px 30px rgba(${rgb}, 0.2))` 
          }}
        >
          {formatDay(time)}
        </motion.div>

        {/* Vertical Day of week positioned along the left edge of '1' */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute left-[2.5rem] bottom-[15%] origin-bottom-left -rotate-90 flex items-center"
        >
          <div className="text-[0.6rem] tracking-[0.5em] font-space uppercase drop-shadow-md whitespace-nowrap" style={{ color: `${textColor}CC` }}>
            {formatDayOfWeek(time)}
          </div>
        </motion.div>

        {/* Overlay: Month, Time, Line */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="absolute left-[35%] top-[45%] flex flex-col items-start z-10"
        >
          <div className="text-[5rem] tracking-[0.05em] font-bebas leading-[0.85] drop-shadow-2xl" style={{ color: textColor }}>
            {formatMonth(time)}
          </div>
          
          <div className="flex flex-col items-start mt-2 pointer-events-auto">
            <div className="text-[0.85rem] font-bold tracking-[0.05em] font-space drop-shadow-md" style={{ color: textColor }}>
              {formatTime(time)}
            </div>
            <div className="w-12 h-[2px] mt-3 mb-4 shadow-lg" style={{ backgroundColor: textColor }}></div>
            
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1, delay: 0.4 }}
            >
              <p className="text-[0.85rem] font-space tracking-wide" style={{ color: `${textColor}B3` }}>
                {getGreeting()} <span className="transition-colors duration-500" style={{ color: themeColor }}>{customText1}</span>
              </p>
              <div className="text-[0.7rem] font-space tracking-wider mt-1.5 leading-relaxed whitespace-pre inline-block" style={{ color: `${textColor}80` }}>
                {customText2}
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

    </div>
  );
}