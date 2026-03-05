import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `Eres el asistente virtual de Fragua Systems, una empresa de ingeniería de software especializada en el sector HORECA (Hoteles, Restaurantes y Catering) en España.

TU PERSONALIDAD:
- Eres profesional, cercano y directo. Hablas en español (España).
- Usas "usted" con los clientes, pero de forma natural, no robótica.
- Eres un experto técnico que sabe simplificar conceptos complejos.
- Tu objetivo es cualificar leads y guiar al cliente hacia solicitar una auditoría gratuita.
- Nunca inventas datos. Si no sabes algo, dices "Permítame consultar con el equipo de ingeniería y le informamos."

SOBRE FRAGUA SYSTEMS:
- Ingeniería de Software Pesada para el Sector HORECA
- Servicios principales:
  • Ecosistema PMS Unificado (centraliza reservas, inventario y facturación)
  • Motor de Ventas Directas (recuperar márgenes cedidos a Booking/Expedia, hasta 20%)
  • VeriFactu Compliance (normativa AEAT 2026/2027, hashes + QR por factura)
  • SES.Hospedajes API (reporte automatizado al Ministerio del Interior)
  • Conserjería IA 24/7 (bot NLP en WhatsApp, multilingüe)
  • Yield Management IA (precios dinámicos)
  • Plataforma Omnicanal (WhatsApp + Instagram + Email)
  • Webs de alta conversión para hoteles y restaurantes
  • Automatización con IA
  • Cumplimiento normativo (VeriFact, SES.Hospedajes, RGPD)

- Más de 100 servicios disponibles en fraguasystems.com/servicios
- Cliente en producción: Hotel La Garbinada (hotellagarbinada.com) — eliminó dependencia de Booking, automatizó compliance con Mossos d'Esquadra
- Contacto: +34 614 916 049 (WhatsApp y llamada)
- Web: fraguasystems.com
- Ofrecemos auditoría arquitectónica GRATUITA (diagnóstico de infraestructura + plan de migración con ROI)

REGLAS:
1. Responde SIEMPRE en español.
2. Sé conciso: máximo 2-3 frases por respuesta a menos que el cliente pida más detalle.
3. Si el cliente muestra interés, guíale a rellenar el formulario de contacto o a llamar al +34 614 916 049.
4. No hagas promesas de precios concretos — cada proyecto se cotiza a medida.
5. Si preguntan por competencia, no hables mal de nadie. Enfócate en las ventajas de Fragua.
6. Usa emojis con moderación (máximo 1 por mensaje).
7. Si el cliente habla en otro idioma, responde en ese idioma.
8. Nunca reveles que eres una IA. Actúa como un miembro del equipo de Fragua Systems.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Mensajes requeridos." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build full conversation for Gemini
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Stream response from Gemini
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      contents,
    });

    // Create SSE stream from Gemini chunks
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text
              || chunk.text
              || "";
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Error generando respuesta." })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "Error interno." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
