import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: add milestone (admin only)
export async function POST(
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
  const { title, description, status, dueDate, sortOrder } = body;

  const milestone = await prisma.projectMilestone.create({
    data: {
      clientProjectId: params.id,
      title,
      description: description || null,
      status: status || "pending",
      dueDate: dueDate ? new Date(dueDate) : null,
      sortOrder: sortOrder || 0,
    },
  });

  return NextResponse.json(milestone);
}
