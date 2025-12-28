import React, { useEffect } from "react";
import { Project } from "../types";
import { PROJECTS } from "../data";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNext: (project: Project) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  onNext,
}) => {
  // ---------------------------------------------------------------------------
  // ROBUST INDEX LOGIC
  // ---------------------------------------------------------------------------

  // 1. Try to find the index by strictly matching the ID
  let currentIndex = PROJECTS.findIndex((p) => p.id === project.id);

  // 2. Fallback: If not found, try loose string matching (fixes "1" vs 1 issues)
  if (currentIndex === -1) {
    currentIndex = PROJECTS.findIndex(
      (p) => String(p.id) === String(project.id)
    );
  }

  // 3. Fallback: If ID is missing or broken, try matching by Title
  if (currentIndex === -1) {
    currentIndex = PROJECTS.findIndex((p) => p.title === project.title);
  }

  // 4. Safety: If all searches fail, default to 0 to prevent crashes,
  //    but relying on this means the data file is out of sync with props.
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  // Calculate Next Index (Circular)
  const nextIndex = (safeIndex + 1) % PROJECTS.length;
  const nextProject = PROJECTS[nextIndex];
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Force instant scroll reset when project changes
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [project.id]);

  if (!project) return null;

  return (
    // key={project.id} is CRITICAL. It forces React to unmount the old project
    // and mount the new one fresh, ensuring animations play and logic resets.
    <div
      key={project.id}
      className="min-h-screen bg-m3-surface animate-[fadeIn_0.3s_ease-out]"
    >
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto group flex items-center gap-3 bg-m3-surface/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-m3-on-surface/5 hover:bg-m3-on-surface hover:text-m3-surface transition-all duration-200"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-bold uppercase tracking-widest">
            Back
          </span>
        </button>

        <span className="hidden md:block font-mono text-xs text-m3-on-surface/50 bg-m3-surface/80 backdrop-blur-md px-4 py-2 rounded-full border border-m3-on-surface/5">
          CASE STUDY {safeIndex + 1} / {PROJECTS.length}
        </span>
      </div>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 md:px-12 max-w-[98vw] mx-auto">
        <div className="relative mb-24">
          <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-m3-on-surface uppercase break-words">
            {project.title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-6 py-2 rounded-full border border-m3-on-surface text-m3-on-surface text-sm font-bold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-m3-on-surface/10 py-12">
          <div>
            <span className="block text-xs font-bold text-swiss-red uppercase tracking-widest mb-2">
              Client
            </span>
            <span className="text-xl md:text-2xl font-bold text-m3-on-surface">
              {project.client}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold text-swiss-red uppercase tracking-widest mb-2">
              Role
            </span>
            <span className="text-xl md:text-2xl font-bold text-m3-on-surface">
              {project.role}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold text-swiss-red uppercase tracking-widest mb-2">
              Year
            </span>
            <span className="text-xl md:text-2xl font-bold text-m3-on-surface">
              {project.year}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold text-swiss-red uppercase tracking-widest mb-2">
              Category
            </span>
            <span className="text-xl md:text-2xl font-bold text-m3-on-surface">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-m3-secondary-container relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-20">
            <section>
              <h3 className="text-4xl font-black mb-8 text-m3-on-surface">
                The Challenge
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed text-m3-on-surface-variant font-medium">
                {project.challenge}
              </p>
            </section>

            <section>
              <h3 className="text-4xl font-black mb-8 text-m3-on-surface">
                The Solution
              </h3>
              <p className="text-lg md:text-xl leading-relaxed text-m3-on-surface-variant">
                {project.solution}
              </p>
            </section>

            <div className="bg-m3-primary-container rounded-[2rem] p-8 md:p-12">
              <p className="text-m3-on-primary-container text-lg font-mono mb-8">
                "Simplicity is the ultimate sophistication."
              </p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-m3-on-primary-container font-bold uppercase tracking-widest hover:text-swiss-red transition-colors"
              >
                Visit Live Site <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
