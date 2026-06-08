import { useMemo } from "react";
import { motion } from "motion/react";

export interface AudioWaveformProps {
  color?: string;
}

export function AudioWaveform({ color = "#c58bf2" }: AudioWaveformProps) {
  // Generate random heights and durations once so they don't cause hydration mismatches or jump on re-renders
  const bars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      // Create a curve so the middle bars are generally taller than the edge bars
      const position = i / 41; // 0 to 1
      const distanceToCenter = Math.abs(position - 0.5) * 2; // 0 at center, 1 at edges
      const bellCurve = 1 - Math.pow(distanceToCenter, 1.5); // Smoothed curve

      const minHeight = 10 + Math.random() * 15;
      const maxBase = 40 + Math.random() * 60;
      const maxHeight = Math.max(minHeight + 10, maxBase * bellCurve);
      
      const duration = 0.35 + Math.random() * 0.4;
      
      return { minHeight, maxHeight, duration };
    });
  }, []);

  return (
    <div className="flex items-center justify-center gap-[4px] h-32 px-4 pointer-events-none min-w-[320px]">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{ 
            backgroundColor: color, 
            boxShadow: `0 0 15px ${color}80, 0 0 2px rgba(255,255,255,0.8)`,
            // No background or backdrop-blur on the parent or here, fully transparent background!
          }}
          animate={{
            height: [`${bar.minHeight}%`, `${bar.maxHeight}%`, `${bar.minHeight}%`],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.03 // Slight wave ripple effect
          }}
        />
      ))}
    </div>
  );
}