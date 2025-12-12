import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let animationFrameId: number;
    let isVisible = true;

    // Configuration - Performance Tuned
    const GRID_SIZE = 60; // Increased spacing to reduce particle count (Performance win)
    const INFLUENCE_RADIUS = 250; 
    
    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      active: number; // 0 to 1
    }

    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      particles = [];
      const cols = Math.ceil(width / GRID_SIZE);
      const rows = Math.ceil(height / GRID_SIZE);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * GRID_SIZE;
          const y = j * GRID_SIZE;
          particles.push({
            x, y, baseX: x, baseY: y, active: 0
          });
        }
      }
    };

    const draw = () => {
      if (!isVisible) return; // Stop drawing if off-screen

      ctx.clearRect(0, 0, width, height);
      
      // Optimization: Batch style changes if possible, though here we change color per particle
      // We can use a single path for dormant particles to reduce draw calls
      
      ctx.fillStyle = '#E7E0EC'; // m3-surface-variant (light)
      ctx.beginPath();
      
      // First pass: Calculate physics and gather dormant points
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouseX - p.baseX;
        const dy = mouseY - p.baseY;
        
        // Quick bounding box check before expensive sqrt
        if (Math.abs(dx) < INFLUENCE_RADIUS && Math.abs(dy) < INFLUENCE_RADIUS) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            let targetActive = 0;
            if (dist < INFLUENCE_RADIUS) {
              targetActive = 1 - (dist / INFLUENCE_RADIUS);
            }
            p.active += (targetActive - p.active) * 0.15; // Faster lerp (0.1 -> 0.15)
        } else {
            p.active *= 0.9; // Decay
        }

        if (p.active < 0.01) {
             // Add to dormant batch
             ctx.moveTo(p.baseX + 1, p.baseY);
             ctx.arc(p.baseX, p.baseY, 1, 0, Math.PI * 2);
        } else {
            // Draw active particle immediately
            const size = 2 + (p.active * 6);
            ctx.save();
            ctx.translate(p.baseX, p.baseY);
            ctx.strokeStyle = p.active > 0.2 ? '#FF3B30' : '#1C1B1F';
            ctx.lineWidth = 1 + p.active;
            
            const arm = size;
            ctx.beginPath();
            ctx.moveTo(-arm, 0);
            ctx.lineTo(arm, 0);
            ctx.moveTo(0, -arm);
            ctx.lineTo(0, arm);
            ctx.stroke();
            ctx.restore();
        }
      }
      // Fill all dormant dots at once
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    // Intersection Observer to stop animation when not in view
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            if (!isVisible) {
                isVisible = true;
                draw(); // Restart loop
            }
        } else {
            isVisible = false;
            // cancelAnimationFrame handled implicitly by check at start of draw
        }
    }, { threshold: 0 });
    
    observer.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
       if (e.touches.length > 0) {
         const rect = canvas.getBoundingClientRect();
         mouseX = e.touches[0].clientX - rect.left;
         mouseY = e.touches[0].clientY - rect.top;
       }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleMouseLeave);
    container.addEventListener('mouseleave', handleMouseLeave);

    resize();
    draw();

    return () => {
      isVisible = false;
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseLeave);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center bg-m3-surface overflow-hidden pt-20">
      
      {/* Interactive Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-auto opacity-60"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pointer-events-none">
        
        {/* Top Meta Data */}
        <div className="flex justify-between items-end mb-12 md:mb-24 opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
          <div className="font-mono text-xs md:text-sm tracking-widest text-m3-secondary uppercase">
             Code × Design<br/>
             (Est. 2016)
          </div>
          <div className="font-mono text-xs md:text-sm tracking-widest text-m3-secondary uppercase text-right">
             Zurich, CH<br/>
             Available
          </div>
        </div>

        {/* Hero Typography */}
        <div className="flex flex-col select-none pointer-events-auto mix-blend-darken">
          
          {/* First Line */}
          <div className="relative overflow-hidden -mb-[2vw] md:-mb-[3vw]">
            <h1 className="text-[clamp(4rem,15vw,13rem)] leading-none font-black tracking-tighter text-m3-on-surface transform translate-y-full animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
              CREATIVE
            </h1>
          </div>

          {/* Second Line */}
          <div className="relative overflow-hidden pl-[4vw] md:pl-[8vw]">
            <h1 className="group text-[clamp(4rem,15vw,13rem)] leading-none font-black tracking-tighter text-transparent transform translate-y-full animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards] cursor-default transition-all duration-300 hover:text-m3-primary"
                style={{ WebkitTextStroke: '1px #1C1B1F' }}>
               <span className="relative z-10">ENGINEER</span>
               {/* Hover Fill Effect */}
               <span className="absolute inset-0 text-m3-on-surface -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ WebkitTextStroke: '0' }}>
                 ENGINEER
               </span>
            </h1>
          </div>

        </div>

        {/* Bottom Scroll Indicator */}
        <div className="mt-16 md:mt-32 border-t border-m3-on-surface/10 pt-8 flex justify-between items-center opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards] pointer-events-auto">
           <div className="max-w-md text-m3-on-surface-variant text-sm md:text-lg font-medium leading-relaxed hidden md:block">
              Merging rigorous <span className="text-swiss-red">Swiss systems</span> with playful <span className="text-m3-primary">Material motion</span>.
           </div>
           
           <button 
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-4 text-xs md:text-sm font-bold uppercase tracking-widest hover:text-swiss-red transition-colors"
           >
               Scroll
               <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:bg-swiss-red group-hover:text-white group-hover:border-swiss-red transition-all">
                 ↓
               </span>
           </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(110%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Hero;