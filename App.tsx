import React, { useState } from "react";
// ... keep your existing imports
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkGrid from "./components/WorkGrid";
import Services from "./components/Services";
import Experience from "./components/Experience";
import About from "./components/About";
import Philosophy from "./components/Philosophy";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import ProjectDetail from "./components/ProjectDetail";
import Gallery from "./components/Gallery";
import Dashboard from "./components/Dashboard";
import { SectionId, Project, ViewState } from "./types";

// IMPORT THE NEW MODAL
import ContactModal from "./components/ContactModal";

const App: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>("home");

  // NEW STATE FOR MODAL VISIBILITY
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setActiveProject(project);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveProject(null);
  };

  if (activeProject) {
    return (
      <div className="min-h-screen bg-m3-surface text-m3-on-surface font-sans selection:bg-swiss-red selection:text-white">
        <ProjectDetail
          project={activeProject}
          onBack={handleBack}
          onNext={handleProjectClick}
        />
        <ChatWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-m3-surface text-m3-on-surface font-sans selection:bg-swiss-red selection:text-white overflow-x-hidden">
      <Navbar onNavigate={setCurrentView} currentView={currentView} />

      <main className="w-full">
        {currentView === "home" && (
          <>
            {/* ... other sections remain the same ... */}
            <section id={SectionId.HERO}>
              <Hero />
            </section>

            <div className="w-full max-w-[96vw] mx-auto px-4 md:px-0 space-y-20 md:space-y-32 pb-20 pt-10">
              <section id={SectionId.WORK}>
                <WorkGrid onProjectClick={handleProjectClick} />
              </section>

              <Philosophy />

              <section id={SectionId.SERVICES}>
                <Services />
              </section>

              <section id={SectionId.EXPERIENCE}>
                <Experience />
              </section>

              <section id={SectionId.ABOUT}>
                <About />
              </section>

              <section id={SectionId.CONTACT}>
                <div className="flex flex-col items-center justify-center text-center w-full bg-m3-secondary-container rounded-[3rem] py-24 md:py-32 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-swiss-red opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-m3-primary opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

                  <span className="relative z-10 text-sm font-bold uppercase tracking-[0.3em] text-m3-on-secondary-container mb-8">
                    Ready to start?
                  </span>
                  <h2 className="relative z-10 text-[10vw] leading-[0.8] font-black tracking-tighter text-m3-on-secondary-container mb-12">
                    LET'S
                    <br />
                    COLLABORATE
                  </h2>

                  {/* CHANGED: Replaced <a> with <button> and onClick handler */}
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="group relative z-10 inline-flex items-center justify-center h-20 md:h-24 px-12 md:px-20 rounded-full bg-m3-on-secondary-container text-m3-secondary-container text-xl md:text-2xl font-bold overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10 group-hover:-translate-y-24 transition-transform duration-300 block">
                      Pokhrelsumit36@gmail.com
                    </span>
                    <span className="absolute z-10 translate-y-24 group-hover:translate-y-0 transition-transform duration-300 block">
                      Send a Message
                    </span>
                  </button>
                </div>
              </section>
            </div>
          </>
        )}

        {currentView === "gallery" && <Gallery />}

        {currentView === "dashboard" && <Dashboard />}
      </main>

      <Footer onNavigate={setCurrentView} />
      {/* <ChatWidget /> */}

      {/* RENDER THE MODAL HERE */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

export default App;
