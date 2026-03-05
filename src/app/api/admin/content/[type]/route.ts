import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

function isAdminToken(token: { role?: string } | null): boolean {
  return token?.role === "admin";
}

const modelMap: Record<string, string> = {
  projects: "project",
  services: "serviceItem",
  skills: "skillGroup",
  testimonials: "testimonialItem",
  experiences: "experienceItem",
  pricing: "pricingPlan",
  settings: "siteSetting",
};

function getModel(type: string) {
  const model = modelMap[type];
  if (!model) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as unknown as Record<string, unknown>)[model] as Record<string, (...args: any[]) => any>;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { type: string } }
) {
  const token = await getToken({ req: _request });
  if (!isAdminToken(token as { role?: string } | null)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const model = getModel(params.type);
  if (!model) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const orderBy = params.type === "settings" ? undefined : { sortOrder: "asc" as const };
  const items = await model.findMany(orderBy ? { orderBy } : undefined);
  return NextResponse.json(items);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const token = await getToken({ req: request });
  if (!isAdminToken(token as { role?: string } | null)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const model = getModel(params.type);
  if (!model) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const body = await request.json();
  const item = await model.create({ data: body });
  return NextResponse.json(item);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const token = await getToken({ req: request });
  if (!isAdminToken(token as { role?: string } | null)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const model = getModel(params.type);
  if (!model) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  // Settings use upsert since the record may not exist yet
  if (params.type === "settings") {
    const item = await model.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
    return NextResponse.json(item);
  }

  const item = await model.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const token = await getToken({ req: request });
  if (!isAdminToken(token as { role?: string } | null)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const model = getModel(params.type);
  if (!model) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const { id } = await request.json();
  await model.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
