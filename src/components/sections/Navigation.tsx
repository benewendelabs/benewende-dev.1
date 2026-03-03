"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Globe, MessageCircle, Shield, LogOut, LogIn, CreditCard, FileType, LayoutDashboard, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/currency-provider";
import { Currency, currencyLabels } from "@/data/services";
import { ExtendedUser } from "@/lib/types";

interface FeatureToggles {
  cvGenerator?: boolean;
  converter?: boolean;
  auth?: boolean;
  contact?: boolean;
  payments?: boolean;
  card?: boolean;
}

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#projets", label: "Projets" },
  { href: "#competences", label: "Compétences" },
  { href: "#process", label: "Process" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [features, setFeatures] = useState<FeatureToggles>({});
  const [whatsapp, setWhatsapp] = useState("");

  const user = session?.user as ExtendedUser | undefined;
  const isLoggedIn = !!session;
  const isAdminUser = user?.role === "admin";

  const feat = (key: keyof FeatureToggles, def: boolean) => features[key] !== undefined ? !!features[key] : def;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/content/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.features) setFeatures(data.features as FeatureToggles);
        if (data.site?.whatsapp) setWhatsapp(data.site.whatsapp as string);
      })
      .catch(() => {});
  }, []);

  const currencies: Currency[] = ["XOF", "EUR", "USD"];
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "https://wa.me/22607267119";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            <span className="gradient-text">Benewende</span>
            <span className="text-muted-foreground">.dev</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                {link.label}
              </a>
            ))}
            {feat("cvGenerator", true) && (
              <Link href="/cv-generator">
                <Button size="sm" className="ml-2">
                  CV Generator
                </Button>
              </Link>
            )}
            {feat("card", true) && (
              <Link href="/card">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  Ma Carte
                </Button>
              </Link>
            )}
            {feat("converter", true) && (
              <Link href="/converter">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileType className="h-3.5 w-3.5" />
                  Convertisseur
                </Button>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              >
                <Globe className="h-4 w-4" />
              </Button>
              <AnimatePresence>
                {showCurrencyMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setShowCurrencyMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
                          currency === c
                            ? "text-primary font-medium bg-primary/5"
                            : "text-foreground"
                        }`}
                      >
                        {currencyLabels[c]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Auth + user controls */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Button>
                </Link>
                {isAdminUser && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                      <Shield className="h-3.5 w-3.5" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              feat("auth", true) && (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <LogIn className="h-3.5 w-3.5" />
                    Connexion
                  </Button>
                </Link>
              )
            )}

            {/* WhatsApp button for everyone */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white">
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            {!isLoggedIn && feat("auth", true) && (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="gap-1 text-xs h-8 px-2.5">
                  <LogIn className="h-3 w-3" />
                  <span className="hidden xs:inline">Connexion</span>
                </Button>
              </Link>
            )}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <Button size="sm" className="gap-1 bg-[#25D366] hover:bg-[#1da851] text-white h-8 px-2.5">
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50"
                >
                  {link.label}
                </a>
              ))}
              {feat("cvGenerator", true) && (
                <Link
                  href="/cv-generator"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Button size="sm" className="w-full mt-2">
                    CV Generator
                  </Button>
                </Link>
              )}
              {feat("card", true) && (
                <Link
                  href="/card"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full mt-2 gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    Ma Carte
                  </Button>
                </Link>
              )}
              {feat("converter", true) && (
                <Link
                  href="/converter"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full mt-2 gap-1.5">
                    <FileType className="h-3.5 w-3.5" />
                    Convertisseur
                  </Button>
                </Link>
              )}
              {/* WhatsApp mobile */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileOpen(false)}>
                <Button size="sm" className="w-full mt-2 gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white">
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </Button>
              </a>
              {/* User controls mobile */}
              {isLoggedIn ? (
                <div className="pt-3 border-t border-border mt-3 space-y-2">
                  <div className="flex items-center gap-2 px-1 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{user?.name}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="block">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Mon Dashboard
                    </Button>
                  </Link>
                  {isAdminUser && (
                    <Link href="/admin" onClick={() => setIsMobileOpen(false)} className="block">
                      <Button variant="outline" size="sm" className="w-full gap-1.5">
                        <Shield className="h-3.5 w-3.5" />
                        Administration
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-1.5 text-muted-foreground"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                feat("auth", true) && (
                  <Link href="/auth/login" onClick={() => setIsMobileOpen(false)} className="block pt-3 border-t border-border mt-3">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <LogIn className="h-3.5 w-3.5" />
                      Connexion
                    </Button>
                  </Link>
                )
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-border mt-2">
                <div className="flex gap-1">
                  {currencies.map((c) => (
                    <Button
                      key={c}
                      variant={currency === c ? "default" : "ghost"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setCurrency(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
