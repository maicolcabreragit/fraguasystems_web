# Fragua Systems — Product Requirements Document & Technical Specification

> **Versión:** 1.0 · **Fecha:** 3 de marzo de 2026
> **Autor:** Dirección de Producto & Arquitectura de Software — Fragua Systems
> **Clasificación:** Documento Interno de Ingeniería — Fuente de Verdad Única

---

## 1. Visión Corporativa y Posicionamiento

### 1.1. Identidad y Nomenclatura

| Campo                | Valor                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| **Nombre Comercial** | Fragua Systems                                                             |
| **Dominio Oficial**  | `fraguasystems.com`                                                        |
| **Sede Conceptual**  | Lleida, Catalunya, España                                                  |
| **Nicho de Mercado** | Sector HORECA — Hoteles, Turismo Rural y Grupos de Restauración en España  |
| **Modelo de Venta**  | B2B High-Ticket (presupuestos de implementación entre 5.000 € y >20.000 €) |

### 1.2. El Concepto "La Fragua" — La Herencia de Lleida

Fragua Systems encarna la transición de lo digital (intangible, frágil, efímero) a lo **físico, industrial y permanente**. No somos una "agencia de desarrollo web"; somos un **taller de ingeniería de software pesado**.

El nombre hunde sus raíces en la **Fragua Catalana** (_Farga Catalana_), el método ancestral de forja de acero de altísima resistencia perfeccionado en los Pirineos catalanes durante siglos. Este referente histórico no es decorativo: es el eje vertebral de toda la identidad visual, la narrativa comercial y la arquitectura de la experiencia de usuario.

> **Storytelling Fundacional:** _Antes forjábamos el hierro más resistente del Pirineo; hoy forjamos la infraestructura de software más segura para la hostelería._

La dualidad conceptual que debe impregnar cada píxel de la plataforma:

- **El Hierro** → La solidez de la ingeniería pesada, la infraestructura inamovible, la permanencia.
- **El Fuego** → La precisión del software avanzado, la transformación controlada, la energía focalizada.

Los grises fríos del acero mantienen el entorno utilitario y técnico. El cobre fundido y el oro industrial aportan el acabado de alta gama reservado para las funcionalidades clave y los puntos de conversión.

### 1.3. Posicionamiento B2B High-Ticket

**Lo que NO vendemos:** Páginas web, scripts, ni "soluciones digitales genéricas".

**Lo que SÍ vendemos:** Soluciones de infraestructura tecnológica que escalan operaciones, reducen OPEX y aceleran la adquisición de clientes para establecimientos hoteleros.

El ecosistema de ventas B2B en 2026 ha experimentado una transformación estructural fundamental. Los comités de compra incluyen ahora a múltiples partes interesadas (a menudo más de 13 perfiles internos en decisiones empresariales críticas), y hasta el **80% del ciclo de decisión se ejecuta de forma autónoma** a través de investigación digital antes de que el prospecto interactúe directamente con un representante de ventas. La confianza es la divisa definitiva. El diseño web no puede permitirse fisuras cognitivas.

Para no ser percibida como una simple "agencia de marketing digital barata", Fragua Systems debe desterrar los patrones de diseño SaaS de la década anterior —fondos blancos clínicos, colores pastel vibrantes, ilustraciones isométricas estilo "Corporate Memphis"— y adoptar firmemente las estéticas que dominan el B2B de alto valor en 2026.

---

## 2. Psicología del Comprador y Soluciones

### 2.1. Perfilado Psicológico del CEO Hotelero (45–65 años)

El segmento demográfico objetivo está compuesto por **CEOs, Directores de Operaciones (COOs) y propietarios de activos hoteleros**, predominantemente en la franja de edad de **45 a 65 años**. Este perfil no responde a incentivos de "disrupción tecnológica" o jerga de Silicon Valley.

**Su psicología de compra está regida por tres vectores:**

1. **Aversión a la disrupción operativa** — Cualquier cambio tecnológico se percibe como riesgo de colapso de las operaciones diarias del hotel.
2. **Maximización de márgenes de beneficio** — La inversión tecnológica solo se justifica con ROI cuantificable y demostrable.
3. **Exigencia estricta de cumplimiento normativo** — El marco legal español de 2026 (VeriFactu, SES.Hospedajes) genera una presión existencial que convierte la compliance en el primer criterio de compra.

### 2.2. Variables Psicológicas que Dictan el Diseño

#### Fatiga de la Jerga y Necesidad de Evidencia Empírica

Los compradores B2B modernos exigen pruebas tangibles sobre promesas de marketing. La adopción de soluciones se basa en la **validación empírica y la competencia demostrable**. El diseño debe priorizar la presentación de interfaces reales, flujos de datos y casos de estudio cuantificables en lugar de ilustraciones abstractas.

#### Ergonomía Cognitiva y Accesibilidad Visual

Para el grupo demográfico de 45–65 años, la legibilidad y la claridad visual no son meras preferencias estéticas, sino **requisitos funcionales innegociables**:

