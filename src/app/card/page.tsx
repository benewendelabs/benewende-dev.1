"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Globe,
  Download,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SiteSettings {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  discord?: string;
  reddit?: string;
  calendly?: string;
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

const defaultSettings: SiteSettings = {
  name: "Benewende.dev",
  email: "benewende.dev@gmail.com",
  phone: "+226 07 26 71 19",
  whatsapp: "2250708454592",
  location: "Ouagadougou, Burkina Faso",
  github: "https://github.com/benewendebrandstudios-design",
};

export default function CardPage() {
  const [site, setSite] = useState<SiteSettings>(defaultSettings);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetch("/api/content/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.site) setSite({ ...defaultSettings, ...data.site });
      })
      .catch(() => {});
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText("https://benewende.dev/card");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Benewende
ORG:Benewende.dev
TITLE:Développeur Full Stack & Créateur de SaaS
TEL;TYPE=CELL:${site.phone || ""}
EMAIL:${site.email || ""}
URL:https://benewende.dev
ADR;TYPE=WORK:;;${site.location || ""}
NOTE:Développeur Full Stack · Créateur de SaaS · Expert IA
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "benewende-dev.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const socials = [
    { icon: Github, href: site.github, label: "GitHub", color: "hover:bg-gray-700 hover:text-white" },
    { icon: Linkedin, href: site.linkedin, label: "LinkedIn", color: "hover:bg-blue-600 hover:text-white" },
    { icon: Twitter, href: site.twitter, label: "X", color: "hover:bg-black hover:text-white" },
    { icon: Facebook, href: site.facebook, label: "Facebook", color: "hover:bg-blue-500 hover:text-white" },
    { icon: Instagram, href: site.instagram, label: "Instagram", color: "hover:bg-pink-500 hover:text-white" },
    { icon: TikTokIcon, href: site.tiktok, label: "TikTok", color: "hover:bg-black hover:text-white" },
    { icon: DiscordIcon, href: site.discord, label: "Discord", color: "hover:bg-indigo-500 hover:text-white" },
    { icon: RedditIcon, href: site.reddit, label: "Reddit", color: "hover:bg-orange-500 hover:text-white" },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          {/* Gradient Header */}
          <div className="relative h-32 bg-gradient-to-br from-primary via-primary/80 to-purple-600 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />
          </div>

          {/* Avatar */}
          <div className="relative -mt-16 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-[3px] shadow-xl shadow-primary/25 rotate-3">
                <div className="h-full w-full rounded-2xl bg-card flex items-center justify-center -rotate-3">
                  <span className="text-4xl font-bold gradient-text">B</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-green-500 border-[3px] border-card flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Info */}
          <div className="px-6 pt-4 pb-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-2xl font-bold tracking-tight">Benewende</h1>
              <p className="text-sm text-primary font-medium mt-0.5">.dev</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-3"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                Développeur Full Stack · Créateur de SaaS · Expert IA
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground mt-3 leading-relaxed"
            >
              Je transforme vos idées en produits digitaux performants.
              SaaS, apps web, solutions IA — du concept au déploiement.
            </motion.p>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="px-6 py-4 space-y-2"
          >
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all group"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</div>
                <div className="text-sm font-medium truncate">{site.email}</div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all group"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Téléphone</div>
                  <div className="text-sm font-medium">{site.phone}</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {site.whatsapp && (
              <a
                href={`https://wa.me/${site.whatsapp}?text=Bonjour%20Benewende%2C%20je%20souhaite%20discuter%20d%27un%20projet.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 hover:bg-green-500/15 border border-green-500/10 transition-all group"
              >
                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-green-600 uppercase tracking-wider">WhatsApp</div>
                  <div className="text-sm font-medium text-green-600">Envoyer un message</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Localisation</div>
                <div className="text-sm font-medium">{site.location}</div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          {socials.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="px-6 pb-4"
            >
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 text-center">Réseaux sociaux</div>
              <div className="flex justify-center gap-2">
                {socials.map((social, i) => (
                  <motion.a
                    key={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.05 }}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-11 w-11 rounded-xl bg-muted/40 flex items-center justify-center transition-all duration-200 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="px-6 pb-6 space-y-2"
          >
            <Link href="/" className="block">
              <Button className="w-full gap-2 h-11 rounded-xl text-sm" size="lg">
                <Globe className="h-4 w-4" />
                Voir mon portfolio
              </Button>
            </Link>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="gap-1.5 h-10 rounded-xl text-xs"
                onClick={downloadVCard}
              >
                <Download className="h-3.5 w-3.5" />
                vCard
              </Button>

              <Button
                variant="outline"
                className="gap-1.5 h-10 rounded-xl text-xs"
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode className="h-3.5 w-3.5" />
                QR Code
              </Button>

              <Button
                variant="outline"
                className={`gap-1.5 h-10 rounded-xl text-xs ${copied ? "border-green-500 text-green-500" : ""}`}
                onClick={copyLink}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copié !" : "Lien"}
              </Button>
            </div>

            {/* QR Code */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col items-center p-4 rounded-xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://benewende.dev/card&color=0a0a0a&bgcolor=ffffff&format=svg`}
                    alt="QR Code Benewende.dev"
                    width={180}
                    height={180}
                    className="rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">benewende.dev/card</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-border/30 text-center">
            <p className="text-[10px] text-muted-foreground">
              &copy; {new Date().getFullYear()} Benewende.dev &mdash; Ouagadougou, Burkina Faso
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
