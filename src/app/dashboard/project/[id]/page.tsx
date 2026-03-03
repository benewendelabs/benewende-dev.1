"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  Zap,
  TrendingUp,
  FileText,
  Calendar,
  MessageCircle,
  ExternalLink,
  Github,
  Send,
  Download,
  CircleDot,
  Milestone,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MilestoneItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  completedAt: string | null;
  sortOrder: number;
}

interface UpdateItem {
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

interface ProjectDetail {
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
  milestones: MilestoneItem[];
  updates: UpdateItem[];
  user: { id: string; name: string; email: string; image: string | null };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  discovery: { label: "Découverte", color: "text-blue-500", bg: "bg-blue-500" },
  design: { label: "Design", color: "text-purple-500", bg: "bg-purple-500" },
  development: { label: "Développement", color: "text-amber-500", bg: "bg-amber-500" },
  testing: { label: "Tests", color: "text-orange-500", bg: "bg-orange-500" },
  review: { label: "Révision", color: "text-cyan-500", bg: "bg-cyan-500" },
  delivered: { label: "Livré", color: "text-emerald-500", bg: "bg-emerald-500" },
  maintenance: { label: "Maintenance", color: "text-gray-500", bg: "bg-gray-500" },
};

const milestoneStatusIcon: Record<string, { icon: React.ElementType; color: string }> = {
  pending: { icon: CircleDot, color: "text-muted-foreground" },
  in_progress: { icon: Loader2, color: "text-amber-500" },
  completed: { icon: CheckCircle2, color: "text-emerald-500" },
  blocked: { icon: PauseCircle, color: "text-red-500" },
};

const updateTypeIcon: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  update: { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  milestone: { icon: Milestone, color: "text-purple-500", bg: "bg-purple-500/10" },
  delivery: { icon: Download, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  feedback: { icon: MessageCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
  invoice: { icon: FileText, color: "text-red-500", bg: "bg-red-500/10" },
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ProjectDetailPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "updates">("overview");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard");
    }
  }, [authStatus, router]);

  const fetchProject = () => {
    fetch(`/api/dashboard/projects/${projectId}`)
      .then((r) => r.json())
      .then((data) => { if (data.id) setProject(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authStatus !== "authenticated" || !projectId) return;
    fetchProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, projectId]);

  const sendComment = async () => {
    if (!commentText.trim() || sending) return;
    setSending(true);
    try {
      await fetch(`/api/dashboard/projects/${projectId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Commentaire client",
          content: commentText.trim(),
          type: "feedback",
        }),
      });
      setCommentText("");
      fetchProject();
    } catch { /* ignore */ }
    setSending(false);
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Projet introuvable</h2>
          <Link href="/dashboard"><Button variant="outline">Retour au dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const sc = statusConfig[project.status] || statusConfig.discovery;
  const techStack = project.techStack ? JSON.parse(project.techStack) : [];
  const allStages = ["discovery", "design", "development", "testing", "review", "delivered"];
  const currentStageIdx = allStages.indexOf(project.status);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-sm font-bold tracking-tight flex items-center gap-2">
                  {project.name}
                  <Badge className={`text-[10px] text-white ${sc.bg}`}>{sc.label}</Badge>
                </h1>
                <p className="text-[10px] text-muted-foreground">Mis à jour le {formatDate(project.updatedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ExternalLink className="h-3 w-3" /> Voir le site
                  </Button>
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Github className="h-3 w-3" /> Repo
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Progress pipeline */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Progression du projet</h3>
              <span className="text-2xl font-bold text-primary">{project.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
              <motion.div
                className={`h-full rounded-full ${project.progress === 100 ? "bg-emerald-500" : "bg-primary"}`}
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            {/* Stage pipeline */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {allStages.map((stage, i) => {
                const s = statusConfig[stage];
                const isActive = i === currentStageIdx;
                const isDone = i < currentStageIdx;
                return (
                  <div key={stage} className="flex items-center gap-1 flex-1 min-w-0">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                      isActive ? `${s.bg} text-white` : isDone ? "bg-emerald-500/10 text-emerald-600" : "bg-muted/50 text-muted-foreground"
                    }`}>
                      {isDone ? <CheckCircle2 className="h-3 w-3" /> : isActive ? <Zap className="h-3 w-3" /> : <CircleDot className="h-3 w-3" />}
                      {s.label}
                    </div>
                    {i < allStages.length - 1 && <div className={`h-0.5 flex-1 min-w-2 ${isDone ? "bg-emerald-500" : "bg-muted"}`} />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">Dates</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Début</span><span className="font-medium">{formatDate(project.startDate)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Échéance</span><span className="font-medium">{formatDate(project.deadline)}</span></div>
                {project.completedAt && <div className="flex justify-between"><span className="text-muted-foreground">Livré le</span><span className="font-medium text-emerald-500">{formatDate(project.completedAt)}</span></div>}
              </div>
            </CardContent>
          </Card>
          {project.budget && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Budget</span>
                </div>
                <p className="text-lg font-bold">{project.budget} <span className="text-xs text-muted-foreground">{project.currency}</span></p>
              </CardContent>
            </Card>
          )}
          {techStack.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Technologies</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {techStack.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-muted font-medium">{t}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {(["overview", "updates"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "overview" ? `Étapes (${project.milestones.length})` : `Activité (${project.updates.length})`}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" ? (
          /* Milestones */
          <div className="space-y-3">
            {project.milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune étape définie pour le moment.</p>
            ) : (
              project.milestones.map((m, i) => {
                const ms = milestoneStatusIcon[m.status] || milestoneStatusIcon.pending;
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-border transition-colors">
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <ms.icon className={`h-5 w-5 ${ms.color} ${m.status === "in_progress" ? "animate-spin" : ""}`} />
                        {i < project.milestones.length - 1 && <div className="w-0.5 h-6 bg-border" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-medium ${m.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{m.title}</h4>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {m.status === "pending" ? "En attente" : m.status === "in_progress" ? "En cours" : m.status === "completed" ? "Terminé" : "Bloqué"}
                          </Badge>
                        </div>
                        {m.description && <p className="text-[11px] text-muted-foreground mt-1">{m.description}</p>}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                          {m.dueDate && <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {formatDate(m.dueDate)}</span>}
                          {m.completedAt && <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="h-2.5 w-2.5" /> {formatDate(m.completedAt)}</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        ) : (
          /* Updates feed + comment input */
          <div className="space-y-4">
            {/* Comment input */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Ajouter un commentaire ou une question..."
                      className="w-full min-h-[60px] text-sm bg-transparent border-0 resize-none focus:outline-none placeholder:text-muted-foreground"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" disabled={!commentText.trim() || sending} onClick={sendComment} className="gap-1.5">
                        {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates list */}
            {project.updates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune mise à jour pour le moment.</p>
            ) : (
              project.updates.map((u, i) => {
                const ut = updateTypeIcon[u.type] || updateTypeIcon.update;
                return (
                  <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className={u.authorRole === "client" ? "border-primary/20 bg-primary/[0.02]" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${ut.bg}`}>
                            <ut.icon className={`h-4 w-4 ${ut.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-sm font-medium">{u.title}</h4>
                              <span className="text-[10px] text-muted-foreground shrink-0">{formatDateTime(u.createdAt)}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground whitespace-pre-wrap">{u.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-[9px]">
                                {u.authorRole === "admin" ? "Équipe" : "Vous"}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{u.authorName}</span>
                            </div>
                            {u.attachmentUrl && (
                              <a href={u.attachmentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline">
                                <Download className="h-3 w-3" />
                                {u.attachmentName || "Télécharger le fichier"}
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