- Tipografía de cuerpo de texto **no inferior a 16px**.
- **Altos ratios de contraste** (WCAG AA mínimo).
- Estructuración de la información en **bloques digeribles** para evitar la sobrecarga cognitiva.

#### Construcción de Micro-Confianza (Micro-Trust)

La confianza en plataformas digitales se acumula a través de "micro-interacciones" y señales sutiles:

- **Tiempo de carga imperceptible** (inferior a 2.5 segundos — LCP).
- **Transiciones de interfaz predecibles** (sin saltos, sin glitches).
- **Presentación transparente de la información técnica** (mostrar "los engranajes" del sistema).

La deducción instintiva del CEO de 55 años es letal: _"Si no pueden asegurar una transición fluida en su propio sitio web corporativo, ¿cómo van a sincronizar el volumen masivo de reservas de mis hoteles sin colapsar?"_.

### 2.3. El Contexto Regulatorio: VeriFactu y SES.Hospedajes

La urgencia del diseño para Fragua Systems está intrínsecamente ligada al complejo marco legal del mercado español en 2026. El sector hotelero se enfrenta a un **desafío existencial de infraestructura de datos**.

#### Normativa VeriFactu (Ley Antifraude y Facturación Electrónica B2B)

| Hito                                                              | Fecha                      |
| ----------------------------------------------------------------- | -------------------------- |
| Obligatoriedad para empresas sujetas al Impuesto sobre Sociedades | **1 de enero de 2027**     |
| Obligatoriedad para el resto de empresas                          | **1 de julio de 2027**     |
| Sanción máxima por incumplimiento                                 | **50.000 € por ejercicio** |

**Requisitos técnicos severos que los sistemas de software (PMS, POS, ERP) deben garantizar:**

- Inmutabilidad de los registros contables.
- Transmisión en tiempo real a la **Agencia Estatal de Administración Tributaria (AEAT)**.
- Firmas electrónicas avanzadas.
- Generación dinámica de **códigos QR** por factura.

#### Normativa SES.Hospedajes (Real Decreto 933/2021)

Obliga al **reporte automatizado y diario** de los datos de huéspedes a las Fuerzas y Cuerpos de Seguridad del Estado. Requiere envío electrónico estructurado de datos personales de cada check-in.

### 2.4. Cómo el Diseño Transmite Seguridad Institucional

Frente a esta presión regulatoria, el diseño web de Fragua Systems debe actuar como un **agente tranquilizador**:

- Un diseño inestable, excesivamente animado o visualmente genérico **no transmite** la capacidad de manejar protocolos criptográficos y envíos masivos de datos a la Hacienda pública.
- La identidad visual debe gritar implícitamente: **"Nuestra infraestructura es impenetrable; su negocio está a salvo con nuestra ingeniería."**
- Los distintivos de certificación técnica y regulatoria ("VeriFactu Ready 2026/2027", "Integración Oficial SES.Hospedajes", "SOC 2 Compliant") actúan como **interruptores psicológicos** que neutralizan las alarmas de riesgo normativo del cliente.

### 2.5. Propuesta de Valor — Los Tres Pilares

| Pilar                                       | Dolor del Cliente                                                                        | Solución Fragua Systems                                                                                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Mitigación de Riesgo Legal (Compliance)** | Caos administrativo del RD 933/2021, terror a sanciones VeriFactu de hasta 50.000 €/año. | Envío automático a SES.Hospedajes. Infraestructuras preparadas para facturación electrónica obligatoria VeriFactu 2026/2027.  |
| **Recuperación de Márgenes**                | Cesión del 15–20% de reservas a OTAs intermediarias (Booking, Expedia).                  | Canales de Venta Directa ultrarrápidos que eliminan comisiones de intermediarios. Incremento demostrable del 34% en márgenes. |
| **Eficiencia Operativa**                    | Sobrecarga de personal administrativo en tareas repetitivas de gestión.                  | "Back-Offices Invisibles": PMS a medida que automatizan gestión de reservas, facturación, inventario y reporting.             |

---

## 3. Arquitectura de Sistemas y DevOps

### 3.1. Stack Tecnológico

| Capa               | Tecnología                     | Justificación                                                                                                      |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Framework Core** | **Next.js** (App Router)       | Renderizado híbrido (SSR/SSG/ISR), routing basado en filesystem, optimización SEO nativa, Image Optimization API.  |
| **UI Library**     | **React 19+**                  | Componentes declarativos, Server Components, Suspense boundaries para estados de carga.                            |
| **Lenguaje**       | **TypeScript** (modo estricto) | Tipado estático obligatorio. Cero `any`. Interfaces explícitas para todos los contratos de datos.                  |
| **Estilos**        | **Tailwind CSS**               | Utility-first para velocidad de desarrollo. Design tokens mapeados como variables CSS custom.                      |
| **Animaciones**    | **Framer Motion**              | Físicas de resortes (spring mechanics), animaciones gestuales (whileHover, whileTap), orchestration de secuencias. |
| **3D / WebGL**     | **Three.js** / **Spline**      | Mallas topológicas metálicas, shaders de materiales oscuros, parallax reactivo al ratón.                           |
| **Base de Datos**  | **PostgreSQL**                 | ACID compliance total, extensiones JSON nativas, soporte para queries complejas de reporting.                      |

