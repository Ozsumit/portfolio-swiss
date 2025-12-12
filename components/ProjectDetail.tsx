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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    // Sped up fadeIn from 0.5s to 0.3s for snappier feel
    <div className="min-h-screen bg-m3-surface animate-[fadeIn_0.3s_ease-out]">
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
          CASE STUDY {project.id} / {PROJECTS.length}
        </span>
      </div>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 md:px-12 max-w-[98vw] mx-auto">
        {/* Massive Title Block */}
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

        {/* Info Grid - Swiss Style */}
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
          {/* Minimal Image - Treated as texture/object */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-m3-secondary-container relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 "></div>
              </div>
            </div>
          </div>

          {/* Typography Heavy Content */}
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
                className="inline-flex items-center gap-2 text-m3-on-primary-container font-bold uppercase tracking-widest hover:text-swiss-red transition-colors"
              >
                Visit Live Site <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Next Project Footer */}
      <div
        onClick={() => onNext(nextProject)}
        className="group relative bg-m3-on-surface text-m3-surface py-32 px-4 md:px-12 cursor-pointer overflow-hidden mt-20"
      >
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-bold uppercase tracking-[0.3em] mb-4 text-m3-surface-variant">
            Next Case
          </span>
          <h2 className="text-[10vw] leading-none font-black tracking-tighter group-hover:scale-105 transition-transform duration-300">
            {nextProject.title}
          </h2>
          <div className="mt-8 w-16 h-16 rounded-full border border-m3-surface flex items-center justify-center group-hover:bg-swiss-red group-hover:border-swiss-red transition-all duration-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </div>
        </div>
        {/* Background Fill Animation */}
        <div className="absolute inset-0 bg-m3-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default ProjectDetail;
