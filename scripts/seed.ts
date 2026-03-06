import { createClient } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════════════════════
   Seed Script — Populate Supabase CRM with sample HORECA leads
   
   Run with: npx tsx scripts/seed.ts
   ═══════════════════════════════════════════════════════════════════ */

const supabaseUrl = "https://mdcympkmliinozeslnjx.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY3ltcGttbGlpbm96ZXNsbmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc5MDIzOSwiZXhwIjoyMDg4MzY2MjM5fQ.JjNkV8ob4Ooyn77njjUVWSLt0xU1NKbmRU9XGDrmfu8";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ─── Sample Leads ────────────────────────────────────────────────

const SAMPLE_LEADS = [
  {
    business_name: "Hotel Nastasi & Spa",
    contact_name: "Jordi Martínez",
    contact_role: "Director General",
    phone: "973 227 050",
    email: "info@hotelnastasi.com",
    business_type: "hotel",
    tier: "A",
    status: "reunion",
    location: "Lleida",
    size: "89 habitaciones",
    pain_points: ["SES.Hospedajes", "VeriFactu", "Comisiones OTAs"],
    estimated_ticket: 12000,
    next_action: "Preparar propuesta Enterprise",
    next_action_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    notes: "Hotel de 4 estrellas. Muy interesado en cumplimiento normativo y canal directo.",
    assigned_to: "admin-socio",
  },
  {
    business_name: "Hotel Zenit Lleida",
    contact_name: "Maria Teresa Puig",
    contact_role: "Revenue Manager",
    phone: "973 209 191",
    email: "reservas@zenitleida.com",
    business_type: "hotel",
    tier: "A",
    status: "contactado",
    location: "Lleida",
    size: "71 habitaciones",
    pain_points: ["SES.Hospedajes", "Comisiones OTAs", "Gestión manual"],
    estimated_ticket: 9000,
    next_action: "Llamar para agendar reunión",
    next_action_date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    notes: "Cadena con varios hoteles. Potencial alto si la primera implementación va bien.",
    assigned_to: "admin-socio",
  },
  {
    business_name: "Cal Duc - Casa Rural",
    contact_name: "Pere Solé",
    contact_role: "Propietario",
    phone: "973 650 123",
    email: "info@calduc.com",
    business_type: "rural",
    tier: "A",
    status: "nuevo",
    location: "Pallars Jussà",
    size: "8 habitaciones",
    pain_points: ["SES.Hospedajes", "Web obsoleta", "Sin reservas online"],
    estimated_ticket: 3500,
    next_action: "Primera llamada de prospección",
    next_action_date: new Date().toISOString().split("T")[0],
    notes: "Casa rural en el Pirineu. Web muy antigua, no tiene sistema de reservas.",
    assigned_to: "admin-socio",
  },
  {
    business_name: "Restaurant La Huerta",
    contact_name: "Ana Blasco",
    contact_role: "Gerente",
    phone: "973 243 567",
    email: "lahuerta@gmail.com",
    business_type: "restaurante",
    tier: "B",
    status: "nuevo",
    location: "Lleida",
    size: "60 comensales",
    pain_points: ["VeriFactu", "Sin presencia digital"],
    estimated_ticket: 2000,
    next_action: "Enviar email introductorio",
    next_action_date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    notes: "Restaurante consolidado pero sin presencia online. VeriFactu urgente.",
    assigned_to: "admin-socio",
  },
  {
    business_name: "Apartamentos Turístics Segre",
    contact_name: "Marc Fontanet",
    contact_role: "Gestor",
    phone: "973 281 900",
    email: "marc@aptsegre.com",
    business_type: "apartamentos",
    tier: "A",
    status: "propuesta",
    location: "Lleida",
    size: "15 apartamentos",
    pain_points: ["SES.Hospedajes", "Comisiones OTAs", "Gestión manual"],
    estimated_ticket: 6000,
    next_action: "Seguimiento propuesta enviada",
    next_action_date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    notes: "Ya les enviamos propuesta Professional. Muy interesado pero consulta con socio.",
    assigned_to: "admin-maicol",
  },
  {
    business_name: "Hostal del Rei",
    contact_name: "Rosa Prats",
    contact_role: "Propietaria",
    phone: "973 456 789",
    email: "hostaldelrei@hotmail.com",
    business_type: "hotel",
    tier: "B",
    status: "nuevo",
    location: "Balaguer",
    size: "22 habitaciones",
    pain_points: ["SES.Hospedajes", "Web obsoleta"],
    estimated_ticket: 3000,
    next_action: "Llamar la semana que viene",
    next_action_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    notes: "Hostal familiar. Web de 2018. Probablemente Paquete Starter.",
    assigned_to: "admin-socio",
  },
  {
    business_name: "Les Corts Hotel Boutique",
    contact_name: "David Clua",
    contact_role: "Director",
    phone: "973 300 100",
    email: "info@lescortshotel.com",
    business_type: "hotel",
    tier: "A",
    status: "negociacion",
    location: "Lleida",
    size: "32 habitaciones",
    pain_points: ["SES.Hospedajes", "VeriFactu", "Comisiones OTAs"],
    estimated_ticket: 15000,
    next_action: "Cerrar contrato esta semana",
    next_action_date: new Date().toISOString().split("T")[0],
    notes: "Hotel boutique premium. Quiere PMS completo + web + compliance. Ticket alto.",
    assigned_to: "admin-maicol",
  },
  {
    business_name: "Ca la Siona - Turisme Rural",
    contact_name: "Montse Vilaró",
    contact_role: "Propietaria",
    phone: "973 780 456",
    email: "calasiona@turismerural.cat",
    business_type: "rural",
    tier: "B",
    status: "contactado",
    location: "Alt Urgell",
    size: "6 habitaciones",
    pain_points: ["Web obsoleta", "Sin reservas online", "SES.Hospedajes"],
    estimated_ticket: 2500,
    next_action: "Agendar videollamada demo",
    next_action_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    notes: "Casa rural preciosa. Solo tiene Instagram, necesita web y reservas directas.",
    assigned_to: "admin-socio",
  },
  {
    business_name: "Cafetería El Bolsi",
    contact_name: "Toni Casals",
    contact_role: "Dueño",
    phone: "973 210 333",
    email: "elbolsi@gmail.com",
    business_type: "bar",
    tier: "C",
    status: "nuevo",
    location: "Lleida",
    size: "30 plazas",
    pain_points: ["VeriFactu", "Sin presencia digital"],
    estimated_ticket: 1500,
    next_action: "Incluir en campaña email masivo",
    next_action_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    notes: "Cafetería pequeña. Ticket bajo pero puede ser rápido.",
    assigned_to: "admin-socio",
  },
  {
    business_name: "Parador de Lleida",
    contact_name: "Luis Hernández",
    contact_role: "Director Comercial",
    phone: "973 200 000",
    email: "lleida@parador.es",
    business_type: "hotel",
    tier: "A",
    status: "nuevo",
    location: "Lleida",
    size: "65 habitaciones",
    pain_points: ["Comisiones OTAs", "Gestión manual"],
    estimated_ticket: 18000,
    next_action: "Investigar si usan PMS externo",
    next_action_date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    notes: "Gran oportunidad pero difícil acceso. Cadena nacional con burocracia.",
    assigned_to: "admin-maicol",
  },
];

