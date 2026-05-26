import {
  LayoutGrid,
  ShoppingCart,
  Globe,
  Code2,
  Server,
  Database,
  Zap,
} from "lucide-react";

export const statsData = [
  { value: 547, suffix: "+", label: "Completed Projects" },
  { value: 6, suffix: "", label: "Expert Platforms" },
  { value: 4.9, suffix: "★", label: "Client Satisfaction" },
];

export const platformBadges = [
  "Squarespace",
  "Shopify",
  "Wix & Velo",
  "React",
  "Node.js",
  "NestJS",
  "MongoDB",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
];

export const bentoServices = [
  {
    icon: LayoutGrid,
    title: "Squarespace Websites",
    description: "Premium business websites, portfolios, landing pages, service sites, and custom CSS/JS enhancements.",
    accent: "from-emerald-500/20 to-transparent",
    border: "group-hover:border-emerald-500/30",
    glow: "bg-emerald-500/10",
    tags: ["Squarespace", "CSS/JS", "Fluid Engine"],
  },
  {
    icon: ShoppingCart,
    title: "Shopify Stores",
    description: "Custom Shopify storefronts, product pages, collection pages, custom Liquid sections, and conversion-focused eCommerce layouts.",
    accent: "from-cyan-500/20 to-transparent",
    border: "group-hover:border-cyan-500/30",
    glow: "bg-cyan-500/10",
    image: "/bento_ui_4k.png",
    tags: ["Shopify", "Liquid", "Dawn Theme"],
  },
  {
    icon: Globe,
    title: "Wix & Velo Development",
    description: "Custom Wix websites, dynamic pages, booking flows, forms, database logic, and Velo functionality.",
    accent: "from-purple-500/20 to-transparent",
    border: "group-hover:border-purple-500/30",
    glow: "bg-purple-500/10",
    tags: ["Wix", "Velo", "JavaScript"],
  },
  {
    icon: Code2,
    title: "React Frontend Development",
    description: "Modern interactive interfaces, dashboards, landing pages, and animated web experiences.",
    accent: "from-emerald-500/20 to-transparent",
    border: "group-hover:border-emerald-500/30",
    glow: "bg-emerald-500/10",
    image: "/bento_tech_4k.png",
    tags: ["React", "Next.js", "Framer Motion"],
  },
  {
    icon: Server,
    title: "Node.js / NestJS Backend",
    description: "Custom APIs, authentication, business logic, backend systems, and scalable server architecture.",
    accent: "from-cyan-500/20 to-transparent",
    border: "group-hover:border-cyan-500/30",
    glow: "bg-cyan-500/10",
    tags: ["Node.js", "NestJS", "REST API"],
  },
];

export const processSteps = [
  {
    num: "01",
    title: "Discovery",
    desc: "We understand your business, platform needs, target audience, and project goals.",
  },
  {
    num: "02",
    title: "UI/UX Design",
    desc: "We create clean, premium, user-friendly layouts with strong visual hierarchy and conversion intent.",
  },
  {
    num: "03",
    title: "Development",
    desc: "We build using the right platform: Squarespace, Shopify, Wix, or custom React/NestJS/MongoDB.",
  },
  {
    num: "04",
    title: "Testing & Launch",
    desc: "We test responsiveness, speed, functionality, browser compatibility, forms, animations, and final polish.",
  },
];

export const platformExpertise = [
  { name: "Squarespace", desc: "Elegant business websites & landing pages", color: "text-emerald-400", bg: "bg-emerald-500/5", border: "hover:border-emerald-500/25", icon: LayoutGrid, projectCount: "150+", expertise: "Expert" },
  { name: "Shopify", desc: "Premium eCommerce stores & product sites", color: "text-cyan-400", bg: "bg-cyan-500/5", border: "hover:border-cyan-500/25", icon: ShoppingCart, projectCount: "120+", expertise: "Expert" },
  { name: "Wix Velo", desc: "Flexible websites with custom database flow", color: "text-purple-400", bg: "bg-purple-500/5", border: "hover:border-purple-500/25", icon: Globe, projectCount: "80+", expertise: "Advanced" },
  { name: "React", desc: "Interactive frontend experiences & dashboards", color: "text-blue-400", bg: "bg-blue-500/5", border: "hover:border-blue-500/25", icon: Code2, projectCount: "70+", expertise: "Expert" },
  { name: "Node.js", desc: "Backend logic, custom APIs & microservices", color: "text-emerald-400", bg: "bg-emerald-500/5", border: "hover:border-emerald-500/25", icon: Server, projectCount: "60+", expertise: "Advanced" },
  { name: "NestJS", desc: "Scalable backend architecture for enterprise", color: "text-rose-400", bg: "bg-rose-500/5", border: "hover:border-rose-500/25", icon: Zap, projectCount: "30+", expertise: "Proficient" },
  { name: "MongoDB", desc: "Dynamic data, custom dashboards & cloud storage", color: "text-amber-400", bg: "bg-amber-500/5", border: "hover:border-amber-500/25", icon: Database, projectCount: "90+", expertise: "Expert" },
];

export const featuredProjects = [
  {
    title: "Premium Shopify Store Redesign",
    platform: "Shopify",
    focus: "Product page, collection page, custom Liquid sections, responsive layout",
    value: "Stronger product presentation and cleaner buying journey",
    image: "/project_shopify.png",
  },
  {
    title: "Architecture Firm Website",
    platform: "Squarespace",
    focus: "Portfolio showcase, full-bleed hero, custom CSS transitions",
    value: "Elevated brand perception with premium visual storytelling",
    image: "/project_squarespace.png",
  },
  {
    title: "SaaS Analytics Dashboard",
    platform: "React + NestJS + MongoDB",
    focus: "Real-time chart data, custom authentication, role-based access",
    value: "Full-stack enterprise platform with live websocket streaming",
    image: "/project_react.png",
  },
  {
    title: "Spa & Wellness Booking Site",
    platform: "Wix + Velo",
    focus: "Booking calendar, dynamic services catalog, customer database",
    value: "Increased customer conversion via friction-free scheduling",
    image: "/project_wix.png",
  },
];

export const animationChips = [
  "Cinematic Text Reveal",
  "Scroll-Triggered Entrances",
  "Floating UI Elements",
  "Magnetic Hover Buttons",
  "Parallax Image Layers",
  "Spring Physics Interactions",
  "Premium Card Hover Effects",
  "Loading Screen Sequences",
];
