import React from "react";

const About: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="aspect-square rounded-full overflow-hidden bg-m3-primary-container relative z-10">
          {/* Placeholder for portrait */}
          <img
            src="/sumit.jpg
            "
            alt="Portrait"
            className="w-full h-full object-cover mix-blend-multiply opacity-90"
          />
        </div>
        {/* Decorative Swiss elements */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-swiss-red rounded-full mix-blend-multiply opacity-80 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-m3-primary rounded-full mix-blend-multiply opacity-20"></div>
      </div>

      <div>
        <h2 className="text-5xl md:text-6xl font-black mb-8 leading-none tracking-tight">
          ORDER. <br />
          CLARITY. <br />
          <span className="text-m3-primary">EMOTION.</span>
        </h2>

        <div className="space-y-6 text-lg text-m3-on-surface-variant leading-relaxed">
          <p>
            I am sumit, a product designer and engineer who believes that
            structure doesn't have to be boring. My work sits at the
            intersection of systematic Swiss design and the playful, adaptive
            nature of modern web technologies.
          </p>
          <p>
            With over 8 years of experience, I build design systems that scale
            and user interfaces that feel alive.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-m3-secondary-container text-m3-on-secondary-container">
            <div className="text-4xl font-bold mb-1">3+</div>
            <div className="text-sm font-medium opacity-80">
              Years Experience
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-m3-primary-container text-m3-on-primary-container">
            <div className="text-4xl font-bold mb-1">5+</div>
            <div className="text-sm font-medium opacity-80">
              Projects Shipped
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
