import React, { useRef, useEffect, useState } from 'react';

const Philosophy: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`w-full bg-m3-on-surface text-m3-surface rounded-[2.5rem] p-8 md:p-20 transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-32 items-start">
         {/* Title Column */}
         <div className="sticky top-32">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-swiss-red mb-8">Philosophy</h2>
            <div className="text-[12vw] xl:text-[8vw] font-black tracking-tighter leading-[0.85] mb-12">
              LESS<br/>
              BUT<br/>
              BETTER.
            </div>
            <p className="text-m3-surface-variant/80 font-mono text-sm max-w-sm border-l border-m3-surface-variant/20 pl-6">
               Adhering to the principles of Dieter Rams while embracing the fluid, adaptive nature of the modern web.
            </p>
         </div>

         {/* Content Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { title: "Systematic Design", color: "bg-swiss-red", text: "Structure prevents chaos. I utilize rigorous design tokens and component libraries to ensure consistency." },
                { title: "Material Motion", color: "bg-m3-primary-container", text: "Motion is meaning. Transitions are not just decoration; they guide the user's focus and understanding." },
                { title: "Radical Simplicity", color: "bg-white", text: "Complexity is easy. I strive to strip away the non-essential to reveal the core function." },
                { title: "Human Centric", color: "bg-m3-secondary", text: "Technology serves us. I prioritize accessibility and intuitive patterns over flashy trends." },
                { title: "Code Quality", color: "bg-green-400", text: "Clean code is sustainable. I write self-documenting, modular code that scales with the product." },
                { title: "Performance First", color: "bg-blue-400", text: "Speed is a feature. Optimizing assets and render cycles is fundamental to the user experience." }
            ].map((item, idx) => (
                <div key={idx} className="bg-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                   <div className={`w-12 h-2 ${item.color} mb-6 rounded-full group-hover:w-24 transition-all duration-300`}></div>
                   <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                   <p className="text-m3-surface-variant text-lg leading-relaxed opacity-80 group-hover:opacity-100">
                      {item.text}
                   </p>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Philosophy;