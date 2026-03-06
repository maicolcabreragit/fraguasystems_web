import { supabaseAdmin } from "./supabase";

/* ═══════════════════════════════════════════════════════════════════
   Fragua Systems — Data Layer (Supabase PostgreSQL)
   
   All CRUD operations for leads, projects, and activities.
   Uses supabaseAdmin (service_role) to bypass RLS.
   ═══════════════════════════════════════════════════════════════════ */

// ─── Types ────────────────────────────────────────────────────────

export type LeadStatus =
  | "nuevo"
  | "contactado"
  | "reunion"
  | "propuesta"
  | "negociacion"
  | "cerrado"
  | "perdido";

export type LeadTier = "A" | "B" | "C";

export type BusinessType =
  | "hotel"
  | "rural"
  | "restaurante"
  | "apartamentos"
  | "bar"
  | "otro";

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  contactRole: string;
  phone: string;
  email: string;
  businessType: BusinessType;
  tier: LeadTier;
  status: LeadStatus;
  location: string;
  size: string;
  painPoints: string[];
  estimatedTicket: number;
  nextAction: string;
  nextActionDate: string;
  notes: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectPhase =
  | "discovery"
  | "design"
  | "development"
  | "testing"
  | "deployment"
  | "maintenance";

export type ProjectStatus = "active" | "paused" | "completed" | "cancelled";

export interface Project {
  id: string;
  name: string;
  clientName: string;
  leadId: string | null;
  status: ProjectStatus;
  currentPhase: ProjectPhase;
  phases: {
    phase: ProjectPhase;
    label: string;
    completed: boolean;
    completedAt: string | null;
  }[];
  packageType: "starter" | "professional" | "enterprise";
  totalBudget: number;
  paidAmount: number;
  deadline: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = "call" | "email" | "meeting" | "note" | "proposal" | "close";

export interface Activity {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  type: ActivityType;
  title: string;
  description: string;
  outcome: string;
  createdAt: string;
}

// ─── DB → App Type Mappers ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToLead(row: any): Lead {
  return {
    id: row.id,
    businessName: row.business_name,
    contactName: row.contact_name,
    contactRole: row.contact_role || "",
    phone: row.phone || "",
    email: row.email || "",
    businessType: row.business_type,
    tier: row.tier,
    status: row.status,
    location: row.location || "",
    size: row.size || "",
    painPoints: row.pain_points || [],
    estimatedTicket: row.estimated_ticket || 0,
    nextAction: row.next_action || "",
    nextActionDate: row.next_action_date || "",
    notes: row.notes || "",
    assignedTo: row.assigned_to || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function leadToDb(lead: Partial<Lead>): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  if (lead.businessName !== undefined) map.business_name = lead.businessName;
  if (lead.contactName !== undefined) map.contact_name = lead.contactName;
  if (lead.contactRole !== undefined) map.contact_role = lead.contactRole;
  if (lead.phone !== undefined) map.phone = lead.phone;
  if (lead.email !== undefined) map.email = lead.email;
  if (lead.businessType !== undefined) map.business_type = lead.businessType;
  if (lead.tier !== undefined) map.tier = lead.tier;
  if (lead.status !== undefined) map.status = lead.status;
  if (lead.location !== undefined) map.location = lead.location;
  if (lead.size !== undefined) map.size = lead.size;
  if (lead.painPoints !== undefined) map.pain_points = lead.painPoints;
  if (lead.estimatedTicket !== undefined) map.estimated_ticket = lead.estimatedTicket;
  if (lead.nextAction !== undefined) map.next_action = lead.nextAction;
  if (lead.nextActionDate !== undefined) map.next_action_date = lead.nextActionDate || null;
  if (lead.notes !== undefined) map.notes = lead.notes;
  if (lead.assignedTo !== undefined) map.assigned_to = lead.assignedTo;
  return map;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    clientName: row.client_name,
    leadId: row.lead_id,
    status: row.status,
    currentPhase: row.current_phase,
    phases: row.phases || [],
    packageType: row.package_type,
    totalBudget: row.total_budget || 0,
    paidAmount: row.paid_amount || 0,
    deadline: row.deadline || "",
    description: row.description || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToActivity(row: any): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    userId: row.user_id,
    userName: row.user_name,
    type: row.type,
    title: row.title,
    description: row.description || "",
    outcome: row.outcome || "",
    createdAt: row.created_at,
  };
}

// ─── Lead CRUD ────────────────────────────────────────────────────

