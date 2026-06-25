import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, MoreHorizontal, Check, Square } from "lucide-react";

export interface ChecklistWidgetProps {
  color?: string;
  textColor?: string;
  transparentBg?: boolean;
  blur?: number;
  strokeEnabled?: boolean;
  strokeColor?: string;
  bgOpacity?: number;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function ChecklistWidget({
  color = "#c58bf2",
  textColor = "#ffffff",
  transparentBg = false,
  blur = 24,
  strokeEnabled = false,
  strokeColor = "#c58bf2",
  bgOpacity = 30
}: ChecklistWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("homepage_checklist_tasks");
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load checklist tasks", e);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem("homepage_checklist_tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.warn("Failed to save checklist tasks:", error);
    }
  };

  const addTask = () => {
    if (newTaskText.trim() === "") {
      setIsAdding(false);
      return;
    }
    const newTasks = [...tasks, { id: Date.now().toString(), text: newTaskText, completed: false }];
    saveTasks(newTasks);
    setNewTaskText("");
    setIsAdding(false);
    setShowCelebration(false);
  };

  const toggleTask = (id: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(newTasks);
    
    // Check if all are completed now
    const allCompleted = newTasks.length > 0 && newTasks.every(t => t.completed);
    if (allCompleted) {
      setShowCelebration(true);
      // Optional: hide celebration after a few seconds or keep it until a new task is added
    } else {
      setShowCelebration(false);
    }
  };

  const glassStyle: React.CSSProperties = transparentBg ? {} : {
    background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%), rgba(0,0,0,${bgOpacity / 100})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderTop: '1px solid rgba(255,255,255,0.4)',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 30px 60px -10px rgba(0,0,0,0.6), inset 0 1px 20px rgba(255,255,255,0.08)',
  };

  const hasTasks = tasks.length > 0;
  const allCompleted = hasTasks && tasks.every(t => t.completed);

  return (
    <div
      className={`relative flex flex-col p-6 rounded-[2rem] overflow-hidden pointer-events-auto min-w-[320px] max-w-[400px] transition-all duration-500 ${transparentBg ? '' : 'shadow-2xl'}`}
      style={{
        ...glassStyle,
        ...(showCelebration && allCompleted ? {
          background: 'linear-gradient(135deg, rgba(30,30,40,0.9) 0%, rgba(40,30,50,0.9) 100%)',
          boxShadow: `0 0 20px ${color}40`,
        } : {})
      }}
    >
      {/* Animated gradient border for celebration */}
      <AnimatePresence>
        {showCelebration && allCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 rounded-[2rem]"
            style={{
              padding: '3px',
              background: `linear-gradient(45deg, #fb923c, ${color})`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-space font-medium" style={{ color: textColor }}>
            To Do List
          </h2>
          <button
            onClick={() => setIsAdding(true)}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: color, color: '#fff' }}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-white/50 hover:text-white transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
          <AnimatePresence>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                  onPointerDown={(e) => e.stopPropagation()}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-32 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  <button
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      saveTasks([]);
                      setShowMenu(false);
                      setShowCelebration(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 bg-transparent hover:bg-red-500/30 transition-all font-space"
                  >
                    Clear list
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mb-2"
            >
              <div 
                className="flex items-center gap-3 p-3 rounded-xl border bg-black/20"
                style={{ borderColor: color }}
              >
                <Plus size={18} className="text-white/50" />
                <input
                  type="text"
                  autoFocus
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addTask();
                    if (e.key === 'Escape') {
                      setIsAdding(false);
                      setNewTaskText("");
                    }
                  }}
                  onBlur={addTask}
                  onPointerDown={(e) => e.stopPropagation()}
                  placeholder="Add an item"
                  className="bg-transparent border-none outline-none text-sm font-space flex-1 text-white placeholder-white/40"
                />
              </div>
            </motion.div>
          )}

          {(!showCelebration || !allCompleted) && tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 group"
            >
              <button
                onClick={() => toggleTask(task.id)}
                onPointerDown={(e) => e.stopPropagation()}
                className="text-white/60 hover:text-white transition-colors"
              >
                {task.completed ? (
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: color }}>
                    <Check size={14} className="text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded border border-white/40 group-hover:border-white transition-colors" />
                )}
              </button>
              <span 
                className={`text-sm font-space transition-all ${task.completed ? 'line-through text-white/30' : ''}`}
                style={{ color: task.completed ? 'rgba(255,255,255,0.3)' : textColor }}
              >
                {task.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {showCelebration && allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <h3 className="text-xl font-bold mb-1" style={{ 
              background: `linear-gradient(to right, #fb923c, ${color})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Good work
            </h3>
            <p className="text-white/70 font-space text-sm mb-6">All clear</p>
            <div className="text-6xl animate-bounce">
              🦊
            </div>
            <button 
              onClick={() => {
                setTasks(tasks.filter(t => !t.completed));
                setShowCelebration(false);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="mt-6 text-xs text-white/40 hover:text-white/80 uppercase tracking-widest font-space transition-colors"
            >
              Clear completed
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
