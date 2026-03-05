"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Twitter,
  Zap,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useContent } from "@/lib/useContent";

interface SiteSettings {
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

const budgetOptions = [
  "< 500 000 FCFA",
  "500K - 1.5M FCFA",
  "1.5M - 3M FCFA",
  "3M+ FCFA",
  "Je ne sais pas encore",
];

const defaultSiteSettings: SiteSettings = {
  email: "benewende.dev@gmail.com",
  phone: "+226 07 26 71 19",
  whatsapp: "2250708454592",
  location: "Ouagadougou, Burkina Faso",
  github: "https://github.com/benewende",
  linkedin: "https://linkedin.com/in/benewende",
  twitter: "https://x.com/benewende",
  facebook: "",
  instagram: "",
  tiktok: "",
};

export default function Contact() {
  const allSettings = useContent<Record<string, SiteSettings>>("settings", {});
  const site = { ...defaultSiteSettings, ...(allSettings.site || {}) };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      setFormData({ name: "", email: "", project: "", budget: "", message: "" });
    } catch {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Contact
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pr&ecirc;t &agrave; lancer votre{" "}
            <span className="gradient-text">projet</span> ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Je transforme vos id&eacute;es en produits digitaux rentables. Parlons de
            votre projet.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Message envoy&eacute; !
                  </h3>
                  <p className="text-muted-foreground">
                    Je vous r&eacute;ponds sous 24h. Merci !
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Nom complet
                      </label>
                      <Input
                        required
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Email
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="pro@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Type de projet
                    </label>
                    <Input
                      required
                      placeholder="SaaS, Web App, Application mobile..."
                      value={formData.project}
                      onChange={(e) =>
                        setFormData({ ...formData, project: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Budget estim&eacute;
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, budget: option })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            formData.budget === option
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/50 text-muted-foreground border-border hover:border-primary/30"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Message
                    </label>
                    <Textarea
                      required
                      rows={4}
                      placeholder="D&eacute;crivez votre projet en quelques lignes..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Email</div>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {site.email}
                  </a>
                </div>
              </div>

              {site.phone && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">T&eacute;l&eacute;phone</div>
                    <a
                      href={`tel:${site.phone}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {site.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Localisation</div>
                  <div className="text-sm text-muted-foreground">
                    {site.location}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-sm">WhatsApp</div>
                  <a
                    href={`https://wa.me/${site.whatsapp}?text=Bonjour%20Benewende%2C%20je%20souhaite%20discuter%20d%27un%20projet.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-500 hover:underline"
                  >
                    Envoyer un message
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Appel découverte</div>
                  {site.calendly ? (
                    <a
                      href={site.calendly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Réserver un créneau Calendly
                    </a>
                  ) : (
                    <a
                      href={`https://wa.me/${site.whatsapp}?text=Bonjour%20Benewende%2C%20je%20souhaite%20planifier%20un%20appel%20d%C3%A9couverte%20de%2030min.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Planifier 30min gratuites via WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="text-sm font-medium mb-3">Suivez-moi</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Github, href: site.github, label: "GitHub" },
                  { icon: Linkedin, href: site.linkedin, label: "LinkedIn" },
                  { icon: Twitter, href: site.twitter, label: "X / Twitter" },
                  { icon: Facebook, href: site.facebook, label: "Facebook" },
                  { icon: Instagram, href: site.instagram, label: "Instagram" },
                  { icon: TikTokIcon, href: site.tiktok, label: "TikTok" },
                  { icon: DiscordIcon, href: (site as Record<string, string>).discord, label: "Discord" },
                  { icon: RedditIcon, href: (site as Record<string, string>).reddit, label: "Reddit" },
                ].filter((s) => s.href).map((social) => (
                  <a
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-lg bg-muted/50 hover:bg-primary/10 flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <Card className="p-5 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">
                  R&eacute;ponse garantie sous 24h
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Je r&eacute;ponds &agrave; chaque message dans un d&eacute;lai de 24 heures
                maximum. Pour les urgences, contactez-moi directement par
                email.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
