import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if ((token as { role?: string } | null)?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez JPG, PNG, WebP, GIF, SVG, MP4 ou WebM." },
        { status: 400 }
      );
    }

    const isVideo = VIDEO_TYPES.includes(file.type);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${isVideo ? "50" : "5"} Mo)` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = await prisma.upload.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        data: buffer,
      },
    });

    const url = `/api/uploads/${upload.id}`;

    return NextResponse.json({ url, name: file.name, size: file.size });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
