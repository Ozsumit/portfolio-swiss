export interface Project {
  id: string; // UUID from supabase
  title: string;
  client: string;
  year: string;
  role: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  image: string;
  tags: string[]; // Supabase handles Postgres array -> JS array automatically
  link: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
  read?: boolean;
}

export interface GalleryItem {
  id: string;
  url: string; // Simulating Cloudflare R2 URL
  caption: string;
  date: string;
}

export enum SectionId {
  HERO = "hero",
  WORK = "work",
  SERVICES = "services",
  EXPERIENCE = "experience",
  ABOUT = "about",
  CONTACT = "contact",
}

export type ViewState = "home" | "gallery" | "dashboard";
