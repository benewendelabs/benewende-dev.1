import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: list projects for logged-in user (or all for admin)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const isAdmin = user.role === "admin";
  const { searchParams } = new URL(req.url);
  const allParam = searchParams.get("all");

  const projects = await prisma.clientProject.findMany({
    where: isAdmin && allParam === "true" ? {} : { userId: user.id, visible: true },
    include: {
      milestones: { orderBy: { sortOrder: "asc" } },
      updates: { orderBy: { createdAt: "desc" }, take: 5 },
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

// POST: create a new client project (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, name, description, status, priority, budget, currency, deadline, techStack, repoUrl, liveUrl } = body;

  if (!userId || !name || !description) {
    return NextResponse.json({ error: "Champs requis: userId, name, description" }, { status: 400 });
  }

  const project = await prisma.clientProject.create({
    data: {
      userId,
      name,
      description,
      status: status || "discovery",
      priority: priority || "normal",
      budget: budget || null,
      currency: currency || "XOF",
      deadline: deadline ? new Date(deadline) : null,
      techStack: techStack ? JSON.stringify(techStack) : null,
      repoUrl: repoUrl || null,
      liveUrl: liveUrl || null,
    },
    include: { milestones: true, updates: true, user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(project);
}
