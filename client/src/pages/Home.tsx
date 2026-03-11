import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Download, Mail, ArrowRight, Github, Linkedin, Briefcase, PencilRuler, Code2, ShieldAlert, ChevronLeft } from "lucide-react";
import archTheme from "@assets/Architecture-theam_1772726721753.jpg";
import cyberTheme from "@assets/cyber-security-theam_1772726721642.jpg";
import softwareTheme from "@assets/Software-Engineer-theam_1772726721692.jpeg";
import bunga1 from "@assets/Screenshot_20260307_180405_WhatsAppBusiness_1772896024709.jpg";
import bunga2 from "@assets/Screenshot_20260307_180414_WhatsAppBusiness_1772896024768.jpg";
import houseAnimation from "@assets/3D_House_Animation_1773137939467.mp4";
import { ProjectModal, type ProjectData } from "@/components/ProjectModal";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { SkillBar } from "@/components/SkillBar";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { useSubmitContact } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Project data
const archProjects: ProjectData[] = [
  {
    title: "Modern Minimalist Villa",
    description: "A complete architectural design and rendering for a sustainable, minimalist villa focusing on natural light and raw materials.",
    technologies: ["AutoCAD", "Revit", "Lumion", "Photoshop"],
    theme: "arch",
    image: archTheme,
  },
  {
    title: "Mua Bungalow Project",
    description: "Contemporary bungalow design featuring clean lines, spacious interior, and premium finishes.",
    technologies: ["Revit", "SketchUp", "3D Visualization", "CAD"],
    theme: "arch",
    images: [bunga1, bunga2],
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
    description: "Active participant on HackerOne. Successfully reported and helped patch multiple XSS and IDOR vulnerabilities.",
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

type CareerType = "architecture" | "cybersecurity" | "software";

const careers = [
  { id: "architecture", title: "Architecture", icon: PencilRuler, color: "blue" },
  { id: "cybersecurity", title: "Security", icon: ShieldAlert, color: "green" },
  { id: "software", title: "Engineering", icon: Code2, color: "purple" }
];

export default function Home() {
  const [currentCareerIndex, setCurrentCareerIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

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

  // Handle swipe/touch for career navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentCareerIndex < careers.length - 1) {
        setCurrentCareerIndex(currentCareerIndex + 1);
      } else if (diff < 0 && currentCareerIndex > 0) {
        setCurrentCareerIndex(currentCareerIndex - 1);
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentCareerIndex < careers.length - 1) {
        setCurrentCareerIndex(currentCareerIndex + 1);
      } else if (e.key === "ArrowLeft" && currentCareerIndex > 0) {
        setCurrentCareerIndex(currentCareerIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCareerIndex]);

  const renderCareerSection = (index: number) => {
    const career = careers[index];
    
    if (career.id === "architecture") {
      return (
        <ArchitectureSection 
          projects={archProjects}
          onProjectClick={setSelectedProject}
          contactForm={{ form, onSubmit, contactMutation }}
        />
      );
    } else if (career.id === "cybersecurity") {
      return (
        <CybersecuritySection 
          projects={cyberProjects}
          onProjectClick={setSelectedProject}
          contactForm={{ form, onSubmit, contactMutation }}
        />
      );
    } else {
      return (
        <SoftwareSection 
          projects={softProjects}
          onProjectClick={setSelectedProject}
          contactForm={{ form, onSubmit, contactMutation }}
        />
      );
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="relative bg-black text-white w-screen h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Career Navigation Indicator */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 flex gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        {careers.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setCurrentCareerIndex(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              currentCareerIndex === i 
                ? "bg-white/20 border border-white/40" 
                : "hover:bg-white/10"
            }`}
          >
            <c.icon className="w-4 h-4" />
            <span className="text-sm font-mono uppercase hidden sm:inline">{c.title}</span>
          </button>
        ))}
      </div>

      {/* Left/Right Navigation Arrows */}
      {currentCareerIndex > 0 && (
        <button
          onClick={() => setCurrentCareerIndex(currentCareerIndex - 1)}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentCareerIndex < careers.length - 1 && (
        <button
          onClick={() => setCurrentCareerIndex(currentCareerIndex + 1)}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Career Sections with Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCareerIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full overflow-y-auto overflow-x-hidden"
        >
          {renderCareerSection(currentCareerIndex)}
        </motion.div>
      </AnimatePresence>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

// ============ ARCHITECTURE SECTION ============
function ArchitectureSection({ projects, onProjectClick, contactForm }: any) {
  return (
    <div className="w-full bg-gradient-to-b from-[#0a192f] to-black">
      {/* Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img src={archTheme} alt="Architecture" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mb-12 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-400 font-mono text-sm mb-6">
            <PencilRuler className="w-4 h-4" /> Architectural Designer
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-glow-arch">
            Spatial<br/>Design
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Designing Structures. Creating Spaces. Building Dreams.
          </p>
          <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto">
            Explore Projects <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* 3D House Animation Video — full-bleed, edges fade into background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute inset-0 z-0 w-full h-full pointer-events-none"
        >
          <video
            src={houseAnimation}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient fades on all four edges to blend into the section background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-[#0a192f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-transparent to-[#0a192f]" />
          {/* Extra bottom fade to blend into the next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a192f] to-transparent" />
        </motion.div>
      </section>

      {/* About & Skills */}
      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-glow-arch">About My Work</h2>
            <p className="text-lg text-white/70 mb-6 leading-relaxed">
              With six years of self-taught architectural design experience, I specialize in creating sustainable, functional spaces that blend traditional craftsmanship with modern innovation. From residential villas to commercial complexes, every project reflects my commitment to excellence.
            </p>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              I leverage industry-leading tools like AutoCAD, Revit, and SketchUp to transform concepts into stunning visual realities.
            </p>
          </div>
          <div className="space-y-6">
            <SkillBar name="AutoCAD & Drafting" percentage={95} theme="arch" delay={0.1} />
            <SkillBar name="Revit & BIM" percentage={88} theme="arch" delay={0.2} />
            <SkillBar name="SketchUp & 3D Modeling" percentage={92} theme="arch" delay={0.3} />
            <SkillBar name="Design Philosophy" percentage={90} theme="arch" delay={0.4} />
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-glow-arch">Architecture Projects</h2>
          <ProjectCarousel 
            projects={projects}
            theme="arch"
            onProjectClick={onProjectClick}
          />
        </motion.div>
      </section>

      {/* Contact */}
      <ContactSection contactForm={contactForm} theme="arch" />
    </div>
  );
}

// ============ CYBERSECURITY SECTION ============
function CybersecuritySection({ projects, onProjectClick, contactForm }: any) {
  return (
    <div className="w-full bg-black">
      {/* Hero with Three.js Globe Background */}
      <section className="relative w-full h-screen flex items-center justify-center p-8 overflow-hidden">
        <iframe
          src="/cyber-globe.html"
          className="absolute inset-0 w-full h-full border-0"
          style={{ zIndex: 0, pointerEvents: 'none' }}
          title="Cyber Globe"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" style={{ zIndex: 1 }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/30 bg-green-400/10 text-green-400 font-mono text-sm mb-6">
            <ShieldAlert className="w-4 h-4" /> Cybersecurity Specialist
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-glow-cyber">
            System<br/>Defense
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Securing Systems. Uncovering Vulnerabilities. Protecting Assets.
          </p>
          <button className="px-8 py-4 rounded-full bg-green-500 text-black font-bold hover:bg-green-400 transition-all flex items-center gap-2 mx-auto">
            View Security Work <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* Terminal & Skills */}
      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-glow-cyber">Security Expertise</h2>
            <p className="text-lg text-white/70 mb-6 leading-relaxed">
              As a cybersecurity specialist with hands-on experience at Safaricom Kenya, I specialize in vulnerability assessments, penetration testing, and API security. I've identified critical zero-days and helped organizations strengthen their defenses.
            </p>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Currently active in bug bounty hunting on HackerOne, continuously discovering and responsibly disclosing vulnerabilities to improve global security.
            </p>
          </div>
          <div className="space-y-6">
            <SkillBar name="Penetration Testing" percentage={90} theme="cyber" delay={0.1} />
            <SkillBar name="Vulnerability Assessment" percentage={94} theme="cyber" delay={0.2} />
            <SkillBar name="API Security Testing" percentage={92} theme="cyber" delay={0.3} />
            <SkillBar name="Network Security" percentage={85} theme="cyber" delay={0.4} />
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-glow-cyber">Security Projects</h2>
          <ProjectCarousel 
            projects={projects}
            theme="cyber"
            onProjectClick={onProjectClick}
          />
        </motion.div>
      </section>

      {/* Contact */}
      <ContactSection contactForm={contactForm} theme="cyber" />
    </div>
  );
}

// ============ SOFTWARE ENGINEERING SECTION ============
function SoftwareSection({ projects, onProjectClick, contactForm }: any) {
  return (
    <div className="w-full bg-gradient-to-b from-[#170f2e] to-black">
      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={softwareTheme} alt="Software" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/30 bg-purple-400/10 text-purple-400 font-mono text-sm mb-6">
            <Code2 className="w-4 h-4" /> Software Engineer
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-glow-soft">
            Digital<br/>Creation
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Engineering the Future. Building Solutions. Creating Impact.
          </p>
          <button className="px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-600 transition-all flex items-center gap-2 mx-auto">
            Explore Software <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* About & Skills */}
      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-glow-soft">Software Development</h2>
            <p className="text-lg text-white/70 mb-6 leading-relaxed">
              Building robust, scalable applications with modern fullstack technologies. I specialize in React, TypeScript, Node.js, and cloud infrastructure. From privacy-first applications to network visualization systems, I create solutions that matter.
            </p>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              My architectural background brings structured thinking to software design, resulting in elegant, maintainable code and impressive user experiences.
            </p>
          </div>
          <div className="space-y-6">
            <SkillBar name="React & Frontend" percentage={94} theme="soft" delay={0.1} />
            <SkillBar name="Node.js & Backend" percentage={90} theme="soft" delay={0.2} />
            <SkillBar name="TypeScript & Type Safety" percentage={92} theme="soft" delay={0.3} />
            <SkillBar name="Cloud & DevOps" percentage={85} theme="soft" delay={0.4} />
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-glow-soft">Software Projects</h2>
          <ProjectCarousel 
            projects={projects}
            theme="soft"
            onProjectClick={onProjectClick}
          />
        </motion.div>
      </section>

      {/* Contact */}
      <ContactSection contactForm={contactForm} theme="soft" />
    </div>
  );
}

// ============ CONTACT SECTION ============
function ContactSection({ contactForm, theme }: any) {
  const themeColors = {
    arch: "bg-blue-400/10 border-blue-400/30 text-blue-400",
    cyber: "bg-green-400/10 border-green-400/30 text-green-400",
    soft: "bg-purple-400/10 border-purple-400/30 text-purple-400"
  };

  return (
    <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto w-full mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <h2 className={`text-4xl md:text-5xl font-bold mb-12 ${theme === "arch" ? "text-glow-arch" : theme === "cyber" ? "text-glow-cyber" : "text-glow-soft"}`}>
          Get In Touch
        </h2>
        <form onSubmit={contactForm.onSubmit} className="space-y-4 max-w-md">
          <input 
            {...contactForm.form.register("name")}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 outline-none transition-all text-white placeholder:text-white/40"
          />
          <input 
            {...contactForm.form.register("email")}
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 outline-none transition-all text-white placeholder:text-white/40"
          />
          <textarea 
            {...contactForm.form.register("message")}
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 outline-none transition-all text-white placeholder:text-white/40 resize-none"
          />
          <button 
            type="submit"
            disabled={contactForm.contactMutation.isPending}
            className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${themeColors[theme as keyof typeof themeColors]}`}
          >
            {contactForm.contactMutation.isPending ? "Sending..." : "Send Message"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </section>
  );
}
