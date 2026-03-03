import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: single project with all milestones and updates
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const project = await prisma.clientProject.findUnique({
    where: { id: params.id },
    include: {
      milestones: { orderBy: { sortOrder: "asc" } },
      updates: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  // Only allow access to own projects or admin
  if (user.role !== "admin" && project.userId !== user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  return NextResponse.json(project);
}

// PUT: update project (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, status, priority, progress, budget, currency, deadline, techStack, repoUrl, liveUrl, completedAt } = body;

  const project = await prisma.clientProject.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(progress !== undefined && { progress: Number(progress) }),
      ...(budget !== undefined && { budget }),
      ...(currency !== undefined && { currency }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      ...(techStack !== undefined && { techStack: Array.isArray(techStack) ? JSON.stringify(techStack) : techStack }),
      ...(repoUrl !== undefined && { repoUrl }),
      ...(liveUrl !== undefined && { liveUrl }),
      ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
    },
    include: { milestones: true, updates: true, user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(project);
}

// DELETE: delete project (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  await prisma.clientProject.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
