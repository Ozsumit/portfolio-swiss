import React, { useState, useEffect, useRef } from "react";
import { SectionId, ViewState } from "../types";

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [showAdmin, setShowAdmin] = useState(false);

  // Ref to track tap timeout for mobile
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tapCount, setTapCount] = useState(0);

  // 1. DESKTOP: Listen for typing "admin"
  useEffect(() => {
    let keyBuffer = "";
    const secretCode = "admin";

    const handleKeyDown = (e: KeyboardEvent) => {
      keyBuffer += e.key;
      if (keyBuffer.length > secretCode.length) {
        keyBuffer = keyBuffer.slice(-secretCode.length);
      }
      if (keyBuffer.toLowerCase() === secretCode) {
        setShowAdmin(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. MOBILE: Logic for "5 Taps" secret
  const handleSecretTap = () => {
    // Increment tap count
    setTapCount((prev) => {
      const newCount = prev + 1;

      // If 5 taps reached, unlock admin
      if (newCount >= 5) {
        setShowAdmin(true);
        // Optional: Vibrate phone to indicate success
        if (navigator.vibrate) navigator.vibrate(200);
        return 0; // Reset
      }
      return newCount;
    });

    // Clear existing timer to reset count if user stops tapping
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // Reset tap count if no tap occurs within 1 second
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-m3-on-surface text-m3-surface pt-24 pb-8 overflow-hidden rounded-t-[3rem] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-m3-surface-variant/50 mb-8">
              Get in touch
            </h3>
            {/* ... Social Links ... */}
            <div className="flex flex-col gap-2 items-start">
              <a
                href="mailto:sumit@example.com"
                className="text-3xl md:text-6xl font-black tracking-tighter text-m3-surface-variant hover:text-white hover:translate-x-4 transition-all duration-300"
              >
                Email
              </a>
              <a
                href="#"
                className="text-3xl md:text-6xl font-black tracking-tighter text-m3-surface-variant hover:text-white hover:translate-x-4 transition-all duration-300"
              >
                linkedin
              </a>
              <a
                href="#"
                className="text-3xl md:text-6xl font-black tracking-tighter text-m3-surface-variant hover:text-white hover:translate-x-4 transition-all duration-300"
              >
                github
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <span className="block text-xs font-bold text-m3-secondary mb-6 uppercase tracking-[0.2em]">
                  Menu
                </span>
                <ul className="space-y-4">
                  {/* ... Menu Items ... */}
                  <li>
                    <button
                      onClick={() => {
                        onNavigate("home");
                        document
                          .getElementById(SectionId.WORK)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-xl font-bold hover:text-swiss-red transition-colors text-m3-surface hover:translate-x-2 inline-block duration-300"
                    >
                      Work
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate("home");
                        document
                          .getElementById(SectionId.SERVICES)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-xl font-bold hover:text-swiss-red transition-colors text-m3-surface hover:translate-x-2 inline-block duration-300"
                    >
                      Services
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("gallery")}
                      className="text-xl font-bold hover:text-swiss-red transition-colors text-m3-surface hover:translate-x-2 inline-block duration-300"
                    >
                      Gallery
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                {/* 
                   MOBILE TRIGGER: 
                   Added onClick to this span. 
                   Tapping "LEGAL" 5 times reveals the button. 
                */}
                <span
                  onClick={handleSecretTap}
                  className="block text-xs font-bold text-m3-secondary mb-6 uppercase tracking-[0.2em] select-none cursor-pointer active:text-white transition-colors"
                >
                  Legal
                </span>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-xl font-bold hover:text-swiss-red transition-colors text-m3-surface hover:translate-x-2 inline-block duration-300"
                    >
                      Privacy
                    </a>
                  </li>

                  {showAdmin && (
                    <li className="animate-fade-in">
                      <button
                        onClick={() => onNavigate("dashboard")}
                        className="text-xl font-bold text-swiss-red hover:text-white transition-colors hover:translate-x-2 inline-block duration-300"
                      >
                        Admin
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-12 text-right">
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-3 ml-auto text-sm font-bold uppercase tracking-widest hover:text-swiss-red transition-colors"
              >
                Back to Top
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:-translate-y-2 group-hover:bg-swiss-red group-hover:border-swiss-red group-hover:text-white transition-all duration-300">
                  ↑
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <h2 className="text-[14vw] font-black leading-none tracking-tighter text-m3-surface/5 select-none text-center pointer-events-none">
            SUMIT_POKHREL
          </h2>
          <div className="flex flex-col md:flex-row justify-between mt-8 text-xs text-m3-surface-variant font-mono uppercase tracking-wider">
            <span>© 2024 Sumit Pokhrel</span>
            <span className="mt-2 md:mt-0">SWISS STYLE X MATERIAL YOU</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
