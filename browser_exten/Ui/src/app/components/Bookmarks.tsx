import { motion } from "motion/react";
import { Github, Twitter, Youtube, Mail, Figma, Dribbble } from "lucide-react";

const BOOKMARKS = [
  { name: "GitHub", icon: Github, url: "https://github.com" },
  { name: "Figma", icon: Figma, url: "https://figma.com" },
  { name: "YouTube", icon: Youtube, url: "https://youtube.com" },
  { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
  { name: "Dribbble", icon: Dribbble, url: "https://dribbble.com" },
  { name: "Mail", icon: Mail, url: "https://mail.google.com" },
];

export function Bookmarks() {
  return (
    <div className="mt-16 flex gap-4 sm:gap-8">
      {BOOKMARKS.map((bookmark, i) => (
        <motion.a
          key={bookmark.name}
          href={bookmark.url}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          whileHover={{ y: -5, scale: 1.05 }}
          className="group flex flex-col items-center gap-3"
        >
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md transition-all group-hover:bg-white/10 group-hover:border-white/30 shadow-xl">
            <bookmark.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white/70 group-hover:text-white" />
          </div>
          <span className="text-xs font-medium tracking-wide text-white/50 opacity-0 transition-all group-hover:opacity-100 drop-shadow-md">
            {bookmark.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}