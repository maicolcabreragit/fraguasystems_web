import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_EMAIL || "info@fraguasystems.com";
const FROM_EMAIL = process.env.RESEND_FROM || "Fragua Systems <onboarding@resend.dev>";
const LOGO_URL = "https://www.fraguasystems.com/brand/logo.png";
const SITE_URL = "https://www.fraguasystems.com";

// Sanitize user input to prevent XSS in email
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

function buildEmailHTML(data: { name: string; email: string; company: string; message: string }): string {
  const { name, email, company, message } = data;
  const now = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid", dateStyle: "long", timeStyle: "short" });

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f0ece6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece6;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:#0e0f12;padding:28px 36px;border-radius:8px 8px 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48" style="vertical-align:middle;">
          <img src="${LOGO_URL}" alt="FS" width="40" height="40" style="display:block;border-radius:4px;" />
        </td>
        <td style="padding-left:16px;vertical-align:middle;">
          <p style="margin:0;color:#f0ece6;font-size:18px;font-weight:700;letter-spacing:0.5px;">Fragua Systems</p>
          <p style="margin:2px 0 0;color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Ingeniería HORECA</p>
        </td>
        <td align="right" style="vertical-align:middle;">
          <span style="display:inline-block;background:#c86a3d;color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:3px;text-transform:uppercase;letter-spacing:1px;">Nuevo Lead</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- TITLE BAR -->
  <tr><td style="background:#1a1b1f;padding:20px 36px;border-bottom:2px solid #c86a3d;">
    <h1 style="margin:0;color:#f0ece6;font-size:20px;font-weight:600;">Nueva Solicitud de Auditoría</h1>
    <p style="margin:6px 0 0;color:#6b6b6b;font-size:12px;">${now} · Formulario web fraguasystems.com</p>
  </td></tr>

  <!-- LEAD DATA -->
  <tr><td style="background:#ffffff;padding:32px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:14px 16px;background:#f8f7f5;border-left:3px solid #c86a3d;font-size:12px;color:#8a8a8a;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Contacto</td>
        <td style="padding:14px 16px;background:#f8f7f5;font-size:15px;font-weight:600;color:#1a1b1f;">${esc(name)}</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #eae8e3;font-size:12px;color:#8a8a8a;text-transform:uppercase;letter-spacing:1.5px;">Email</td>
        <td style="padding:14px 16px;border-bottom:1px solid #eae8e3;">
          <a href="mailto:${esc(email)}" style="color:#c86a3d;font-size:15px;text-decoration:none;font-weight:500;">${esc(email)}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #eae8e3;font-size:12px;color:#8a8a8a;text-transform:uppercase;letter-spacing:1.5px;">Empresa</td>
        <td style="padding:14px 16px;border-bottom:1px solid #eae8e3;font-size:15px;color:#1a1b1f;font-weight:500;">${company ? esc(company) : '<span style="color:#bbb;">No especificada</span>'}</td>
      </tr>
    </table>

    <!-- MESSAGE -->
    <div style="margin-top:24px;padding:20px 24px;background:#f8f7f5;border-radius:6px;border:1px solid #eae8e3;">
      <p style="margin:0 0 8px;font-size:11px;color:#8a8a8a;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Mensaje</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#2d2d2d;">${esc(message)}</p>
    </div>

    <!-- QUICK ACTIONS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
      <tr>
        <td width="48%" style="padding-right:8px;">
          <a href="mailto:${esc(email)}?subject=Re: Auditoría Arquitectónica — Fragua Systems" style="display:block;text-align:center;padding:14px 20px;background:#0e0f12;color:#f0ece6;font-size:13px;font-weight:600;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">
            ✉️&nbsp; Responder por Email
          </a>
        </td>
        <td width="48%" style="padding-left:8px;">
          <a href="https://wa.me/34614916049" style="display:block;text-align:center;padding:14px 20px;background:#25D366;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">
            💬&nbsp; Contactar WhatsApp
          </a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0e0f12;padding:24px 36px;border-radius:0 0 8px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:middle;">
          <p style="margin:0;color:#6b6b6b;font-size:11px;line-height:1.6;">
            <a href="${SITE_URL}" style="color:#c86a3d;text-decoration:none;font-weight:600;">fraguasystems.com</a><br>
            Ingeniería de Software para el Sector HORECA<br>
            <span style="color:#4b4b4b;">Webs de conversión · Reservas directas · IA · Compliance</span>
          </p>
        </td>
        <td align="right" style="vertical-align:middle;">
          <p style="margin:0;color:#4b4b4b;font-size:10px;line-height:1.6;text-align:right;">
            Cliente en producción:<br>
            <a href="https://www.hotellagarbinada.com" style="color:#6b6b6b;text-decoration:underline;">hotellagarbinada.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildConfirmationHTML(data: { name: string; company: string }): string {
  const firstName = data.name.split(" ")[0];

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f0ece6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece6;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:#0e0f12;padding:28px 36px;border-radius:8px 8px 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48" style="vertical-align:middle;">
          <img src="${LOGO_URL}" alt="Fragua Systems" width="40" height="40" style="display:block;border-radius:4px;" />
        </td>
        <td style="padding-left:16px;vertical-align:middle;">
          <p style="margin:0;color:#f0ece6;font-size:18px;font-weight:700;letter-spacing:0.5px;">Fragua Systems</p>
          <p style="margin:2px 0 0;color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Ingeniería HORECA</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- HERO -->
  <tr><td style="background:#1a1b1f;padding:32px 36px;border-bottom:2px solid #c86a3d;text-align:center;">
    <p style="margin:0;color:#c86a3d;font-size:11px;text-transform:uppercase;letter-spacing:3px;font-weight:600;">Confirmación de solicitud</p>
    <h1 style="margin:12px 0 0;color:#f0ece6;font-size:24px;font-weight:700;line-height:1.3;">
      Hemos recibido su solicitud,<br>${esc(firstName)}.
    </h1>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:36px;">
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#2d2d2d;">
      Gracias por confiar en Fragua Systems${data.company ? ` para impulsar la tecnología de <strong>${esc(data.company)}</strong>` : ""}. 
      Su infraestructura merece ingeniería de precisión, y eso es exactamente lo que hacemos.
    </p>

    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#555;">
      Un ingeniero de nuestro equipo revisará su caso personalmente. Esto es lo que puede esperar:
    </p>

    <!-- TIMELINE -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="44" style="vertical-align:top;padding:0 0 20px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#0e0f12;color:#c86a3d;font-size:14px;font-weight:700;text-align:center;line-height:36px;">1</div>
        </td>
        <td style="padding:0 0 20px 12px;vertical-align:top;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#1a1b1f;">Revisión en menos de 24h laborables</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b6b6b;line-height:1.5;">Analizamos su mensaje y preparamos las preguntas clave para entender su necesidad exacta.</p>
        </td>
      </tr>
      <tr>
        <td width="44" style="vertical-align:top;padding:0 0 20px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#0e0f12;color:#c86a3d;font-size:14px;font-weight:700;text-align:center;line-height:36px;">2</div>
        </td>
        <td style="padding:0 0 20px 12px;vertical-align:top;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#1a1b1f;">Diagnóstico arquitectónico</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b6b6b;line-height:1.5;">Evaluamos su stack actual: PMS, canales de venta, compliance (VeriFact, SES.Hospedajes) y puntos de fuga de revenue.</p>
        </td>
      </tr>
      <tr>
        <td width="44" style="vertical-align:top;padding:0 0 0;">
          <div style="width:36px;height:36px;border-radius:50%;background:#c86a3d;color:#ffffff;font-size:14px;font-weight:700;text-align:center;line-height:36px;">3</div>
        </td>
        <td style="padding:0 0 0 12px;vertical-align:top;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#1a1b1f;">Plan de acción con ROI proyectado</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b6b6b;line-height:1.5;">Le entregamos una hoja de ruta técnica con fases, plazos y cifras concretas de ahorro. Sin compromiso.</p>
        </td>
      </tr>
    </table>

    <!-- TRUST BOX -->
    <div style="margin-top:28px;padding:20px 24px;background:#f8f7f5;border-radius:6px;border-left:3px solid #c86a3d;">
      <p style="margin:0;font-size:13px;color:#6b6b6b;line-height:1.6;">
        <strong style="color:#1a1b1f;">¿Sabía que...?</strong> Nuestro cliente 
        <a href="https://www.hotellagarbinada.com" style="color:#c86a3d;text-decoration:none;font-weight:600;">Hotel La Garbinada</a> 
        eliminó su dependencia de Booking.com y automatizó el compliance con Mossos d'Esquadra — todo con infraestructura propia que genera reservas directas 24/7.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-top:28px;">
      <a href="${SITE_URL}/servicios" style="display:inline-block;padding:14px 32px;background:#0e0f12;color:#f0ece6;font-size:14px;font-weight:600;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">
        Explorar Servicios de Ingeniería →
      </a>
    </div>
  </td></tr>

  <!-- SIGNATURE -->
  <tr><td style="background:#ffffff;padding:0 36px 32px;border-top:1px solid #eae8e3;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding-top:24px;">
      <tr>
        <td>
          <p style="margin:0;font-size:14px;color:#1a1b1f;font-weight:600;">Equipo de Ingeniería</p>
          <p style="margin:2px 0 0;font-size:13px;color:#6b6b6b;">Fragua Systems · Ingeniería de Software Pesada</p>
          <p style="margin:6px 0 0;font-size:12px;">
            <a href="tel:+34614916049" style="color:#c86a3d;text-decoration:none;">+34 614 916 049</a>
            <span style="color:#ddd;"> · </span>
            <a href="${SITE_URL}" style="color:#c86a3d;text-decoration:none;">fraguasystems.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0e0f12;padding:20px 36px;border-radius:0 0 8px 8px;text-align:center;">
    <p style="margin:0;color:#4b4b4b;font-size:10px;line-height:1.6;">
      Este email confirma la recepción de su solicitud.<br>
      © ${new Date().getFullYear()} Fragua Systems · Ingeniería HORECA · España
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}


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

    // Send email to Fragua Systems (internal)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[Auditoría] ${company || "Sin empresa"} — ${name}`,
      html: buildEmailHTML({ name, email, company, message }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Error al enviar el email. Inténtelo de nuevo." },
        { status: 500 }
      );
    }

    // Send confirmation email to client (non-blocking)
    resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Hemos recibido su solicitud — Fragua Systems`,
      html: buildConfirmationHTML({ name, company }),
    }).catch((err) => console.error("Confirmation email error:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