### 3.2. Infraestructura de Despliegue

```
┌──────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE PRODUCCIÓN                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐      ┌──────────────┐      ┌────────────────┐  │
│  │   GitHub     │─────▶│    Vercel     │      │   Hetzner VPS  │  │
│  │  (main)      │      │  Edge Network │      │  Bare-Metal    │  │
│  │             │      │              │      │  (Europa/DE)   │  │
│  │  Commits    │      │  Frontend    │      │              │  │
│  │  atómicos   │      │  SSR/SSG     │◀────▶│  Backend API   │  │
│  │  CI/CD      │      │  CDN Global  │      │  PostgreSQL    │  │
│  │  Pipelines  │      │  Zero-Down   │      │  Datos GDPR    │  │
│  └─────────────┘      └──────────────┘      └────────────────┘  │
│                                                                  │
│  Soberanía de datos policiales (SES.Hospedajes) y fiscales       │
│  (VeriFactu) garantizada en servidores europeos.                 │
└──────────────────────────────────────────────────────────────────┘
```

#### Repositorio y CI/CD — GitHub

- Control de versiones absoluto. **Commits atómicos** con mensajes descriptivos.
- Pipelines de integración continua para linting (ESLint), type-checking (tsc), y build validation.
- Branch protection en `main` con required reviews.

#### Despliegue Frontend (Edge) — Vercel

- Hosting acoplado a la rama `main` de GitHub.
- **Despliegues inmutables**, "Zero-Downtime".
- Tiempos de carga de **sub-segundos a nivel global** gracias a la Edge Network.
- Preview Deployments automáticos por Pull Request.

#### Infraestructura Backend — Hetzner (Bare-Metal, Europa)

- Servidores ubicados **físicamente en Europa (Alemania)**.
- **Argumento de ventas crítico:** Garantiza la **soberanía de los datos policiales** (SES.Hospedajes) y **fiscales** (VeriFactu), blindando al cliente contra multas del **Reglamento General de Protección de Datos (GDPR)**.
- Base de datos primaria: **PostgreSQL** con backups cifrados y replicación.

---

## 4. Sistema de Diseño UI/UX — Design Tokens

### 4.1. Filosofía Visual: "Dark Corporate" e "Industrial Luxe"

La interfaz debe proyectar **"Autoridad Táctil"** y **"Claridad Extrema"**. La estética converge con los líderes del software B2B enterprise de 2026:

| Empresa de Referencia        | Filosofía de Diseño Dominante                                                           | Elementos Visuales Clave                                                                                                                              | Aplicación para Fragua Systems                                                                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Palantir (AIP / Foundry)** | Profundidad analítica y escala gubernamental. Visualización de arquitecturas complejas. | Interfaces oscuras densas, mallas topológicas (Ontology), esquemas de grafos interactivos, métricas crudas sin adornos.                               | Adoptar la visualización de sistemas en lugar de ilustraciones de personas. Mostrar flujos de datos abstractos que simulen la sincronización de reservas y facturación.   |
| **Stripe Enterprise**        | Claridad absoluta, precisión financiera y neutralidad institucional.                    | Cuadrículas milimétricas, jerarquía tipográfica impecable, paletas monocromáticas con acentos de color funcional, animaciones guiadas por el scroll.  | Implementar una estructura SPA con navegación predecible. Uso de tablas transparentes y directas para desglosar ventajas técnicas.                                        |
| **Linear.app**               | Eficiencia pura, ergonomía para el teclado y "Dark Corporate" nativo.                   | Fondos abismales (casi negros), escalas de espaciado matemático (base 8px), "Liquid Glass" y destellos metálicos interactivos.                        | Adoptar la paleta oscura como lienzo por defecto. Utilizar el concepto de "Glassmorphism maduro" para crear capas de interfaz superpuestas que denotan orden y prioridad. |
| **Vercel**                   | Minimalismo estructural, velocidad percibida y estética "Developer-First".              | Tipografía customizada de alta precisión (Geist, Geist Pixel), contraste extremo (blanco/negro), bordes limpios y reducción drástica de ruido visual. | Seleccionar tipografías neo-grotescas que funcionen tanto en marketing como en consolas de código, priorizando la legibilidad a escalas pequeñas.                         |

**Prohibiciones absolutas del diseño:**

- ❌ Fotografías genéricas de bancos de imágenes (profesionales sonriendo frente a pantallas).
- ❌ Ilustraciones isométricas planas estilo "Corporate Memphis".
- ❌ Fondos blancos clínicos o colores pastel vibrantes.
- ❌ Gradientes decorativos sin función semántica.

**Activos visuales obligatorios:**

