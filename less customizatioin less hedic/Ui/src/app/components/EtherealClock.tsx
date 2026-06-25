import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface EtherealClockProps {
  color?: string;
  transparentBg?: boolean;
}

export function EtherealClock({ color = "#c58bf2", transparentBg = false }: EtherealClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const isAm = hours < 12;
  const hours12 = (hours % 12 || 12).toString().padStart(2, '0');
  
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDate = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div 
      className={`relative flex items-center justify-center p-10 rounded-[3rem] overflow-hidden select-none pointer-events-none group min-w-[420px] ${transparentBg ? '' : 'shadow-2xl'}`}
      style={transparentBg ? {} : {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.005) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        borderRight: '1px solid rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.02)',
        boxShadow: '0 30px 60px -10px rgba(0,0,0,0.6), inset 0 1px 20px rgba(255,255,255,0.03)',
      }}
    >
      
      {/* Light Sweep (Shimmer Effect) */}
      <motion.div 
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12"
      />

      {/* Ambient Pulsing Glow behind text */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.35, 0.1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none mix-blend-screen"
        style={{ 
          backgroundColor: color,
          filter: 'blur(80px)'
        }}
      />
      
      {/* Soft inner vignette overlay */}
      {!transparentBg && (
        <div className="absolute inset-0 rounded-[3rem] pointer-events-none z-0" style={{
          background: 'radial-gradient(150% 150% at 30% 0%, rgba(255,255,255,0.08) 0%, transparent 100%)'
        }} />
      )}

      <div className="relative z-10 flex items-center gap-8">
        
        {/* Hours section: Massive, highly elegant serif */}
        <div className="flex flex-col items-end leading-none">
          <span 
            className="text-[8rem] font-cormorant italic tracking-tighter text-white"
            style={{ 
              textShadow: `0 10px 40px ${color}60, 0 2px 10px rgba(255,255,255,0.2)`,
            }}
          >
            {hours12}
          </span>
        </div>

        {/* Delicate glowing divider */}
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/50 to-transparent relative opacity-70">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], height: ['20%', '80%', '20%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] blur-[3px]" 
            style={{ backgroundColor: color }} 
          />
        </div>

        {/* Minutes & Info section: Clean, geometric sans-serif */}
        <div className="flex flex-col justify-center">
          
          <div className="flex items-baseline gap-3 leading-none mb-1">
            <span 
              className="text-[5.5rem] font-space font-light tracking-tighter text-white"
              style={{ textShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${color}30` }}
            >
              {minutes}
            </span>
            
            <div className="flex flex-col gap-1 pb-4">
              <span 
                className="text-sm font-space font-bold tracking-[0.25em] uppercase" 
                style={{ 
                  color,
                  textShadow: `0 0 15px ${color}60`
                }}
              >
                {isAm ? 'AM' : 'PM'}
              </span>
              <span className="text-xs font-space text-white/50 tracking-[0.2em]" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                {seconds}
              </span>
            </div>
          </div>
          
          {/* Subtle date display */}
          <div className="flex items-center gap-3 text-xs font-space tracking-[0.2em] text-white/70 uppercase ml-1">
            <span className="font-medium text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{dayName}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{monthDate}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}
