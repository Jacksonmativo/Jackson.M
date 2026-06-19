import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Download, Mail, ArrowRight, Github, Linkedin,
  Briefcase, PencilRuler, Code2, ShieldAlert, ChevronLeft,
  Shield, Search, Layers, Lock, GitMerge, AlertTriangle,
  ClipboardCheck, Target, Zap, CheckSquare, FileCheck, X,
  Facebook, Instagram, Play, Leaf, Users
} from "lucide-react";
import { Building2, PenTool, Box, Lightbulb, Award, Clock, Users2 } from "lucide-react";
import archTheme from "@assets/Architecture-theam_1772726721753.jpg";
import cyberTheme from "@assets/cyber-security-theam_1772726721642.jpg";
import softwareTheme from "@assets/Software-Engineer-theam_1772726721692.jpeg";
import bunga1 from "@assets/Screenshot_20260307_180405_WhatsAppBusiness_1772896024709.jpg";
import bunga2 from "@assets/Screenshot_20260307_180414_WhatsAppBusiness_1772896024768.jpg";
import bunga3 from "@assets/IMG-20260130-WA0025(1)_1773289529998.jpg";
import bunga4 from "@assets/IMG-20260130-WA0027(1)_1773289530041.jpg";
import elg1 from "@assets/IMG-20230211-WA0007_1773289895553.jpg";
import elg2 from "@assets/IMG-20230213-WA0006_1773289895604.jpg";
import elg3 from "@assets/IMG-20230211-WA0006_1773289895643.jpg";
import elg4 from "@assets/IMG-20230211-WA0008_1773289895689.jpg";
import elg5 from "@assets/IMG-20251203-WA0003_1773289895726.jpg";
import elg6 from "@assets/IMG-20251203-WA0004_1773289895761.jpg";
import elg7 from "@assets/IMG-20251203-WA0001_1773289895790.jpg";
import elg8 from "@assets/IMG-20251203-WA0002_1773289895820.jpg";
import elg9 from "@assets/IMG-20240416-WA0014_1773289895851.jpg";
import piiShieldCover from "@assets/Secure_AI_interaction_with_PIIShieldPad_1773296871272.png";
import siteOriginCover from "@assets/image_(6)_1773308318134.jpg";
import micro1 from "@assets/Screenshot_20260312_124128_WhatsAppBusiness_1773309027946.jpg";
import micro2 from "@assets/Screenshot_20260312_124152_WhatsAppBusiness_1773309027992.jpg";
import micro3 from "@assets/Screenshot_20260312_124156_WhatsAppBusiness_1773309028053.jpg";
import micro4 from "@assets/Screenshot_20260312_124215_WhatsAppBusiness_1773309027855.jpg";
import limuru1 from "@assets/1000835346.jpg";
import limuru2 from "@assets/1000835352.jpg";
import wamunyu1 from "@assets/1000835623.jpg";
import wamunyu2 from "@assets/1000835632.jpg";
import wamunyu3 from "@assets/1000835649.jpg";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { SkillBar } from "@/components/SkillBar";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { PhotoStack } from "@/components/PhotoStack";
import { GalleryViewer } from "@/components/GalleryViewer";
import { ProjectModal } from "@/components/ProjectModal";
import { HeroCard } from "./hero";
import { useSubmitContact } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import bgImage from "@assets/BG.jpeg";
import bg1Image from "@assets/bg1.jpeg";
import bg2Image from "@assets/bg2.jpeg";

// ─── Project data ────────────────────────────────────────────────────────────

const archProjects: ProjectData[] = [
  {
    title: "Modern Minimalist Villa",
    description:
      "A complete architectural design and rendering for a sustainable, minimalist villa focusing on natural light and raw materials.",
    technologies: ["AutoCAD", "Revit", "Lumion", "Photoshop"],
    theme: "arch",
    image: archTheme,
  },
  {
    title: "Mua Bungalow Project",
    description:
      "Contemporary bungalow design featuring clean lines, spacious interior, and premium finishes.",
    technologies: ["Revit", "SketchUp", "3D Visualization", "CAD"],
    theme: "arch",
    images: [bunga1, bunga2, bunga3, bunga4],
  },
  {
    title: "Micro Centre",
    description:
      "A concept design for a computer and electronics retail store inspired by the iconic form of the NVIDIA RTX 4090 GPU. The building's roofline and aerial footprint mirror the card's distinctive triple-fan shroud, blending tech culture with architectural expression.",
    technologies: ["SketchUp", "Lumion", "3D Rendering", "Concept Design"],
    theme: "arch",
    images: [micro1, micro2, micro3, micro4],
  },
  {
    title: "Elgeiyo Marakwet Project",
    description:
      "A striking residential design for Elgeiyo Marakwet County featuring a distinctive curved roofline, large glazed gable, and rich stone masonry. The project blends bold architectural expression with local craftsmanship, documented from 3D concept renders through to full construction completion.",
    technologies: ["AutoCAD", "SketchUp", "3D Rendering", "Site Supervision"],
    theme: "arch",
    images: [elg1, elg2, elg3, elg4, elg5, elg6, elg7, elg8, elg9],
  },
  {
    title: "One Bedroom at Limuru",
    description:
      "A compact yet elegant one-bedroom residential design in Limuru, featuring efficient space planning, modern finishes, and seamless indoor-outdoor flow. Perfect for first-time buyers or investment properties.",
    technologies: ["SketchUp", "AutoCAD", "3D Visualization", "Concept Design"],
    theme: "arch",
    images: [limuru1, limuru2],
  },
  {
    title: "Four Bedroom Maisonette at Wamunyu",
    description:
      "A spacious and modern four-bedroom maisonette design in Wamunyu featuring open-plan living, contemporary finishes, and optimal natural lighting. Designed for comfort and functionality with excellent investment potential.",
    technologies: ["SketchUp", "AutoCAD", "3D Visualization", "Residential Design"],
    theme: "arch",
    images: [wamunyu1, wamunyu2, wamunyu3],
  },
];

