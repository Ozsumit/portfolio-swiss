import React, { useState, useEffect } from "react";
import { SectionId, ViewState } from "../types";

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = (id?: SectionId, view?: ViewState) => {
    setMobileMenuOpen(false);

    if (view) {
      onNavigate(view);
      window.scrollTo(0, 0);
    } else if (id) {
      if (currentView !== "home") {
        onNavigate("home");
        // Wait for render then scroll
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navLinks = [
    { label: "Work", id: SectionId.WORK },
    { label: "Services", id: SectionId.SERVICES },
    { label: "Gallery", view: "gallery" as ViewState },
    { label: "About", id: SectionId.ABOUT },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          scrolled || mobileMenuOpen || currentView !== "home"
            ? "bg-m3-surface/95 backdrop-blur-md border-b border-m3-on-surface/10 py-3 shadow-sm"
            : "bg-transparent border-b border-transparent py-6"
        }`}
      >
        <div className="w-full max-w-[96vw] mx-auto px-4 md:px-0">
          <div className="flex justify-between items-center">
            {/* Logo Area */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleLinkClick(undefined, "home")}
                className="text-xl md:text-2xl font-black tracking-tighter uppercase text-m3-on-surface hover:text-swiss-red transition-colors"
              >
                Sumit Pokhrel
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.id, item.view)}
                  className={`text-sm font-bold uppercase tracking-widest hover:text-swiss-red transition-colors relative group ${
                    item.view && currentView === item.view
                      ? "text-swiss-red"
                      : "text-m3-on-surface"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-swiss-red transition-all group-hover:w-full ${
                      item.view && currentView === item.view ? "w-full" : "w-0"
                    }`}
                  ></span>
                </button>
              ))}

              <button
                onClick={() => handleLinkClick(SectionId.CONTACT)}
                className="px-6 py-2.5 bg-m3-primary text-m3-on-primary rounded-full text-sm font-bold uppercase tracking-widest hover:bg-m3-on-primary-container hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Let's Talk
              </button>
            </div>

            {/* Mobile Toggle & Status */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-m3-on-surface p-1 focus:outline-none relative z-50"
                aria-label="Toggle menu"
              >
                <div className="w-8 h-5 flex flex-col justify-between items-end">
                  <span
                    className={`h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "w-8 -rotate-45 translate-y-2.5" : "w-8"
                    }`}
                  ></span>
                  <span
                    className={`h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : "w-8"
                    }`}
                  ></span>
                  <span
                    className={`h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "w-8 rotate-45 -translate-y-2.5" : "w-5"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-m3-surface z-[50] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden flex flex-col pt-32 px-6 ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="space-y-6">
          {navLinks.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.id, item.view)}
              className={`block text-6xl font-black text-m3-on-surface hover:text-swiss-red transition-colors text-left transform duration-500 ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 50 + 100}ms` }}
            >
              {item.label}
            </button>
          ))}
          <div
            className="pt-8 border-t border-m3-on-surface/10 mt-8 opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]"
            style={{
              animationPlayState: mobileMenuOpen ? "running" : "paused",
            }}
          >
            <button
              onClick={() => handleLinkClick(SectionId.CONTACT)}
              className="w-full py-5 bg-m3-primary text-m3-on-primary rounded-xl text-xl font-bold uppercase tracking-wider shadow-lg"
            >
              Start a Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
