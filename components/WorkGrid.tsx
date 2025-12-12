import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data';

interface WorkGridProps {
  onProjectClick: (project: Project) => void;
}

const ProjectRow: React.FC<{ 
  project: Project; 
  index: number; 
  onClick: () => void;
  isHovered: boolean;
  anyHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ project, index, onClick, isHovered, anyHovered, onMouseEnter, onMouseLeave }) => {
  
  // Staggered delay based on index
  const delayStyle = { animationDelay: `${index * 80}ms` }; // Faster stagger

  return (
    <div 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative w-full mb-4 cursor-pointer animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 transition-all duration-400 ${
         anyHovered && !isHovered ? 'opacity-40 scale-[0.99] blur-[2px]' : 'opacity-100 scale-100 blur-0'
      }`}
      style={delayStyle}
    >
      {/* Container */}
      <div className="relative overflow-hidden bg-m3-surface-variant/30 hover:bg-swiss-red rounded-[3rem] px-8 py-10 md:px-16 md:py-16 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.01] hover:shadow-2xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
          
          {/* Left: Index & Title */}
          <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
             <span className="font-mono text-sm md:text-base text-m3-secondary group-hover:text-white/60 transition-colors duration-300">
               (0{index + 1})
             </span>
             <h3 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-m3-on-surface group-hover:text-white transition-colors duration-300 leading-[0.8]">
               {project.title}
             </h3>
          </div>

          {/* Right: Meta & Minimal Image Avatar */}
          <div className="flex items-center gap-6 md:gap-12 self-end md:self-auto">
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold uppercase tracking-widest text-m3-on-surface group-hover:text-white transition-colors duration-300">
                   {project.category}
                </span>
                <span className="font-mono text-xs text-m3-secondary group-hover:text-white/60 transition-colors duration-300">
                   {project.year}
                </span>
             </div>
             
             {/* Minimal Circular Image Reveal */}
             <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-white/20 transition-all duration-500 rotate-0 group-hover:rotate-12 bg-white">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
             </div>

             {/* Arrow */}
             <div className="w-12 h-12 rounded-full border border-m3-on-surface/10 group-hover:border-white/20 flex items-center justify-center transition-all duration-400 group-hover:bg-white group-hover:text-swiss-red">
                <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const WorkGrid: React.FC<WorkGridProps> = ({ onProjectClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="flex flex-col mb-20 px-4 md:px-0">
         <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-swiss-red mb-4">Index</h2>
         <div className="flex justify-between items-end border-b border-m3-on-surface/10 pb-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-m3-on-surface">
              SELECTED CASES
            </h2>
            <span className="hidden md:block font-mono text-sm text-m3-secondary">
              Total {PROJECTS.length}
            </span>
         </div>
      </div>

      <div className="max-w-[100vw] mx-auto">
        {PROJECTS.map((project, index) => (
          <ProjectRow 
            key={project.id} 
            project={project} 
            index={index} 
            onClick={() => onProjectClick(project)}
            isHovered={hoveredIndex === index}
            anyHovered={hoveredIndex !== null}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WorkGrid;