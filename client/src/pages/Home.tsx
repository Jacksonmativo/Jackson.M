import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Download, Mail, ArrowRight, Github, Linkedin, Briefcase, MonitorPlay, PencilRuler, Code2, ShieldAlert } from "lucide-react";
import archTheme from "@assets/Architecture-theam_1772726721753.jpg";
import cyberTheme from "@assets/cyber-security-theam_1772726721642.jpg";
import softwareTheme from "@assets/Software-Engineer-theam_1772726721692.jpeg";
import { ProjectModal, type ProjectData } from "@/components/ProjectModal";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { SkillBar } from "@/components/SkillBar";
import { useSubmitContact } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// --- DUMMY DATA ---
const archProjects: ProjectData[] = [
  {
    title: "Modern Minimalist Villa",
    description: "A complete architectural design and rendering for a sustainable, minimalist villa focusing on natural light and raw materials.",
    technologies: ["AutoCAD", "Revit", "Lumion", "Photoshop"],
    theme: "arch",
    image: archTheme, // Using theme image as placeholder
  },
  {
    title: "Urban Commercial Complex",
    description: "Mixed-use commercial building design optimizing flow and space utilization in a dense urban environment.",
    technologies: ["SketchUp", "V-Ray", "Rhino"],
    theme: "arch",
  }
];

const cyberProjects: ProjectData[] = [
  {
    title: "VAPT Assessment",
    description: "Comprehensive Vulnerability Assessment and Penetration Testing for a mid-sized financial institution. Identified 3 critical zero-days.",
    technologies: ["Burp Suite", "Metasploit", "Nmap", "Nessus"],
    theme: "cyber",
  },
  {
    title: "Bug Bounty Hunter",
    description: "Active participant on HackerOne. Successfully reported and helped patch multiple XSS and IDOR vulnerabilities across major platforms.",
    technologies: ["Python scripts", "Wireshark", "OWASP ZAP"],
    theme: "cyber",
    image: cyberTheme,
  }
];