// ─── Sample Project ──────────────────────────────────────────────

const SAMPLE_PROJECT = {
  name: "Hotel La Garbinada — Web + PMS + Compliance",
  client_name: "Hotel La Garbinada",
  lead_id: null,
  status: "active",
  current_phase: "maintenance",
  phases: [
    { phase: "discovery", label: "Discovery", completed: true, completedAt: "2025-11-01T00:00:00Z" },
    { phase: "design", label: "Diseño", completed: true, completedAt: "2025-11-15T00:00:00Z" },
    { phase: "development", label: "Desarrollo", completed: true, completedAt: "2026-01-20T00:00:00Z" },
    { phase: "testing", label: "Testing", completed: true, completedAt: "2026-02-15T00:00:00Z" },
    { phase: "deployment", label: "Despliegue", completed: true, completedAt: "2026-03-01T00:00:00Z" },
    { phase: "maintenance", label: "Mantenimiento", completed: false, completedAt: null },
  ],
  package_type: "enterprise",
  total_budget: 15000,
  paid_amount: 15000,
  deadline: "2026-03-01",
  description: "Proyecto estrella: web multi-idioma, motor reservas directo, PMS completo, chatbot IA, compliance SES.Hospedajes automatizado.",
};

// ─── Execute Seed ────────────────────────────────────────────────

