import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { useEffect } from "react";

export interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  theme: "arch" | "cyber" | "soft";
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  const getThemeColors = (theme: string) => {
    switch(theme) {
      case 'arch': return 'border-[#60a5fa] shadow-[#60a5fa]/20 text-[#60a5fa]';
      case 'cyber': return 'border-[#22c55e] shadow-[#22c55e]/20 text-[#22c55e]';
      case 'soft': return 'border-[#a78bfa] shadow-[#a78bfa]/20 text-[#a78bfa]';
      default: return 'border-white/20 shadow-white/10 text-white';
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border-t-2 ${getThemeColors(project.theme).split(' ')[0]} shadow-2xl ${getThemeColors(project.theme).split(' ')[1]}`}
          >
            <div className="relative p-6 sm:p-8">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${getThemeColors(project.theme).split(' ')[2]}`}>
                {project.title}
              </h2>
              
              {project.image && (
                <div className="w-full h-64 sm:h-80 md:h-96 mt-6 rounded-xl overflow-hidden border border-white/10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white/90 mb-3 font-display">Overview</h3>
                  <p className="text-white/70 leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white/90 mb-3 font-display">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className={`px-3 py-1 rounded-md text-sm font-mono border bg-black/50 ${getThemeColors(project.theme).split(' ')[0]} text-white/80`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border ${getThemeColors(project.theme).split(' ')[0]} transition-all`}
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/20 transition-all"
                    >
                      <Github className="w-5 h-5" />
                      View Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
