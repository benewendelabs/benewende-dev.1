import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({
        success: true,
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetExpires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`;

    // Always log reset URL server-side
    console.log("🔑 Reset password URL:", resetUrl);

    // Try to send email via Resend
    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const fromEmail = process.env.SMTP_FROM || "Benewende.dev <onboarding@resend.dev>";
        const result = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: "Réinitialisation de votre mot de passe",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: linear-gradient(135deg, #0066FF, #0052cc); padding: 32px 24px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
                <h1 style="margin: 0; font-size: 22px;">Réinitialisation du mot de passe</h1>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Benewende.dev</p>
              </div>
              <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 14px; line-height: 1.7; color: #374151;">
                  Bonjour <strong>${user.name}</strong>,
                </p>
                <p style="font-size: 14px; line-height: 1.7; color: #374151;">
                  Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous :
                </p>
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${resetUrl}" style="background: #0066FF; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
                    Réinitialiser mon mot de passe
                  </a>
                </div>
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                  Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.
                </p>
              </div>
            </div>`,
        });
        if (result.error) {
          console.error("Resend error:", result.error);
        } else {
          emailSent = true;
          console.log("Reset email sent to:", email, "id:", result.data?.id);
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    // If email failed, return the reset link directly so user isn't stuck
    if (!emailSent) {
      return NextResponse.json({
        success: true,
        message: "L'envoi d'email n'est pas disponible actuellement.",
        resetUrl,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Un lien de réinitialisation a été envoyé à votre adresse email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
