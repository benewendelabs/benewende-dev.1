import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { skillCategories } from "@/data/skills";
import { testimonials } from "@/data/testimonials";
import { experiences } from "@/data/experience";

const iconNames = ["Rocket", "Palette", "Bot", "FileText", "GraduationCap", "Lightbulb"];

export async function GET(request: NextRequest) {
  // Block in production unless SEED_SECRET is provided
  if (process.env.NODE_ENV === "production") {
    const secret = request.nextUrl.searchParams.get("secret");
    if (!secret || secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
  }

  try {
    const results: Record<string, string> = {};

    // 1. Admin user
    const adminEmail = "benewende.dev@gmail.com";
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      results.admin = "already exists";
    } else {
      const adminPassword = process.env.ADMIN_PASSWORD || "Benewende@2026!";
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: { name: "Benewende", email: adminEmail, password: hashedPassword, role: "admin", plan: "business", cvCredits: 999 },
      });
      results.admin = "created";
    }

    // 2. Projects
    const existingProjects = await prisma.project.count();
    if (existingProjects === 0) {
      for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        await prisma.project.create({
          data: {
            name: p.name,
            description: p.description,
            image: p.image,
            technologies: JSON.stringify(p.technologies),
            status: p.status,
            category: p.category,
            progress: p.progress || 0,
            launchDate: p.launchDate || null,
            liveUrl: p.liveUrl || null,
            githubUrl: p.githubUrl || null,
            statsUsers: p.stats?.users || null,
            statsPerf: p.stats?.performance || null,
            statsRoi: p.stats?.roi || null,
            sortOrder: i,
            visible: true,
          },
        });
      }
      results.projects = `${projects.length} created`;
    } else {
      results.projects = `${existingProjects} already exist`;
    }

    // 3. Services
    const existingServices = await prisma.serviceItem.count();
    if (existingServices === 0) {
      for (let i = 0; i < services.length; i++) {
        const s = services[i];
        await prisma.serviceItem.create({
          data: {
            title: s.title,
            description: s.description,
            icon: iconNames[i] || "Rocket",
            priceXOF: s.price.XOF,
            priceEUR: s.price.EUR,
            priceUSD: s.price.USD,
            features: JSON.stringify(s.features),
            sortOrder: i,
            visible: true,
          },
        });
      }
      results.services = `${services.length} created`;
    } else {
      results.services = `${existingServices} already exist`;
    }

    // 4. Skills
    const existingSkills = await prisma.skillGroup.count();
    if (existingSkills === 0) {
      for (let i = 0; i < skillCategories.length; i++) {
        const sc = skillCategories[i];
        await prisma.skillGroup.create({
          data: {
            category: sc.category,
            skills: JSON.stringify(sc.skills),
            sortOrder: i,
            visible: true,
          },
        });
      }
      results.skills = `${skillCategories.length} created`;
    } else {
      results.skills = `${existingSkills} already exist`;
    }

    // 5. Testimonials
    const existingTestimonials = await prisma.testimonialItem.count();
    if (existingTestimonials === 0) {
      for (let i = 0; i < testimonials.length; i++) {
        const t = testimonials[i];
        await prisma.testimonialItem.create({
          data: {
            name: t.name,
            role: t.role,
            company: t.company,
            content: t.content,
            rating: t.rating,
            avatar: t.avatar || null,
            sortOrder: i,
            visible: true,
          },
        });
      }
      results.testimonials = `${testimonials.length} created`;
    } else {
      results.testimonials = `${existingTestimonials} already exist`;
    }

    // 6. Experiences
    const existingExperiences = await prisma.experienceItem.count();
    if (existingExperiences === 0) {
      for (let i = 0; i < experiences.length; i++) {
        const e = experiences[i];
        await prisma.experienceItem.create({
          data: {
            period: e.period,
            title: e.title,
            company: e.company,
            description: e.description,
            achievements: JSON.stringify(e.achievements),
            current: e.current || false,
            sortOrder: i,
            visible: true,
          },
        });
      }
      results.experiences = `${experiences.length} created`;
    } else {
      results.experiences = `${existingExperiences} already exist`;
    }

    // 7. Site Settings (upsert each individually)
    const settingsToSeed: { id: string; value: Record<string, unknown> }[] = [
      {
        id: "hero",
        value: {
          title: "Je crée",
          subtitle: "Développeur Full Stack & Créateur de SaaS · Expert IA · Ouagadougou, Burkina Faso",
          typingTexts: [
            "des SaaS qui génèrent des revenus",
            "des apps web ultra-performantes",
            "des solutions IA sur mesure",
            "votre vision en produit digital",
          ],
          available: true,
        },
      },
      {
        id: "site",
        value: {
          name: "Benewende.dev",
          email: "benewende.dev@gmail.com",
          phone: "+226 07 26 71 19",
          whatsapp: "2250708454592",
          location: "Ouagadougou, Burkina Faso",
          github: "https://github.com/benewendebrandstudios-design",
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
          tiktok: "",
          calendly: "",
        },
      },
      {
        id: "process",
        value: {
          steps: [
            { icon: "Search", title: "Découverte", duration: "1-2 jours", tasks: ["Analyse besoin", "Audit technique", "Proposition solution"] },
            { icon: "PenTool", title: "Design & Architecture", duration: "3-5 jours", tasks: ["Wireframes", "Architecture technique", "Validation client"] },
            { icon: "Code2", title: "Développement", duration: "2-6 semaines", tasks: ["Sprints hebdomadaires", "Démos régulières", "Feedbacks itératifs"] },
            { icon: "Rocket", title: "Déploiement", duration: "1 semaine", tasks: ["Mise en production", "Formation équipe", "Documentation"] },
            { icon: "Wrench", title: "Maintenance", duration: "Ongoing", tasks: ["Support technique", "Nouvelles features", "Optimisations"] },
          ],
        },
      },
      {
        id: "footer",
        value: {
          description: "Développeur Full Stack passionné, spécialisé en React, Next.js et architectures SaaS. Je transforme vos idées en produits digitaux performants, de la conception au déploiement. Basé à Ouagadougou, Burkina Faso.",
          copyright: "Benewende.dev. Tous droits réservés.",
          tagline: "Fait avec ❤️ à Ouagadougou",
        },
      },
    ];
    const seededSettings: string[] = [];
    for (const s of settingsToSeed) {
      const existing = await prisma.siteSetting.findUnique({ where: { id: s.id } });
      if (!existing) {
        await prisma.siteSetting.create({ data: { id: s.id, value: JSON.stringify(s.value) } });
        seededSettings.push(s.id);
      }
    }
    results.settings = seededSettings.length > 0 ? `created: ${seededSettings.join(", ")}` : "all exist";

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors du seed", details: String(error) },
      { status: 500 }
    );
  }
}
