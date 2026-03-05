"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Crown,
  FileText,
  Smartphone,
  Sparkles,
  Shield,
  MessageCircle,
  Zap,
  Copy,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WHATSAPP_NUMBER = "2250708454592";

const PLANS = [
  {
    id: "cv-pro",
    name: "CV Pro",
    price: "3 000 FCFA",
    priceNum: 3000,
    period: "par CV",
    description: "Cr\u00e9ez un CV professionnel optimis\u00e9",
    features: [
      "Templates premium",
      "Suggestions IA",
      "Optimisation ATS",
      "Export PDF haute qualit\u00e9",
    ],
    icon: Sparkles,
    popular: true,
  },
  {
    id: "cv-business",
    name: "CV Business",
    price: "30 000 FCFA",
    priceNum: 30000,
    period: "par mois",
    description: "CV illimit\u00e9s pour les professionnels",
    features: [
      "Tout dans Pro",
      "CV illimit\u00e9s",
      "Support prioritaire",
      "Mod\u00e8les exclusifs",
      "Personnalisation avanc\u00e9e",
    ],
    icon: Shield,
    popular: false,
  },
];

const PAYMENT_METHODS = [
  {
    id: "orange",
    name: "Orange Money",
    icon: "\ud83d\udfe7",
    color: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
  },
  {
    id: "moov",
    name: "Moov Money",
    icon: "\ud83d\udfe6",
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
  },
  {
    id: "wave",
    name: "Wave",
    icon: "\ud83c\udf0a",
    color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
  },
  {
    id: "mtn",
    name: "MTN MoMo",
    icon: "\ud83d\udfe8",
    color: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
  },
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("cv-pro");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlan);
  const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  const whatsappMessage = `Bonjour Benewende,\n\nJe souhaite souscrire au plan *${plan?.name}* (${plan?.price} ${plan?.period}).\n\nMode de paiement : ${method?.name || "Mobile Money"}\n\nMerci !`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const copyNumber = () => {
    navigator.clipboard.writeText(WHATSAPP_NUMBER.replace(/^226/, "+226 "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/cv-generator">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">Paiement</h1>
                <p className="text-xs text-muted-foreground">
                  Mobile Money via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Choose Plan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              1
            </div>
            <h2 className="text-lg font-bold">Choisir votre plan</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                  selectedPlan === p.id
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/50 hover:border-primary/30 bg-card"
                }`}
              >
                {p.popular && (
                  <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[10px] gap-0.5">
                    <Zap className="h-2.5 w-2.5" /> Populaire
                  </Badge>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  {selectedPlan === p.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                <h3 className="font-bold text-base mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{p.description}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-extrabold text-primary">{p.price}</span>
                  <span className="text-xs text-muted-foreground">/{p.period}</span>
                </div>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              2
            </div>
            <h2 className="text-lg font-bold">Mode de paiement</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                  selectedMethod === m.id
                    ? `border-primary bg-gradient-to-br ${m.color} shadow-md`
                    : "border-border/50 hover:border-primary/30 bg-card"
                }`}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <p className="text-xs font-semibold">{m.name}</p>
                {selectedMethod === m.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
            <MessageCircle className="h-4 w-4 text-green-500 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Le paiement se fait via <strong className="text-green-500">WhatsApp</strong>. Vous serez guid\u00e9 pour envoyer votre paiement Mobile Money et recevoir votre acc\u00e8s imm\u00e9diatement.
            </p>
          </div>
        </motion.div>

        {/* Step 3: Pay via WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              3
            </div>
            <h2 className="text-lg font-bold">Payer via WhatsApp</h2>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{plan?.name}</p>
                  <p className="text-xs text-muted-foreground">{plan?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{plan?.price}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{plan?.period}</p>
              </div>
            </div>

            {method && (
              <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-muted/50">
                <span className="text-lg">{method.icon}</span>
                <span className="text-sm font-medium">{method.name}</span>
              </div>
            )}

            {/* How it works */}
            <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-xs font-semibold mb-3">Comment \u00e7a marche :</p>
              <div className="space-y-2.5">
                {[
                  "Cliquez sur le bouton WhatsApp ci-dessous",
                  `Envoyez votre paiement de ${plan?.price} via ${method?.name || "Mobile Money"}`,
                  "Partagez la capture d'\u00e9cran de confirmation",
                  "Recevez votre acc\u00e8s premium en quelques minutes",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp number */}
            <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">+226 70 00 00 00</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={copyNumber}>
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copi\u00e9" : "Copier"}
              </Button>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                className="w-full h-12 rounded-xl text-sm font-semibold gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                disabled={!selectedMethod}
              >
                <MessageCircle className="h-5 w-5" />
                Payer {plan?.price} via WhatsApp
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" /> Paiement s\u00e9curis\u00e9
              </span>
              <span className="text-[10px] text-muted-foreground">\u2022</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Crown className="h-3 w-3" /> Activation rapide
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
