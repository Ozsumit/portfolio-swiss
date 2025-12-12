export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  description: string;
  challenge: string;
  solution: string;
  image: string;
  tags: string[];
  link: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
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
  HERO = 'hero',
  WORK = 'work',
  SERVICES = 'services',
  EXPERIENCE = 'experience',
  ABOUT = 'about',
  CONTACT = 'contact'
}

export type ViewState = 'home' | 'gallery' | 'dashboard';
