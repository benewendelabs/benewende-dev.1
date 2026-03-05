"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MessageCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const defaultTypingTexts = [
  "des SaaS qui résolvent de vrais problèmes",
  "des applications web performantes",
  "des solutions IA innovantes",
  "des expériences digitales premium",
];

const stats = [
  { value: "25+", label: "Projets livrés" },
  { value: "3+", label: "Années d'expérience" },
  { value: "98%", label: "Satisfaction clients" },
];

interface HeroSettings {
  title?: string;
  subtitle?: string;
  typingTexts?: string[];
  available?: boolean;
}

const DEFAULT_WHATSAPP = "2250708454592";

export default function Hero() {
  const [currentText, setCurrentText] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({});
  const [whatsappNum, setWhatsappNum] = useState(DEFAULT_WHATSAPP);

  useEffect(() => {
    fetch("/api/content/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.hero) setHeroSettings(data.hero);
        if (data?.site?.whatsapp) setWhatsappNum((data.site.whatsapp as string).replace(/\D/g, ""));
      })
      .catch(() => {});
  }, []);

  const typingTexts = heroSettings.typingTexts?.length ? heroSettings.typingTexts : defaultTypingTexts;
  const isAvailable = heroSettings.available !== undefined ? heroSettings.available : true;
  const heroTitle = heroSettings.title || "Je crée";
  const heroSubtitle = heroSettings.subtitle || "Développeur Full Stack \u00b7 Créateur de SaaS \u00b7 Expert IA";

  useEffect(() => {
    const text = typingTexts[currentText % typingTexts.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayedText(text.slice(0, displayedText.length + 1));
          if (displayedText.length === text.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayedText(text.slice(0, displayedText.length - 1));
          if (displayedText.length === 0) {
            setIsDeleting(false);
            setCurrentText((prev) => (prev + 1) % (typingTexts?.length || 1));
          }
        }
      },
      isDeleting ? 30 : 60
    );
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentText, typingTexts]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            {isAvailable ? "Disponible pour projets" : "Actuellement en mission"}
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="block text-foreground">{heroTitle}</span>
          <span className="block gradient-text min-h-[1.2em]">
            {displayedText}
            <span className="animate-pulse text-primary">|</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          {heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8">
              <Rocket className="h-5 w-5" />
              Démarrer un projet
            </Button>
          </Link>
          <a href="#projets">
            <Button size="lg" variant="outline" className="gap-2 text-base px-8">
              Voir mes projets
            </Button>
          </a>
          <a href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Bonjour, je suis intéressé par vos services de développement.")}`} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2 text-base px-8 text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#services">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
