# FRAGUA CRM — Documento Maestro de Referencia

> **Generado**: 9 de marzo de 2026
> **Versión**: 1.0
> **Autor**: Arquitectura interna — Fragua Systems
> **Alcance**: Ingeniería inversa completa del CRM interno (`src/app/dashboard`, `src/components/dashboard`, `src/lib`, `src/app/api/dashboard`)

---

## Índice

1. [Stack Tecnológico y Arquitectura](#1-stack-tecnológico-y-arquitectura)
2. [Esquema de Base de Datos (Supabase)](#2-esquema-de-base-de-datos-supabase)
3. [Componentes Core del Frontend](#3-componentes-core-del-frontend)
4. [Flujos de Usuario (Workflows)](#4-flujos-de-usuario-workflows)
5. [Cuellos de Botella y Deuda Técnica](#5-cuellos-de-botella-y-deuda-técnica)

---

## 1. Stack Tecnológico y Arquitectura

### 1.1 Stack Principal

| Capa              | Tecnología            | Versión / Detalle                                                                              |
| ----------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| **Framework**     | Next.js (App Router)  | 16.x                                                                                           |
| **UI Library**    | React                 | 19                                                                                             |
| **Lenguaje**      | TypeScript            | Strict mode                                                                                    |
| **Estilos**       | Tailwind CSS          | Colores custom "Industrial Luxe"                                                               |
| **Animaciones**   | Framer Motion         | Layout animations, spring physics                                                              |
| **Base de datos** | Supabase (PostgreSQL) | Hosted, RLS habilitado                                                                         |
| **Autenticación** | JWT custom (jose)     | HS256, cookies httpOnly, 7d TTL                                                                |
| **Despliegue**    | Vercel                | `fraguasystems.com`                                                                            |
| **Design System** | Industrial Luxe v2.0  | Colores: `molten-copper`, `industrial-gold`, `titanium-white`, `machine-gray`, `brushed-steel` |

### 1.2 Arquitectura de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│                                                              │
│  Dashboard Pages (React "use client")                        │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────┐        │
│  │ page.tsx    │  │ leads/page   │  │ projects/page │        │
│  │ (Overview)  │  │ (Pipeline)   │  │ (Proyectos)   │        │
│  └──────┬─────┘  └──────┬───────┘  └───────┬───────┘        │
│         │               │                  │                 │
│         └───── fetch() ─┴──── fetch() ─────┘                │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │ HTTP (JSON)
┌─────────────────────────┼────────────────────────────────────┐
│                    SERVIDOR (Next.js API Routes)              │
│                         │                                    │
│  src/app/api/dashboard/ │                                    │
│  ┌──────────────────────▼──────────────────────────────┐     │
│  │ leads/route.ts      → GET (list) / POST (create)   │     │
│  │ leads/[id]/route.ts → GET / PUT / DELETE            │     │
│  │ activities/route.ts → GET (list) / POST (create)    │     │
│  │ projects/route.ts   → GET (list) / POST (create)   │     │
│  │ stats/route.ts      → GET (dashboard KPIs)          │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                    │
│  src/lib/data.ts        │  (Data Layer — CRUD + mappers)     │
│  src/lib/supabase.ts    │  (Dual client: anon + admin)       │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │ supabaseAdmin (service_role key)
┌─────────────────────────┼────────────────────────────────────┐
│                  SUPABASE (PostgreSQL)                        │
│                         │                                    │
│  ┌──────────┐  ┌────────┴───┐  ┌────────────┐  ┌─────────┐ │
│  │  leads   │  │ activities │  │  projects   │  │crm_users│ │
│  └──────────┘  └────────────┘  └────────────┘  └─────────┘ │
│                                                              │
│  RLS: ENABLED (policy = allow all via service_role)          │
└──────────────────────────────────────────────────────────────┘
```

### 1.3 Middleware y Protección de Rutas

**Archivo**: `src/middleware.ts`

| Patrón de ruta            | Protección                      | Redirección                           |
| ------------------------- | ------------------------------- | ------------------------------------- |
| `/dashboard/*`            | JWT válido + `role === "admin"` | → `/area-clientes?redirect=dashboard` |
| `/area-clientes/portal/*` | JWT válido (cualquier role)     | → `/area-clientes`                    |

El token se lee de la cookie `fragua-session` y se verifica con `jose/jwtVerify`.

### 1.4 Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=         # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Clave anónima (client-side)
SUPABASE_SERVICE_ROLE_KEY=        # Clave service_role (bypasses RLS)
JWT_SECRET=                       # Secret para firmar JWT (HS256)
```

---

## 2. Esquema de Base de Datos (Supabase)

**Schema SQL completo**: `scripts/schema.sql`

### 2.1 Tabla `leads`

La tabla central del CRM. Representa un prospecto comercial HORECA.

| Columna            | Tipo            | Default             | Descripción                                                                                  |
| ------------------ | --------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `id`               | `UUID` PK       | `gen_random_uuid()` | Identificador único                                                                          |
| `business_name`    | `TEXT NOT NULL` | —                   | Nombre del negocio                                                                           |
| `contact_name`     | `TEXT NOT NULL` | —                   | Nombre de contacto                                                                           |
| `contact_role`     | `TEXT`          | `''`                | Cargo (Director, Gerente...)                                                                 |
| `phone`            | `TEXT`          | `''`                | Teléfono                                                                                     |
| `email`            | `TEXT`          | `''`                | Email de contacto                                                                            |
| `business_type`    | `TEXT NOT NULL` | `'hotel'`           | Enum: `hotel`, `rural`, `restaurante`, `apartamentos`, `bar`, `otro`                         |
| `tier`             | `TEXT NOT NULL` | `'B'`               | Prioridad: `A` (🔥 Hot), `B` (⭐ Warm), `C` (🔵 Cold)                                        |
| `status`           | `TEXT NOT NULL` | `'nuevo'`           | Pipeline: `nuevo`, `contactado`, `reunion`, `propuesta`, `negociacion`, `cerrado`, `perdido` |
| `location`         | `TEXT`          | `'Lleida'`          | Ciudad / zona                                                                                |
| `size`             | `TEXT`          | `''`                | Tamaño (ej: "12 habitaciones")                                                               |
| `pain_points`      | `TEXT[]`        | `'{}'`              | Array de puntos de dolor                                                                     |
| `estimated_ticket` | `INTEGER`       | `0`                 | Valor estimado en €                                                                          |
| `next_action`      | `TEXT`          | `''`                | Próxima acción a realizar                                                                    |
| `next_action_date` | `DATE`          | `NULL`              | Fecha de próxima acción                                                                      |
| `notes`            | `TEXT`          | `''`                | Notas libres                                                                                 |
| `assigned_to`      | `TEXT`          | `''`                | ID del usuario asignado                                                                      |
| `created_at`       | `TIMESTAMPTZ`   | `now()`             | Timestamp de creación                                                                        |
| `updated_at`       | `TIMESTAMPTZ`   | `now()`             | Auto-actualizado via trigger                                                                 |

**Índices**: `idx_leads_status`, `idx_leads_tier`, `idx_leads_business_type`

### 2.2 Tabla `projects`

Proyectos de clientes con tracking de fases.

| Columna                     | Tipo                    | Default             | Descripción                                               |
| --------------------------- | ----------------------- | ------------------- | --------------------------------------------------------- |
| `id`                        | `UUID` PK               | `gen_random_uuid()` | Identificador único                                       |
| `name`                      | `TEXT NOT NULL`         | —                   | Nombre del proyecto                                       |
| `client_name`               | `TEXT NOT NULL`         | —                   | Nombre del cliente                                        |
| `lead_id`                   | `UUID` FK → `leads(id)` | `NULL`              | Lead de origen (ON DELETE SET NULL)                       |
| `status`                    | `TEXT NOT NULL`         | `'active'`          | Estado: `active`, `paused`, `completed`, `cancelled`      |
| `current_phase`             | `TEXT NOT NULL`         | `'discovery'`       | Fase actual del proyecto                                  |
| `phases`                    | `JSONB NOT NULL`        | `'[]'`              | Array de objetos `{phase, label, completed, completedAt}` |
| `package_type`              | `TEXT NOT NULL`         | `'starter'`         | Paquete: `starter`, `professional`, `enterprise`          |
| `total_budget`              | `INTEGER`               | `0`                 | Presupuesto total en €                                    |
| `paid_amount`               | `INTEGER`               | `0`                 | Monto cobrado en €                                        |
| `deadline`                  | `DATE`                  | `NULL`              | Fecha límite                                              |
| `description`               | `TEXT`                  | `''`                | Descripción del proyecto                                  |
| `created_at` / `updated_at` | `TIMESTAMPTZ`           | `now()`             | Timestamps                                                |

**FK**: `lead_id` → `leads(id)` ON DELETE SET NULL
**Índice**: `idx_projects_status`

### 2.3 Tabla `activities`

Historial de interacciones con un lead (llamadas, emails, reuniones...).

| Columna       | Tipo                             | Default             | Descripción                                                   |
| ------------- | -------------------------------- | ------------------- | ------------------------------------------------------------- |
| `id`          | `UUID` PK                        | `gen_random_uuid()` | Identificador único                                           |
| `lead_id`     | `UUID NOT NULL` FK → `leads(id)` | —                   | Lead asociado (ON DELETE CASCADE)                             |
| `user_id`     | `TEXT NOT NULL`                  | —                   | ID del usuario que registra                                   |
| `user_name`   | `TEXT NOT NULL`                  | —                   | Nombre del usuario                                            |
| `type`        | `TEXT NOT NULL`                  | `'note'`            | Tipo: `call`, `email`, `meeting`, `note`, `proposal`, `close` |
| `title`       | `TEXT NOT NULL`                  | —                   | Título de la actividad                                        |
| `description` | `TEXT`                           | `''`                | Descripción detallada                                         |
| `outcome`     | `TEXT`                           | `''`                | Resultado de la actividad                                     |
| `created_at`  | `TIMESTAMPTZ`                    | `now()`             | Timestamp                                                     |

**FK**: `lead_id` → `leads(id)` ON DELETE CASCADE
**Índice**: `idx_activities_lead_id`

### 2.4 Tabla `crm_users`

Usuarios del sistema (clientes con acceso al portal).

| Columna             | Tipo                       | Default             | Descripción                                    |
| ------------------- | -------------------------- | ------------------- | ---------------------------------------------- |
| `id`                | `UUID` PK                  | `gen_random_uuid()` | Identificador único                            |
| `email`             | `TEXT UNIQUE NOT NULL`     | —                   | Email (login)                                  |
| `password_hash`     | `TEXT NOT NULL`            | —                   | Contraseña (⚠️ texto plano, ver deuda técnica) |
| `name`              | `TEXT NOT NULL`            | —                   | Nombre del usuario                             |
| `role`              | `TEXT NOT NULL`            | `'client'`          | Rol: `admin` o `client`                        |
| `client_project_id` | `UUID` FK → `projects(id)` | `NULL`              | Proyecto asignado (ON DELETE SET NULL)         |
| `created_at`        | `TIMESTAMPTZ`              | `now()`             | Timestamp                                      |

**FK**: `client_project_id` → `projects(id)` ON DELETE SET NULL
**Índice**: `idx_crm_users_email`

### 2.5 Diagrama de Relaciones

```
┌──────────────────┐       ┌──────────────────┐
│      leads       │       │    activities     │
│──────────────────│       │──────────────────│
│ id (PK)          │◄──────│ lead_id (FK)     │
│ business_name    │  1:N  │ user_id          │
│ status           │       │ type             │
│ tier             │       │ title            │
│ estimated_ticket │       │ created_at       │
│ ...              │       └──────────────────┘
└────────┬─────────┘
         │ 1:N (optional)
         ▼
┌──────────────────┐       ┌──────────────────┐
│    projects      │       │    crm_users     │
│──────────────────│       │──────────────────│
│ id (PK)          │◄──────│ client_project_id│
│ lead_id (FK)     │  1:N  │ email            │
│ client_name      │       │ password_hash    │
│ status           │       │ role             │
│ phases (JSONB)   │       │ ...              │
│ ...              │       └──────────────────┘
└──────────────────┘
```

### 2.6 Triggers y Políticas RLS

- **Trigger `update_updated_at_column()`**: Actualiza automáticamente `updated_at` en `leads` y `projects` antes de cada `UPDATE`.
- **RLS**: Habilitado en las 4 tablas, pero con política permisiva `FOR ALL USING (true)` — el control de acceso real se hace a nivel de aplicación (middleware JWT).

---

## 3. Componentes Core del Frontend

### 3.1 Mapa de Componentes

```
src/app/dashboard/
├── layout.tsx .................. Layout con Sidebar fija (ml-64)
├── page.tsx .................... Dashboard Overview (KPIs + Pipeline + Activity)
├── leads/page.tsx .............. CRM Pipeline (tabla + filtros + detalle slide-over)
├── projects/page.tsx ........... Gestión de proyectos
└── settings/page.tsx ........... Configuración y equipo

src/components/dashboard/
├── Sidebar.tsx ................. Navegación lateral fija
├── KanbanBoard.tsx ............. Tablero Kanban (drag & drop)
├── LeadCard.tsx ................ Tarjeta de lead para el Kanban
├── AddLeadModal.tsx ............ Modal de creación de leads
├── KPICard.tsx ................. Tarjeta de KPI animada
└── ActivityTimeline.tsx ........ Timeline vertical de actividades
```

### 3.2 Detalle de Componentes

#### `Sidebar` — `src/components/dashboard/Sidebar.tsx`

| Prop          | Tipo | Descripción                              |
| ------------- | ---- | ---------------------------------------- |
| _(sin props)_ | —    | Componente autónomo, usa `usePathname()` |

- **Navegación**: Overview, CRM Pipeline, Proyectos, Configuración
- **Funcionalidad**: Indicador activo animado (`layoutId`), logout via `POST /api/auth/logout`
- **Ancho fijo**: `w-64`, posición `fixed`

#### `KanbanBoard` — `src/components/dashboard/KanbanBoard.tsx`

| Prop             | Tipo                                              | Descripción             |
| ---------------- | ------------------------------------------------- | ----------------------- |
| `leads`          | `Lead[]`                                          | Array completo de leads |
| `onLeadClick`    | `(lead: Lead) => void`                            | Click en tarjeta        |
| `onStatusChange` | `(leadId: string, newStatus: LeadStatus) => void` | Drag & drop completado  |

- **7 columnas**: nuevo → contactado → reunión → propuesta → negociación → cerrado → perdido
- **Drag & drop**: Nativo HTML5 (`draggable`, `onDragStart`, `onDragOver`, `onDrop`)
- **Estado local**: `dragOverColumn` para resaltar columna destino
- **Nota**: Actualmente este componente **no se utiliza** en ninguna página. La vista de leads usa tabla (`leads/page.tsx`).

#### `LeadCard` — `src/components/dashboard/LeadCard.tsx`

| Prop      | Tipo                   | Descripción      |
| --------- | ---------------------- | ---------------- |
| `lead`    | `Lead`                 | Datos del lead   |
| `onClick` | `(lead: Lead) => void` | Handler de click |

- Muestra: nombre, tier badge, tipo de negocio, ubicación, ticket estimado, teléfono, pain points (max 3), próxima acción
- **Draggable**: con `onDragStart` → `setData("leadId", lead.id)`
- Animaciones: `layout`, `whileHover`, `whileTap`

#### `AddLeadModal` — `src/components/dashboard/AddLeadModal.tsx`

| Prop       | Tipo                                      | Descripción          |
| ---------- | ----------------------------------------- | -------------------- |
| `isOpen`   | `boolean`                                 | Controla visibilidad |
| `onClose`  | `() => void`                              | Cerrar modal         |
| `onSubmit` | `(data: Record<string, unknown>) => void` | Enviar formulario    |

- **Campos**: businessName*, contactName*, contactRole, phone, email, businessType (select), tier (botones A/B/C), location, size, painPoints (toggle chips), estimatedTicket, nextActionDate, nextAction, notes
- **Pain points predefinidos**: SES.Hospedajes, VeriFactu, Web obsoleta, Sin reservas online, Comisiones OTAs, Sin presencia digital, Gestión manual
- **assignedTo default**: `"admin-socio"`
- **status default**: siempre `"nuevo"` al crear

#### `KPICard` — `src/components/dashboard/KPICard.tsx`

| Prop                | Tipo                              | Descripción            |
| ------------------- | --------------------------------- | ---------------------- |
| `title`             | `string`                          | Label del KPI          |
| `value`             | `number`                          | Valor numérico         |
| `prefix` / `suffix` | `string?`                         | Ej: "€"                |
| `icon`              | `ReactNode`                       | Icono SVG              |
| `trend`             | `{value, positive}?`              | Indicador de tendencia |
| `accentColor`       | `"copper" \| "gold" \| "default"` | Color de acento        |

- **Animación count-up**: Incremento progresivo en 30 pasos durante 1s
- **Spring animation**: `stiffness: 200, damping: 22`

#### `ActivityTimeline` — `src/components/dashboard/ActivityTimeline.tsx`

| Prop         | Tipo         | Descripción          |
| ------------ | ------------ | -------------------- |
| `activities` | `Activity[]` | Lista de actividades |

- **6 tipos**: call (📞), email (✉️), meeting (🗓️), note (📝), proposal (📋), close (🤝)
- Timeline vertical con línea conectora, iconos con color y animaciones staggered

#### `LeadDetailPanel` — `src/app/dashboard/leads/page.tsx` (inline)

Componente interno en `leads/page.tsx`. Slide-over panel (desde la derecha) con:

- Info de contacto (editable)
- Estado y ticket (editables)
- Notas (editables)
- Historial de actividad con `ActivityTimeline`
- Formulario inline para registrar nueva actividad
- Botón de eliminar lead (con `confirm()`)
- Hardcoded: `userId: "admin-maicol"`, `userName: "Maicol"` al crear actividad

### 3.3 API Routes del Dashboard

| Ruta                        | Métodos                | Handler                                         | Descripción                                                                         |
| --------------------------- | ---------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `/api/dashboard/leads`      | `GET`, `POST`          | `getLeads()`, `createLead()`                    | Listar y crear leads. GET acepta `?status=`, `?tier=`, `?businessType=`, `?search=` |
| `/api/dashboard/leads/[id]` | `GET`, `PUT`, `DELETE` | `getLeadById()`, `updateLead()`, `deleteLead()` | CRUD individual de un lead                                                          |
| `/api/dashboard/activities` | `GET`, `POST`          | `getActivities()`, `createActivity()`           | Listar y crear actividades. GET acepta `?leadId=`                                   |
| `/api/dashboard/projects`   | `GET`, `POST`          | `getProjects()`, `createProject()`              | Listar y crear proyectos. GET acepta `?status=`                                     |
| `/api/dashboard/stats`      | `GET`                  | `getStats()`                                    | KPIs del dashboard                                                                  |

### 3.4 Data Layer (`src/lib/data.ts`)

**Patrón**: Mapeo bidireccional `camelCase` (app) ↔ `snake_case` (DB).

| Función                      | Uso                                                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dbToLead(row)`              | DB row → `Lead` type                                                                                                                                 |
| `leadToDb(lead)`             | `Partial<Lead>` → DB columns                                                                                                                         |
| `dbToProject(row)`           | DB row → `Project` type                                                                                                                              |
| `dbToActivity(row)`          | DB row → `Activity` type                                                                                                                             |
| `getLeads(filters?)`         | Lista leads con filtros opcionales                                                                                                                   |
| `getLeadById(id)`            | Lead por UUID                                                                                                                                        |
| `createLead(input)`          | Insertar lead                                                                                                                                        |
| `updateLead(id, updates)`    | Actualizar campos parciales                                                                                                                          |
| `deleteLead(id)`             | Eliminar lead                                                                                                                                        |
| `getProjects(filters?)`      | Lista proyectos                                                                                                                                      |
| `getProjectById(id)`         | Proyecto por UUID                                                                                                                                    |
| `createProject(input)`       | Insertar proyecto                                                                                                                                    |
| `updateProject(id, updates)` | Actualizar proyecto                                                                                                                                  |
| `getActivities(leadId?)`     | Lista actividades (filtrable por lead)                                                                                                               |
| `createActivity(input)`      | Insertar actividad                                                                                                                                   |
| `getStats()`                 | Calcula KPIs: totalLeads, leadsByStatus, leadsByTier, pipelineRevenue, closedRevenue, conversionRate, activeProjects, todayActions, recentActivities |

---

## 4. Flujos de Usuario (Workflows)

### 4.1 Login (Admin)

```
1. Usuario navega a /area-clientes
2. Introduce email + password
3. POST /api/auth/login
   → authenticate(email, password)
     → Primero busca en ADMIN_USERS (hardcoded):
       - maicolcabreraferreira@gmail.com / fragua2026
       - socio@fraguasystems.com / fragua2026
     → Si no, busca en tabla crm_users de Supabase
   → Si match: createToken() → setSessionCookie()
4. Redirect a /dashboard
5. middleware.ts verifica JWT en cookie fragua-session
   → role === "admin" → acceso permitido
   → role !== "admin" → redirect a /area-clientes
```

### 4.2 Añadir un Lead

```
1. En /dashboard/leads → click "Nuevo Lead"
2. Se abre AddLeadModal (isOpen = true)
3. Llenar formulario:
   - businessName* + contactName* (obligatorios)
   - Seleccionar businessType, tier (A/B/C), dolor(es)
   - Ticket estimado, próxima acción
4. Click "Crear Lead"
   → onSubmit() → POST /api/dashboard/leads
     → body = {...formData, status: "nuevo"}
     → createLead(body) → supabaseAdmin.from("leads").insert()
5. Modal se cierra, se re-fetch la lista de leads
6. Lead aparece en la tabla con status "Nuevo"
```

### 4.3 Mover Lead en Pipeline (Cambio de Estado)

#### Vía Tabla (implementación actual):

```
1. En /dashboard/leads, cada fila tiene un <select> de estado
2. Cambiar el valor del select
   → handleStatusChange(leadId, newStatus)
   → Optimistic update: setLeads() actualiza estado local
   → PUT /api/dashboard/leads/{id} con { status: newStatus }
   → updateLead(id, { status }) → supabaseAdmin.update()
```

#### Vía Kanban (componente disponible, NO conectado):

```
1. Drag de LeadCard desde columna origen
   → onDragStart: setData("leadId", lead.id)
2. Hover sobre columna destino
   → dragOverColumn se resalta (border copper)
3. Drop en columna destino
   → onDrop: getData("leadId") → onStatusChange(leadId, newStatus)
```

### 4.4 Registrar Actividad en un Lead

```
1. En /dashboard/leads → click en fila de la tabla
2. Se abre LeadDetailPanel (slide-over desde la derecha)
3. Panel carga actividades: GET /api/dashboard/activities?leadId={id}
4. Click "+ Registrar actividad"
5. Formulario inline aparece con campos:
   - Tipo (call/email/meeting/note/proposal/close)
   - Título, descripción, resultado
6. Click "Guardar actividad"
   → POST /api/dashboard/activities
     → body = { leadId, userId: "admin-maicol", userName: "Maicol", ...fields }
     → createActivity(body) → supabaseAdmin.from("activities").insert()
7. Se re-fetch y muestra en el ActivityTimeline
```

### 4.5 Crear Proyecto

```
1. En /dashboard/projects → click "Nuevo Proyecto"
2. Formulario inline se expande (showNewForm = true)
3. Llenar: nombre, cliente, paquete (starter/professional/enterprise), presupuesto, deadline
4. Click "Crear proyecto"
   → POST /api/dashboard/projects
     → body incluye 6 fases predefinidas (discovery → maintenance)
     → status: "active", currentPhase: "discovery", paidAmount: 0
   → createProject(body) → supabaseAdmin.from("projects").insert()
5. Lista se actualiza mostrando el nuevo proyecto con barra de progreso
```

### 4.6 Dashboard Overview

```
1. Navegar a /dashboard
2. Página llama GET /api/dashboard/stats
3. getStats() ejecuta 3 queries en paralelo:
   - SELECT * FROM leads
   - SELECT * FROM activities ORDER BY created_at DESC LIMIT 10
   - SELECT id, status FROM projects
4. Calcula y devuelve:
   - totalLeads, leadsByStatus (7 estados), leadsByTier (A/B/C)
   - pipelineRevenue (sum tickets de leads no cerrados/perdidos)
   - closedRevenue (sum tickets de leads cerrados)
   - conversionRate (cerrados / (cerrados + perdidos) * 100)
   - activeProjects (status = "active")
   - todayActions (leads con next_action_date = hoy)
   - recentActivities (últimas 10)
5. Renderiza 4 KPICards + Pipeline chart + ActivityTimeline
```

---

## 5. Cuellos de Botella y Deuda Técnica

### 🔴 CRÍTICO — Seguridad

| #   | Archivo                               | Línea(s) | Problema                                                                                                                | Acción recomendada                                                                             |
| --- | ------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | `src/lib/auth.ts`                     | 29-43    | **Contraseñas hardcoded en texto plano** (`fragua2026`). Visibles en el source code.                                    | Migrar a `bcrypt` hash + variables de entorno o Supabase Auth nativo.                          |
| 2   | `src/lib/auth.ts`                     | 90       | **`crm_users.password_hash` se compara como texto plano**: `dbUser.password_hash === password`. No hay hashing real.    | Implementar `bcrypt.compare()` y almacenar hashes reales.                                      |
| 3   | `src/lib/auth.ts`                     | 12-14    | **JWT_SECRET con fallback hardcoded** en el código. Si `JWT_SECRET` no está en `.env`, usa un secret predecible.        | Eliminar fallback. Forzar error si no existe `JWT_SECRET`.                                     |
| 4   | `scripts/schema.sql`                  | 110-120  | **RLS con política `USING (true)`**: RLS está habilitado pero la política permite todo acceso. Equivale a no tener RLS. | Implementar políticas RLS reales por role, o confiar explícitamente solo en el app-level auth. |
| 5   | `src/app/dashboard/settings/page.tsx` | 79-97    | **Credenciales visibles en el UI** del panel de Settings.                                                               | Eliminar section de credenciales del UI.                                                       |

### 🟡 MEDIA — Arquitectura & Rendimiento

| #   | Archivo                                    | Problema                                                                                                                                        | Acción recomendada                                                                                                         |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 6   | `src/lib/data.ts:355-401`                  | **`getStats()` carga TODOS los leads** (`SELECT *`) para calcular conteos. Con 1000+ leads será lento.                                          | Usar `COUNT` y `SUM` agregados en PostgreSQL: `SELECT status, COUNT(*), SUM(estimated_ticket) FROM leads GROUP BY status`. |
| 7   | `src/lib/data.ts:196-198`                  | **Búsqueda por concatenación string insegura**: `business_name.ilike.%${filters.search}%`. Vulnerable a inyección de filtros Supabase.          | Sanitizar input o usar `textSearch()` con índice `tsvector`.                                                               |
| 8   | `src/app/dashboard/leads/page.tsx:514-530` | **`userId` y `userName` hardcoded** al crear actividades (`"admin-maicol"`, `"Maicol"`).                                                        | Obtener del `SessionPayload` actual (ya disponible via `/api/auth/me`).                                                    |
| 9   | `src/components/dashboard/KanbanBoard.tsx` | **Componente huérfano**: El `KanbanBoard` existe pero no se usa en ninguna página. La vista de leads usa tabla.                                 | Decidir: implementar toggle Tabla/Kanban o eliminar el componente.                                                         |
| 10  | `src/app/dashboard/leads/page.tsx:56-67`   | **Re-fetch de leads en cada cambio de `searchQuery`**: `useEffect` con `fetchLeads` como dependencia se ejecuta en cada keystroke sin debounce. | Añadir `useDebouncedValue(searchQuery, 300)`.                                                                              |

### 🟡 MEDIA — Preparación para IA (Gemini / Google Places)

| #   | Área                             | Estado actual                                                        | Acción para integración                                                                                                                                    |
| --- | -------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11  | **Enriquecimiento de leads**     | Los campos `size`, `painPoints`, `location` se rellenan manualmente. | Crear endpoint `/api/ai/enrich-lead` que llame a Google Places API para auto-completar dirección, teléfono, website, horarios, rating y fotos del negocio. |
| 12  | **Scoring inteligente de leads** | El `tier` (A/B/C) se asigna manualmente.                             | Integrar Gemini para generar un lead score automático basado en: tipo de negocio, tamaño, ubicación, pain points y datos de Google Places.                 |
| 13  | **Resumen de actividad**         | Las notas se escriben a mano.                                        | Endpoint `/api/ai/summarize` que use Gemini para resumir el historial de actividades de un lead y sugerir próxima acción.                                  |
| 14  | **Análisis de pipeline**         | `getStats()` calcula métricas básicas.                               | Dashboard con predicciones: probabilidad de cierre por lead, revenue forecast con Gemini.                                                                  |

### 🔵 BAJA — Mejoras UX

| #   | Archivo             | Problema                                                                                                  | Acción recomendada                                                             |
| --- | ------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 15  | `AddLeadModal.tsx`  | No hay feedback visual de éxito/error post-creación.                                                      | Añadir toast/notificación de confirmación.                                     |
| 16  | `projects/page.tsx` | No hay CRUD completo: no se puede editar ni eliminar proyectos.                                           | Añadir PUT/DELETE routes y panel de edición.                                   |
| 17  | `settings/page.tsx` | Página estática, no editable. Info del sistema incorrecta ("JSON File (Phase 1)" cuando ya usa Supabase). | Refactorizar para mostrar info real del sistema.                               |
| 18  | General             | **No hay sistema de notificaciones/toasts** para feedback de acciones CRUD.                               | Implementar context de notificaciones con component Toast.                     |
| 19  | General             | **No hay manejo de errores visible al usuario** — los `catch` son silenciosos o con `console.error`.      | Propagar errores al UI con mensajes descriptivos.                              |
| 20  | `middleware.ts`     | No distingue entre sesión expirada y ausencia de sesión — ambos redirigen igual.                          | Añadir query param `?reason=expired` para mostrar mensaje contextual en login. |

---

## Apéndice A: Archivos del Proyecto (Post-Limpieza)

```
fraguasystems_web/
├── README.md                          # Único .md conservado
├── FRAGUA_CRM_MASTER_DOC.md           # ← ESTE DOCUMENTO
├── .env.local                         # Variables de entorno
├── package.json / package-lock.json
├── tsconfig.json / next.config.ts
├── eslint.config.mjs / postcss.config.mjs
├── public/                            # Assets estáticos (logo, video, etc.)
├── scripts/
│   ├── schema.sql                     # DDL de la base de datos
│   ├── seed.ts                        # Datos iniciales
│   ├── migrate.ts                     # Migraciones
│   ├── import-notion.ts               # Importación desde Notion
│   ├── create-client.ts               # Creación de clientes
│   └── *.py                           # Scripts de generación de assets
└── src/
    ├── middleware.ts                   # Protección de rutas
    ├── app/
    │   ├── layout.tsx / page.tsx / globals.css
    │   ├── dashboard/                 # CRM (protegido: admin only)
    │   │   ├── layout.tsx
    │   │   ├── page.tsx               # Overview
    │   │   ├── leads/page.tsx         # Pipeline CRM
    │   │   ├── projects/page.tsx      # Gestión proyectos
    │   │   └── settings/page.tsx      # Configuración
    │   ├── api/
    │   │   ├── auth/ (login, logout, me)
    │   │   ├── dashboard/ (leads, leads/[id], activities, projects, stats)
    │   │   ├── chat/route.ts          # Chatbot (Gemini)
    │   │   └── contact/route.ts       # Formulario de contacto
    │   ├── area-clientes/             # Portal de clientes
    │   ├── area-trabajadores/         # Portal de empleados
    │   ├── casos/                     # Casos de éxito
    │   └── servicios/                 # Página de servicios
    ├── components/
    │   ├── dashboard/                 # 6 componentes CRM
    │   ├── sections/                  # 9 secciones de la homepage
    │   ├── ui/                        # 4 componentes UI reutilizables
    │   ├── ChatWidget.tsx             # Widget de chat
    │   └── LayoutShell.tsx            # Shell del layout público
    ├── hooks/
    │   ├── useCountUp.ts              # Hook de animación counter
    │   └── useMagneticBorder.ts       # Hook de borde magnético
    └── lib/
        ├── auth.ts                    # Autenticación JWT
        ├── data.ts                    # Data layer (CRUD Supabase)
        └── supabase.ts               # Clientes Supabase (anon + admin)
```

---

> **Este documento es la única fuente de verdad sobre la arquitectura del CRM de Fragua Systems.**
> Última actualización: 9 de marzo de 2026.
