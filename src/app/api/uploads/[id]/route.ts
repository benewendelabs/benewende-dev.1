import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const upload = await prisma.upload.findUnique({
      where: { id: params.id },
    });

    if (!upload) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(upload.data), {
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": upload.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Upload serve error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