const cyberProjects: ProjectData[] = [
  {
    title: "VAPT Assessment",
    description:
      "Comprehensive Vulnerability Assessment and Penetration Testing for a mid-sized financial institution. Identified 3 critical zero-days.",
    technologies: ["Burp Suite", "Metasploit", "Nmap", "Nessus"],
    theme: "cyber",
  },
  {
    title: "Bug Bounty Hunter",
    description:
      "Active participant on HackerOne. Successfully reported and helped patch multiple XSS and IDOR vulnerabilities.",
    technologies: ["Python scripts", "Wireshark", "OWASP ZAP"],
    theme: "cyber",
    image: cyberTheme,
  },
];

const softProjects: ProjectData[] = [
  {
    title: "PIIShieldPad",
    description:
      "A secure, encrypted notepad application that automatically detects and redacts Personally Identifiable Information in real-time.",
    technologies: ["React", "TypeScript", "Node.js", "Regex"],
    theme: "soft",
    image: piiShieldCover,
  },
  {
    title: "Network Digital Twin",
    description:
      "Simulation dashboard visualizing real-time network traffic and anomaly detection using WebSockets and 3D graphs.",
    technologies: ["Next.js", "Three.js", "Python", "WebSockets"],
    theme: "soft",
    image: softwareTheme,
  },
  {
    title: "SiteOrigin Checker",
    description:
      "A browser extension that evaluates the authenticity of every website listed in a search results page. Analyses Domain Age, TLS/SSL certificate validity, issuer, and expiry, then produces a Composite Score — a weighted overall trust percentage.",
    technologies: ["JavaScript", "Browser Extension API", "TLS/SSL", "DNS Lookup"],
    theme: "soft",
    image: siteOriginCover,
    githubUrl: "https://github.com/Jacksonmativo/SiteOrigin-Checker",
    demoUrl: "https://share.google/DQjXZTkOxI2Kfjoau",
  },
];

// ─── Cyber services data ─────────────────────────────────────────────────────

interface CyberService {
  num: string;
  icon: React.ElementType;
  name: string;
  tagline: string;
  desc: string;
  bullets: string[];
  ideal: string;
}

