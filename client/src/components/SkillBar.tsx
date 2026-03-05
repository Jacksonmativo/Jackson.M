import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  percentage: number;
  theme: 'arch' | 'cyber' | 'soft';
  delay?: number;
}

export function SkillBar({ name, percentage, theme, delay = 0 }: SkillBarProps) {
  const colors = {
    arch: "bg-[#60a5fa] shadow-[#60a5fa]",
    cyber: "bg-[#22c55e] shadow-[#22c55e]",
    soft: "bg-[#a78bfa] shadow-[#a78bfa]"
  };

  const bgColors = {
    arch: "bg-[#60a5fa]/20",
    cyber: "bg-[#22c55e]/20",
    soft: "bg-[#a78bfa]/20"
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-mono text-sm text-white/80 uppercase tracking-wider">{name}</span>
        <span className="font-mono text-sm text-white/50">{percentage}%</span>
      </div>
      <div className={`h-2 w-full rounded-full overflow-hidden ${bgColors[theme]}`}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${colors[theme]} shadow-[0_0_10px_currentColor]`}
        />
      </div>
    </div>
  );
}
