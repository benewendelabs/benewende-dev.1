"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check, Clock, RefreshCw, Headphones, Star, ArrowRight,
  Globe, ShoppingBag, Code, Rocket, Smartphone, Bot, Wrench, Layout,
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

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  "site-vitrine": { label: "Site Vitrine", icon: Globe, color: "from-blue-500/20 to-blue-600/10" },
  "site-wordpress": { label: "Site WordPress", icon: Layout, color: "from-indigo-500/20 to-indigo-600/10" },
  "boutique-shopify": { label: "Boutique Shopify", icon: ShoppingBag, color: "from-green-500/20 to-green-600/10" },
  "webapp": { label: "Web App Sur Mesure", icon: Code, color: "from-purple-500/20 to-purple-600/10" },
  "saas": { label: "Plateforme SaaS", icon: Rocket, color: "from-orange-500/20 to-orange-600/10" },
  "mobile": { label: "Application Mobile", icon: Smartphone, color: "from-pink-500/20 to-pink-600/10" },
  "ecommerce": { label: "E-Commerce Custom", icon: ShoppingBag, color: "from-amber-500/20 to-amber-600/10" },
  "ia": { label: "Solution IA", icon: Bot, color: "from-cyan-500/20 to-cyan-600/10" },
  "maintenance": { label: "Maintenance & Support", icon: Wrench, color: "from-slate-500/20 to-slate-600/10" },
};

const defaultPlans: PricingPlan[] = [];

export default function Pricing() {
  const plans = useContent<PricingPlan[]>("pricing", defaultPlans);
  const { currency } = useCurrency();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = Array.from(new Set(plans.map((p) => p.serviceCategory)));
  const filteredPlans = activeCategory === "all" ? plans : plans.filter((p) => p.serviceCategory === activeCategory);
  const grouped = filteredPlans.reduce<Record<string, PricingPlan[]>>((acc, p) => {
    if (!acc[p.serviceCategory]) acc[p.serviceCategory] = [];
    acc[p.serviceCategory].push(p);
    return acc;
  }, {});

  if (plans.length === 0) return null;

  return (
    <section id="tarifs" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Tarifs</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Des prix <span className="gradient-text">transparents</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chaque projet est unique. Choisissez la formule adapt&eacute;e &agrave; vos besoins et votre budget.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className="gap-1.5"
          >
            Tout voir
          </Button>
          {categories.map((cat) => {
            const config = categoryConfig[cat] || { label: cat, icon: Globe, color: "" };
            const Icon = config.icon;
            return (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
              </Button>
            );
          })}
        </div>

        {/* Pricing grids by category */}
        {Object.entries(grouped).map(([category, categoryPlans]) => {
          const config = categoryConfig[category] || { label: category, icon: Globe, color: "from-gray-500/20 to-gray-600/10" };
          const Icon = config.icon;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 last:mb-0"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{config.label}</h3>
                <Badge variant="secondary" className="ml-2">{categoryPlans.length} formules</Badge>
              </div>

              <div className={`grid gap-6 ${categoryPlans.length === 1 ? "max-w-md" : categoryPlans.length === 2 ? "md:grid-cols-2 max-w-3xl" : categoryPlans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
                {categoryPlans.sort((a, b) => a.tierLevel - b.tierLevel).map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={`h-full relative group transition-all duration-300 hover:border-primary/30 bg-card/50 backdrop-blur-sm ${plan.popular ? "ring-2 ring-primary shadow-lg shadow-primary/10" : ""}`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="gap-1 bg-primary text-primary-foreground shadow-lg">
                            <Star className="h-3 w-3 fill-current" />
                            Populaire
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">{plan.tierName}</CardTitle>
                        {plan.description && (
                          <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                        )}
                        <div className="mt-4">
                          <span className="text-3xl font-bold text-primary">{plan.price[currency]}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Features */}
                        <ul className="space-y-2">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-2.5 w-2.5 text-primary" />
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {/* Details */}
                        <div className="pt-3 border-t border-border space-y-2">
                          {plan.deliveryTime && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 text-primary/60" />
                              {plan.deliveryTime}
                            </div>
                          )}
                          {plan.revisions && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <RefreshCw className="h-3.5 w-3.5 text-primary/60" />
                              {plan.revisions}
                            </div>
                          )}
                          {plan.support && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Headphones className="h-3.5 w-3.5 text-primary/60" />
                              {plan.support}
                            </div>
                          )}
                        </div>

                        {/* Maintenance option */}
                        {plan.maintenance && (
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center gap-1.5 text-xs">
                              <Wrench className="h-3.5 w-3.5 text-amber-500" />
                              <span className="text-muted-foreground">Maintenance :</span>
                              <span className="font-semibold text-amber-500">{plan.maintenance[currency]}</span>
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <a href="#contact">
                          <Button
                            variant={plan.popular ? "default" : "outline"}
                            size="sm"
                            className="w-full gap-2 mt-2"
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
          );
        })}

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="inline-block bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Projet sur mesure ?</strong> Chaque tarif est une base de d&eacute;part.
                Contactez-moi pour un devis personnalis&eacute; adapt&eacute; &agrave; vos besoins sp&eacute;cifiques.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