- ✅ Texturas, ruido digital (_noise_) y grano de película fotográfica sobre fondos oscuros.
- ✅ Mallas 3D interactivas (WebGL / Three.js / Spline) con shaders metálicos.
- ✅ Terminales de consola simuladas estilizadas con código formateado.
- ✅ Visualizaciones abstractas de flujos de datos (grafos, topologías, redes de nodos).

### 4.2. Paleta de Colores: La Fusión del Acero y el Fuego

La paleta se construye sobre un principio de **restricción cromática**: un **85–90%** de la interfaz estará dominada por sombras neutras y oscuras, reservando los acentos cálidos estrictamente para la señalización interactiva y los puntos de conversión.

| Token             | Nombre Funcional    | HEX       | CSS Variable              | Aplicación en la Arquitectura Web                                                                                | Justificación Psicológica / Brand Concept                                                                                                                |
| ----------------- | ------------------- | --------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abyss-black`     | **Abyss Black**     | `#0E0F12` | `--color-abyss-black`     | Fondo principal global. Base del modo Dark Corporate.                                                            | Proyecta el vacío técnico y el entorno de máxima concentración. Silencia el ruido externo.                                                               |
| `forged-slate`    | **Forged Slate**    | `#1F232B` | `--color-forged-slate`    | Fondos de tarjetas primarias, modulares y bloques estructurales del Bento Grid.                                  | Aporta dimensión sobre el fondo abismal. Evoca la superficie de un yunque de acero oscuro o un bloque de motor fundido.                                  |
| `brushed-steel`   | **Brushed Steel**   | `#2E3542` | `--color-brushed-steel`   | Bordes interiores, líneas separadoras y marcos de componentes UI.                                                | Delimita los espacios sin generar contraste agresivo. Simula el brillo frío del acero mecanizado.                                                        |
| `titanium-white`  | **Titanium White**  | `#E6E7EA` | `--color-titanium-white`  | Tipografía principal (H1, H2), titulares y cuerpo de texto denso.                                                | Un blanco ligeramente agrisado que mitiga el deslumbramiento (halación) contra el fondo oscuro, asegurando legibilidad sin fatiga para usuarios maduros. |
| `machine-gray`    | **Machine Gray**    | `#8A9197` | `--color-machine-gray`    | Tipografía secundaria, microcopias, leyendas de tablas de datos y metadatos.                                     | Mantiene el orden jerárquico. La información técnica auxiliar no debe competir con el mensaje principal de mitigación de riesgo.                         |
| `molten-copper`   | **Molten Copper**   | `#C86A3D` | `--color-molten-copper`   | **Acción Principal (CTA)**, estados activos de botones, barras de carga, indicadores de progreso.                | Representa el calor focalizado de "La Fragua". Capta inmediatamente la atención sin la urgencia de alarma que genera el rojo puro. Energético y premium. |
| `industrial-gold` | **Industrial Gold** | `#D4AF37` | `--color-industrial-gold` | **Uso exclusivo** para señales de confianza: Badges de VeriFactu, certificaciones SOC2, y métricas clave de ROI. | El color del estándar institucional. Comunica éxito probado, lujo silencioso y solvencia financiera definitiva.                                          |

**Reglas de uso cromático:**

- **Molten Copper** (`#C86A3D`) se reserva **exclusivamente** para CTAs, estados `:hover`/`:active` y elementos de interacción primaria. Nunca como decoración.
- **Industrial Gold** (`#D4AF37`) tiene un uso **aún más restrictivo**: solo aparece en badges de certificación, sellos de confianza y métricas de ROI verificadas. Nunca en botones ni enlaces genéricos.
- Los gradientes, cuando se empleen, deben ser **sutiles y funcionales** (ej. gradiente de `molten-copper` al `10% de opacidad` para iluminación reactiva del cursor).

### 4.3. Sistema Tipográfico Dual: Mecánica y Ritmo Humano

En el contexto estricto de las interfaces B2B en 2026, la tipografía asume un rol protagónico extraordinario. Al eliminar la decoración excesiva, las fuentes tipográficas deben cargar con el tono corporativo, funcionando como **guardianes de la conversión** y emisores instantáneos de innovación y confiabilidad.

#### Fuente Primaria — Titulares (Display: H1 / H2 / H3)

**Opciones (seleccionar una):**

| Fuente            | Clasificación                            | Justificación                                                                                                                                                                                                                                           |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IBM Plex Sans** | Súper-familia "hombre-máquina"           | Combina la lógica estricta de la ingeniería de software con detalles humanísticos. Elegida por corporaciones tecnológicas profundas (computación cuántica, infraestructura de datos). Geometría estable que impone un tono de autoridad inquebrantable. |
| **Aeonik**        | Neo-grotesca geométrica (CoType Foundry) | Precisión mecánica extrema a través de terminales rigurosamente perpendiculares, compensados sutilmente por formas redondeadas. Empleada extensamente en Fintech B2B y tecnología de transporte en 2026. Modernidad aséptica.                           |

#### Fuente Secundaria — Cuerpo de Texto, Interfaces y Datos

