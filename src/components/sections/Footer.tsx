"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter, Heart, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useContent } from "@/lib/useContent";

interface SiteSettings {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  discord?: string;
  reddit?: string;
  whatsapp?: string;
}

interface FooterSettings {
  copyright?: string;
  tagline?: string;
  description?: string;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const RedditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

interface FeatureToggles {
  cvGenerator?: boolean;
  converter?: boolean;
  payments?: boolean;
  card?: boolean;
}

function buildFooterLinks(ft: FeatureToggles) {
  const feat = (key: keyof FeatureToggles, def: boolean) => ft[key] !== undefined ? !!ft[key] : def;

  const servicesLinks = [
    { label: "Développement SaaS", href: "#services" },
    { label: "Web App", href: "#services" },
    { label: "Solutions IA", href: "#services" },
  ];
  if (feat("cvGenerator", true)) servicesLinks.push({ label: "CV Generator", href: "/cv-generator" });
  if (feat("converter", true)) servicesLinks.push({ label: "Convertisseur", href: "/converter" });

  const ressourcesLinks = [
    { label: "Process", href: "#process" },
    { label: "Témoignages", href: "#temoignages" },
    { label: "Expérience", href: "#experience" },
  ];
  if (feat("payments", false)) ressourcesLinks.push({ label: "Paiement", href: "/payment" });
  if (feat("card", true)) ressourcesLinks.push({ label: "Ma Carte", href: "/card" });

  return [
    {
      title: "Navigation",
      links: [
        { label: "Services", href: "#services" },
        { label: "Projets", href: "#projets" },
        { label: "Compétences", href: "#competences" },
        { label: "Contact", href: "#contact" },
      ],
    },
    { title: "Services", links: servicesLinks },
    { title: "Ressources", links: ressourcesLinks },
  ];
}

const defaultSiteSettings: SiteSettings = {
  github: "https://github.com/benewende",
  linkedin: "https://linkedin.com/in/benewende",
  twitter: "https://x.com/benewende",
  facebook: "",
  instagram: "",
  tiktok: "",
};

export default function Footer() {
  const allSettings = useContent<Record<string, unknown>>("settings", {});
  const site = { ...defaultSiteSettings, ...((allSettings.site as SiteSettings) || {}) };
  const footer = (allSettings.footer as FooterSettings) || {};
  const features = (allSettings.features as FeatureToggles) || {};
  const footerLinks = buildFooterLinks(features);

  const socials = [
    { icon: Github, href: site.github, label: "GitHub" },
    { icon: Linkedin, href: site.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: site.twitter, label: "X / Twitter" },
    { icon: Facebook, href: site.facebook, label: "Facebook" },
    { icon: Instagram, href: site.instagram, label: "Instagram" },
    { icon: TikTokIcon, href: site.tiktok, label: "TikTok" },
    { icon: MessageCircle, href: site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}` : undefined, label: "WhatsApp" },
    { icon: DiscordIcon, href: site.discord, label: "Discord" },
    { icon: RedditIcon, href: site.reddit, label: "Reddit" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Benewende</span>
              <span className="text-muted-foreground">.dev</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs">
              {footer.description || "Développeur Full Stack & Créateur de SaaS basé à Ouagadougou, Burkina Faso."}
            </p>
            <div className="flex gap-3 mt-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-primary/10 flex items-center justify-center transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {footer.copyright || "Benewende.dev. Tous droits réservés."}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {footer.tagline ? footer.tagline : (<>Fait avec <Heart className="h-3 w-3 text-red-500 fill-red-500" /> à Ouagadougou</>)}
          </p>
        </div>
      </div>
    </footer>
  );
}
