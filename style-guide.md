# Guía de Estilo y Diseño - Form Builder

Esta guía documenta la identidad visual, los componentes principales y el flujo de navegación de la aplicación para asegurar la coherencia en el diseño y la experiencia de usuario.

---

## 1. Identidad Visual

### Paleta de Colores
Utilizamos el sistema **OKLCH** para una mayor fidelidad cromática y consistencia entre temas.

#### Modo Claro (Light)
| Nombre | Valor OKLCH | Propósito |
| :--- | :--- | :--- |
| **Fondo** | `oklch(0.9529 0.0146 102.4597)` | Base de la página. |
| **Texto** | `oklch(0.4063 0.0255 40.3627)` | Texto principal. |
| **Primario** | `oklch(0.6083 0.0623 44.3588)` | Botones y acentos. |
| **Secundario** | `oklch(0.7473 0.0387 80.5476)` | Elementos de apoyo. |
| **Muted** | `oklch(0.8502 0.0389 49.0874)` | Texto secundario/desactivado. |

#### Modo Oscuro (Dark)
| Nombre | Valor OKLCH | Propósito |
| :--- | :--- | :--- |
| **Fondo** | `oklch(0.2721 0.0141 48.1783)` | Base de la página oscura. |
| **Texto** | `oklch(0.9529 0.0146 102.4597)` | Texto en modo oscuro. |
| **Primario** | `oklch(0.7272 0.0539 52.3320)` | Acentos en modo oscuro. |
| **Secundario** | `oklch(0.5416 0.0512 37.2132)` | Elementos de apoyo oscuros. |
| **Muted** | `oklch(0.4063 0.0255 40.3627)` | Texto secundario oscuro. |

> [!TIP]
> En la configuración de **Clerk**, el avatar usa el color `--primary` con texto `--primary-foreground` para las iniciales, asegurando que la marca esté presente incluso sin foto de perfil.

### Tipografía
- **Serif (Títulos):** `Source Serif 4` / `Georgia` - Aporta elegancia y profesionalismo (usado en el Hero y el logo).
- **Sans (Cuerpo):** `DM Sans` / `Inter` - Limpia y legible para la interfaz.
- **Mono (Código/Datos):** `JetBrains Mono` - Usada en etiquetas técnicas o identificadores.

---

## 2. Componentes UI

### Botones
- **Primary:** Fondo `--primary`, texto contrastado. Sombra suave del mismo tono.
- **Outline/Ghost:** Borde `--border/50` o transparente, texto `--foreground`.
- **Interacción:** Hover con leve elevación (`-translate-y-0.5`) y aumento de sombra.

### Tarjetas (Cards)
Todas las tarjetas deben seguir un diseño unificado para mantener la coherencia:
- **Borde:** `1px solid hsl(var(--border) / 0.4)` o `@apply border-border/40`.
- **Esquinas:** `rounded-2xl` (0.5rem base con ajustes).
- **Fondo:** Degradado suave de `--card` a `--muted/10`.
- **Hover:** Cambio sutil a `--secondary` o aumento de opacidad en el borde.

### Navegación (Navbar)
- Diseño minimalista con efecto *glassmorphism* (`backdrop-blur`).
- Enlace principal: "Form **Builder**" donde "Builder" resalta en color primario.

---

## 3. Flujo de la Aplicación

### Inicio y Autenticación
1.  **Landing Page:** El usuario llega al Hero donde se explica la propuesta de valor.
2.  **Autenticación:** Uso de Clerk para Sign-In/Sign-Up. Interfaz limpia con el color primario de la app.
3.  **Primer Paso:** Botón "Empezar ahora" dirige al Dashboard.

### Gestión de Formularios
1.  **Dashboard:** Visualización de todos los formularios creados. Sidebar lateral para navegación rápida.
2.  **Creación:** Editor visual donde se arrastran o añaden campos dinámicos.
3.  **Compartir:** Cada formulario genera un link único para pacientes/usuarios externos.
4.  **Resultados:** Sección de "Submissions" para visualizar y exportar las respuestas recibidas.

---

## 4. Reglas de Coherencia
- **Bordes:** Nunca usar negros puros o grises fuertes. Siempre usar la variable `--border` con opacidad (ej. `border-border/50`).
- **Espaciado:** Basado en la escala de 4px (`--spacing: 0.25rem`).
- **Sombras:** Usar sombras basadas en el color de la marca con baja opacidad (`shadow-primary/10`).
