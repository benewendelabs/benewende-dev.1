"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Clock, RefreshCw, Headphones, Star, ArrowRight,
  Globe, ShoppingBag, Code, Rocket, Smartphone, Bot, Wrench, Layout,
  ChevronDown, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/useContent";
import { useCurrency } from "@/components/currency-provider";
import { Currency } from "@/data/services";

interface PricingPlan {
  id: string;
  serviceCategory: string;
  tierName: string;
  tierLevel: number;
  description: string;
  price: Record<Currency, string>;
  features: string[];
  deliveryTime: string;
  revisions: string;
  support: string;
  maintenance: Record<Currency, string> | null;
  popular: boolean;
  sortOrder: number;
}

const categoryConfig: Record<string, { label: string; description: string; icon: React.ElementType; gradient: string; accent: string }> = {
  "site-vitrine": {
    label: "Site Vitrine",
    description: "Pr\u00e9sence en ligne professionnelle pour votre entreprise",
    icon: Globe,
    gradient: "from-blue-500/20 to-blue-600/5",
    accent: "text-blue-500",
  },
  "site-wordpress": {
    label: "Site WordPress",
    description: "Sites WordPress personnalis\u00e9s et performants",
    icon: Layout,
    gradient: "from-indigo-500/20 to-indigo-600/5",
    accent: "text-indigo-500",
  },
  "boutique-shopify": {
    label: "Boutique Shopify",
    description: "Votre boutique e-commerce cl\u00e9 en main",
    icon: ShoppingBag,
    gradient: "from-green-500/20 to-green-600/5",
    accent: "text-green-500",
  },
  "webapp": {
    label: "Web App Sur Mesure",
    description: "Applications web modernes et performantes",
    icon: Code,
    gradient: "from-purple-500/20 to-purple-600/5",
    accent: "text-purple-500",
  },
  "saas": {
    label: "Plateforme SaaS",
    description: "Lancez votre produit SaaS de z\u00e9ro",
    icon: Rocket,
    gradient: "from-orange-500/20 to-orange-600/5",
    accent: "text-orange-500",
  },
  "mobile": {
    label: "Application Mobile",
    description: "Apps iOS & Android natives ou cross-platform",
    icon: Smartphone,
    gradient: "from-pink-500/20 to-pink-600/5",
    accent: "text-pink-500",
  },
  "ecommerce": {
    label: "E-Commerce Custom",
    description: "Solutions e-commerce sur mesure sans limites",
    icon: ShoppingBag,
    gradient: "from-amber-500/20 to-amber-600/5",
    accent: "text-amber-500",
  },
  "ia": {
    label: "Solution IA",
    description: "Int\u00e9grations IA & automatisation intelligente",
    icon: Bot,
    gradient: "from-cyan-500/20 to-cyan-600/5",
    accent: "text-cyan-500",
  },
  "maintenance": {
    label: "Maintenance & Support",
    description: "Gardez votre site performant et s\u00e9curis\u00e9",
    icon: Wrench,
    gradient: "from-slate-500/20 to-slate-600/5",
    accent: "text-slate-400",
  },
};

const defaultPlans: PricingPlan[] = [];