| Fuente    | Clasificación                              | Justificación                                                                                                                                                                                                                                                                                                                                         |
| --------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inter** | Sans-serif screen-first (Rasmus Andersson) | Concebida para ser escaneada a velocidades extremas en pantallas de alta densidad. Trampas de tinta internas (_ink traps_). Altura de la X que garantiza resolución perfecta a tamaños de 14px o inferiores. Transmite subliminalmente que el usuario está ante una empresa desarrolladora de software robusto, no frente a una campaña de marketing. |

#### Escala Tipográfica

| Elemento                  | Fuente                 | Peso               | Tamaño Mínimo       | Line-Height |
| ------------------------- | ---------------------- | ------------------ | ------------------- | ----------- |
| H1 — Titular Heroico      | IBM Plex Sans / Aeonik | **Bold (700)**     | `48px` / `3rem`     | `1.1`       |
| H2 — Subtitular Principal | IBM Plex Sans / Aeonik | **SemiBold (600)** | `32px` / `2rem`     | `1.2`       |
| H3 — Titular de Sección   | IBM Plex Sans / Aeonik | **Medium (500)**   | `24px` / `1.5rem`   | `1.3`       |
| Body — Cuerpo de Texto    | Inter                  | **Regular (400)**  | `16px` / `1rem`     | `1.6`       |
| Body Small — Microcopias  | Inter                  | **Regular (400)**  | `14px` / `0.875rem` | `1.5`       |
| Caption — Metadatos       | Inter                  | **Medium (500)**   | `12px` / `0.75rem`  | `1.4`       |

### 4.4. Espaciado y Grid

- **Escala de espaciado matemático:** Base **8px** (`0.5rem`). Todos los valores de padding, margin y gap deben ser múltiplos de 8px (`8, 16, 24, 32, 48, 64, 96, 128`).
- **Corner radii de tarjetas:** `16–24px` para un acabado táctil y "app-like".
- **Border-width de glassmorphism:** `1px` con opacidad controlada (`border: 1px solid rgba(46, 53, 66, 0.5)`).

### 4.5. Texturas, Ruido y Materialidad

Para evitar la planitud clínica y estéril asociada al contenido autogenerado, se aplicará el principio de **"perfección imperfecta"**:

- Superposición **casi imperceptible de ruido digital** (_noise grain_) sobre los fondos `Abyss Black`.
- Grano de película fotográfica en overlays sutiles (`mix-blend-mode: overlay`, `opacity: 0.03–0.05`).
- Esto introduce fricción visual, otorgando a la plataforma una cualidad táctil de **material forjado** (asfalto, acero no pulido, concreto).

### 4.6. Glassmorphism Estructural ("Liquid Glass")

El Glassmorphism ha madurado en 2026 hacia el **"Liquid Glass"** o **"Glassmorphism Estructural"**. En lugar de utilizarse como un truco visual decorativo, se emplea para establecer **relaciones espaciales y jerarquía a lo largo del eje Z** de la interfaz.

**Implementación técnica:**

```css
.glass-panel {
  background: rgba(31, 35, 43, 0.6); /* Forged Slate al 60% */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(46, 53, 66, 0.5); /* Brushed Steel al 50% */
  border-radius: 16px;
}
```

Los paneles de software y las tarjetas de servicios de Fragua Systems no deben ser elementos planos bidimensionales. Mediante la superposición de capas traslúcidas sutiles, desenfoques de fondo (`backdrop-filter: blur`) muy medidos y bordes reflectantes de un píxel, la interfaz adquiere **tactilidad**. Se simula la interacción con paneles de cristal y herrajes metálicos de alta precisión.

---

## 5. Cinética e Interacción — Ingeniería del Movimiento B2B

Si la paleta cromática y la tipografía constituyen la arquitectura inerte de la plataforma, **el movimiento dicta cómo el sistema "respira"**. En el diseño B2B moderno, el movimiento no es un adorno estético; es el lenguaje fundamental para comunicar **intención, jerarquía y estatus operativo**.

Todas las interacciones se implementarán utilizando **Framer Motion** en React/Next.js.

### 5.1. Físicas de Resortes (Spring Mechanics) — Peso Digital

La era de las animaciones lineales fundamentadas en duraciones estáticas (`transition: all 0.3s ease-in-out`) ha concluido. En el mundo físico de la ingeniería pesada que Fragua Systems emula, los objetos masivos poseen **inercia, tensión y rozamiento**.

**Configuración canónica de Framer Motion para elementos interactivos:**

```typescript
const springConfig = {
  type: "spring",
  stiffness: 400, // Alta rigidez — respuesta inmediata, "maquinaria pesada"
  damping: 25, // Amortiguación severa — bajo rebote, contención industrial
  mass: 0.5, // Masa perceptible — no es liviano, tiene "peso digital"
};
```

**Comportamiento esperado:**

- **`whileTap`**: El elemento se contraerá con alta rigidez y bajo rebote, replicando la pulsación firme y contundente de un **actuador mecánico de maquinaria industrial pesada**.
- **`whileHover`**: Elevación sutil (`scale: 1.02`, `y: -2px`) con transición spring. Nunca escalas exageradas.
- **Despliegue de módulos**: Los paneles de servicio se expandirán con `stiffness: 300, damping: 30`, simulando la apertura de un mecanismo hidráulico.

