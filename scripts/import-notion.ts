import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";

/* ═══════════════════════════════════════════════════════════════════
   Import Notion Leads CSV → Supabase
   
   Reads the exported Notion CSV and inserts all leads into the
   Supabase `leads` table, mapping columns appropriately.
   ═══════════════════════════════════════════════════════════════════ */

const sb = createClient(
  "https://mdcympkmliinozeslnjx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY3ltcGttbGlpbm96ZXNsbmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc5MDIzOSwiZXhwIjoyMDg4MzY2MjM5fQ.JjNkV8ob4Ooyn77njjUVWSLt0xU1NKbmRU9XGDrmfu8"
);

const CSV_PATH = "data/notion-export/extracted/Leads (Despensa Total) 30eaa3e04ea981cfabd3cdba676c3d1d.csv";

// Detect business type from name/website
function detectBusinessType(name: string, website: string): string {
  const lower = (name + " " + website).toLowerCase();
  if (lower.includes("hotel")) return "hotel";
  if (lower.includes("hostal")) return "hotel";
  if (lower.includes("rural") || lower.includes("casa ") || lower.includes("masia") || lower.includes("masía")) return "rural";
  if (lower.includes("apart") || lower.includes("apartament")) return "apartamentos";
  if (lower.includes("camping") || lower.includes("glamping")) return "camping";
  if (lower.includes("refugi") || lower.includes("alberg")) return "rural";
  if (lower.includes("restaurant") || lower.includes("rest.")) return "restaurante";
  if (lower.includes("bar ") || lower.includes("café") || lower.includes("cafe")) return "bar";
  return "hotel"; // Default for HORECA
}

// Determine tier based on score
function detectTier(score: string): "A" | "B" | "C" {
  const num = parseFloat(score?.replace(",", ".") || "0");
  if (num >= 70) return "A";
  if (num >= 40) return "B";
  return "C";
}

// Estimate ticket based on type and tier
function estimateTicket(type: string, tier: string): number {
  const tickets: Record<string, Record<string, number>> = {
    hotel:        { A: 8000, B: 4000, C: 2000 },
    rural:        { A: 5000, B: 3000, C: 1500 },
    apartamentos: { A: 6000, B: 3500, C: 2000 },
    camping:      { A: 6000, B: 3000, C: 1500 },
    restaurante:  { A: 3000, B: 2000, C: 1000 },
    bar:          { A: 2000, B: 1500, C: 1000 },
  };
  return tickets[type]?.[tier] || 2000;
}

// Build pain points from scan data and pitch
function buildPainPoints(row: Record<string, string>): string[] {
  const pains: string[] = [];
  const pitch = (row["Pitch / Dolor"] || "").toLowerCase();
  
  if (pitch.includes("booking") || pitch.includes("comisión") || pitch.includes("comision")) pains.push("Comisiones OTAs");
  if (pitch.includes("reserva") || pitch.includes("motor")) pains.push("Sin reservas online");
  if (pitch.includes("web") || pitch.includes("obsolet")) pains.push("Web obsoleta");
  if (pitch.includes("ses") || pitch.includes("mossos") || pitch.includes("viajero")) pains.push("SES.Hospedajes");
  if (pitch.includes("verifactu") || pitch.includes("factur")) pains.push("VeriFactu");
  if (!row["Website"] || row["Website"].trim() === "") pains.push("Sin presencia digital");
  
  // Default pain points for HORECA
  if (pains.length === 0) {
    pains.push("Sin presencia digital", "Gestión manual");
  }
  
  return pains;
}

async function importLeads() {
  console.log("\n  🔄 Leyendo CSV de Notion...\n");
  
  const csv = readFileSync(CSV_PATH, "utf-8");
  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  console.log(`  📊 ${records.length} leads encontrados en el CSV\n`);

  // First, clear existing seed data (the 10 sample leads)
  const { count } = await sb.from("leads").select("*", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(`  🧹 Limpiando ${count} leads existentes (sample data)...`);
    await sb.from("activities").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await sb.from("leads").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    console.log("  ✅ Datos de prueba limpiados\n");
  }

  // Prepare leads for insertion
  const leads = records
    .filter(row => row["Hotel / Nombre"]?.trim()) // Skip blank rows
    .map(row => {
      const name = row["Hotel / Nombre"].trim();
      const website = row["Website"]?.trim() || "";
      const type = detectBusinessType(name, website);
      const tier = detectTier(row["Score"] || "0");
      const ticket = estimateTicket(type, tier);
      const painPoints = buildPainPoints(row);
      const ciudad = row["Ciudad"]?.trim() || "Lleida";

      return {
        business_name: name,
        contact_name: "",
        email: "",
        phone: row["Teléfono"]?.trim() || "",
        status: "nuevo",
        business_type: type,
        tier,
        estimated_ticket: ticket,
        location: ciudad,
        size: "",
        pain_points: painPoints,
        next_action_date: null,
        next_action: "Llamar para agendar reunión",
        notes: [
          website ? `Web: ${website}` : "",
          row["Rating GBP"] ? `Rating Google: ${row["Rating GBP"]}⭐ (${row["Reviews"] || "?"} reviews)` : "",
          row["Score"] ? `Score Notion: ${row["Score"]}` : "",
          row["Pitch / Dolor"] ? `Pitch: ${row["Pitch / Dolor"].substring(0, 200)}` : "",
        ].filter(Boolean).join(" | "),
      };
    });

  console.log(`  📝 Insertando ${leads.length} leads en Supabase...\n`);

  // Insert in batches of 50
  const BATCH = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < leads.length; i += BATCH) {
    const batch = leads.slice(i, i + BATCH);
    const { data, error } = await sb.from("leads").insert(batch).select("id");
    
    if (error) {
      console.error(`  ❌ Error batch ${i / BATCH + 1}:`, error.message);
      errors += batch.length;
    } else {
      inserted += data.length;
      const pct = Math.round((inserted / leads.length) * 100);
      console.log(`  ✅ Batch ${Math.floor(i / BATCH) + 1}: ${data.length} leads insertados (${pct}%)`);
    }
  }

  console.log(`\n  ════════════════════════════════════════`);
  console.log(`  ✅ Importación completada`);
  console.log(`  📊 ${inserted} leads insertados`);
  if (errors > 0) console.log(`  ❌ ${errors} errores`);
  console.log(`  ════════════════════════════════════════\n`);

  // Show breakdown by city
  const byCiudad: Record<string, number> = {};
  leads.forEach(l => { byCiudad[l.location] = (byCiudad[l.location] || 0) + 1; });
  console.log("  📍 Distribución por ciudad:");
  Object.entries(byCiudad)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([city, n]) => console.log(`     ${city}: ${n}`));

  // Show breakdown by type
  const byType: Record<string, number> = {};
  leads.forEach(l => { byType[l.business_type] = (byType[l.business_type] || 0) + 1; });
  console.log("\n  🏨 Distribución por tipo:");
  Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, n]) => console.log(`     ${type}: ${n}`));

  // Show breakdown by tier
  const byTier: Record<string, number> = {};
  leads.forEach(l => { byTier[l.tier] = (byTier[l.tier] || 0) + 1; });
  console.log("\n  🏆 Distribución por tier:");
  Object.entries(byTier)
    .sort()
    .forEach(([tier, n]) => console.log(`     Tier ${tier}: ${n}`));

  console.log("");
}

importLeads();
