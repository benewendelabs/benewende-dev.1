import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: add update (admin or project owner)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const project = await prisma.clientProject.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  // Only admin or project owner can post updates
  if (user.role !== "admin" && project.userId !== user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { title, content, type, attachmentUrl, attachmentName } = body;

  const update = await prisma.projectUpdate.create({
    data: {
      clientProjectId: params.id,
      authorRole: user.role === "admin" ? "admin" : "client",
      authorName: user.name || "Utilisateur",
      title,
      content,
      type: type || "update",
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
    },
  });

  return NextResponse.json(update);
}
