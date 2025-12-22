import React, { useEffect, useRef, useState } from "react";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<"idle" | "hover" | "active">(
    "idle"
  );
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 1. Detect Touch Device
    // "pointer: coarse" indicates the primary input is inaccurate (like a finger).
    // If true, we set state to hide the component and exit early to save resources.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      setIsTouchDevice(true);
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    const animate = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      cursorX += dx * 0.15;
      cursorY += dy * 0.15;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

      requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseDown = () => setHoverState("active");
    const onMouseUp = () =>
      setHoverState((prev) => (prev === "active" ? "hover" : "idle"));

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let el: HTMLElement | null = target;
      let isClickable = false;
      let depth = 0;

      while (el && el !== document.body && depth < 5) {
        const style = window.getComputedStyle(el);
        if (
          style.cursor === "pointer" ||
          el.tagName === "A" ||
          el.tagName === "BUTTON" ||
          el.tagName === "INPUT"
        ) {
          isClickable = true;
          break;
        }
        el = el.parentElement;
        depth++;
      }
      setHoverState(isClickable ? "hover" : "idle");
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", checkHover);

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", checkHover);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Conditional Rendering
  // If it is a touch device, return null to render nothing in the DOM.
  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      // Added `hidden md:block` as a CSS-only fallback (hides on small screens immediately before JS hydrates)
      className="hidden md:block fixed top-0 left-0 z-[9999] pointer-events-none -ml-[12px] -mt-[12px]"
    >
      <div
        className={`
          relative flex items-center justify-center
          backdrop-blur-md
          backdrop-saturate-150
          bg-gradient-to-br
          border border-white/40
          shadow-[0_4px_16px_rgba(0,0,0,0.15)]
          transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
          
          ${
            hoverState === "idle"
              ? "w-6 h-6 rounded-full from-white/40 to-white/10"
              : ""
          }
          ${
            hoverState === "hover"
              ? "w-20 h-10 rounded-full from-violet-500/20 to-white/10 -ml-[28px] -mt-[8px] border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              : ""
          }
          ${
            hoverState === "active"
              ? "w-14 h-7 rounded-full from-white/50 to-white/20 -ml-[16px] -mt-[2px] backdrop-blur-xl scale-90"
              : ""
          }
        `}
      >
        <div
          className={`
           bg-[#EF4444] 
           shadow-[0_0_8px_rgba(239,68,68,0.8)]
           rounded-full transition-all duration-300
           ${
             hoverState === "idle"
               ? "w-1.5 h-1.5 opacity-100"
               : "w-1 h-1 opacity-0"
           }
        `}
        />
      </div>
    </div>
  );
};

export default CustomCursor;