async function seed() {
  console.log("\n  🔄 Seeding Supabase CRM database...\n");

  // Clear existing data
  await supabase.from("activities").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("leads").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // Insert leads
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .insert(SAMPLE_LEADS)
    .select();

  if (leadsError) {
    console.error("  ❌ Error inserting leads:", leadsError.message);
    return;
  }
  console.log(`  ✅ ${leads.length} leads inserted`);

  // Insert project
  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .insert(SAMPLE_PROJECT)
    .select();

  if (projectError) {
    console.error("  ❌ Error inserting project:", projectError.message);
    return;
  }
  console.log(`  ✅ ${projects.length} project(s) inserted`);

  // Insert sample activities (linked to first few leads)
  const SAMPLE_ACTIVITIES = [
    {
      lead_id: leads[0].id,
      user_id: "admin-socio",
      user_name: "Socio Ventas",
      type: "call",
      title: "Primera llamada de prospección",
      description: "Contacté con Jordi del Hotel Nastasi. Muy receptivo al tema SES.Hospedajes.",
      outcome: "Interesado, agendamos reunión presencial",
    },
    {
      lead_id: leads[0].id,
      user_id: "admin-maicol",
      user_name: "Maicol Cabrera",
      type: "meeting",
      title: "Reunión presencial Hotel Nastasi",
      description: "Demo completa del sistema La Garbinada. Impresionados con la automatización Mossos.",
      outcome: "Solicitan propuesta Enterprise",
    },
    {
      lead_id: leads[4].id,
      user_id: "admin-maicol",
      user_name: "Maicol Cabrera",
      type: "email",
      title: "Propuesta enviada - Apt. Segre",
      description: "Propuesta Professional con detalle de PMS + canal directo. Presupuesto: €6.000.",
      outcome: "Pendiente respuesta",
    },
    {
      lead_id: leads[1].id,
      user_id: "admin-socio",
      user_name: "Socio Ventas",
      type: "call",
      title: "Follow-up Hotel Zenit",
      description: "Llamada para agendar demo. Revenue Manager interesada pero pide confirmación dirección.",
      outcome: "Callback la semana que viene",
    },
    {
      lead_id: leads[6].id,
      user_id: "admin-maicol",
      user_name: "Maicol Cabrera",
      type: "proposal",
      title: "Propuesta Enterprise - Les Corts",
      description: "PMS completo + web + VeriFactu + SES.Hospedajes. Todo incluido.",
      outcome: "En negociación, pendiente firma",
    },
  ];

  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .insert(SAMPLE_ACTIVITIES)
    .select();

  if (activitiesError) {
    console.error("  ❌ Error inserting activities:", activitiesError.message);
    return;
  }
  console.log(`  ✅ ${activities.length} activities inserted`);

  // Insert admin users in crm_users
  const ADMIN_USERS = [
    {
      email: "maicolcabreraferreira@gmail.com",
      password_hash: "fragua2026",
      name: "Maicol Cabrera",
      role: "admin",
    },
    {
      email: "socio@fraguasystems.com",
      password_hash: "fragua2026",
      name: "Socio Ventas",
      role: "admin",
    },
  ];

  await supabase.from("crm_users").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error: usersError } = await supabase.from("crm_users").insert(ADMIN_USERS);
  if (usersError) {
    console.error("  ⚠️  Users insert:", usersError.message);
  } else {
    console.log("  ✅ 2 admin users inserted");
  }

  console.log("\n  🎉 Supabase CRM seeded successfully!\n");
}

seed().catch(console.error);
