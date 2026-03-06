import { NextResponse } from "next/server";
import { getLeadById, updateLead, deleteLead } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ lead });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const lead = await updateLead(id, body);
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Error actualizando lead" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = await deleteLead(id);
  if (!success) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
