import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_EMAIL || "info@fraguasystems.com";
// Use onboarding@resend.dev until fraguasystems.com domain is verified
const FROM_EMAIL = process.env.RESEND_FROM || "Fragua Systems <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son obligatorios." },
        { status: 400 }
      );
    }

    // Send email to Fragua Systems
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[Auditoría] ${company || "Sin empresa"} — ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0e0f12; padding: 24px 32px; border-bottom: 2px solid #c86a3d;">
            <h1 style="color: #f0ece6; font-size: 18px; margin: 0; font-weight: 600;">
              Nueva Solicitud de Auditoría
            </h1>
          </div>
          <div style="padding: 32px; background: #f8f8f6;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b; font-size: 13px; width: 120px; vertical-align: top;">Nombre</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e2dc; font-size: 15px; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b; font-size: 13px; vertical-align: top;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e2dc; font-size: 15px;">
                  <a href="mailto:${email}" style="color: #c86a3d;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e2dc; color: #6b6b6b; font-size: 13px; vertical-align: top;">Empresa</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e2dc; font-size: 15px;">${company || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b6b6b; font-size: 13px; vertical-align: top;">Mensaje</td>
                <td style="padding: 12px 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 16px 32px; background: #0e0f12; text-align: center;">
            <p style="color: #6b6b6b; font-size: 11px; margin: 0;">
              Fragua Systems · Ingeniería HORECA · fraguasystems.com
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Error al enviar el email. Inténtelo de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