const cyberServices: CyberService[] = [
  {
    num: "01",
    icon: Shield,
    name: "Security & Privacy by Design Assurance",
    tagline: "Risks caught before they cost you",
    desc: "Rigorous technical evaluations of your SPDA processes across all active client projects, reviewing how your team thinks about security from the earliest design phase — not as an afterthought.",
    bullets: [
      "Evaluation of existing SPDA frameworks and documentation",
      "Gap analysis against ISO 27001, GDPR, and sector-specific standards",
      "Actionable remediation roadmap with prioritised findings",
      "Ongoing advisory to embed security culture across teams",
    ],
    ideal: "Founders preparing for enterprise client audits or regulatory certification.",
  },
  {
    num: "02",
    icon: Layers,
    name: "Security-by-Design Architecture",
    tagline: "Secure from the first line of code",
    desc: "Security is most effective when baked into solution architecture from day one. We embed security-by-design principles into every layer of your system blueprints and implementation plans.",
    bullets: [
      "Secure architecture review for cloud, on-premise, and hybrid deployments",
      "Threat-informed design patterns: Zero Trust, least-privilege, defence-in-depth",
      "Security controls mapped to business requirements",
      "Developer guidance and secure coding standards documentation",
    ],
    ideal: "Startups building their first production system or refactoring a legacy one.",
  },
  {
    num: "03",
    icon: Search,
    name: "Security Assessment of Systems & APIs",
    tagline: "Know your attack surface",
    desc: "A comprehensive security assessment surfaces vulnerabilities in your systems, applications, and APIs before attackers do — combining automated scanning with expert-led manual analysis.",
    bullets: [
      "Web application security testing (OWASP Top 10)",
      "REST and GraphQL API security review",
      "Infrastructure and cloud configuration assessment",
      "Detailed findings report with CVSS-scored vulnerabilities",
    ],
    ideal: "Applications approaching launch, post-breach reviews, or investor due-diligence.",
  },
  {
    num: "04",
    icon: Zap,
    name: "Scalable Cybersecurity Solutions Design",
    tagline: "Built for your regulatory environment",
    desc: "We design and implement cybersecurity solutions that are proportionate, scalable, and aligned to both client expectations and applicable regulations.",
    bullets: [
      "Custom security programme design for your industry vertical",
      "Regulatory compliance mapping (GDPR, PCI-DSS, HIPAA, Kenya Data Protection Act)",
      "Security tooling selection and integration roadmap",
      "Scalability planning as your user base and data footprint grows",
    ],
    ideal: "Startups entering regulated markets or seeking enterprise-grade trust signals.",
  },
  {
    num: "05",
    icon: GitMerge,
    name: "Secure Integration Collaboration",
    tagline: "Engineering & delivery alignment",
    desc: "We work alongside your engineering and delivery teams to embed security checkpoints throughout the development and deployment lifecycle.",
    bullets: [
      "CI/CD pipeline security review and hardening",
      "Secure code review integrated into pull-request workflows",
      "Third-party and vendor integration risk assessments",
      "Security champions programme setup for your engineering team",
    ],
    ideal: "Teams adopting DevSecOps or onboarding new third-party services.",
  },
  {
    num: "06",
    icon: AlertTriangle,
    name: "Threat Modelling & Risk Integration",
    tagline: "Proactive, lifecycle-wide protection",
    desc: "We integrate threat modelling and risk assessments directly into your system design and development lifecycles so risks are identified and mitigated continuously — not post-launch.",
    bullets: [
      "STRIDE / PASTA threat modelling workshops",
      "Risk register creation and maintenance",
      "Attack surface mapping and threat actor profiling",
      "Integration with project management and sprint workflows",
    ],
    ideal: "Product teams building features that handle sensitive user data or payments.",
  },
  {
    num: "07",
    icon: ClipboardCheck,
    name: "Pre-Implementation Security Reviews",
    tagline: "Zero surprises at launch",
    desc: "Before any major system goes live, we conduct structured security reviews to identify Material, Procedural, and Administrative risks that could cause harm post-deployment.",
    bullets: [
      "Material risk: technical vulnerabilities in code and infrastructure",
      "Procedural risk: weaknesses in processes, access controls, and policies",
      "Administrative risk: governance gaps and documentation deficiencies",
      "Sign-off report suitable for stakeholder and board review",
    ],
    ideal: "Any project with a defined go-live date seeking a formal security gate.",
  },
  {
    num: "08",
    icon: Target,
    name: "Penetration Testing (Internal & External)",
    tagline: "Real-world attack simulation",
    desc: "Penetration testing simulates real-world attacks to uncover exploitable vulnerabilities before a malicious actor does, covering internal and external perimeters with optional post-deployment validation.",
    bullets: [
      "Black-box, grey-box, and white-box testing options",
      "Internal network and Active Directory penetration testing",
      "External perimeter, web app, and API penetration testing",
      "Executive summary, technical report, and optional re-test post-remediation",
    ],
    ideal: "Businesses handling payments, health data, or enterprise client information.",
  },
  {
    num: "09",
    icon: Zap,
    name: "Attack Scenario Simulation",
    tagline: "Control effectiveness validated",
    desc: "Attack scenario simulation stress-tests your security controls under realistic, adversary-informed conditions — assessing whether your defences can detect and respond to real threats.",
    bullets: [
      "Phishing and social engineering simulations",
      "Lateral movement and privilege escalation scenarios",
      "Data exfiltration and ransomware simulation (safe, controlled)",
      "Security Operations Centre (SOC) detection capability assessment",
    ],
    ideal: "Organisations wanting to validate their incident response and detection posture.",
  },
  {
    num: "10",
    icon: CheckSquare,
    name: "Automated & Manual Security Testing",
    tagline: "Comprehensive coverage, every time",
    desc: "We combine automated security scanning speed with expert manual testing creativity to achieve comprehensive coverage that neither approach delivers alone.",
    bullets: [
      "DAST (Dynamic Application Security Testing) with leading tooling",
      "SAST (Static Application Security Testing) integrated into CI pipelines",
      "Manual expert review for logic flaws automated tools miss",
      "Continuous testing options for iterative development teams",
    ],
    ideal: "Agile teams shipping frequent releases who need security in every sprint.",
  },
  {
    num: "11",
    icon: FileCheck,
    name: "Compliance & Deliverable Standards",
    tagline: "Meet every regulatory bar",
    desc: "Every deliverable is benchmarked against defined security standards and compliance requirements, ensuring what you ship meets the bar your clients and regulators expect.",
    bullets: [
      "Compliance checklists for GDPR, ISO 27001, SOC 2, and local regulations",
      "Security acceptance criteria embedded in project deliverables",
      "Audit-ready documentation and evidence packs",
      "Ongoing compliance monitoring and advisory retainer options",
    ],
    ideal: "Startups pursuing enterprise contracts, certifications, or investor readiness.",
  },
];

