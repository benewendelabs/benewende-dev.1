export type ProjectStatus = "live" | "in-progress" | "prototype";
export type ProjectCategory = "saas" | "webapp" | "mobile" | "ia" | "prototype";

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  image: string;
  demoVideo?: string;
  featured?: boolean;
  technologies: string[];
  status: ProjectStatus;
  category: ProjectCategory;
  progress?: number;
  launchDate?: string;
  liveUrl?: string;
  githubUrl?: string;
  stats?: {
    users?: string;
    performance?: string;
    roi?: string;
  };
}

export const projects: Project[] = [
  {
    id: "wenastudio",
    name: "WENA Studio",
    description:
      "Plateforme SaaS d'intelligence artificielle tout-en-un pour créateurs et entrepreneurs.",
    longDescription:
      "WENA Studio est une plateforme SaaS complète qui centralise l'accès à des agents IA spécialisés, la génération de contenu texte, images et vidéos, ainsi que des outils de productivité avancés. Conçue pour les créateurs, marketeurs et entrepreneurs qui veulent exploiter la puissance de l'IA sans complexité technique.",
    image: "/projects/wenastudio.png",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI", "Prisma", "PostgreSQL", "Vercel"],
    status: "live",
    category: "saas",
    liveUrl: "https://wenastudio.com",
    stats: { users: "1K+", performance: "99.9%", roi: "5x" },
  },
  {
    id: "saas-crm",
    name: "CRM SaaS Platform",
    description:
      "Plateforme CRM complète pour PME avec gestion contacts, pipeline ventes et analytics.",
    image: "/projects/crm-saas.png",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind"],
    status: "live",
    category: "saas",
    stats: { users: "500+", performance: "99.9%", roi: "3x" },
  },
  {
    id: "ai-content",
    name: "AI Content Generator",
    description:
      "Outil de generation de contenu marketing propulse par IA multi-modeles.",
    image: "/projects/ai-content.png",
    technologies: ["React", "Node.js", "OpenAI", "MongoDB", "Redis"],
    status: "live",
    category: "ia",
    stats: { users: "1.2K", performance: "98%", roi: "5x" },
  },
  {
    id: "ecommerce-platform",
    name: "E-Commerce Platform",
    description:
      "Marketplace multi-vendeurs avec paiements mobile money et livraison integree.",
    image: "/projects/ecommerce.png",
    technologies: ["Next.js", "Prisma", "Stripe", "AWS S3", "Tailwind"],
    status: "live",
    category: "webapp",
    stats: { users: "2K+", performance: "97%", roi: "4x" },
  },
  {
    id: "saas-analytics",
    name: "Analytics Dashboard SaaS",
    description:
      "Dashboard analytics temps reel avec visualisation avancee et rapports automatises.",
    image: "/projects/analytics.png",
    technologies: ["Next.js", "D3.js", "PostgreSQL", "WebSocket", "Docker"],
    status: "in-progress",
    category: "saas",
    progress: 75,
    launchDate: "Q2 2026",
  },
  {
    id: "mobile-fintech",
    name: "FinTech Mobile App",
    description:
      "Application mobile de gestion financiere avec IA predictive pour le marche africain.",
    image: "/projects/fintech.png",
    technologies: ["React Native", "Node.js", "PostgreSQL", "TensorFlow"],
    status: "in-progress",
    category: "mobile",
    progress: 45,
    launchDate: "Q3 2026",
  },
  {
    id: "cv-generator",
    name: "CV Generator IA",
    description:
      "Generateur de CV professionnel assiste par IA avec templates premium et export PDF.",
    image: "/projects/cv-gen.png",
    technologies: ["Next.js", "OpenRouter", "PDF-lib", "Framer Motion"],
    status: "in-progress",
    category: "ia",
    progress: 90,
    launchDate: "Q1 2026",
  },
  {
    id: "chatbot-builder",
    name: "Chatbot Builder",
    description:
      "Plateforme no-code pour creer des chatbots IA connectes a vos donnees.",
    image: "/projects/chatbot.png",
    technologies: ["Next.js", "LangChain", "Pinecone", "OpenAI"],
    status: "prototype",
    category: "ia",
  },
  {
    id: "devops-monitor",
    name: "DevOps Monitor",
    description:
      "Outil de monitoring infrastructure avec alertes intelligentes et auto-scaling.",
    image: "/projects/devops.png",
    technologies: ["Go", "Docker", "Prometheus", "Grafana", "WebSocket"],
    status: "prototype",
    category: "prototype",
  },
];
