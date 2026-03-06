import { NextResponse } from "next/server";
import { getActivities, createActivity } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId") || undefined;
    const activities = await getActivities(leadId);
    return NextResponse.json({ activities });
  } catch {
    return NextResponse.json({ error: "Error cargando actividades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const activity = await createActivity(body);
    return NextResponse.json({ activity }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error registrando actividad" }, { status: 500 });
  }
}
