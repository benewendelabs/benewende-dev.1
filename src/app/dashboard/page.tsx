"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  FolderOpen,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Calendar,
  Target,
  MessageCircle,
  FileText,
  Zap,
  Shield,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  completedAt: string | null;
  sortOrder: number;
}

interface Update {
  id: string;
  authorRole: string;
  authorName: string;
  title: string;
  content: string;
  type: string;
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: string;
}

interface ClientProject {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  budget: string | null;
  currency: string;
  startDate: string;
  deadline: string | null;
  completedAt: string | null;
  techStack: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  updates: Update[];
  user: { id: string; name: string; email: string; image: string | null };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  discovery: { label: "Découverte", color: "bg-blue-500", icon: Target },
  design: { label: "Design", color: "bg-purple-500", icon: Zap },
  development: { label: "Développement", color: "bg-amber-500", icon: TrendingUp },
  testing: { label: "Tests", color: "bg-orange-500", icon: Shield },
  review: { label: "Révision", color: "bg-cyan-500", icon: FileText },
  delivered: { label: "Livré", color: "bg-emerald-500", icon: CheckCircle2 },
  maintenance: { label: "Maintenance", color: "bg-gray-500", icon: Clock },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Basse", color: "bg-gray-400" },
  normal: { label: "Normale", color: "bg-blue-400" },
  high: { label: "Haute", color: "bg-orange-500" },
  urgent: { label: "Urgente", color: "bg-red-500" },
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(d: string | null) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    fetch("/api/dashboard/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authStatus]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const activeProjects = projects.filter((p) => !["delivered", "maintenance"].includes(p.status));
  const completedProjects = projects.filter((p) => p.status === "delivered");
  const totalProgress = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight">Mon Espace Client</h1>
                  <p className="text-[10px] text-muted-foreground">Bienvenue, {session.user?.name || "Client"}</p>
                </div>
              </div>
            </div>
            <a href="https://wa.me/22607267119" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white">
                <MessageCircle className="h-3.5 w-3.5" />
                Support
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Projets actifs", value: activeProjects.length, icon: FolderOpen, color: "text-blue-500" },
            { label: "Projets livrés", value: completedProjects.length, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Progression moy.", value: `${totalProgress}%`, icon: TrendingUp, color: "text-amber-500" },
            { label: "Total projets", value: projects.length, icon: Target, color: "text-purple-500" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Projects list */}
        {projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Aucun projet en cours</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Vous n&apos;avez pas encore de projet. Contactez-nous pour démarrer votre prochain projet digital !
            </p>
            <a href="https://wa.me/22607267119" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white">
                <MessageCircle className="h-5 w-5" />
                Démarrer un projet
              </Button>
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Mes Projets
            </h2>

            <AnimatePresence>
              {projects.map((project, i) => {
                const sc = statusConfig[project.status] || statusConfig.discovery;
                const pc = priorityConfig[project.priority] || priorityConfig.normal;
                const deadlineDays = daysUntil(project.deadline);
                const techStack = project.techStack ? JSON.parse(project.techStack) : [];
                const completedMilestones = project.milestones.filter((m) => m.status === "completed").length;
                const totalMilestones = project.milestones.length;
                const lastUpdate = project.updates[0];

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/dashboard/project/${project.id}`}>
                      <Card className="hover:border-primary/30 transition-all cursor-pointer group">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            {/* Left: project info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="text-base font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                                <Badge className={`text-[10px] text-white ${sc.color}`}>{sc.label}</Badge>
                                {project.priority !== "normal" && (
                                  <Badge variant="outline" className="text-[10px]">{pc.label}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

                              {/* Tech stack */}
                              {techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {techStack.map((t: string) => (
                                    <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground font-medium">{t}</span>
                                  ))}
                                </div>
                              )}

                              {/* Dates */}
                              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Début: {formatDate(project.startDate)}
                                </span>
                                {project.deadline && (
                                  <span className={`flex items-center gap-1 ${deadlineDays !== null && deadlineDays < 7 ? "text-red-500 font-medium" : ""}`}>
                                    <Clock className="h-3 w-3" />
                                    Échéance: {formatDate(project.deadline)}
                                    {deadlineDays !== null && deadlineDays > 0 && ` (${deadlineDays}j)`}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right: progress + milestones */}
                            <div className="flex flex-col items-end gap-3 shrink-0">
                              {/* Progress circle */}
                              <div className="relative h-16 w-16">
                                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                                  <path
                                    className="text-muted/30"
                                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                  />
                                  <path
                                    className="text-primary"
                                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={`${project.progress}, 100`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{project.progress}%</span>
                              </div>

                              {/* Milestones summary */}
                              {totalMilestones > 0 && (
                                <span className="text-[10px] text-muted-foreground">
                                  {completedMilestones}/{totalMilestones} étapes
                                </span>
                              )}

                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${project.progress === 100 ? "bg-emerald-500" : "bg-primary"}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                            />
                          </div>

                          {/* Last update preview */}
                          {lastUpdate && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <div className="flex items-start gap-2">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${lastUpdate.authorRole === "admin" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                                  <FileText className="h-2.5 w-2.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium truncate">{lastUpdate.title}</p>
                                  <p className="text-[10px] text-muted-foreground">{lastUpdate.authorName} · {formatDate(lastUpdate.createdAt)}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Links */}
        {projects.some((p) => p.liveUrl) && (
          <div className="mt-8">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              Liens rapides
            </h3>
            <div className="flex flex-wrap gap-2">
              {projects.filter((p) => p.liveUrl).map((p) => (
                <a key={p.id} href={p.liveUrl!} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-primary/5">
                    <ExternalLink className="h-3 w-3" />
                    {p.name}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
