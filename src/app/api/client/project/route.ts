import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/* ═══════════════════════════════════════════════════════════════════
   /api/client/project — Get project for authenticated client
   ═══════════════════════════════════════════════════════════════════ */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    
    if (!projectId) {
      return NextResponse.json({ error: "projectId requerido" }, { status: 400 });
    }

    // Get project
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();
    
    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // Get activities linked to this project's lead
    let activities = [];
    if (project.lead_id) {
      const { data } = await supabaseAdmin
        .from("activities")
        .select("*")
        .eq("lead_id", project.lead_id)
        .order("created_at", { ascending: false })
        .limit(20);
      activities = data || [];
    }

    return NextResponse.json({ project, activities });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
