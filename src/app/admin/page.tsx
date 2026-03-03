"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users, Mail, FileText, TrendingUp, Eye, Trash2, Archive,
  LogOut, ArrowLeft, Shield, FolderOpen, Briefcase, Code2,
  Clock, Settings, Star, Bot, Cpu, ToggleLeft, ToggleRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExtendedUser } from "@/lib/types";
import ContentManager, { FieldDef } from "@/components/admin/ContentManager";

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  project: string | null;
  budget: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

type TabId = "overview" | "projects" | "services" | "skills" | "testimonials" | "experiences" | "contacts" | "settings";

interface Stats { totalUsers: number; totalContacts: number; unreadContacts: number; totalCVs: number; }

const projectFields: FieldDef[] = [
  { key: "name", label: "Nom", type: "text", required: true },
  { key: "description", label: "Description courte", type: "textarea", required: true },
  { key: "longDescription", label: "Description détaillée", type: "textarea", placeholder: "Décrivez le projet en détail : fonctionnalités, stack, résultats..." },
  { key: "image", label: "Screenshot / Image (1280×960 PNG/WebP)", type: "image" },
  { key: "demoVideo", label: "Vidéo démo (MP4/WebM, boucle auto)", type: "video" },
  { key: "featured", label: "Projet mis en avant (carte large)", type: "boolean" },
  { key: "status", label: "Statut", type: "select", options: [{ value: "live", label: "Production" }, { value: "in-progress", label: "En cours" }, { value: "prototype", label: "Prototype" }] },
  { key: "category", label: "Catégorie", type: "select", options: [{ value: "saas", label: "SaaS" }, { value: "webapp", label: "Web App" }, { value: "mobile", label: "Mobile" }, { value: "ia", label: "IA" }, { value: "prototype", label: "Prototype" }] },
  { key: "technologies", label: "Technologies", type: "json-array" },
  { key: "progress", label: "Progression (%)", type: "number" },
  { key: "launchDate", label: "Date de lancement", type: "text", placeholder: "Q1 2026" },
  { key: "liveUrl", label: "URL Live", type: "text" },
  { key: "githubUrl", label: "URL GitHub", type: "text" },
  { key: "statsUsers", label: "Stat: Utilisateurs", type: "text" },
  { key: "statsPerf", label: "Stat: Performance", type: "text" },
  { key: "statsRoi", label: "Stat: ROI", type: "text" },
  { key: "sortOrder", label: "Ordre", type: "number" },
  { key: "visible", label: "Visible", type: "boolean" },
];

const serviceFields: FieldDef[] = [
  { key: "title", label: "Titre", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "icon", label: "Icône (Lucide)", type: "select", options: [{ value: "Rocket", label: "Rocket" }, { value: "Palette", label: "Palette" }, { value: "Bot", label: "Bot" }, { value: "FileText", label: "FileText" }, { value: "GraduationCap", label: "GraduationCap" }, { value: "Lightbulb", label: "Lightbulb" }, { value: "Code2", label: "Code2" }, { value: "Globe", label: "Globe" }] },
  { key: "priceXOF", label: "Prix XOF", type: "text", required: true },
  { key: "priceEUR", label: "Prix EUR", type: "text", required: true },
  { key: "priceUSD", label: "Prix USD", type: "text", required: true },
  { key: "features", label: "Features", type: "json-array" },
  { key: "sortOrder", label: "Ordre", type: "number" },
  { key: "visible", label: "Visible", type: "boolean" },
];

const skillFields: FieldDef[] = [
  { key: "category", label: "Catégorie", type: "text", required: true },
  { key: "skills", label: "Compétences", type: "json-skills" },
  { key: "sortOrder", label: "Ordre", type: "number" },
  { key: "visible", label: "Visible", type: "boolean" },
];

const testimonialFields: FieldDef[] = [
  { key: "name", label: "Nom", type: "text", required: true },
  { key: "role", label: "Rôle", type: "text", required: true },
  { key: "company", label: "Entreprise", type: "text", required: true },
  { key: "content", label: "Témoignage", type: "textarea", required: true },
  { key: "rating", label: "Note (1-5)", type: "number" },
  { key: "avatar", label: "Photo / Avatar", type: "image" },
  { key: "sortOrder", label: "Ordre", type: "number" },
  { key: "visible", label: "Visible", type: "boolean" },
];

