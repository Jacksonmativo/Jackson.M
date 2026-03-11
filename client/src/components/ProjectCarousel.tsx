import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ProjectData } from "./ProjectModal";
import { PhotoStack } from "./PhotoStack";
import { GalleryViewer } from "./GalleryViewer";

interface ProjectCarouselProps {
  projects: ProjectData[];
  theme: "arch" | "cyber" | "soft";
  onProjectClick: (project: ProjectData) => void;
}

export function ProjectCarousel({ projects, theme, onProjectClick }: ProjectCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Gallery viewer state — one gallery shared, tracks which project is open
  const [galleryProject, setGalleryProject] = useState<ProjectData | null>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const getThemeColors = () => {
    switch (theme) {
      case "arch":
        return {
          border: "border-blue-400/30",
          hover: "hover:border-blue-400/60",
          shadow: "hover:shadow-[0_10px_30px_rgba(96,165,250,0.15)]",
          text: "text-blue-100/60",
          button: "text-blue-400",
        };
      case "cyber":
        return {
          border: "border-green-400/30",
          hover: "hover:border-green-400/60",
          shadow: "hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)]",
          text: "text-green-100/60",
          button: "text-green-400",
        };
      case "soft":
        return {
          border: "border-purple-400/30",
          hover: "hover:border-purple-400/60",
          shadow: "hover:shadow-[0_10px_30px_rgba(167,139,250,0.15)]",
          text: "text-purple-100/60",
          button: "text-purple-400",
        };
    }
  };

  const colors = getThemeColors();

  if (projects.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => e.stopPropagation();
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const atStart = scrollLeft === 0;
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 10;
      if ((e.deltaX > 0 && !atEnd) || (e.deltaX < 0 && !atStart)) e.preventDefault();
    }
  };

  // Collect all images for a project (supports both `image` and `images`)
  const getImages = (project: ProjectData): string[] => {
    if (project.images && project.images.length > 0) return project.images;
    if (project.image) return [project.image];
    return [];
  };

  return (
    <>
      <div className="relative group carousel-container">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all -ml-6"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all -mr-6"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
        >
          {projects.map((project, i) => {
            const images = getImages(project);
            const isGalleryOpen = galleryProject?.title === project.title;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-shrink-0 w-80 snap-start"
              >
                <div
                  className={`group glass-panel p-6 rounded-2xl h-full border transition-all hover:-translate-y-2 ${colors.border} ${colors.hover} ${colors.shadow}`}
                >
                  {/* Photo Stack — clicking opens gallery, not the project modal */}
                  {images.length > 0 && (
                    <div className="mb-6">
                      <PhotoStack
                        images={images}
                        alt={project.title}
                        onOpenGallery={() => setGalleryProject(project)}
                        isGalleryOpen={isGalleryOpen}
                        theme={theme}
                      />
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2 font-display">{project.title}</h3>
                  <p className={`line-clamp-2 text-sm ${colors.text}`}>{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 text-white/70 font-mono">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="text-xs px-2 py-1 text-white/50">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                  </div>

                  {/* View Details → opens ProjectModal */}
                  <button
                    onClick={() => onProjectClick(project)}
                    className={`flex items-center font-mono text-sm gap-2 ${colors.button} hover:gap-3 transition-all`}
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>

      {/* Gallery Viewer — rendered outside the carousel so it overlays everything */}
      <GalleryViewer
        images={galleryProject ? getImages(galleryProject) : []}
        title={galleryProject?.title ?? ""}
        isOpen={galleryProject !== null}
        onClose={() => setGalleryProject(null)}
        theme={theme}
      />
    </>
  );
}
