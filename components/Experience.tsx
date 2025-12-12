import React from "react";

const Experience: React.FC = () => {
  const jobs = [
    {
      year: "2026 — Pres.",
      company: "Yeti Int'l College",
      role: "Junior IT Technician",
      location: "Kathmandu",
    },
    {
      year: "2025 jan — 2025 Dec",
      company: "Leading Edge Softwares",
      role: "Intern",
      location: "Birtamode",
    },
    {
      year: "2023 jun — 2023 sep",
      company: "Buddhashanti Gaunpalika",
      role: "Data Entry Operator",
      location: "Buddhashanti, Jhapa",
    },
    {
      year: "2024 jan — 2024 dec",
      company: "Shree Aadarsha Secondary School",
      role: "Hardware Technician",
      location: "Jayapur",
    },
  ];

  return (
    <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-m3-on-surface mb-8">
            EXPERIENCE
          </h2>
          <p className="text-xl text-m3-on-surface-variant leading-relaxed mb-8">
            A history of shipping high-quality products for world-class teams. I
            thrive in environments that value both engineering excellence and
            design fidelity.
          </p>
          {/* <a
            href="#"
            className="inline-block px-8 py-4 rounded-2xl bg-m3-secondary-container text-m3-on-secondary-container font-bold hover:scale-105 transition-transform"
          >
            Download Resume
          </a> */}
        </div>

        <div className="space-y-0">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-6 border-b border-m3-on-surface-variant/20 hover:bg-white/50 px-4 -mx-4 rounded-xl transition-colors group"
            >
              <div>
                <h4 className="text-xl font-bold text-m3-on-surface">
                  {job.company}
                </h4>
                <p className="text-m3-on-surface-variant">{job.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-m3-secondary group-hover:text-swiss-red transition-colors">
                  {job.year}
                </p>
                <p className="text-xs text-m3-secondary/70">{job.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
