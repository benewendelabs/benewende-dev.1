"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Save,
  ArrowLeft,
  Crown,
  Check,
  FileText,
  Sparkles,
  Eye,
  MessageSquare,
  Zap,
  Shield,
  Palette,
  Loader2,
  PauseCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CVChat from "@/components/cv/CVChat";
import CVForm from "@/components/cv/CVForm";
import CVPreview from "@/components/cv/CVPreview";
import { CVData, defaultCVData, cvTemplates, chatSteps } from "@/lib/cv/templates";
import { useCurrency } from "@/components/currency-provider";

export default function CVGeneratorPage() {
  const [cvData, setCvData] = useState<CVData>({ ...defaultCVData });
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/22607267119");

  useEffect(() => {
    fetch("/api/content/settings")
      .then((r) => r.json())
      .then((data) => {
        const features = data.features || {};
        setFeatureEnabled(features.cvGenerator !== undefined ? !!features.cvGenerator : true);
        if (data.site?.whatsapp) setWhatsappUrl(`https://wa.me/${(data.site.whatsapp as string).replace(/\D/g, "")}`);
      })
      .catch(() => setFeatureEnabled(true));
  }, []);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isComplete, setIsComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<"chat" | "form">("chat");
  const { currency } = useCurrency();

  const totalSteps = chatSteps.length - 2;
  const progress = useMemo(
    () => Math.min(Math.round((currentStep / totalSteps) * 100), 100),
    [currentStep, totalSteps]
  );

  const priceLabels: Record<string, string> = {
    XOF: "3 000 FCFA",
    EUR: "5€",
    USD: "$5",
  };
  const businessLabels: Record<string, string> = {
    XOF: "30 000 FCFA",
    EUR: "50€",
    USD: "$50",
  };

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    try {
      const { generateCVPdf } = await import("@/lib/generatePDF");
      const fileName = cvData.personalInfo.fullName
        ? `CV-${cvData.personalInfo.fullName.replace(/\s+/g, "_")}`
        : "CV-Benewende";
      await generateCVPdf("cv-preview-content", fileName);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Erreur lors de la génération du PDF. Utilisez Ctrl+P (Cmd+P) comme alternative.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  if (featureEnabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (featureEnabled === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center space-y-6">
          <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
            <PauseCircle className="h-10 w-10 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Service en pause</h1>
            <p className="text-muted-foreground">Le générateur de CV est temporairement désactivé. Contactez-nous sur WhatsApp pour toute demande.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full gap-2 bg-[#25D366] hover:bg-[#1da851] text-white">
                <MessageCircle className="h-5 w-5" />
                Nous contacter sur WhatsApp
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight flex items-center gap-2">
                    CV Generator
                    <Badge variant="secondary" className="text-[10px] gap-0.5 font-medium">
                      <Sparkles className="h-2.5 w-2.5" /> IA
                    </Badge>
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    &Eacute;tape {Math.min(currentStep, totalSteps)}/{totalSteps}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar - center */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs mx-8">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground w-8">{progress}%</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden gap-1.5 rounded-full"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <><MessageSquare className="h-3.5 w-3.5" /> Chat</>
                ) : (
                  <><Eye className="h-3.5 w-3.5" /> Aper&ccedil;u</>
                )}
              </Button>

              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 hidden sm:flex rounded-full"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Sauvegarder
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      onClick={handleDownloadPDF}
                      disabled={isPdfLoading}
                    >
                      {isPdfLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">{isPdfLoading ? "G\u00e9n\u00e9ration..." : "T\u00e9l\u00e9charger"}</span> {!isPdfLoading && "PDF"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile progress bar */}
          <div className="md:hidden pb-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Template selector - sleeker horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Choisir un template</h2>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {cvTemplates.length} templates
            </Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {cvTemplates.map((tmpl) => {
              const tierConfig = {
                free: { label: "Gratuit", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                pro: { label: "Pro", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
                premium: { label: "Premium", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
              }[tmpl.tier];
              const [c1, c2] = tmpl.previewColors;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`group relative shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedTemplate === tmpl.id
                      ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                      : "border-border/50 hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  {/* Mini preview — distinct layout per template */}
                  <div className="w-[120px] h-[156px] bg-white relative overflow-hidden">
                    {tmpl.layout === "sidebar-left" && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-[38%]" style={{ backgroundColor: c1 }}>
                          <div className="mt-4 mx-auto w-5 h-5 rounded-full" style={{ backgroundColor: c2 }} />
                          <div className="mt-2 mx-2 space-y-1">{[...Array(4)].map((_, i) => <div key={i} className="h-0.5 rounded-full bg-white/30" />)}</div>
                        </div>
                        <div className="ml-[42%] mt-3 mr-2 space-y-1.5">
                          <div className="h-1 rounded-full w-3/4" style={{ backgroundColor: c1 }} />
                          <div className="h-0.5 bg-gray-200 rounded-full w-full" />
                          <div className="h-0.5 bg-gray-200 rounded-full w-2/3" />
                          <div className="mt-2 h-0.5 rounded-full w-1/2" style={{ backgroundColor: c2 + "60" }} />
                          <div className="h-0.5 bg-gray-100 rounded-full" /><div className="h-0.5 bg-gray-100 rounded-full w-5/6" />
                        </div>
                      </>
                    )}
                    {tmpl.layout === "sidebar-right" && (
                      <>
                        <div className="absolute right-0 top-0 bottom-0 w-[32%]" style={{ backgroundColor: c1 + "15" }}>
                          <div className="mt-3 mx-2 space-y-1">{[...Array(5)].map((_, i) => <div key={i} className="h-0.5 rounded-full" style={{ backgroundColor: c2 + "40" }} />)}</div>
                          <div className="mt-2 mx-2 space-y-1">{[...Array(3)].map((_, i) => <div key={i} className="h-1 rounded-full" style={{ backgroundColor: c2 + "30" }} />)}</div>
                        </div>
                        <div className="mr-[35%] p-2">
                          <div className="h-6 rounded mb-2" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                            <div className="h-1 bg-white/60 rounded-full w-2/3 ml-1.5 mt-1.5" />
                          </div>
                          <div className="space-y-1"><div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-4/5" /><div className="h-0.5 bg-gray-200 rounded-full w-full" /></div>
                        </div>
                      </>
                    )}
                    {tmpl.layout === "header-bold" && (
                      <>
                        <div className="h-10" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                          <div className="pt-2.5 pl-2.5"><div className="h-1.5 bg-white/80 rounded-full w-2/3" /><div className="h-0.5 bg-white/40 rounded-full w-1/3 mt-1" /></div>
                        </div>
                        <div className="p-2 space-y-1.5">
                          <div className="h-0.5 rounded-full w-1/3" style={{ backgroundColor: c1 + "60" }} />
                          <div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-5/6" />
                          <div className="mt-1 h-0.5 rounded-full w-1/3" style={{ backgroundColor: c1 + "60" }} />
                          <div className="h-0.5 bg-gray-200 rounded-full w-3/4" /><div className="h-0.5 bg-gray-100 rounded-full" />
                          <div className="flex gap-0.5 mt-1">{[...Array(3)].map((_, i) => <div key={i} className="h-1.5 rounded-full px-1" style={{ backgroundColor: c1 + "20", flex: 1 }} />)}</div>
                        </div>
                      </>
                    )}
                    {tmpl.layout === "two-column" && (
                      <div className="p-2">
                        <div className="text-center mb-1.5"><div className="h-1 mx-auto rounded-full w-2/3" style={{ backgroundColor: c1 }} /><div className="h-0.5 mx-auto mt-0.5 rounded-full w-1/3" style={{ backgroundColor: c2 + "60" }} /></div>
                        <div className="border-t" style={{ borderColor: c2 + "40" }} />
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                          <div className="space-y-1"><div className="h-0.5 rounded-full" style={{ backgroundColor: c2 + "60" }} /><div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-4/5" /><div className="h-0.5 bg-gray-100 rounded-full" /></div>
                          <div className="space-y-1"><div className="h-0.5 rounded-full" style={{ backgroundColor: c2 + "60" }} /><div className="h-0.5 bg-gray-200 rounded-full w-5/6" /><div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-100 rounded-full w-3/4" /></div>
                        </div>
                      </div>
                    )}
                    {tmpl.layout === "single" && tmpl.id === "classic" && (
                      <div className="p-2.5">
                        <div className="text-center mb-2 pb-1.5" style={{ borderBottom: `1.5px double ${c1}` }}><div className="h-1.5 mx-auto rounded-full w-3/4" style={{ backgroundColor: c1 }} /><div className="h-0.5 mx-auto mt-1 rounded-full w-1/2 bg-gray-300" /></div>
                        <div className="space-y-1.5">
                          <div className="h-0.5 rounded-full w-1/3" style={{ backgroundColor: c1, borderBottom: `1px solid ${c1}` }} />
                          <div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-5/6" />
                          <div className="h-0.5 rounded-full w-1/3 mt-1" style={{ backgroundColor: c1 }} />
                          <div className="h-0.5 bg-gray-200 rounded-full w-3/4" /><div className="h-0.5 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                    )}
                    {tmpl.layout === "single" && tmpl.id === "modern" && (
                      <div className="p-2.5">
                        <div className="mb-2"><div className="h-2 rounded-full w-3/4" style={{ backgroundColor: "#111" }} /><div className="h-0.5 mt-1 rounded-full w-1/2" style={{ backgroundColor: c1 }} /><div className="flex gap-1 mt-1.5">{[...Array(3)].map((_, i) => <div key={i} className="h-1 rounded px-1 bg-gray-100" style={{ flex: 1 }} />)}</div></div>
                        <div className="flex items-center gap-1 mb-1.5"><div className="w-0.5 h-2.5 rounded" style={{ backgroundColor: c1 }} /><div className="h-0.5 rounded-full w-1/3" style={{ backgroundColor: c1 }} /></div>
                        <div className="space-y-0.5 pl-1.5 border-l border-gray-200"><div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-4/5" /></div>
                        <div className="flex gap-0.5 mt-2">{[...Array(4)].map((_, i) => <div key={i} className="h-1.5 rounded-full" style={{ backgroundColor: c1 + "20", flex: 1 }} />)}</div>
                      </div>
                    )}
                    {tmpl.layout === "single" && tmpl.id === "elegant" && (
                      <div className="p-2.5">
                        <div className="text-center mb-2"><div className="flex items-center justify-center gap-1"><div className="w-4 h-px" style={{ backgroundColor: c1 }} /><div className="h-1.5 rounded-full w-1/2" style={{ backgroundColor: c1 + "30" }} /><div className="w-4 h-px" style={{ backgroundColor: c1 }} /></div><div className="h-0.5 mx-auto mt-1 rounded-full w-1/3" style={{ backgroundColor: c2 + "60" }} /></div>
                        <div className="flex items-center gap-1 my-1.5"><div className="flex-1 h-px" style={{ backgroundColor: c1 + "30" }} /><div className="w-1 h-1 rotate-45" style={{ backgroundColor: c1 }} /><div className="flex-1 h-px" style={{ backgroundColor: c1 + "30" }} /></div>
                        <div className="space-y-1 text-center"><div className="h-0.5 mx-auto bg-gray-200 rounded-full w-4/5" /><div className="h-0.5 mx-auto bg-gray-200 rounded-full w-3/5" /><div className="h-0.5 mx-auto bg-gray-100 rounded-full w-full" /></div>
                      </div>
                    )}
                    {/* Minimal — ultra-clean, thin accent */}
                    {tmpl.layout === "minimal" && (
                      <div className="p-3">
                        <div className="mb-2"><div className="h-2 rounded-full w-4/5 bg-gray-800" /><div className="w-5 h-0.5 rounded-full mt-1.5 mb-1" style={{ backgroundColor: c1 }} /><div className="h-0.5 bg-gray-300 rounded-full w-1/2" /></div>
                        <div className="space-y-2 mt-3">
                          <div className="h-px w-1/4" style={{ backgroundColor: c1 + "40" }} />
                          <div className="space-y-0.5"><div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-5/6" /></div>
                          <div className="h-px w-1/4" style={{ backgroundColor: c1 + "40" }} />
                          <div className="space-y-0.5"><div className="h-0.5 bg-gray-200 rounded-full w-4/5" /><div className="h-0.5 bg-gray-100 rounded-full" /></div>
                        </div>
                      </div>
                    )}
                    {/* Berlin — split header with arrow */}
                    {tmpl.id === "berlin" && (
                      <div>
                        <div className="flex h-10">
                          <div className="flex-1 relative" style={{ backgroundColor: c1 }}>
                            <div className="pt-2 pl-2"><div className="h-1.5 bg-white/80 rounded-full w-4/5" /><div className="h-0.5 mt-1 rounded-full w-1/2" style={{ backgroundColor: c2 }} /></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px]" style={{ borderLeftColor: c2 }} />
                          </div>
                          <div className="w-[35%] bg-gray-100 p-1.5 space-y-0.5">{[...Array(3)].map((_, i) => <div key={i} className="h-0.5 rounded-full" style={{ backgroundColor: c1 + "40" }} />)}</div>
                        </div>
                        <div className="p-2 space-y-1.5">
                          <div className="flex items-center gap-1"><div className="w-2.5 h-0.5" style={{ backgroundColor: c2 }} /><div className="h-0.5 rounded-full w-1/4" style={{ backgroundColor: c1 }} /></div>
                          <div className="flex gap-2 pl-3">
                            <div className="w-8 space-y-0.5 shrink-0"><div className="h-0.5 rounded-full" style={{ backgroundColor: c2 + "60" }} /><div className="h-0.5 bg-gray-200 rounded-full" /></div>
                            <div className="w-0.5 rounded shrink-0" style={{ backgroundColor: c2 + "30" }} />
                            <div className="flex-1 space-y-0.5"><div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-4/5" /></div>
                          </div>
                          <div className="flex gap-0.5 mt-1">{[...Array(3)].map((_, i) => <div key={i} className="h-1 rounded-full" style={{ backgroundColor: c2, flex: 1, opacity: 0.15 + i * 0.1 }} />)}</div>
                        </div>
                      </div>
                    )}
                    {/* Artisan — centered, warm, rounded */}
                    {tmpl.layout === "centered" && (
                      <div className="p-2.5">
                        <div className="text-center mb-2">
                          <div className="w-6 h-6 rounded-full mx-auto" style={{ backgroundColor: c1 + "15", border: `1.5px solid ${c1}40` }} />
                          <div className="h-1.5 mx-auto mt-1.5 rounded-full w-3/5" style={{ backgroundColor: c1 + "20" }} />
                          <div className="flex items-center justify-center gap-1 mt-1"><div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: c1 + "40" }} /><div className="w-1 h-1 rounded-full" style={{ backgroundColor: c1 + "30" }} /><div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: c1 + "40" }} /></div>
                        </div>
                        <div className="rounded-lg p-1.5 mb-1.5" style={{ backgroundColor: c1 + "08", border: `1px solid ${c1}15` }}>
                          <div className="space-y-0.5"><div className="h-0.5 mx-auto bg-gray-200 rounded-full w-4/5" /><div className="h-0.5 mx-auto bg-gray-200 rounded-full w-3/5" /></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-0.5 mt-1">{[...Array(4)].map((_, i) => <div key={i} className="h-1.5 rounded-full px-2" style={{ backgroundColor: c1 + "12", border: `1px solid ${c1}20` }} />)}</div>
                      </div>
                    )}
                    {/* Luxe — left content + navy right sidebar with gold bar */}
                    {tmpl.id === "luxe" && (
                      <>
                        <div className="flex h-full">
                          <div className="flex-1 p-2">
                            <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: c1 }} />
                            <div className="w-5 h-0.5 mt-1 mb-2" style={{ background: `linear-gradient(to right, ${c2}, transparent)` }} />
                            <div className="space-y-1">
                              <div className="flex items-center gap-1"><div className="w-1 h-1 rotate-45" style={{ backgroundColor: c2 }} /><div className="h-0.5 rounded-full w-1/3" style={{ backgroundColor: c1 }} /></div>
                              <div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-200 rounded-full w-5/6" />
                              <div className="h-0.5 bg-gray-100 rounded-full w-3/4" />
                            </div>
                          </div>
                          <div className="w-[30%] shrink-0 relative" style={{ backgroundColor: c1 }}>
                            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: c2 }} />
                            <div className="mt-3 mx-1.5">
                              <div className="w-4 h-4 rounded-full mx-auto" style={{ border: `1px solid ${c2}60` }} />
                              <div className="mt-2 space-y-0.5">{[...Array(3)].map((_, i) => <div key={i} className="h-0.5 rounded-full bg-white/20" />)}</div>
                              <div className="mt-2 space-y-1">{[...Array(2)].map((_, i) => <div key={i} className="h-0.5 rounded-full" style={{ backgroundColor: c2 + "40" }} />)}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {/* Mosaic — card grid */}
                    {tmpl.layout === "mosaic" && (
                      <div className="p-1.5" style={{ backgroundColor: "#f9fafb" }}>
                        <div className="rounded-lg p-2 mb-1" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-white/20" /><div><div className="h-1 bg-white/80 rounded-full w-12" /><div className="h-0.5 bg-white/40 rounded-full w-8 mt-0.5" /></div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded p-1 border border-gray-100">
                              <div className="h-0.5 rounded-full w-2/3 mb-0.5" style={{ backgroundColor: c1 + "40" }} />
                              <div className="h-0.5 bg-gray-200 rounded-full" /><div className="h-0.5 bg-gray-100 rounded-full w-4/5 mt-0.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Aurora — teal→purple gradient header + frosted cards */}
                    {tmpl.id === "aurora" && (
                      <div className="h-full" style={{ background: "linear-gradient(135deg, #f0fdfa, #ede9fe, #fdf4ff)" }}>
                        <div className="rounded-b-xl p-2 mx-0.5 mt-0.5" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                          <div className="w-4 h-4 rounded-full bg-white/15 mb-1" />
                          <div className="h-1.5 bg-white/80 rounded-full w-3/4" /><div className="h-0.5 bg-white/40 rounded-full w-1/2 mt-0.5" />
                        </div>
                        <div className="p-1.5 space-y-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-lg p-1.5" style={{ backgroundColor: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.4)" }}>
                              <div className="h-0.5 rounded-full w-1/3 mb-0.5" style={{ backgroundColor: c2 + "40" }} />
                              <div className="h-0.5 bg-gray-200 rounded-full w-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="px-2.5 py-2 bg-card text-center">
                    <p className="text-[11px] font-semibold">{tmpl.name}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{tmpl.description}</p>
                    <Badge variant="secondary" className={`text-[9px] mt-1.5 gap-0.5 ${tierConfig.color}`}>
                      {tmpl.tier === "premium" && <Crown className="h-2 w-2" />}
                      {tmpl.tier === "pro" && <Sparkles className="h-2 w-2" />}
                      {tierConfig.label}
                    </Badge>
                  </div>
                  {selectedTemplate === tmpl.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    >
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </motion.div>
                  )}
                  {tmpl.tier !== "free" && (
                    <div className="absolute top-2 left-2 h-4 w-4 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
                      <Crown className="h-2.5 w-2.5 text-amber-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main content - Chat + Preview */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 min-h-[calc(100vh-260px)]">
          {/* Chat panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-sm ${
              showPreview ? "hidden lg:flex lg:flex-col" : "flex flex-col"
            }`}
          >
            {/* Mode toggle */}
            <div className="flex border-b border-border/50">
              <button
                onClick={() => setMode("chat")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
                  mode === "chat"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> Assistant Chat
              </button>
              <button
                onClick={() => setMode("form")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
                  mode === "form"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" /> Formulaire
              </button>
            </div>
            {mode === "chat" ? (
              <CVChat
                cvData={cvData}
                onUpdateCV={setCvData}
                onComplete={() => setIsComplete(true)}
                onStepChange={setCurrentStep}
              />
            ) : (
              <CVForm cvData={cvData} onUpdateCV={setCvData} />
            )}
          </motion.div>

          {/* Preview panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`bg-muted/20 border border-border/50 rounded-2xl overflow-hidden shadow-sm ${
              !showPreview ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold">Aper&ccedil;u en direct</span>
              </div>
              <Badge variant="outline" className="text-[10px] gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </Badge>
            </div>
            <CVPreview data={cvData} template={selectedTemplate} />
          </motion.div>
        </div>

        {/* Bottom pricing bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-card via-card to-card/80 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-primary/[0.03]" />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Choisissez votre plan</p>
                  <p className="text-xs text-muted-foreground">
                    Templates premium, optimisation ATS et suggestions IA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                {[
                  {
                    name: "Gratuit",
                    price: "0",
                    desc: "1 CV basique",
                    icon: FileText,
                    active: false,
                  },
                  {
                    name: "Pro",
                    price: priceLabels[currency],
                    desc: "par CV",
                    icon: Sparkles,
                    active: true,
                  },
                  {
                    name: "Business",
                    price: `${businessLabels[currency]}/mois`,
                    desc: "Illimité",
                    icon: Shield,
                    active: false,
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`text-center px-4 py-3 rounded-xl transition-all ${
                      plan.active
                        ? "bg-primary/10 border border-primary/20 shadow-sm"
                        : "bg-muted/50 border border-transparent"
                    }`}
                  >
                    <plan.icon className={`h-4 w-4 mx-auto mb-1 ${plan.active ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {plan.name}
                    </div>
                    <div className={`text-sm font-bold ${plan.active ? "text-primary" : ""}`}>
                      {plan.price}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{plan.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