export default function Pricing() {
  const plans = useContent<PricingPlan[]>("pricing", defaultPlans);
  const { currency } = useCurrency();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(plans.map((p) => p.serviceCategory)));
  const grouped = plans.reduce<Record<string, PricingPlan[]>>((acc, p) => {
    if (!acc[p.serviceCategory]) acc[p.serviceCategory] = [];
    acc[p.serviceCategory].push(p);
    return acc;
  }, {});

  if (plans.length === 0) return null;

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Services & Tarifs</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Des solutions sur mesure,{" "}
            <span className="gradient-text">des prix transparents</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choisissez le service adapt&eacute; &agrave; vos besoins. Chaque formule inclut un accompagnement
            personnalis&eacute; de la conception au d&eacute;ploiement.
          </p>
        </motion.div>

        {/* Service Category Cards */}
        <div className="space-y-4">
          {categories.map((category, catIdx) => {
            const config = categoryConfig[category] || {
              label: category,
              description: "",
              icon: Globe,
              gradient: "from-gray-500/20 to-gray-600/5",
              accent: "text-gray-500",
            };
            const Icon = config.icon;
            const categoryPlans = (grouped[category] || []).sort((a, b) => a.tierLevel - b.tierLevel);
            const isExpanded = expandedCategory === category;
            const lowestPrice = categoryPlans[0]?.price[currency] || "";
            const hasPopular = categoryPlans.some((p) => p.popular);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.05 }}
              >
                {/* Category Header (clickable) */}
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:border-primary/30 ${
                    isExpanded ? "ring-1 ring-primary/20 border-primary/30" : "bg-card/50"
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shrink-0 ring-1 ring-white/5`}>
                        <Icon className={`h-6 w-6 ${config.accent}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold">{config.label}</h3>
                          <Badge variant="secondary" className="text-[10px]">
                            {categoryPlans.length} formule{categoryPlans.length > 1 ? "s" : ""}
                          </Badge>
                          {hasPopular && (
                            <Badge className="text-[10px] gap-0.5 bg-primary/10 text-primary border-primary/20">
                              <Sparkles className="h-2.5 w-2.5" />
                              Recommand&eacute;
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">
                          {config.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-xs text-muted-foreground">&Agrave; partir de</p>
                        <p className={`text-lg font-bold ${config.accent}`}>{lowestPrice}</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </CardContent>
                </Card>

                {/* Expanded Pricing Grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`pt-4 pb-2 grid gap-4 ${
                        categoryPlans.length === 1 ? "max-w-md mx-auto" :
                        categoryPlans.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" :
                        "md:grid-cols-3"
                      }`}>
                        {categoryPlans.map((plan, i) => (
                          <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Card className={`h-full relative group transition-all duration-300 hover:border-primary/30 bg-card/80 backdrop-blur-sm ${
                              plan.popular ? "ring-2 ring-primary shadow-lg shadow-primary/10" : ""
                            }`}>
                              {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                  <Badge className="gap-1 bg-primary text-primary-foreground shadow-lg">
                                    <Star className="h-3 w-3 fill-current" />
                                    Populaire
                                  </Badge>
                                </div>
                              )}
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">{plan.tierName}</CardTitle>
                                {plan.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
                                )}
                                <div className="mt-3">
                                  <span className="text-2xl sm:text-3xl font-bold text-primary">{plan.price[currency]}</span>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {/* Features */}
                                <ul className="space-y-1.5">
                                  {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="h-2.5 w-2.5 text-primary" />
                                      </div>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>

                                {/* Delivery / Revisions / Support */}
                                <div className="pt-3 border-t border-border space-y-1.5">
                                  {plan.deliveryTime && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3 text-primary/60" />
                                      {plan.deliveryTime}
                                    </div>
                                  )}
                                  {plan.revisions && plan.revisions !== "-" && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <RefreshCw className="h-3 w-3 text-primary/60" />
                                      {plan.revisions}
                                    </div>
                                  )}
                                  {plan.support && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Headphones className="h-3 w-3 text-primary/60" />
                                      {plan.support}
                                    </div>
                                  )}
                                </div>

                                {/* Maintenance */}
                                {plan.maintenance && (
                                  <div className="pt-2 border-t border-border">
                                    <div className="flex items-center gap-1.5 text-xs">
                                      <Wrench className="h-3 w-3 text-amber-500" />
                                      <span className="text-muted-foreground">Maintenance :</span>
                                      <span className="font-semibold text-amber-500">{plan.maintenance[currency]}</span>
                                    </div>
                                  </div>
                                )}

                                {/* CTA */}
                                <a href="#contact" className="block pt-1">
                                  <Button
                                    variant={plan.popular ? "default" : "outline"}
                                    size="sm"
                                    className="w-full gap-2"
                                  >
                                    Demander un devis
                                    <ArrowRight className="h-4 w-4" />
                                  </Button>
                                </a>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="inline-block bg-primary/5 border-primary/10 max-w-xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                <strong>Projet sur mesure ?</strong> Ces tarifs sont des bases de d&eacute;part.
                Contactez-moi pour un devis personnalis&eacute; adapt&eacute; &agrave; vos besoins.
              </p>
              <a href="#contact">
                <Button size="sm" className="mt-3 gap-2">
                  Discutons de votre projet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
