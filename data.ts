import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon',
    client: 'Neon Financial',
    year: '2023',
    role: 'Lead Frontend',
    category: 'Fintech',
    description: 'Micro-frontend architecture for a challenger bank.',
    challenge: 'The legacy banking application was monolithic, slow, and impossible to scale across multiple teams. The user experience felt disjointed and dated.',
    solution: 'We re-architected the platform using a Micro-frontend approach with Module Federation. This allowed independent teams to deploy features instantly. We implemented a strict design system to ensure visual consistency across the fragmented architecture.',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&q=80&w=1000',
    tags: ['React', 'TypeScript', 'D3.js', 'Module Federation'],
    link: '#'
  },
  {
    id: '2',
    title: 'Helvetica',
    client: 'Helvetica Studio',
    year: '2022',
    role: 'System Designer',
    category: 'System',
    description: 'Automated design token pipeline syncing Figma to React.',
    challenge: 'Designers and developers were constantly out of sync. Hand-offs were painful, and manual updates to CSS variables led to inconsistencies.',
    solution: 'I built a custom plugin pipeline that extracts design tokens (colors, typography, spacing) directly from Figma and generates type-safe TypeScript themes and CSS variables automatically via GitHub Actions.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    tags: ['Figma API', 'Node.js', 'GitHub Actions'],
    link: '#'
  },
  {
    id: '3',
    title: 'Alpine',
    client: 'Tourism CH',
    year: '2023',
    role: 'Creative Dev',
    category: 'WebGL',
    description: 'Interactive 3D topographic mapping for hikers.',
    challenge: 'Traditional 2D maps failed to convey the steepness and difficulty of Swiss hiking trails to tourists, leading to safety concerns.',
    solution: 'We utilized Three.js and real satellite elevation data to create an interactive 3D terrain model. Users can explore trails in 3D, check weather in real-time, and plan routes with better spatial awareness.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000',
    tags: ['Three.js', 'GLSL', 'React Three Fiber'],
    link: '#'
  },
  {
    id: '4',
    title: 'Mono',
    client: 'Mono Type',
    year: '2024',
    role: 'Full Stack',
    category: 'Commerce',
    description: 'Bespoke headless e-commerce experience for typography.',
    challenge: 'Selling fonts requires a unique try-before-you-buy experience that standard e-commerce platforms like Shopify could not support out of the box.',
    solution: 'A headless Next.js solution integrated with Stripe. We built a custom type-tester engine that renders font previews on the fly with high performance, allowing users to test OpenType features in the browser.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    tags: ['Next.js', 'Stripe', 'Vercel', 'Canvas'],
    link: '#'
  }
];