const whyPoints = [
  { label: "STARTUP-NATIVE MINDSET", text: "Security advice calibrated to your actual risk, not a generic enterprise checklist." },
  { label: "END-TO-END COVERAGE", text: "From design to deployment to post-launch — one expert across the full lifecycle." },
  { label: "PLAIN-LANGUAGE REPORTING", text: "Findings explained clearly for both technical and non-technical stakeholders." },
  { label: "REGULATORY AWARENESS", text: "GDPR, Kenya Data Protection Act, PCI-DSS, and emerging African frameworks." },
  { label: "FLEXIBLE ENGAGEMENTS", text: "Project-based, retainer, or on-demand — structured around how you work." },
  { label: "ACTIONABLE, NOT ADVISORY", text: "Every engagement ends with clear, prioritised steps your team can execute." },
];

const processSteps = [
  { n: "01", label: "Discovery Call" },
  { n: "02", label: "Scope & Proposal" },
  { n: "03", label: "Kick-off" },
  { n: "04", label: "Delivery" },
  { n: "05", label: "Reporting" },
  { n: "06", label: "Remediation" },
];

// ─── Career navigation ────────────────────────────────────────────────────────

type CareerType = "architecture" | "cybersecurity" | "software";

const careers = [
  { id: "architecture", title: "Architecture", icon: PencilRuler, color: "blue" },
  { id: "cybersecurity", title: "Security", icon: ShieldAlert, color: "red" },
  { id: "software", title: "Engineering", icon: Code2, color: "purple" },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [currentCareerIndex, setCurrentCareerIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const careerScrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const contactMutation = useSubmitContact();
  const form = useForm({
    resolver: zodResolver(api.contact.create.input),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = form.handleSubmit((data) => {
    contactMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "I'll get back to you soon." });
        form.reset();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      },
    });
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentCareerIndex < careers.length - 1) setCurrentCareerIndex((i) => i + 1);
      else if (diff < 0 && currentCareerIndex > 0) setCurrentCareerIndex((i) => i - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentCareerIndex < careers.length - 1)
        setCurrentCareerIndex((i) => i + 1);
      else if (e.key === "ArrowLeft" && currentCareerIndex > 0)
        setCurrentCareerIndex((i) => i - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCareerIndex]);

  const renderCareerSection = (index: number) => {
    const career = careers[index];
    const contactForm = { form, onSubmit, contactMutation };
    if (career.id === "architecture")
      return <ArchitectureSection projects={archProjects} onProjectClick={setSelectedProject} contactForm={contactForm} scrollerRef={careerScrollRef} />;
    if (career.id === "cybersecurity")
      return <CybersecuritySection projects={cyberProjects} onProjectClick={setSelectedProject} contactForm={contactForm} />;
    return <SoftwareSection projects={softProjects} onProjectClick={setSelectedProject} contactForm={contactForm} />;
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative bg-black text-white w-screen h-screen overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hero Section */}
      {currentCareerIndex === 2 && (
        <section className="w-full h-screen flex items-center justify-center relative">
          <HeroCard />
        </section>
      )}

      {/* Top nav */}
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

      {/* Arrow nav */}
      {currentCareerIndex > 0 && (
        <button
          onClick={() => setCurrentCareerIndex((i) => i - 1)}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentCareerIndex < careers.length - 1 && (
        <button
          onClick={() => setCurrentCareerIndex((i) => i + 1)}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Career sections */}
      <AnimatePresence mode="wait">
        <motion.div
          ref={careerScrollRef}
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

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

// ─── ARCHITECTURE feature bar data ───────────────────────────────────────────

const archFeatures = [
  {
    icon: PencilRuler,
    title: "Innovative Design",
    desc: "Creative & functional architectural solutions.",
  },
  {
    icon: Shield,
    title: "Quality & Durability",
    desc: "High-quality materials and lasting structures.",
  },
  {
    icon: Leaf,
    title: "Sustainable Approach",
    desc: "Eco-friendly designs for a better tomorrow.",
  },
  {
    icon: Users,
    title: "Client Focused",
    desc: "Your vision, our priority from concept to creation.",
  },
];

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Instagram, href: "#" },
];

// ─── Animated heading line ───────────────────────────────────────────────────
// Each line clips from below (overflow-hidden) and fades+slides up 0.8s