const softProjects: ProjectData[] = [
  {
    title: "PIIShieldPad",
    description: "A secure, encrypted notepad application that automatically detects and redacts Personally Identifiable Information in real-time.",
    technologies: ["React", "TypeScript", "Node.js", "Regex"],
    theme: "soft",
  },
  {
    title: "Network Digital Twin",
    description: "Simulation dashboard visualizing real-time network traffic and anomaly detection using WebSockets and 3D graphs.",
    technologies: ["Next.js", "Three.js", "Python", "WebSockets"],
    theme: "soft",
    image: softwareTheme,
  }
];

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const { toast } = useToast();
  
  // Framer Motion horizontal scroll setup
  // We have 5 sections total (Intro, Arch, Cyber, Soft, Contact). Width = 500vw.
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // Responsive transform: use "0%" to "-80%" on desktop, but might need adjustment for mobile
  // Since each section is 100vw, -80% of 500vw is -400vw, which lands on the last section.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  // Mobile responsiveness: Check if we are on mobile to potentially disable horizontal scroll
  // and just use normal vertical scroll, or keep it if it feels cinematic.
  // For now, we'll keep the horizontal scroll but ensure the sections are properly sized.

  // Contact Form setup
  const contactMutation = useSubmitContact();
  const form = useForm({
    resolver: zodResolver(api.contact.create.input),
    defaultValues: { name: "", email: "", message: "" }
  });

  const onSubmit = form.handleSubmit((data) => {
    contactMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "I'll get back to you soon." });
        form.reset();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  });

  return (
    <div className="bg-black text-white selection:bg-white/30">
      
      {/* Global Navigation Indicator (Optional, but adds to the cinematic feel) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:flex gap-4 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
        {['Intro', 'Architecture', 'Security', 'Engineering', 'Contact'].map((item, i) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <span className="text-xs font-mono text-white/50 uppercase hidden lg:block">{item}</span>
            {i < 4 && <ChevronRight className="w-4 h-4 text-white/20" />}
          </div>
        ))}
      </div>

      {/* The Scroll Container */}
      <div ref={targetRef} className="h-[500vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ x }} className="flex w-[500vw] h-full">
            
            {/* 1. HERO / INTRO SECTION */}
            <section className="w-[100vw] h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-black via-zinc-900 to-black p-8">
              {/* Subtle background particles / stars effect could go here. We'll use simple radial gradients for elegance */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="z-10 text-center max-w-4xl"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter">
                  JACKSON <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">MATIVO</span>
                </h1>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base font-mono text-white/60 mb-8 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><PencilRuler className="w-4 h-4 text-blue-400" /> Architectural Designer</span>
                  <span className="hidden md:inline text-white/20">|</span>
                  <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-green-400" /> Cybersecurity Specialist</span>
                  <span className="hidden md:inline text-white/20">|</span>
                  <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-purple-400" /> Software Engineer</span>
                </div>

                <p className="text-xl md:text-2xl text-white/80 font-light mb-12">
                  Designing Structures. Securing Systems. Engineering the Future.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a href="/attached_assets/JACKSON_MATIVO_RESUME_(2)_1772726721818.pdf" download className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                    <Download className="w-5 h-5" /> Download Resume
                  </a>
                  <div className="flex items-center gap-4 text-white/40 font-mono text-sm animate-pulse">
                    <span>Scroll or Swipe to Explore</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 2. ARCHITECTURE WORLD */}
            <section className="w-[100vw] h-full relative overflow-hidden flex items-center p-8 md:p-24 bg-blueprint-grid">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img src={archTheme} alt="Architecture Theme" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0a192f]/80 to-[#0a192f]/40" />
              </div>

              <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-400 font-mono text-sm mb-6">
                    <PencilRuler className="w-4 h-4" /> 01. Architecture
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold mb-6 text-glow-arch">Spatial<br/>Design</h2>
                  <p className="text-lg text-blue-100/70 mb-8 leading-relaxed">
                    Bridging the gap between conceptual vision and structural reality. My architectural practice focuses on creating sustainable, functional spaces that inspire. I blend traditional drafting techniques with modern 3D visualization.
                  </p>
                  
                  <div className="mb-8">
                    <SkillBar name="AutoCAD & Drafting" percentage={95} theme="arch" delay={0.1} />
                    <SkillBar name="Revit & BIM" percentage={88} theme="arch" delay={0.2} />
                    <SkillBar name="SketchUp & 3D Modeling" percentage={92} theme="arch" delay={0.3} />
                  </div>
                </motion.div>

                <div className="grid gap-6">
                  {archProjects.map((project, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.2 }}
                      onClick={() => setSelectedProject(project)}
                      className="group cursor-pointer glass-panel p-6 rounded-2xl border-blue-400/20 hover:border-blue-400/60 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(96,165,250,0.15)]"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2 font-display">{project.title}</h3>
                      <p className="text-blue-100/60 line-clamp-2 text-sm">{project.description}</p>
                      <div className="mt-4 flex items-center text-blue-400 font-mono text-sm group-hover:gap-3 transition-all">
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. CYBERSECURITY WORLD */}
            <section className="w-[100vw] h-full relative overflow-hidden flex items-center p-8 md:p-24 bg-cyber-grid">
              <div className="absolute inset-0 z-0">
                <img src={cyberTheme} alt="Cybersecurity Theme" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-[#000000]/40" />
                {/* Vignette effect */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none" />
              </div>

              <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="order-2 lg:order-1"
                >
                  <InteractiveTerminal />
                  
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {cyberProjects.map((project, i) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedProject(project)}
                        className="cursor-pointer border border-[#22c55e]/30 bg-[#22c55e]/5 p-4 rounded-lg hover:bg-[#22c55e]/10 transition-colors"
                      >
                        <h4 className="text-[#22c55e] font-mono mb-1">{project.title}</h4>
                        <p className="text-white/40 text-xs line-clamp-2">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="order-1 lg:order-2"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/30 bg-green-400/10 text-green-400 font-mono text-sm mb-6">
                    <ShieldAlert className="w-4 h-4" /> 02. Security
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold mb-6 text-glow-cyber">System<br/>Defense</h2>
                  <p className="text-lg text-green-100/70 mb-8 leading-relaxed">
                    Protecting digital assets through rigorous testing and offensive security strategies. Experience in VAPT, bug bounties, and securing complex enterprise environments.
                  </p>
                  
                  <div className="space-y-4">
                    <SkillBar name="Penetration Testing" percentage={90} theme="cyber" delay={0.1} />
                    <SkillBar name="Vulnerability Assessment" percentage={94} theme="cyber" delay={0.2} />
                    <SkillBar name="Network Security" percentage={85} theme="cyber" delay={0.3} />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 4. SOFTWARE ENGINEERING WORLD */}
            <section className="w-[100vw] h-full relative overflow-hidden flex items-center p-8 md:p-24">
              <div className="absolute inset-0 z-0">
                <img src={softwareTheme} alt="Software Theme" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#170f2e]/90 via-[#0f0920]/90 to-black/90" />
              </div>

              <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/30 bg-purple-400/10 text-purple-400 font-mono text-sm mb-6">
                    <Code2 className="w-4 h-4" /> 03. Engineering
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold mb-6 text-glow-soft">Digital<br/>Creation</h2>
                  <p className="text-lg text-purple-100/70 mb-8 leading-relaxed">
                    Building robust, scalable applications from the ground up. I specialize in modern fullstack development, bringing architectural thinking into software design patterns.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "Python", "Docker"].map(tech => (
                      <span key={tech} className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 font-mono text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <div className="grid gap-6 relative">
                  {/* Decorative code lines floating behind */}
                  <div className="absolute -inset-10 border border-purple-500/10 rounded-[3rem] -z-10 bg-gradient-to-br from-purple-500/5 to-transparent backdrop-blur-3xl hidden md:block transform rotate-3" />
                  
                  {softProjects.map((project, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.2 }}
                      onClick={() => setSelectedProject(project)}
                      className="group cursor-pointer glass-panel p-8 rounded-2xl border-purple-400/20 hover:border-purple-400/60 transition-all hover:shadow-[0_0_40px_rgba(167,139,250,0.15)] relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                      <h3 className="text-2xl font-bold text-white mb-2 font-display">{project.title}</h3>
                      <p className="text-purple-100/60 text-sm mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0,3).map(t => (
                          <span key={t} className="text-xs text-purple-300 font-mono">{t}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. CONTACT & TIMELINE SECTION */}
            <section className="w-[100vw] h-full relative bg-zinc-950 flex flex-col items-center justify-center p-8 md:p-24 overflow-y-auto">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/50 via-zinc-950 to-black pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Timeline / Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl font-bold mb-8 font-display">Journey</h2>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/20 before:via-white/20 before:to-transparent">
                    
                    {/* Timeline Item 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-zinc-900 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.1)] z-10">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-white">Safaricom</h4>
                          <span className="text-xs font-mono text-white/50">2023</span>
                        </div>
                        <p className="text-sm text-white/70">Cybersecurity Intern. Conducted vulnerability assessments and assisted in securing enterprise infrastructure.</p>
                      </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-zinc-900 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <MonitorPlay className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-white">Freelance</h4>
                          <span className="text-xs font-mono text-white/50">2021-Present</span>
                        </div>
                        <p className="text-sm text-white/70">Architectural Designer & Developer. Designing physical spaces and building digital solutions for various clients.</p>
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-4 mt-12">
                    <a href="https://github.com/jacksonmativo" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                      <Github className="w-6 h-6" />
                    </a>
                    <a href="https://linkedin.com/in/jacksonmativo" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a href="mailto:contact@example.com" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                      <Mail className="w-6 h-6" />
                    </a>
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass-panel p-8 rounded-3xl"
                >
                  <h2 className="text-3xl font-bold mb-6 font-display">Initialize Connection</h2>
                  
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <input 
                        {...form.register("name")}
                        placeholder="Your Designation (Name)"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 outline-none transition-all text-white placeholder:text-white/30 font-mono text-sm"
                      />
                      {form.formState.errors.name && <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>}
                    </div>
                    
                    <div>
                      <input 
                        {...form.register("email")}
                        placeholder="Communication Node (Email)"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 outline-none transition-all text-white placeholder:text-white/30 font-mono text-sm"
                      />
                      {form.formState.errors.email && <p className="text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>}
                    </div>

                    <div>
                      <textarea 
                        {...form.register("message")}
                        placeholder="Transmit Payload (Message)"
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/40 outline-none transition-all text-white placeholder:text-white/30 font-mono text-sm resize-none"
                      />
                      {form.formState.errors.message && <p className="text-red-400 text-xs mt-1">{form.formState.errors.message.message}</p>}
                    </div>

                    <button 
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {contactMutation.isPending ? "Transmitting..." : "Execute"}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </motion.div>

              </div>
            </section>

          </motion.div>
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
