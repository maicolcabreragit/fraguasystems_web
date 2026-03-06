import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://mdcympkmliinozeslnjx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY3ltcGttbGlpbm96ZXNsbmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc5MDIzOSwiZXhwIjoyMDg4MzY2MjM5fQ.JjNkV8ob4Ooyn77njjUVWSLt0xU1NKbmRU9XGDrmfu8"
);

async function createClientUser() {
  // Get La Garbinada project ID
  const { data: proj } = await sb.from("projects").select("id, name").limit(1).single();
  console.log("  📁 Proyecto:", proj?.name, "→", proj?.id);

  if (!proj) {
    console.error("  ❌ No se encontró el proyecto");
    return;
  }

  // Create client user
  const { data, error } = await sb
    .from("crm_users")
    .upsert(
      {
        email: "info@lagarbinada.com",
        password_hash: "garbinada2026",
        name: "Hotel La Garbinada",
        role: "client",
        client_project_id: proj.id,
      },
      { onConflict: "email" }
    )
    .select();

  if (error) {
    console.error("  ❌ Error:", error.message);
  } else {
    console.log("  ✅ Usuario cliente creado:", data);
    console.log("\n  🔑 Credenciales del cliente:");
    console.log("     Email: info@lagarbinada.com");
    console.log("     Password: garbinada2026");
    console.log("     URL: http://localhost:3000/area-clientes\n");
  }
}

createClientUser();
