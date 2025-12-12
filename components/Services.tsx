import React, { useRef, useState, useEffect } from "react";

const Services: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    {
      title: "Frontend Architecture",
      desc: "Scalable React applications using Next.js and Micro-frontends. Focusing on performance and clean code.",
    },
    {
      title: "Design Systems",
      desc: "Bridging the gap between Figma and Code. Automated token pipelines and component libraries.",
    },
    {
      title: "Creative Development",
      desc: "WebGL, Canvas, and complex interactions. Adding the 'magic' layer to standard web interfaces.",
    },
    {
      title: "UI/UX Design",
      desc: "Clean user interfaces with a focus on typography, grid systems, and functional clarity.",
    },
  ];

  return (
    <div
      ref={ref}
      className={`py-20 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mb-16">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red mb-2">
          What I Do
        </h2>
        <h3 className="text-4xl md:text-6xl font-black text-m3-on-surface tracking-tight">
          CAPABILITIES
        </h3>
      </div>

      <div className="flex flex-col">
        {services.map((service, index) => (
          <div
            key={index}
            className="group border-t border-m3-on-surface-variant/20 py-12 transition-all duration-300 hover:bg-m3-surface-variant/30 hover:px-8 -mx-4 px-4 md:-mx-8 md:px-8 rounded-3xl cursor-default"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
              <div className="md:col-span-1">
                <span className="text-xs font-mono text-m3-secondary opacity-50 group-hover:opacity-100 group-hover:text-swiss-red transition-colors">
                  0{index + 1}
                </span>
              </div>
              <div className="md:col-span-5">
                <h4 className="text-2xl md:text-4xl font-bold text-m3-on-surface group-hover:translate-x-2 transition-transform duration-300">
                  {service.title}
                </h4>
              </div>
              <div className="md:col-span-5">
                <p className="text-base md:text-xl text-m3-on-surface-variant leading-relaxed opacity-80 group-hover:opacity-100">
                  {service.desc}
                </p>
              </div>
              <div className="md:col-span-1 flex justify-end">
                <div className="w-12 h-12 rounded-full bg-m3-surface text-m3-on-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-sm border border-m3-on-surface/5">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-m3-on-surface-variant/20"></div>
      </div>
    </div>
  );
};

export default Services;
