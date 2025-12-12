import { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Crescent Moon",
    client: "Personal Project",
    year: "2024",
    role: "Lead Developer",
    category: "Entertainment",
    description:
      "A beautifully crafted, free, and open-source movie streaming platform focused on simplicity, speed, and an immersive viewing experience.",
    challenge:
      "Building a streaming platform that delivers fast video playback, multiple source handling, and smooth performance across devices—while keeping the design clean and lightweight—was a core challenge. Managing API inconsistencies between various video providers added additional complexity.",
    solution:
      "I designed a modular architecture with provider fallbacks, ensuring each movie loads seamlessly regardless of the selected source. The platform uses optimized caching, responsive UI components, and custom player logic to maintain high performance and a premium user experience.",
    image: "/cmoon.png",
    tags: ["Next.js", "TypeScript", "Tailwind", "Video Players"],
    link: "https://cmoon.sumit.info.np",
  },

  {
    id: "2",
    title: "Yeti Int'l College",
    client: "Yeti Int'l College",
    year: "2022",
    role: "Lead Developer, Frontend Engineer",
    category: "Education",
    description:
      "A streamlined academic website and management system designed to modernize the college’s digital presence and internal workflows.",
    challenge:
      "The college relied on outdated pages and manual processes that made content updates slow and the user experience inconsistent. Managing announcements, programs, and student information required too much manual effort.",
    solution:
      "I redesigned the website architecture with a clean, modular system that allows staff to update programs, announcements, and pages effortlessly. The platform uses structured components, automated content pipelines, and a responsive UI tailored for both students and administrators.",
    image: "/yeti.png",
    tags: ["Next.js", "TypeScript", "Content Automation"],
    link: "https://yeticollege.edu.np",
  },

  {
    id: "3",
    title: "OmegaChat",
    client: "Personal Project",
    year: "2024",
    role: "Full Stack Developer",
    category: "Communication",
    description:
      "A peer-to-peer messaging and file-transfer platform designed to work instantly on local networks without servers.",
    challenge:
      "Most chat platforms rely on heavy backend infrastructure, making local communication slow, costly, and dependent on external servers. Enabling real-time messaging and large file transfers directly between browsers—while preserving message history—required a highly efficient P2P setup.",
    solution:
      "I engineered a lightweight WebRTC/PeerJS architecture that establishes direct connections between clients, enabling instant messaging and high-speed file sharing. Conversations persist in LocalStorage and IndexedDB, allowing users to access chats even when peers are offline. Smart connection reuse and fallback logic ensure a smooth, WhatsApp-like experience without needing a backend.",
    image: "/chat.png",
    tags: ["PeerJS", "WebRTC", "Next.js", "IndexedDB"],
    link: "https://chat.sumit.info.np",
  },

  {
    id: "4",
    title: "Library Management System",
    client: "Institution Project",
    year: "2024",
    role: "Full Stack Developer",
    category: "Education",
    description:
      "A modern library management platform designed to simplify book tracking, borrowing workflows, and digital record handling for institutions.",
    challenge:
      "The existing system relied heavily on manual record-keeping, leading to lost data, slow book retrieval, and difficulty managing student activity. Staff had no efficient way to track borrowed books or maintain updated inventories.",
    solution:
      "I built a clean, database-driven platform with automated book cataloging, user authentication, borrowing logs, and late-return tracking. The interface is optimized for quick scanning, instant search, and seamless management. Admins can add books, manage students, and generate reports with minimal effort.",
    image: "/lib.png",
    tags: ["Next.js", "Node.js", "MongoDB", "REST API"],
    link: "https://lib.sumit.info.np",
  },
];