function AnimLine({
  children,
  delay,
  visible,
  blue = false,
}: {
  children: React.ReactNode;
  delay: number;
  visible: boolean;
  blue?: boolean;
}) {
  return (
    <div className="overflow-hidden leading-none pb-2">
      <div
        style={{
          transform: visible ? "translateY(0)" : "translateX(105%)",
          opacity: visible ? 1 : 0,
          transition: visible
            ? `transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s,
               opacity 0.5s ease ${delay}s`
            : "none",
          fontSize: "clamp(1.1rem, 5.5vw, 4.5rem)",
        }}
        className={`font-black leading-tight whitespace-nowrap ${
          blue ? "text-blue-400" : "text-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// "Building Dreams." pulsing blue glow — only starts after text is visible
function GlowLine({ visible }: { visible: boolean }) {
  return (
    <div className="overflow-hidden leading-none pb-2">
      <motion.div
        style={{
          transform: visible ? "translateY(0)" : "translateX(105%)",
          opacity: visible ? 1 : 0,
          transition: visible
            ? `transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s,
               opacity 0.5s ease 0.4s`
            : "none",
          fontSize: "clamp(1.1rem, 5.5vw, 4.5rem)",
        }}
        className="font-black leading-tight whitespace-nowrap text-blue-800"
      >
        Building Dreams.
      </motion.div>
    </div>
  );
}

// ─── ARCHITECTURE ─────────────────────────────────────────────────────────────

function SkillCard({
  icon: Icon,
  name,
  percentage,
  delay,
}: {
  icon: React.ElementType;
  name: string;
  percentage: number;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * percentage));
      if (progress < 1) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, percentage, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 overflow-hidden cursor-default"
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(96,165,250,0.12) 0%, transparent 70%)" }}
      />
      {/* top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl border border-blue-400/25 bg-blue-400/10 flex items-center justify-center group-hover:border-blue-400/50 group-hover:bg-blue-400/20 transition-all duration-300">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white tabular-nums">{count}</span>
          <span className="text-blue-400 font-bold text-lg">%</span>
        </div>
      </div>

      <p className="text-white font-semibold text-sm mb-3">{name}</p>

      {/* segmented blueprint bar */}
      <div className="flex gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-sm transition-all duration-75"
            style={{
              backgroundColor:
                inView && (i / 20) * 100 <= (count)
                  ? i < 14 ? "rgba(96,165,250,0.9)" : "rgba(147,197,253,0.6)"
                  : "rgba(255,255,255,0.08)",
              transitionDelay: inView ? `${delay * 1000 + i * 40}ms` : "0ms",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ArchitectureSection({ projects, onProjectClick, contactForm, scrollerRef }: any) {
  const introRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  // scrollUnlocked becomes true after the desktop scroll-merge finishes
  const [scrollUnlocked, setScrollUnlocked] = useState(false);

  // ── Mobile detection: render a clean stacked layout on phones ──
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  // panoAspect = the WIDTH/HEIGHT ratio of the whole panorama area.
  // Because each half is exactly w-1/2, the area aspect is (2 * halfW) / halfH.
  // Giving the area this exact ratio means object-cover never zooms/crops the
  // halves on mobile — they fit perfectly and join into one horizontal image.
  const [panoAspect, setPanoAspect] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Measure the real dimensions of one half so the mobile area matches it.
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setPanoAspect((2 * img.naturalWidth) / img.naturalHeight);
      }
    };
    img.src = bg1Image;
  }, []);

  // ── Desktop-only scroll-driven merge animation ──
  useEffect(() => {
    if (isMobile) return;
    const el = introRef.current;
    const scroller = scrollerRef?.current;
    if (!el || !scroller) return;

    const handleScroll = () => {
      const scrollable = el.offsetHeight - scroller.clientHeight;
      if (scrollable <= 0) return;
      const raw = Math.max(0, Math.min(1, scroller.scrollTop / scrollable));
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(eased);

      if (raw >= 0.97 && !scrollUnlocked) {
        setTextVisible(true);
      }
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [isMobile, scrollUnlocked, scrollerRef]);

  // Desktop: fade out → collapse layout → fade back in, no blink
  useEffect(() => {
    if (isMobile) return;
    if (!textVisible) return;
    const scroller = scrollerRef?.current;
    const sticky = stickyRef?.current;
    if (!scroller || !sticky) return;

    const prev = scroller.style.overflowY;
    scroller.style.overflowY = "hidden";

    const t = setTimeout(() => {
      scroller.style.overflowY = prev || "auto";
      setScrollUnlocked(true);
    }, 2400);

    return () => clearTimeout(t);
  }, [isMobile, textVisible, scrollerRef]);

  const offset = progress * 100;

  return (
    <div className="w-full">

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE INTRO
          • Panorama sits at the TOP at its TRUE aspect ratio — no stretch,
            no crop. bg1 (left half) + bg2 (right half) slide in to meet and
            form one seamless horizontal image.
          • Hero text OVERLAYS the image (like the screenshot), with a soft
            gradient scrim so it stays readable.
          • Feature cards follow below the image.
      ══════════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="w-full bg-black">

          {/* Panorama — aspect-ratio keeps the image its natural shape */}
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: panoAspect || 2.4 }}
          >
            {/* base bg, visible behind the halves while they slide in */}
            <img
              src={bgImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* LEFT half — slides down from above */}
            <motion.div
              className="absolute left-0 top-0 w-1/2 h-full overflow-hidden z-10"
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => setTextVisible(true)}
            >
              <img
                src={bg1Image}
                alt=""
                className="w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />
            </motion.div>

            {/* RIGHT half — slides up from below */}
            <motion.div
              className="absolute right-0 top-0 w-1/2 h-full overflow-hidden z-10"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={bg2Image}
                alt=""
                className="w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />
            </motion.div>

            {/* Readability scrim — darkens the left/bottom where the text sits */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 75%)",
              }}
            />

            {/* Hero text — OVERLAID on the image */}
            <div className="absolute inset-0 z-30 flex items-center px-4 pt-10">
              <div className="w-full">
                <div
                  style={{
                    opacity: textVisible ? 1 : 0,
                    transform: textVisible ? "translateY(0)" : "translateY(12px)",
                    transition: textVisible
                      ? "opacity 0.5s ease, transform 0.5s ease"
                      : "none",
                  }}
                  className="inline-flex items-center gap-2 mb-2"
                >
                  <span className="w-1 h-4 bg-blue-800 rounded-full" />
                  <span className="text-white/80 font-mono text-[9px] tracking-widest uppercase">
                    We Design. You Dream. We Build.
                  </span>
                </div>

                <div className="space-y-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  <AnimLine visible={textVisible} delay={0}>Designing Structures.</AnimLine>
                  <AnimLine visible={textVisible} delay={0.2}>Creating Spaces.</AnimLine>
                  <GlowLine visible={textVisible} />
                </div>
              </div>
            </div>
          </div>

          {/* Feature cards — follow below the image */}
          <div
            className="bg-black/95 border-t border-white/10"
            style={{
              opacity: textVisible ? 1 : 0,
              transition: textVisible ? "opacity 0.7s ease 0.3s" : "none",
            }}
          >
            <div className="grid grid-cols-2">
              {archFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className={`flex items-start gap-2 px-3 py-3
                      ${i % 2 === 0 ? "border-r border-white/10" : ""}
                      ${i < 2 ? "border-b border-white/10" : ""}
                    `}
                  >
                    <div className="w-7 h-7 rounded-full border border-blue-400/30 bg-blue-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3 h-3 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-[11px] leading-tight">{f.title}</p>
                      <p className="text-white/45 text-[10px] leading-snug mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP INTRO — original scroll-driven merge (unchanged)
      ══════════════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <div
          ref={introRef}
          style={{ height: "250vh" }}
          className="relative"
        >
          {/* sticky wrapper */}
          <div
            ref={stickyRef}
            className="sticky top-0 h-screen overflow-hidden flex flex-col"
          >

            {/* ── IMAGE AREA ── */}
            <div className="relative flex-1 overflow-hidden min-h-0">

              {/* LAYER 0 — base bg */}
              <img src={bgImage} alt=""
                className="absolute inset-0 w-full h-full object-cover z-0" />

              {/* LAYER 1 — bg1: LEFT half, slides down */}
              <div
                className="absolute left-0 w-1/2 z-10 overflow-hidden"
                style={{
                  top: "-100%",
                  height: "100%",
                  transform: `translateY(${offset}%)`,
                  willChange: "transform",
                }}
              >
                <img
                  src={bg1Image} alt=""
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "right center" }}
                />
              </div>

              {/* LAYER 2 — bg2: RIGHT half, slides up */}
              <div
                className="absolute right-0 w-1/2 z-10 overflow-hidden"
                style={{
                  bottom: "-100%",
                  height: "100%",
                  transform: `translateY(${-offset}%)`,
                  willChange: "transform",
                }}
              >
                <img
                  src={bg2Image} alt=""
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "left center" }}
                />
              </div>

              {/* LAYER 3 — hero text UI */}
              <div className="absolute inset-0 z-20 flex flex-col">

                {/* Social icons */}
                <div
                  className="flex absolute left-5 top-1/2 -translate-y-1/2 flex-col gap-5"
                  style={{
                    opacity: textVisible ? 1 : 0,
                    transition: textVisible ? "opacity 0.6s ease 1.7s" : "none",
                  }}
                >
                  {socialLinks.map(({ icon: Icon, href }, i) => (
                    <a key={i} href={href}
                      className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-blue-500/30 hover:border-blue-400/50 transition-all">
                      <Icon className="w-3.5 h-3.5 text-white/70" />
                    </a>
                  ))}
                </div>

                {/* Main text */}
                <div className="flex-1 flex items-center pl-24 pr-8 pt-16">
                  <div className="w-full">
                    <div
                      style={{
                        opacity: textVisible ? 1 : 0,
                        transform: textVisible ? "translateY(0)" : "translateY(12px)",
                        transition: textVisible ? "opacity 0.5s ease 0s, transform 0.5s ease 0s" : "none",
                      }}
                      className="inline-flex items-center gap-2 mb-6"
                    >
                      <span className="w-1 h-6 bg-blue-800 rounded-full" />
                      <span className="text-white/80 font-mono text-sm tracking-widest uppercase">
                        We Design. You Dream. We Build.
                      </span>
                    </div>

                    <div className="mb-6 space-y-0">
                      <AnimLine visible={textVisible} delay={0}>Designing Structures.</AnimLine>
                      <AnimLine visible={textVisible} delay={0.2}>Creating Spaces.</AnimLine>
                      <GlowLine visible={textVisible} />
                    </div>
                  </div>
                </div>

                {/* Right arrow */}
                <div
                  className="block absolute right-8 top-1/2 -translate-y-1/2"
                  style={{
                    opacity: textVisible ? 1 : 0,
                    transition: textVisible ? "opacity 0.6s ease 1.7s" : "none",
                  }}
                >
                  <button className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/15 transition-all">
                    <ChevronRight className="w-5 h-5 text-white/70" />
                  </button>
                </div>

                {/* Feature bar pinned to bottom */}
                <div
                  className="flex items-stretch border-t border-white/10 bg-black/40 backdrop-blur-md"
                  style={{
                    opacity: textVisible ? 1 : 0,
                    transform: textVisible ? "translateY(0)" : "translateY(20px)",
                    transition: textVisible
                      ? "opacity 0.7s ease 1.6s, transform 0.7s ease 1.6s"
                      : "none",
                  }}
                >
                  {archFeatures.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title}
                        className={`flex items-center gap-4 flex-1 px-5 py-4 ${i < archFeatures.length - 1 ? "border-r border-white/10" : ""}`}>
                        <div className="w-10 h-10 rounded-full border border-blue-400/30 bg-blue-400/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{f.title}</p>
                          <p className="text-white/45 text-xs leading-snug mt-0.5">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-3 px-5 border-l border-white/10 flex-shrink-0">
                    <div className="w-7 h-10 rounded-full border border-white/30 flex flex-col items-center justify-start pt-1.5 gap-1">
                      <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
                    </div>
                    <div className="text-white/50 text-[10px] leading-tight">
                      <p className="font-semibold">Scroll Down</p>
                      <p>to Explore</p>
                    </div>
                  </div>
                </div>

              </div>
              {/* end LAYER 3 */}

              {/* Scroll cue */}
              <div
                className="absolute bottom-24 inset-x-0 flex justify-center z-30 pointer-events-none"
                style={{ opacity: Math.max(0, 1 - progress * 6) }}
              >
                <div className="flex flex-col items-center gap-2 text-white/50 text-xs tracking-widest uppercase">
                  <span>Scroll</span>
                  <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
                    <path d="M8 0v20M1 13l7 7 7-7" />
                  </svg>
                </div>
              </div>

            </div>
            {/* end IMAGE AREA */}

          </div>
        </div>
      )}
      {/* ══════════════════════════════ END ANIMATED INTRO ══════════════════ */}

      {/* ── Featured Work ──────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-gray/10 backdrop-blur-sm py-2 overflow-hidden">
        <div className="w-full px-8">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-2xl md:text-3xl font-bold mb-12 text-glow-arch"
          >
            Featured Work
          </motion.h3>
          <div className="relative h-64 flex items-center overflow-hidden">
            <motion.div
              animate={{ x: [-100, -800] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 min-w-max"
            >
              {[...archProjects.filter((p) => p.images), ...archProjects.filter((p) => p.images)].map(
                (project, idx) => (
                  <div key={`${project.title}-${idx}`} className="flex-shrink-0 w-56">
                    <PhotoStack
                      images={project.images || []}
                      alt={project.title}
                      onOpenGallery={() => onProjectClick(project)}
                      isGalleryOpen={false}
                      theme="arch"
                    />
                    <p className="text-center text-sm text-white/70 mt-4 font-semibold">{project.title}</p>
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-gradient-to-b from-[#0a192f] to-black min-h-screen flex items-center py-24 overflow-hidden">

        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[clamp(80px,18vw,220px)] font-black text-white/[0.03] tracking-widest uppercase leading-none blur-[2px]">
            ARCHITECT
          </span>
        </div>

        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial blue glow top-left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }}
        />
        {/* Radial glow bottom-right */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 w-full px-8 md:px-16 max-w-7xl mx-auto">

          {/* ── Top row: text + stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">

            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-blue-400" />
                <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">About My Work</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-glow-arch leading-tight">
                Crafting Spaces<br />That Inspire
              </h2>

              <p className="text-lg text-white/60 mb-5 leading-relaxed max-w-lg">
                With six years of self-taught architectural design experience, I specialize in creating{" "}
                <span className="text-blue-400 font-semibold">sustainable, functional spaces</span>{" "}
                that blend traditional craftsmanship with modern innovation.
              </p>
              <p className="text-lg text-white/60 leading-relaxed max-w-lg">
                I leverage industry-leading tools like{" "}
                <span className="text-blue-300 font-semibold">AutoCAD, Revit, and SketchUp</span>{" "}
                to transform concepts into stunning visual realities.
              </p>
            </motion.div>

            {/* Right: stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: Award, value: "120+", label: "Projects" },
                { icon: Clock, value: "6", label: "Years Exp." },
                { icon: Users2, value: "40+", label: "Clients" },
              ].map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 text-center overflow-hidden group"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(circle at 50% 0%, rgba(96,165,250,0.1) 0%, transparent 70%)" }}
                  />
                  <div className="w-9 h-9 rounded-xl border border-blue-400/25 bg-blue-400/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-white/40 text-xs mt-1 tracking-wide uppercase font-mono">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Skill glass cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-blue-400" />
              <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Technical Skills</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SkillCard icon={PenTool}   name="AutoCAD & Drafting"    percentage={95} delay={0.1} />
              <SkillCard icon={Building2} name="Revit & BIM"           percentage={88} delay={0.2} />
              <SkillCard icon={Box}       name="SketchUp & 3D Modeling" percentage={92} delay={0.3} />
              <SkillCard icon={Lightbulb} name="Design Philosophy"     percentage={90} delay={0.4} />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Projects ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-black min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-glow-arch">Architecture Projects</h2>
          <ProjectCarousel projects={projects} theme="arch" onProjectClick={onProjectClick} />
        </motion.div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 bg-black">
        <ContactSection contactForm={contactForm} theme="arch" />
      </div>
    </div>
  );
}

// ─── CYBERSECURITY ────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: CyberService }) {
  const [open, setOpen] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      layout
      onClick={() => setOpen(!open)}
      className={`cursor-pointer rounded-xl border p-5 transition-all duration-300 ${
        open
          ? "border-[#C41230] bg-[#160608]"
          : "border-white/10 bg-white/[0.03] hover:border-[#C41230]/50 hover:bg-[#160608]/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              open ? "bg-[#C41230]/20 border border-[#C41230]/40" : "bg-white/5 border border-white/10"
            }`}
          >
            <Icon className={`w-4 h-4 ${open ? "text-[#e84a63]" : "text-white/50"}`} />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-[#C41230]">{service.num}</span>
        </div>
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
            open ? "border-[#C41230]/60 rotate-45" : "border-white/20"
          }`}
        >
          <X className={`w-2.5 h-2.5 ${open ? "text-[#e84a63]" : "text-white/30 rotate-45"}`} />
        </div>
      </div>

      <h3 className="font-semibold text-white text-sm mb-1 leading-snug">{service.name}</h3>
      <p className="text-white/40 text-xs leading-relaxed">{service.tagline}</p>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-[#C41230]/20">
              <p className="text-white/60 text-xs leading-relaxed mb-4">{service.desc}</p>
              <ul className="space-y-2 mb-4">
                {service.bullets.map((b, i) => (
                  <li key={i} className="text-xs text-white/50 flex gap-2">
                    <span className="text-[#C41230] font-bold mt-0.5 flex-shrink-0">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="inline-block text-xs font-mono text-[#e84a63] bg-[#C41230]/10 border border-[#C41230]/20 px-3 py-1.5 rounded-md leading-relaxed">
                Ideal for: {service.ideal}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CybersecuritySection({ projects, onProjectClick, contactForm }: any) {
  return (
    <div className="w-full bg-black min-h-screen">
      <section className="relative w-full min-h-screen overflow-hidden">
        <iframe
          src="/cyber.html"
          className="absolute inset-0 w-full h-full border-0"
          style={{ zIndex: 0, minHeight: "100vh" }}
          title="Cybersecurity Page"
        />
      </section>
    </div>
  );
}

// ─── SOFTWARE ─────────────────────────────────────────────────────────────────

function SoftwareSection({ projects, onProjectClick, contactForm }: any) {
  return (
    <div className="w-full bg-gradient-to-b from-[#170f2e] to-black">


      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[#2a72cc]">Software Development</h2>
            <p className="text-lg text-[#ffffff] mb-6 leading-relaxed">
              Building robust, scalable applications with modern fullstack technologies. I specialize in React,
              TypeScript, Node.js, and cloud infrastructure.
            </p>
            <p className="text-lg text-[#ffffff] mb-8 leading-relaxed">
              My architectural background brings structured thinking to software design, resulting in elegant,
              maintainable code and impressive user experiences.
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

      <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-[#2a72cc]">Software Projects</h2>
          <ProjectCarousel projects={projects} theme="soft" onProjectClick={onProjectClick} />
        </motion.div>
      </section>

      <ContactSection contactForm={contactForm} theme="soft" />
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function ContactSection({ contactForm, theme }: any) {
  const themeColors: Record<string, string> = {
    arch: "bg-blue-400/10 border-blue-400/30 text-blue-400",
    cyber: "bg-[#C41230]/10 border-[#C41230]/30 text-[#e84a63]",
    soft: "bg-purple-400/10 border-purple-400/30 text-purple-400",
  };

  return (
    <section className="min-h-screen flex items-center px-8 md:px-16 py-20 max-w-7xl mx-auto w-full mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold mb-12 ${
            theme === "arch" ? "text-glow-arch" : theme === "cyber" ? "text-glow-cyber" : "text-glow-soft"
          }`}
        >
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
            className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 border ${
              themeColors[theme]
            }`}
          >
            {contactForm.contactMutation.isPending ? "Sending..." : "Send Message"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </section>
  );
}
