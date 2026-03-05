import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COMMANDS = {
  help: "Available commands: help, about, skills, clear",
  about: "Cybersecurity Specialist focused on Penetration Testing and Bug Bounties. Currently seeking vulnerabilities to make the digital world safer.",
  skills: "Tools: Burp Suite, Nmap, Metasploit, Wireshark, Python, Bash\nDomains: Web App Sec, Network Sec, Cryptography",
};

export function InteractiveTerminal() {
  const [history, setHistory] = useState<{type: 'cmd' | 'out', text: string}[]>([
    { type: 'out', text: 'JacksonOS v2.0.4' },
    { type: 'out', text: 'Initializing security protocols...' },
    { type: 'out', text: 'Type "help" for a list of commands.' }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      setInput("");
      
      if (!cmd) return;

      const newHistory = [...history, { type: 'cmd' as const, text: `root@jmativo:~$ ${cmd}` }];
      
      if (cmd === 'clear') {
        setHistory([]);
        return;
      }

      const response = COMMANDS[cmd as keyof typeof COMMANDS] || `bash: ${cmd}: command not found`;
      
      setHistory([...newHistory, { type: 'out' as const, text: response }]);
    }
  };

  return (
    <div className="w-full h-80 rounded-xl bg-black/80 border border-[#22c55e]/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] overflow-hidden flex flex-col font-mono text-sm">
      {/* Terminal Header */}
      <div className="bg-[#1a1a1a] border-b border-[#22c55e]/20 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-white/50 text-xs">jmativo@cyber-lab ~</span>
      </div>
      
      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {history.map((line, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={i} 
            className={`mb-2 whitespace-pre-line ${line.type === 'cmd' ? 'text-white/80' : 'text-[#22c55e]'}`}
          >
            {line.text}
          </motion.div>
        ))}
        
        <div className="flex items-center text-white/80 mt-2">
          <span className="text-[#22c55e] mr-2">root@jmativo:~$</span>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-[#22c55e] caret-[#22c55e]"
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
