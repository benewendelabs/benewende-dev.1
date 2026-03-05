import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    switch (params.type) {
      case "projects": {
        const items = await prisma.project.findMany({
          where: { visible: true },
          orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(
          items.map((p) => ({
            ...p,
            technologies: JSON.parse(p.technologies),
            stats: p.statsUsers
              ? { users: p.statsUsers, performance: p.statsPerf, roi: p.statsRoi }
              : undefined,
          }))
        );
      }
      case "services": {
        const items = await prisma.serviceItem.findMany({
          where: { visible: true },
          orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(
          items.map((s) => ({
            ...s,
            features: JSON.parse(s.features),
            price: { XOF: s.priceXOF, EUR: s.priceEUR, USD: s.priceUSD },
          }))
        );
      }
      case "skills": {
        const items = await prisma.skillGroup.findMany({
          where: { visible: true },
          orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(
          items.map((s) => ({ ...s, skills: JSON.parse(s.skills) }))
        );
      }
      case "testimonials": {
        const items = await prisma.testimonialItem.findMany({
          where: { visible: true },
          orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(items);
      }
      case "experiences": {
        const items = await prisma.experienceItem.findMany({
          where: { visible: true },
          orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json(
          items.map((e) => ({ ...e, achievements: JSON.parse(e.achievements) }))
        );
      }
      case "pricing": {
        const items = await prisma.pricingPlan.findMany({
          where: { visible: true },
          orderBy: [{ serviceCategory: "asc" }, { tierLevel: "asc" }],
        });
        return NextResponse.json(
          items.map((p) => ({
            ...p,
            features: JSON.parse(p.features),
            price: { XOF: p.priceXOF, EUR: p.priceEUR, USD: p.priceUSD },
            maintenance: p.maintenanceXOF
              ? { XOF: p.maintenanceXOF, EUR: p.maintenanceEUR, USD: p.maintenanceUSD }
              : null,
          }))
        );
      }
      case "settings": {
        const items = await prisma.siteSetting.findMany();
        const map: Record<string, unknown> = {};
        for (const s of items) {
          try { map[s.id] = JSON.parse(s.value); } catch { map[s.id] = s.value; }
        }
        return NextResponse.json(map);
      }
      default:
        return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }
  } catch (error) {
    console.error("Content API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
