import { NextResponse } from "next/server";
import { getLeads, createLead } from "@/lib/data";
import type { LeadStatus, LeadTier, BusinessType } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as LeadStatus | null;
    const tier = searchParams.get("tier") as LeadTier | null;
    const businessType = searchParams.get("businessType") as BusinessType | null;
    const search = searchParams.get("search") || undefined;

    const leads = await getLeads({
      status: status || undefined,
      tier: tier || undefined,
      businessType: businessType || undefined,
      search,
    });

    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Error cargando leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = await createLead(body);
    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creando lead" }, { status: 500 });
  }
}