export async function getLeads(filters?: {
  status?: LeadStatus;
  tier?: LeadTier;
  businessType?: BusinessType;
  search?: string;
}): Promise<Lead[]> {
  let query = supabaseAdmin.from("leads").select("*").order("updated_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.tier) query = query.eq("tier", filters.tier);
  if (filters?.businessType) query = query.eq("business_type", filters.businessType);
  if (filters?.search) {
    query = query.or(
      `business_name.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(dbToLead);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return dbToLead(data);
}

export async function createLead(input: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
  const dbData = leadToDb(input);
  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert(dbData)
    .select()
    .single();
  if (error) throw error;
  return dbToLead(data);
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  const dbData = leadToDb(updates);
  const { data, error } = await supabaseAdmin
    .from("leads")
    .update(dbData)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return dbToLead(data);
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from("leads").delete().eq("id", id);
  return !error;
}

// ─── Project CRUD ────────────────────────────────────────────────

export async function getProjects(filters?: { status?: ProjectStatus }): Promise<Project[]> {
  let query = supabaseAdmin.from("projects").select("*").order("updated_at", { ascending: false });
  if (filters?.status) query = query.eq("status", filters.status);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(dbToProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return dbToProject(data);
}

export async function createProject(
  input: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: input.name,
      client_name: input.clientName,
      lead_id: input.leadId,
      status: input.status,
      current_phase: input.currentPhase,
      phases: input.phases,
      package_type: input.packageType,
      total_budget: input.totalBudget,
      paid_amount: input.paidAmount,
      deadline: input.deadline || null,
      description: input.description,
    })
    .select()
    .single();
  if (error) throw error;
  return dbToProject(data);
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const dbData: Record<string, unknown> = {};
  if (updates.name !== undefined) dbData.name = updates.name;
  if (updates.clientName !== undefined) dbData.client_name = updates.clientName;
  if (updates.status !== undefined) dbData.status = updates.status;
  if (updates.currentPhase !== undefined) dbData.current_phase = updates.currentPhase;
  if (updates.phases !== undefined) dbData.phases = updates.phases;
  if (updates.packageType !== undefined) dbData.package_type = updates.packageType;
  if (updates.totalBudget !== undefined) dbData.total_budget = updates.totalBudget;
  if (updates.paidAmount !== undefined) dbData.paid_amount = updates.paidAmount;
  if (updates.deadline !== undefined) dbData.deadline = updates.deadline;
  if (updates.description !== undefined) dbData.description = updates.description;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(dbData)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return dbToProject(data);
}

// ─── Activity CRUD ───────────────────────────────────────────────

export async function getActivities(leadId?: string): Promise<Activity[]> {
  let query = supabaseAdmin.from("activities").select("*").order("created_at", { ascending: false });
  if (leadId) query = query.eq("lead_id", leadId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(dbToActivity);
}

export async function createActivity(
  input: Omit<Activity, "id" | "createdAt">
): Promise<Activity> {
  const { data, error } = await supabaseAdmin
    .from("activities")
    .insert({
      lead_id: input.leadId,
      user_id: input.userId,
      user_name: input.userName,
      type: input.type,
      title: input.title,
      description: input.description,
      outcome: input.outcome,
    })
    .select()
    .single();
  if (error) throw error;
  return dbToActivity(data);
}

// ─── Stats ────────────────────────────────────────────────────────

export interface CRMStats {
  totalLeads: number;
  leadsByStatus: Record<LeadStatus, number>;
  leadsByTier: Record<LeadTier, number>;
  pipelineRevenue: number;
  closedRevenue: number;
  conversionRate: number;
  activeProjects: number;
  todayActions: number;
  recentActivities: Activity[];
}

export async function getStats(): Promise<CRMStats> {
  const today = new Date().toISOString().split("T")[0];

  // Fetch all leads and activities in parallel
  const [leadsResult, activitiesResult, projectsResult] = await Promise.all([
    supabaseAdmin.from("leads").select("*"),
    supabaseAdmin.from("activities").select("*").order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("projects").select("id, status"),
  ]);

  const leads = leadsResult.data || [];
  const activities = (activitiesResult.data || []).map(dbToActivity);
  const projects = projectsResult.data || [];

  const statuses: LeadStatus[] = ["nuevo", "contactado", "reunion", "propuesta", "negociacion", "cerrado", "perdido"];
  const leadsByStatus = {} as Record<LeadStatus, number>;
  statuses.forEach((s) => {
    leadsByStatus[s] = leads.filter((l) => l.status === s).length;
  });

  const tiers: LeadTier[] = ["A", "B", "C"];
  const leadsByTier = {} as Record<LeadTier, number>;
  tiers.forEach((t) => {
    leadsByTier[t] = leads.filter((l) => l.tier === t).length;
  });

  const activePipeline = leads.filter((l) => !["cerrado", "perdido"].includes(l.status));
  const pipelineRevenue = activePipeline.reduce((sum, l) => sum + (l.estimated_ticket || 0), 0);
  const closedRevenue = leads.filter((l) => l.status === "cerrado").reduce((sum, l) => sum + (l.estimated_ticket || 0), 0);

  const totalWithOutcome = leadsByStatus.cerrado + leadsByStatus.perdido;
  const conversionRate = totalWithOutcome > 0 ? Math.round((leadsByStatus.cerrado / totalWithOutcome) * 100) : 0;

  const todayActions = leads.filter((l) => l.next_action_date && l.next_action_date.startsWith(today)).length;

  return {
    totalLeads: leads.length,
    leadsByStatus,
    leadsByTier,
    pipelineRevenue,
    closedRevenue,
    conversionRate,
    activeProjects: projects.filter((p) => p.status === "active").length,
    todayActions,
    recentActivities: activities,
  };
}