### 5.2. Cinética de Materiales: El Brillo de la Forja (Shimmer Effect)

Para enfatizar la materialidad de la marca ("La Fragua", acero forjado), los botones CTA clave y los bordes contenedores del Bento Grid integrarán el **"Shimmer Effect"** (Reflejo Metálico).

**Mecánica:**

- Se prescinde del simple cambio de color al pasar el cursor (`hover`) tradicional.
- Se proyecta un **gradiente lumínico asimétrico y translúcido** que recorre dinámicamente la superficie geométrica del elemento.
- El gradiente **reacciona sutilmente a la posición cardinal del ratón** (X/Y mouse tracking).
- El efecto visual resultante es idéntico a observar cómo un haz de luz incide sobre una pesada placa de **titanio cepillado** al alterar su ángulo.

**Implementación conceptual:**

```typescript
// Shimmer Effect — Mouse-tracking gradient
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.currentTarget.style.setProperty("--shimmer-x", `${x}%`);
  e.currentTarget.style.setProperty("--shimmer-y", `${y}%`);
};
```

```css
.shimmer-element {
  position: relative;
  overflow: hidden;
}

.shimmer-element::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--shimmer-x, 50%) var(--shimmer-y, 50%),
    rgba(200, 106, 61, 0.15),
    /* Molten Copper al 15% */ transparent 60%
  );
  pointer-events: none;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.shimmer-element:hover::after {
  opacity: 1;
}
```

### 5.3. Iluminación Reactiva Condicional (Magnetic Borders)

Una técnica avanzada que consolida el aura tecnológica dentro del propio **Bento Grid**:

- Mediante la captura continua de las coordenadas del puntero, se inyecta un **gradiente radial de opacidad marginal** (`#C86A3D` al `10%` de opacidad) que reside por debajo del color sólido de fondo de las tarjetas.
- Al transitar el cursor cerca de las intersecciones de las tarjetas `Forged Slate` (`#1F232B`) y los canales separadores `Brushed Steel` (`#2E3542`), **la luz virtual parece asomarse tangencialmente**.
- El sistema está perennemente en estado de alerta, **vigilante y reactivo** a las intenciones del usuario hotelero, sin comprometer jamás la legibilidad esencial del texto.

**Esto es la quintaesencia del "Factor WOW" en 2026:** No estallar en fuegos artificiales digitales, sino demostrar una potencia operativa matemática, sobria, incesante y ejecutada con una precisión aplastante.

### 5.4. Reglas Generales de Movimiento

| Parámetro                                | Valor                                                                    | Justificación                                    |
| ---------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| **Entrada de elementos (Scroll Reveal)** | `opacity: 0→1`, `y: 30→0`, spring `stiffness: 200, damping: 20`          | Aparición sólida, sin flotación excesiva.        |
| **Stagger de listas/grids**              | `delayChildren: 0.1`, `staggerChildren: 0.05`                            | Secuencia rápida pero perceptible. Orden visual. |
| **Transiciones de página**               | `duration: 0.3s`, `ease: [0.25, 0.1, 0.25, 1.0]`                         | Navegación instantánea sin latencia percibida.   |
| **Elementos 3D (WebGL)**                 | Rotación deliberadamente lenta y orgánica en eje Y                       | Poder latente, estabilidad operativa.            |
| **Parallax del ratón**                   | Respuesta tenue a la aceleración del ratón (max `5px` de desplazamiento) | Profundidad sin invadir el espacio de lectura.   |

---

## 6. Arquitectura de la Homepage — Estructura Bloque a Bloque

La página de inicio de Fragua Systems se concibe como una **maquinaria predictiva de ventas**, operando bajo el marco de conversión **"Clarity → Comprehension → Credibility → Conversion"** (Claridad, Comprensión, Credibilidad, Conversión).

### 6.1. Bloque 1 — The Hero Section (El Impacto Crítico de 3 Segundos)

El primer contacto visual (_Above the Fold_) determina la supervivencia del usuario en el embudo. La disposición espacial debe ser **implacable**.

| Componente           | Especificación                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fondo Perceptual** | `Abyss Black` (`#0E0F12`) con activo WebGL interactivo en la mitad derecha: una red de datos pulsante en tonos `Forged Slate` con detalles `Molten Copper`. Superposición de noise grain al 3–5%.                                                                                                                                                           |
| **Titular H1**       | Frontal, sin ambigüedades. _"Ingeniería de Software Pesada para la Alta Hotelería."_ — Fuente: IBM Plex Sans / Aeonik Bold, mínimo `48px`. Color: `Titanium White` (`#E6E7EA`).                                                                                                                                                                             |
| **Subtítulo H2**     | Concreto, enfocado en dolor operativo y mitigación de riesgos legales. _"Automatización integral de PMS, canales de venta directa y cumplimiento garantizado de normativas VeriFactu y SES.Hospedajes. Construimos infraestructuras para escalar sus márgenes sin fricción operativa."_ — Fuente: Inter Regular, `18px`. Color: `Machine Gray` (`#8A9197`). |
| **CTA Primario**     | Botón sólido en `Molten Copper` (`#C86A3D`). Texto: _"Solicitar Auditoría Arquitectónica"_. Esquinas redondeadas `12px`. Shimmer Effect activo. Spring response en `whileTap` (`scale: 0.97`).                                                                                                                                                              |
| **CTA Secundario**   | Botón ghost/outline con borde `Brushed Steel`. Texto: _"Ver Casos de Ingeniería"_.                                                                                                                                                                                                                                                                          |

