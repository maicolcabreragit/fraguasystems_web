"use client";

import { use } from "react";
import { CanvasBoard } from "@/components/dashboard/SalesCanvas/CanvasBoard";

/* ═══════════════════════════════════════════════════════════════════
   /dashboard/leads/[id]/canvas — Deal Workspace Canvas
   
   Dedicated per-client node canvas. The lead ID comes from the URL
   and is passed to CanvasBoard, which fetches the lead data from
   Supabase and renders it as the initial central node.
   ═══════════════════════════════════════════════════════════════════ */

export default function DealWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CanvasBoard leadId={id} />;
}
