import { NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/data";
import type { ProjectStatus } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ProjectStatus | null;
    const projects = await getProjects({ status: status || undefined });
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: "Error cargando proyectos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await createProject(body);
    return NextResponse.json({ project }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creando proyecto" }, { status: 500 });
  }
}