### 6.2. Bloque 2 — Barra de Validación Institucional (Micro-Trust Bar)

Directamente bajo el Hero, antes de obligar al usuario a desplazarse. Para el comprador empresarial de 55 años, el riesgo de invertir decenas de miles de euros en software es paralizante. **La validación temprana es obligatoria.**

| Componente                  | Especificación                                                                                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Estilo**                  | Sección monocromática, baja opacidad. Fondo `Abyss Black` continuo.                                                                                                     |
| **Logotipos de Clientes**   | Logotipos estandarizados de cadenas hoteleras en la cartera, filtro `grayscale(100%)` con transición a color en hover.                                                  |
| **Badges de Certificación** | Insignias con borde `Industrial Gold` (`#D4AF37`): "VeriFactu Ready 2026/2027", "Integración Oficial SES.Hospedajes", "SOC 2 Compliant", "GDPR — Servidores en Europa". |
| **Animación**               | Scroll reveal con stagger. Desplazamiento horizontal infinito suave si hay más de 6 elementos.                                                                          |

### 6.3. Bloque 3 — Módulos de Ejecución (Arquitectura Bento Grid)

El 67% de las webs de tecnología empresarial líderes (SaaS) emplean actualmente sistemas "Bento Grid" en sus landing pages. Esta disposición compartimentada, similar a una fiambrera japonesa, organiza los servicios en **tarjetas asimétricas interconectadas**.

**Especificaciones del Grid:**

| Parámetro              | Valor                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Fondo de tarjetas**  | `Forged Slate` (`#1F232B`)                                                                        |
| **Border de tarjetas** | `1px solid` `Brushed Steel` (`#2E3542`) al `50%` opacidad                                         |
| **Corner radius**      | `16–24px`                                                                                         |
| **Gap entre tarjetas** | `16px` (2 × base 8px)                                                                             |
| **Efecto hover**       | Iluminación Reactiva Condicional (Magnetic Borders) + elevación spring (`y: -4px`, `scale: 1.01`) |

**Jerarquía Visual Codificada:**

- **Tarjeta Principal (2×2 cols):** Ancla la solución central → _"El Ecosistema PMS Unificado"_. Integra un componente WebGL o una interfaz de consola simulada.
- **Tarjetas Medianas (1×2 o 2×1):** Módulos críticos → _"Motor de Ventas Directo Libre de Comisiones"_, _"Automatización SES.Hospedajes"_.
- **Tarjetas Compactas (1×1):** Contexto técnico → Pequeños flujos de código, interfaces de consola estilizadas que ilustren sincronizaciones con bases de datos gubernamentales.

**Contenido de cada tarjeta:**

1. **Icono o mini-visualización** (SVG animado o fragmento de interfaz real).
2. **Título H3** en IBM Plex Sans / Aeonik SemiBold.
3. **Descripción concisa** en Inter Regular (`Machine Gray`).
4. **Dato cuantificable** o badge de compliance cuando aplique (`Industrial Gold`).

### 6.4. Bloque 4 — Prueba Empírica Orientada a Resultados (Casos de Ingeniería)

El B2B en 2026 exige **evidencias matemáticas**. Las promesas cualitativas son ignoradas. Esta sección sustituye las clásicas cajas de testimonios por **"Casos de Uso de Ingeniería"**.

| Componente              | Especificación                                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Formato**             | Desgloses tabulares o gráficos precisos del retorno de inversión (ROI).                                                                                                                      |
| **Ejemplo interactivo** | Módulo que contrasta _costes de mantenimiento previos_ versus _incremento del 34% en márgenes_ mediante la eliminación de comisiones de OTAs gracias al canal de venta directa de La Fragua. |
| **Estilo visual**       | Gráficos con acentos `Molten Copper` y `Industrial Gold`. Fondo de tarjeta `Forged Slate`. Datos en `Titanium White`, leyendas en `Machine Gray`.                                            |
| **Trust signal**        | Badge `Industrial Gold`: cifra de ROI verificada.                                                                                                                                            |

### 6.5. Bloque 5 — Flujo de Decisión Final (Bottom Funnel)

El área inferior de la landing page eliminará por completo las distracciones visuales y los enlaces secundarios de navegación (**fugas del embudo**).