const experienceFields: FieldDef[] = [
  { key: "period", label: "Période", type: "text", required: true, placeholder: "2024 - Présent" },
  { key: "title", label: "Titre", type: "text", required: true },
  { key: "company", label: "Entreprise", type: "text", required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "achievements", label: "Réalisations", type: "json-array" },
  { key: "current", label: "Poste actuel", type: "boolean" },
  { key: "sortOrder", label: "Ordre", type: "number" },
  { key: "visible", label: "Visible", type: "boolean" },
];

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: TrendingUp },
  { id: "projects", label: "Projets", icon: FolderOpen },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "skills", label: "Compétences", icon: Code2 },
  { id: "testimonials", label: "Témoignages", icon: Star },
  { id: "experiences", label: "Expérience", icon: Clock },
  { id: "contacts", label: "Messages", icon: Mail },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalContacts: 0, unreadContacts: 0, totalCVs: 0 });
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState<Record<string, Record<string, unknown>[]>>({
    projects: [], services: [], skills: [], testimonials: [], experiences: [],
  });
  const [siteSettings, setSiteSettings] = useState<Record<string, Record<string, unknown>>>({});

  const fetchContent = useCallback(async (type: string) => {
    const res = await fetch(`/api/admin/content/${type}`);
    if (res.ok) {
      const data = await res.json();
      if (type === "settings") {
        const map: Record<string, Record<string, unknown>> = {};
        for (const s of data) { try { map[s.id] = JSON.parse(s.value); } catch { map[s.id] = {}; } }
        setSiteSettings(map);
      } else {
        setContentData((prev) => ({ ...prev, [type]: data }));
      }
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated") {
      if ((session?.user as ExtendedUser)?.role !== "admin") { router.push("/"); return; }
      (async () => {
        try {
          const [statsRes, contactsRes] = await Promise.all([
            fetch("/api/admin/stats"), fetch("/api/admin/contacts"),
          ]);
          if (statsRes.ok) setStats(await statsRes.json());
          if (contactsRes.ok) setContacts(await contactsRes.json());
          await Promise.all(["projects", "services", "skills", "testimonials", "experiences", "settings"].map(fetchContent));
        } catch (e) { console.error("Admin fetch error:", e); }
        finally { setLoading(false); }
      })();
    }
  }, [status, session, router, fetchContent]);

  const crudFor = (type: string) => ({
    onSave: async (item: Record<string, unknown>) => {
      await fetch(`/api/admin/content/${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      await fetchContent(type);
    },
    onDelete: async (id: string) => {
      await fetch(`/api/admin/content/${type}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      await fetchContent(type);
    },
    onCreate: async (item: Record<string, unknown>) => {
      await fetch(`/api/admin/content/${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      await fetchContent(type);
    },
  });

  const [saveStatus, setSaveStatus] = useState<string>("");
  const saveSetting = async (key: string, value: Record<string, unknown>) => {
    try {
      setSaveStatus("saving");
      const res = await fetch("/api/admin/content/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: key, value: JSON.stringify(value) }) });
      if (!res.ok) throw new Error("Erreur serveur");
      await fetchContent("settings");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const markAsRead = async (id: string) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: true } : c))
    );
    setStats((prev) => ({ ...prev, unreadContacts: prev.unreadContacts - 1 }));
  };

  const archiveMessage = async (id: string) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteMessage = async (id: string) => {
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setStats((prev) => ({ ...prev, totalContacts: prev.totalContacts - 1 }));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if ((session?.user as ExtendedUser)?.role !== "admin") return null;

  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Messages",
      value: stats.totalContacts,
      icon: Mail,
      color: "text-green-500",
      bg: "bg-green-500/10",
      badge: stats.unreadContacts > 0 ? `${stats.unreadContacts} non lu(s)` : undefined,
    },
    {
      title: "CVs générés",
      value: stats.totalCVs,
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Taux conversion",
      value: "12%",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h1 className="text-sm font-semibold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {session?.user?.email}
              </span>
              <Badge variant="outline" className="text-xs">Admin</Badge>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1.5 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === "contacts" && stats.unreadContacts > 0 && (
                <span className="h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {stats.unreadContacts}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                        >
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        {stat.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {stat.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.title}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Activity Chart - Messages par semaine */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const now = new Date();
                    const weeks = Array.from({ length: 7 }, (_, i) => {
                      const d = new Date(now);
                      d.setDate(d.getDate() - (6 - i) * 7);
                      return {
                        label: `S${Math.ceil((d.getDate()) / 7)}`,
                        messages: contacts.filter((c) => {
                          const cd = new Date(c.createdAt);
                          const weekStart = new Date(d);
                          weekStart.setDate(weekStart.getDate() - 7);
                          return cd >= weekStart && cd < d;
                        }).length,
                      };
                    });
                    const maxVal = Math.max(...weeks.map((w) => w.messages), 1);
                    return (
                      <div className="space-y-3">
                        <div className="flex items-end gap-2 h-32">
                          {weeks.map((w, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[10px] text-muted-foreground font-medium">{w.messages}</span>
                              <div className="w-full rounded-t-sm bg-primary/10 relative" style={{ height: "100%" }}>
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${(w.messages / maxVal) * 100}%` }}
                                  transition={{ delay: i * 0.05, duration: 0.4 }}
                                  className="absolute bottom-0 w-full rounded-t-sm bg-primary/60"
                                />
                              </div>
                              <span className="text-[9px] text-muted-foreground">{w.label}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">Messages reçus (7 dernières semaines)</p>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Content Distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-500" />
                    Contenu du site
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const items = [
                      { label: "Projets", count: contentData.projects.length, color: "bg-blue-500" },
                      { label: "Services", count: contentData.services.length, color: "bg-green-500" },
                      { label: "Compétences", count: contentData.skills.length, color: "bg-amber-500" },
                      { label: "Témoignages", count: contentData.testimonials.length, color: "bg-purple-500" },
                      { label: "Expériences", count: contentData.experiences.length, color: "bg-pink-500" },
                    ];
                    const total = items.reduce((s, i) => s + i.count, 0);
                    return (
                      <div className="space-y-3">
                        {/* Horizontal stacked bar */}
                        <div className="h-6 rounded-full overflow-hidden flex bg-muted/30">
                          {items.map((item, i) => (
                            <motion.div
                              key={item.label}
                              initial={{ width: 0 }}
                              animate={{ width: total > 0 ? `${(item.count / total) * 100}%` : "0%" }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                              className={`${item.color} relative group cursor-default`}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                {item.count > 0 && (
                                  <span className="text-[9px] text-white font-bold drop-shadow-sm">{item.count}</span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {/* Legend */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {items.map((item) => (
                            <div key={item.label} className="flex items-center gap-1.5">
                              <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                              <span className="text-[11px] text-muted-foreground">{item.label}</span>
                              <span className="text-[11px] font-semibold ml-auto">{item.count}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-center pt-1 border-t border-border/50">
                          <span className="text-xs text-muted-foreground">Total : </span>
                          <span className="text-sm font-bold">{total} éléments</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/0 border-primary/10">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{contentData.projects.filter((p) => p.status === "live").length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Projets en production</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/5 to-green-500/0 border-green-500/10">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-500">{contacts.filter((c) => !c.read).length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Messages non lus</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border-purple-500/10">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-500">{contentData.services.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Services actifs</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Messages récents</CardTitle>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucun message pour le moment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contacts.slice(0, 5).map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          contact.read
                            ? "bg-card border-border"
                            : "bg-primary/5 border-primary/20"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium truncate">
                                {contact.name}
                              </span>
                              {!contact.read && (
                                <Badge className="text-[10px]">Nouveau</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {contact.email}
                              {contact.project && ` • ${contact.project}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {contact.message}
                            </p>
                          </div>
                          <div className="flex gap-1 ml-2 shrink-0">
                            {!contact.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => markAsRead(contact.id)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => archiveMessage(contact.id)}
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => deleteMessage(contact.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contacts tab */}
        {activeTab === "contacts" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tous les messages ({contacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucun message.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          contact.read
                            ? "bg-card border-border"
                            : "bg-primary/5 border-primary/20"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {contact.name}
                              </span>
                              {!contact.read && (
                                <Badge className="text-[10px]">Nouveau</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {contact.email}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!contact.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => markAsRead(contact.id)}
                              >
                                Marquer lu
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => archiveMessage(contact.id)}
                            >
                              Archiver
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => deleteMessage(contact.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                        {contact.project && (
                          <p className="text-xs text-muted-foreground mb-1">
                            <strong>Projet :</strong> {contact.project}
                            {contact.budget && ` • Budget : ${contact.budget}`}
                          </p>
                        )}
                        <p className="text-sm text-foreground/80">
                          {contact.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(contact.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Projects tab */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ContentManager
              title="Projets"
              type="projects"
              fields={projectFields}
              items={contentData.projects}
              {...crudFor("projects")}
            />
          </motion.div>
        )}

        {/* Services tab */}
        {activeTab === "services" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ContentManager
              title="Services"
              type="services"
              fields={serviceFields}
              items={contentData.services}
              {...crudFor("services")}
            />
          </motion.div>
        )}

        {/* Skills tab */}
        {activeTab === "skills" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ContentManager
              title="Compétences"
              type="skills"
              fields={skillFields}
              items={contentData.skills}
              {...crudFor("skills")}
            />
          </motion.div>
        )}

        {/* Testimonials tab */}
        {activeTab === "testimonials" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ContentManager
              title="Témoignages"
              type="testimonials"
              fields={testimonialFields}
              items={contentData.testimonials}
              {...crudFor("testimonials")}
            />
          </motion.div>
        )}

        {/* Experiences tab */}
        {activeTab === "experiences" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ContentManager
              title="Expériences"
              type="experiences"
              fields={experienceFields}
              items={contentData.experiences}
              {...crudFor("experiences")}
            />
          </motion.div>
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-6">
              {/* Feature Toggles */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                      <ToggleLeft className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Fonctionnalités du site</CardTitle>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Activez ou désactivez les pages et services visibles sur le site</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const features = siteSettings.features || {};
                    const toggles = [
                      { key: "cvGenerator", label: "Générateur de CV", desc: "Page /cv-generator — création de CV avec templates et IA", default: true },
                      { key: "converter", label: "Convertisseur d'images", desc: "Page /converter — conversion PNG/JPG/WebP/ICO/SVG", default: true },
                      { key: "auth", label: "Connexion / Inscription", desc: "Pages /auth/login et /auth/register — comptes utilisateurs", default: false },
                      { key: "contact", label: "Formulaire de contact", desc: "Section contact sur la page d'accueil", default: true },
                      { key: "payments", label: "Paiements (CinetPay)", desc: "Page /payment — paiements Mobile Money", default: false },
                      { key: "card", label: "Carte de visite digitale", desc: "Page /card — votre carte de visite interactive", default: true },
                    ];
                    const isEnabled = (key: string, def: boolean) => features[key] !== undefined ? !!features[key] : def;
                    const toggle = (key: string, def: boolean) => {
                      const current = isEnabled(key, def);
                      setSiteSettings((p) => ({ ...p, features: { ...p.features, [key]: !current } }));
                    };
                    return (
                      <>
                        <div className="grid gap-2">
                          {toggles.map((t) => {
                            const on = isEnabled(t.key, t.default);
                            return (
                              <button
                                key={t.key}
                                onClick={() => toggle(t.key, t.default)}
                                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                                  on ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-muted/20 opacity-60"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {on ? <ToggleRight className="h-5 w-5 text-emerald-500 shrink-0" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground shrink-0" />}
                                  <div>
                                    <span className="text-sm font-medium">{t.label}</span>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                                  </div>
                                </div>
                                <Badge variant={on ? "default" : "secondary"} className={`text-[10px] shrink-0 ${on ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}>
                                  {on ? "Activé" : "Désactivé"}
                                </Badge>
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <Button size="sm" disabled={saveStatus === "saving"} onClick={() => saveSetting("features", siteSettings.features || {})}>
                            {saveStatus === "saving" ? "Sauvegarde..." : "Sauvegarder Fonctionnalités"}
                          </Button>
                          {saveStatus === "saved" && <span className="text-xs text-green-500 font-medium">Sauvegardé !</span>}
                          {saveStatus === "error" && <span className="text-xs text-red-500 font-medium">Erreur de sauvegarde</span>}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Hero settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hero / Accueil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const hero = siteSettings.hero || {};
                    return (
                      <>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Titre principal</label>
                          <input
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={(hero.title as string) || ""}
                            onChange={(e) => setSiteSettings((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label>
                          <textarea
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                            value={(hero.subtitle as string) || ""}
                            onChange={(e) => setSiteSettings((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Textes défilants (un par ligne)</label>
                          <textarea
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono min-h-[80px]"
                            value={((hero.typingTexts as string[]) || []).join("\n")}
                            onChange={(e) => setSiteSettings((p) => ({ ...p, hero: { ...p.hero, typingTexts: e.target.value.split("\n").filter(Boolean) } }))}
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={!!hero.available} onChange={(e) => setSiteSettings((p) => ({ ...p, hero: { ...p.hero, available: e.target.checked } }))} />
                            <span className="text-sm">Disponible pour nouveaux projets</span>
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" disabled={saveStatus === "saving"} onClick={() => saveSetting("hero", siteSettings.hero || {})}>
                            {saveStatus === "saving" ? "Sauvegarde..." : "Sauvegarder Hero"}
                          </Button>
                          {saveStatus === "saved" && <span className="text-xs text-green-500 font-medium">Sauvegardé !</span>}
                          {saveStatus === "error" && <span className="text-xs text-red-500 font-medium">Erreur de sauvegarde</span>}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Site info settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informations du site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const site = siteSettings.site || {};
                    const updateSite = (key: string, val: string) => setSiteSettings((p) => ({ ...p, site: { ...p.site, [key]: val } }));
                    return (
                      <>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { key: "name", label: "Nom du site" },
                            { key: "email", label: "Email" },
                            { key: "phone", label: "Téléphone / WhatsApp" },
                            { key: "whatsapp", label: "Numéro WhatsApp (ex: 22607267119)" },
                            { key: "location", label: "Localisation" },
                            { key: "github", label: "GitHub URL" },
                            { key: "linkedin", label: "LinkedIn URL" },
                            { key: "twitter", label: "Twitter / X URL" },
                            { key: "facebook", label: "Facebook URL" },
                            { key: "instagram", label: "Instagram URL" },
                            { key: "tiktok", label: "TikTok URL" },
                            { key: "discord", label: "Discord URL" },
                            { key: "reddit", label: "Reddit URL" },
                            { key: "calendly", label: "Calendly URL (ex: https://calendly.com/benewende)" },
                          ].map((f) => (
                            <div key={f.key}>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.label}</label>
                              <input
                                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={(site[f.key] as string) || ""}
                                onChange={(e) => updateSite(f.key, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" disabled={saveStatus === "saving"} onClick={() => saveSetting("site", siteSettings.site || {})}>
                            {saveStatus === "saving" ? "Sauvegarde..." : "Sauvegarder Infos"}
                          </Button>
                          {saveStatus === "saved" && <span className="text-xs text-green-500 font-medium">Sauvegardé !</span>}
                          {saveStatus === "error" && <span className="text-xs text-red-500 font-medium">Erreur de sauvegarde</span>}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Process / Méthodologie settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Process / Méthodologie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const process = siteSettings.process || {};
                    const steps = (process.steps as { icon: string; title: string; duration: string; tasks: string[] }[]) || [
                      { icon: "Search", title: "Découverte", duration: "1-2 jours", tasks: ["Analyse besoin", "Audit technique", "Proposition solution"] },
                      { icon: "PenTool", title: "Design & Architecture", duration: "3-5 jours", tasks: ["Wireframes", "Architecture technique", "Validation client"] },
                      { icon: "Code2", title: "Développement", duration: "2-6 semaines", tasks: ["Sprints hebdomadaires", "Démos régulières", "Feedbacks itératifs"] },
                      { icon: "Rocket", title: "Déploiement", duration: "1 semaine", tasks: ["Mise en production", "Formation équipe", "Documentation"] },
                      { icon: "Wrench", title: "Maintenance", duration: "Ongoing", tasks: ["Support technique", "Nouvelles features", "Optimisations"] },
                    ];
                    const iconOptions = ["Search", "PenTool", "Code2", "Rocket", "Wrench"];
                    const updateStep = (idx: number, key: string, val: unknown) => {
                      const updated = [...steps];
                      updated[idx] = { ...updated[idx], [key]: val };
                      setSiteSettings((p) => ({ ...p, process: { ...p.process, steps: updated } }));
                    };
                    const addStep = () => {
                      const updated = [...steps, { icon: "Rocket", title: "", duration: "", tasks: [] }];
                      setSiteSettings((p) => ({ ...p, process: { ...p.process, steps: updated } }));
                    };
                    const removeStep = (idx: number) => {
                      const updated = steps.filter((_, i) => i !== idx);
                      setSiteSettings((p) => ({ ...p, process: { ...p.process, steps: updated } }));
                    };
                    return (
                      <>
                        <p className="text-xs text-muted-foreground mb-2">
                          Gérez les étapes de votre méthodologie affichées sur le site.
                        </p>
                        {steps.map((step, idx) => (
                          <div key={idx} className="p-3 rounded-lg border bg-muted/20 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">Étape {idx + 1}</span>
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => removeStep(idx)}>Supprimer</Button>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-muted-foreground">Icône</label>
                                <select className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs" value={step.icon} onChange={(e) => updateStep(idx, "icon", e.target.value)}>
                                  {iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">Titre</label>
                                <input className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs" value={step.title} onChange={(e) => updateStep(idx, "title", e.target.value)} />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">Durée</label>
                                <input className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs" value={step.duration} onChange={(e) => updateStep(idx, "duration", e.target.value)} />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground">Tâches (une par ligne)</label>
                              <textarea className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-mono min-h-[50px]" value={step.tasks.join("\n")} onChange={(e) => updateStep(idx, "tasks", e.target.value.split("\n").filter(Boolean))} />
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="text-xs" onClick={addStep}>+ Ajouter une étape</Button>
                        <div className="flex items-center gap-3">
                          <Button size="sm" disabled={saveStatus === "saving"} onClick={() => saveSetting("process", { steps })}>
                            {saveStatus === "saving" ? "Sauvegarde..." : "Sauvegarder Process"}
                          </Button>
                          {saveStatus === "saved" && <span className="text-xs text-green-500 font-medium">Sauvegardé !</span>}
                          {saveStatus === "error" && <span className="text-xs text-red-500 font-medium">Erreur de sauvegarde</span>}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* AI Model settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-500" />
                    </div>
                    <CardTitle className="text-base">Modèle IA (OpenRouter)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const ai = siteSettings.ai || {};
                    const models = [
                      { value: "anthropic/claude-sonnet-4", label: "Claude Sonnet 4", provider: "Anthropic", tag: "recommended", desc: "Meilleur pour le français & rédaction pro" },
                      { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", tag: "premium", desc: "Excellent en rédaction structurée" },
                      { value: "openai/gpt-4o", label: "GPT-4o", provider: "OpenAI", tag: "premium", desc: "Très polyvalent, bon en français" },
                      { value: "openai/gpt-4.1", label: "GPT-4.1", provider: "OpenAI", tag: "recommended", desc: "Dernière génération OpenAI" },
                      { value: "google/gemini-2.5-pro-preview", label: "Gemini 2.5 Pro", provider: "Google", tag: "premium", desc: "Puissant, bon suivi d'instructions" },
                      { value: "google/gemini-2.5-flash-preview", label: "Gemini 2.5 Flash", provider: "Google", tag: "fast", desc: "Rapide et économique" },
                      { value: "deepseek/deepseek-r1", label: "DeepSeek R1", provider: "DeepSeek", tag: "quality", desc: "Raisonnement avancé" },
                      { value: "deepseek/deepseek-chat-v3-0324", label: "DeepSeek V3", provider: "DeepSeek", tag: "quality", desc: "Bon rapport qualité/prix" },
                      { value: "anthropic/claude-3.5-haiku", label: "Claude 3.5 Haiku", provider: "Anthropic", tag: "fast", desc: "Rapide, bon pour les tâches simples" },
                      { value: "openai/gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI", tag: "fast", desc: "Économique et rapide" },
                      { value: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B", provider: "Meta", tag: "quality", desc: "Open source, bon niveau" },
                      { value: "mistralai/mistral-large-2411", label: "Mistral Large", provider: "Mistral", tag: "premium", desc: "Excellent en français natif" },
                      { value: "mistralai/mistral-small-3.1-24b-instruct", label: "Mistral Small 3.1", provider: "Mistral", tag: "fast", desc: "Rapide, bon en français" },
                      { value: "qwen/qwen-2.5-72b-instruct", label: "Qwen 2.5 72B", provider: "Qwen", tag: "quality", desc: "Multilingue solide" },
                      { value: "meta-llama/llama-3.1-8b-instruct:free", label: "Llama 3.1 8B (Gratuit)", provider: "Meta", tag: "free", desc: "Gratuit mais qualité limitée" },
                    ];
                    const currentModel = (ai.model as string) || "meta-llama/llama-3.1-8b-instruct:free";
                    const tagColors: Record<string, string> = {
                      free: "bg-green-500/10 text-green-600 border-green-500/20",
                      fast: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                      quality: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                      premium: "bg-purple-500/10 text-purple-600 border-purple-500/20",
                      recommended: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                    };
                    const tagLabels: Record<string, string> = {
                      free: "Gratuit", fast: "Rapide", quality: "Qualité", premium: "Premium", recommended: "★ Recommandé",
                    };
                    return (
                      <>
                        <p className="text-xs text-muted-foreground">
                          Sélectionnez le modèle utilisé par l&apos;assistant CV. Les modèles premium consomment des crédits OpenRouter.
                        </p>
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-2">
                          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                            <Cpu className="h-3.5 w-3.5" />
                            Conseil : Pour des CV professionnels en français, choisissez Claude Sonnet 4, GPT-4.1 ou Mistral Large.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          {models.map((m) => (
                            <button
                              key={m.value}
                              onClick={() => setSiteSettings((p) => ({ ...p, ai: { ...p.ai, model: m.value } }))}
                              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                                currentModel === m.value
                                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                  : "border-border/50 hover:border-primary/20 bg-card"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Cpu className={`h-4 w-4 shrink-0 ${currentModel === m.value ? "text-primary" : "text-muted-foreground"}`} />
                                <div>
                                  <span className="text-sm font-medium">{m.label}</span>
                                  <span className="text-[10px] text-muted-foreground ml-2">{m.provider}</span>
                                  {m.desc && <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>}
                                </div>
                              </div>
                              <Badge variant="outline" className={`text-[10px] shrink-0 ${tagColors[m.tag] || ""}`}>
                                {tagLabels[m.tag] || m.tag}
                              </Badge>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-muted-foreground">
                            Actuel : <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{currentModel}</code>
                          </div>
                          <Button size="sm" disabled={saveStatus === "saving"} onClick={() => saveSetting("ai", siteSettings.ai || {})}>
                            {saveStatus === "saving" ? "Sauvegarde..." : "Sauvegarder Modèle"}
                          </Button>
                          {saveStatus === "saved" && <span className="text-xs text-green-500 font-medium">Sauvegardé !</span>}
                          {saveStatus === "error" && <span className="text-xs text-red-500 font-medium">Erreur</span>}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Footer settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Footer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const defaultFooter = {
                      description: "Développeur Full Stack passionné, spécialisé en React, Next.js et architectures SaaS. Je transforme vos idées en produits digitaux performants, de la conception au déploiement. Basé à Ouagadougou, Burkina Faso.",
                      copyright: "Benewende.dev. Tous droits réservés.",
                      tagline: "Fait avec ❤️ à Ouagadougou",
                    };
                    const footer = { ...defaultFooter, ...siteSettings.footer };
                    const updateFooter = (key: string, val: string) => setSiteSettings((p) => ({ ...p, footer: { ...p.footer, [key]: val } }));
                    return (
                      <>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Description (sous le logo)</label>
                          <textarea
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                            placeholder="Développeur Full Stack & Créateur de SaaS basé à Ouagadougou, Burkina Faso."
                            value={(footer.description as string) || ""}
                            onChange={(e) => updateFooter("description", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Copyright</label>
                          <input
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                            placeholder="Benewende.dev. Tous droits réservés."
                            value={(footer.copyright as string) || ""}
                            onChange={(e) => updateFooter("copyright", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Tagline (bas de page)</label>
                          <input
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                            placeholder="Fait avec ❤️ à Ouagadougou"
                            value={(footer.tagline as string) || ""}
                            onChange={(e) => updateFooter("tagline", e.target.value)}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Les réseaux sociaux se gèrent dans « Informations du site » ci-dessus.</p>
                        <div className="flex items-center gap-3">
                          <Button size="sm" disabled={saveStatus === "saving"} onClick={() => saveSetting("footer", footer as Record<string, unknown>)}>
                            {saveStatus === "saving" ? "Sauvegarde..." : "Sauvegarder Footer"}
                          </Button>
                          {saveStatus === "saved" && <span className="text-xs text-green-500 font-medium">Sauvegardé !</span>}
                          {saveStatus === "error" && <span className="text-xs text-red-500 font-medium">Erreur de sauvegarde</span>}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
