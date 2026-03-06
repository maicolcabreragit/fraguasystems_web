import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";

/* ═══════════════════════════════════════════════════════════════════
   Fragua Systems — Auth Module (Supabase-backed)
   
   Admin users (hardcoded) + Client users (from crm_users table).
   JWT-based sessions stored in cookies.
   ═══════════════════════════════════════════════════════════════════ */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fragua-systems-secret-key-change-in-production-2026"
);

const COOKIE_NAME = "fragua-session";

// ─── Types ────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "client";
  projectId?: string;
}

// ─── Admin Users (hardcoded) ──────────────────────────────────────
const ADMIN_USERS: User[] = [
  {
    id: "admin-maicol",
    email: "maicolcabreraferreira@gmail.com",
    password: "fragua2026",
    name: "Maicol Cabrera",
    role: "admin",
  },
  {
    id: "admin-socio",
    email: "socio@fraguasystems.com",
    password: "fragua2026",
    name: "Socio Ventas",
    role: "admin",
  },
];

// ─── Token Management ─────────────────────────────────────────────
export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "client";
  projectId?: string;
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Auth Functions ───────────────────────────────────────────────
export async function authenticate(
  email: string,
  password: string
): Promise<User | null> {
  // Check admin users first
  const admin = ADMIN_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (admin) return admin;

  // Check client users in Supabase
  const { data: dbUser } = await supabaseAdmin
    .from("crm_users")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (dbUser && dbUser.password_hash === password) {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password: dbUser.password_hash,
      name: dbUser.name,
      role: dbUser.role as "admin" | "client",
      projectId: dbUser.client_project_id || undefined,
    };
  }

  return null;
}

export async function setSessionCookie(user: User): Promise<void> {
  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    projectId: user.projectId,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