| Componente               | Especificación                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Fondo**                | `Abyss Black` puro, sin texturas adicionales. Espacio generoso (paddding vertical `128px`+).                                     |
| **Titular**              | Último recordatorio del valor fundamental. H2 en IBM Plex Sans / Aeonik. _"¿Listo para blindar la infraestructura de su hotel?"_ |
| **CTA Replicado**        | Botón idéntico al Hero: `Molten Copper`, _"Solicitar Auditoría Arquitectónica"_. Shimmer Effect activo.                          |
| **Elementos eliminados** | Cero enlaces de navegación secundarios. Cero footer expandido. Solo el CTA y un enlace de contacto directo.                      |
| **Objetivo**             | Forzar la decisión del usuario sin la interferencia del ruido externo.                                                           |

---

## Apéndice A — Mallas 3D Interactivas y WebGL

### Directrices de Implementación

- **Topologías Metálicas:** Abstracciones tridimensionales fluidas. En lugar de mostrar un ordenador, se mostrará una malla topológica (nodos y vértices) renderizada con shaders que simulen **metales oscuros, bronce y reflejos de luz especular**.
- **Cinemática:** Movimiento deliberadamente **lento y orgánico** (partículas flotantes, rotación planetaria en el eje Y). Comunicar poder latente, estabilidad operativa y control termodinámico.
- **Interacción:** Respuesta tenue a la aceleración del ratón (parallax). Máximo `5px` de desplazamiento en cualquier eje. Aporta dimensión de profundidad sin invadir el espacio de lectura.
- **Rendimiento:** El activo WebGL debe cargar de forma diferida (lazy) con un fallback estático SVG/imagen para conexiones lentas y dispositivos móviles.

### El Código Como Arte Conceptual

Las secciones explicativas emplearán:

- **Terminales de consola simuladas** estilizadas (fondo `Abyss Black`, texto mono en `Machine Gray` con highlights en `Molten Copper`).
- **Gráficos de visualización de flujos de datos abstractos** procesando hipotéticas transacciones VeriFactu o sincronizaciones de habitaciones.
- Mostrar la infraestructura cruda —empaquetada en contenedores "Liquid Glass"— es el símbolo máximo de **transparencia técnica** que un hotelero necesita ver para confiar en la estabilidad del sistema.

---

## Apéndice B — Referencias Bibliográficas

| #   | Fuente                                               | URL                                                                                                  |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | Web Design Trends 2026 — Coalition Technologies      | https://coalitiontechnologies.com/blog/2026-web-design-trends                                        |
| 5   | Business Buying Behavior 2026 — Prospeo              | https://prospeo.io/s/business-buying-behavior                                                        |
| 6   | Predictions 2026: Trust as Currency — Forrester      | https://www.forrester.com/blogs/predictions-2026-trust-will-be-the-ultimate-currency-for-b2b-buyers/ |
| 7   | VeriFactu Spain 2025-2026 — Renn                     | https://getrenn.com/blog/verifactu                                                                   |
| 11  | VeriFactu: Verified Billing System — EDICOM          | https://edicomgroup.com/blog/spain-computerized-invoicing-system-verifactu                           |
| 14  | Spain Government Compliance — Cloudbeds              | https://www.cloudbeds.com/government-compliance/spain/                                               |
| 15  | Palantir Analysis 2026 — Deep Research Global        | https://www.deepresearchglobal.com/p/palantir-company-analysis-outlook-report                        |
| 19  | Linear Aesthetic UI Libraries — LogRocket            | https://blog.logrocket.com/ux-design/linear-design-ui-libraries-design-kits-layout-grid/             |
| 23  | Black Gold Color Palette — Media.io                  | https://www.media.io/color-palette/black-gold-color-palette.html                                     |
| 25  | Web Design Trends 2026 — Contra Agency               | https://www.contra.agency/insights/8-web-design-trends-for-2025                                      |
| 29  | Tech Fonts for Innovation & Authority — Fello Agency | https://www.fello.agency/blog/tech-fonts                                                             |
| 30  | 50 Fonts Popular in 2026 — Creative Boom             | https://www.creativeboom.com/resources/top-50-fonts-in-2026/                                         |
| 34  | 9 UX Design Shifts 2026 — Forbes                     | https://www.forbes.com/sites/sap/2025/12/15/9-ux-design-shifts-that-will-shape-2026/                 |
| 35  | Bento Grid Design Guide 2026 — Landdding             | https://landdding.com/blog/blog-bento-grid-design-guide                                              |
| 44  | UI/UX Evolution 2026: Micro-Interactions — Primotech | https://primotech.com/ui-ux-evolution-2026-why-micro-interactions-and-motion-matter-more-than-ever/  |
| 45  | Micro-Interactions & Motion Design — Medium          | https://medium.com/@manavkaushal756/motion-is-meaning-the-new-era-of-micro-interactions-3131b4d95a05 |

---

> **FIN DEL DOCUMENTO** — Este PRD & Tech Spec constituye la **fuente de verdad única** para la implementación de `fraguasystems.com`. Toda decisión de diseño, desarrollo y despliegue debe validarse contra este documento.
