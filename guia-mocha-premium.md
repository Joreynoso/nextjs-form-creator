# Reglas de Tema: Mocha Mousse (tweakcn / shadcn-ui)

> Usa este documento como referencia en cada petición de UI. Aplicar estas variables y convenciones garantiza consistencia con el tema Mocha Mousse de tweakcn.

---

## Identidad del Tema

| Propiedad | Valor |
|---|---|
| Nombre | Mocha Mousse |
| Origen | tweakcn.com — shadcn/ui preset |
| Inspiración | Pantone Color del Año 2025 (17-1230 Mocha Mousse) |
| Espacio de color | OKLCH |
| Stack objetivo | React + Tailwind CSS v4 + shadcn/ui |
| Tipografía | Libre — define la fuente que prefieras |
| Radio base | `0.625rem` (bordes suavemente redondeados) |

---

## Variables CSS — Modo Claro (`:root`)

Pegar en `app/globals.css` o en el archivo de estilos global del proyecto.

```css
@layer base {
  :root {
    /* Geometría */
    --radius: 0.625rem;

    /* Base */
    --background:          oklch(0.9800 0.0100  60.00);
    --foreground:          oklch(0.2500 0.0500  45.00);

    /* Tarjetas y popovers */
    --card:                oklch(1.0000 0.0000   0.00);
    --card-foreground:     oklch(0.2500 0.0500  45.00);
    --popover:             oklch(1.0000 0.0000   0.00);
    --popover-foreground:  oklch(0.2500 0.0500  45.00);

    /* Primario — café/marrón cálido tipo Mocha */
    --primary:             oklch(0.5500 0.1100  47.00);
    --primary-foreground:  oklch(0.9900 0.0050  60.00);

    /* Secundario */
    --secondary:           oklch(0.9300 0.0250  55.00);
    --secondary-foreground:oklch(0.2500 0.0500  45.00);

    /* Muted */
    --muted:               oklch(0.9400 0.0180  55.00);
    --muted-foreground:    oklch(0.5500 0.0450  50.00);

    /* Accent */
    --accent:              oklch(0.8900 0.0450  52.00);
    --accent-foreground:   oklch(0.2500 0.0500  45.00);

    /* Destructivo (errores/alertas) */
    --destructive:         oklch(0.5800 0.1900  25.00);
    --destructive-foreground: oklch(0.9900 0.0050  60.00);

    /* Bordes e inputs */
    --border:              oklch(0.8600 0.0350  52.00);
    --input:               oklch(0.9300 0.0250  55.00);
    --ring:                oklch(0.5500 0.1100  47.00);

    /* Gráficas */
    --chart-1:             oklch(0.5500 0.1100  47.00);
    --chart-2:             oklch(0.6500 0.1000  55.00);
    --chart-3:             oklch(0.7200 0.0800  60.00);
    --chart-4:             oklch(0.7900 0.0700  65.00);
    --chart-5:             oklch(0.8500 0.0500  70.00);

    /* Sidebar */
    --sidebar:             oklch(0.9500 0.0200  52.00);
    --sidebar-foreground:  oklch(0.2500 0.0500  45.00);
    --sidebar-primary:     oklch(0.5500 0.1100  47.00);
    --sidebar-primary-foreground: oklch(0.9900 0.0050  60.00);
    --sidebar-accent:      oklch(0.8900 0.0450  52.00);
    --sidebar-accent-foreground: oklch(0.2500 0.0500  45.00);
    --sidebar-border:      oklch(0.8600 0.0350  52.00);
    --sidebar-ring:        oklch(0.5500 0.1100  47.00);
  }
}
```

---

## Variables CSS — Modo Oscuro (`.dark`)

```css
@layer base {
  .dark {
    /* Base */
    --background:          oklch(0.1800 0.0200  45.00);
    --foreground:          oklch(0.9300 0.0300  55.00);

    /* Tarjetas y popovers */
    --card:                oklch(0.2100 0.0250  47.00);
    --card-foreground:     oklch(0.9300 0.0300  55.00);
    --popover:             oklch(0.2100 0.0250  47.00);
    --popover-foreground:  oklch(0.9300 0.0300  55.00);

    /* Primario — tono claro en oscuro */
    --primary:             oklch(0.8200 0.0900  55.00);
    --primary-foreground:  oklch(0.1800 0.0200  45.00);

    /* Secundario */
    --secondary:           oklch(0.3200 0.0450  47.00);
    --secondary-foreground:oklch(0.9300 0.0300  55.00);

    /* Muted */
    --muted:               oklch(0.2600 0.0350  46.00);
    --muted-foreground:    oklch(0.6500 0.0700  52.00);

    /* Accent */
    --accent:              oklch(0.3200 0.0450  47.00);
    --accent-foreground:   oklch(0.9300 0.0300  55.00);

    /* Destructivo */
    --destructive:         oklch(0.6200 0.2000  25.00);
    --destructive-foreground: oklch(0.9900 0.0050  60.00);

    /* Bordes e inputs */
    --border:              oklch(0.3200 0.0450  47.00);
    --input:               oklch(0.3200 0.0450  47.00);
    --ring:                oklch(0.8200 0.0900  55.00);

    /* Gráficas */
    --chart-1:             oklch(0.8200 0.0900  55.00);
    --chart-2:             oklch(0.6500 0.0700  52.00);
    --chart-3:             oklch(0.5500 0.0600  50.00);
    --chart-4:             oklch(0.4000 0.0450  47.00);
    --chart-5:             oklch(0.3000 0.0350  45.00);

    /* Sidebar */
    --sidebar:             oklch(0.1800 0.0200  45.00);
    --sidebar-foreground:  oklch(0.9300 0.0300  55.00);
    --sidebar-primary:     oklch(0.8200 0.0900  55.00);
    --sidebar-primary-foreground: oklch(0.1800 0.0200  45.00);
    --sidebar-accent:      oklch(0.3200 0.0450  47.00);
    --sidebar-accent-foreground: oklch(0.9300 0.0300  55.00);
    --sidebar-border:      oklch(0.3200 0.0450  47.00);
    --sidebar-ring:        oklch(0.8200 0.0900  55.00);
  }
}
```

---

## Configuración Tailwind v4 (`@theme`)

Para Tailwind CSS v4, agrega esto en tu archivo CSS principal **antes** del bloque `@layer base`:

```css
@import "tailwindcss";

@theme inline {
  --color-background:              var(--background);
  --color-foreground:              var(--foreground);
  --color-card:                    var(--card);
  --color-card-foreground:         var(--card-foreground);
  --color-popover:                 var(--popover);
  --color-popover-foreground:      var(--popover-foreground);
  --color-primary:                 var(--primary);
  --color-primary-foreground:      var(--primary-foreground);
  --color-secondary:               var(--secondary);
  --color-secondary-foreground:    var(--secondary-foreground);
  --color-muted:                   var(--muted);
  --color-muted-foreground:        var(--muted-foreground);
  --color-accent:                  var(--accent);
  --color-accent-foreground:       var(--accent-foreground);
  --color-destructive:             var(--destructive);
  --color-destructive-foreground:  var(--destructive-foreground);
  --color-border:                  var(--border);
  --color-input:                   var(--input);
  --color-ring:                    var(--ring);
  --color-chart-1:                 var(--chart-1);
  --color-chart-2:                 var(--chart-2);
  --color-chart-3:                 var(--chart-3);
  --color-chart-4:                 var(--chart-4);
  --color-chart-5:                 var(--chart-5);
  --color-sidebar:                 var(--sidebar);
  --color-sidebar-foreground:      var(--sidebar-foreground);
  --color-sidebar-primary:         var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent:          var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border:          var(--sidebar-border);
  --color-sidebar-ring:            var(--sidebar-ring);

  /* Fuente: define --font-sans y --font-mono según tu preferencia */

  --radius-sm:   calc(var(--radius) - 4px);
  --radius-md:   calc(var(--radius) - 2px);
  --radius-lg:   var(--radius);
  --radius-xl:   calc(var(--radius) + 4px);
}
```

---

## Paleta de referencia (colores clave del tema)

| Rol | Luz (aprox. hex) | Oscuro (aprox. hex) | Descripción |
|---|---|---|---|
| Primary | `#8B6045` | `#C9A882` | Marrón Mocha cálido |
| Background | `#FAF7F2` | `#2A2018` | Crema / chocolate oscuro |
| Foreground | `#3D2B1A` | `#EDE5D8` | Texto principal |
| Accent | `#DCC9B0` | `#4A3428` | Toques suaves |
| Destructive | `#C0412A` | `#D96045` | Alertas/errores |
| Border | `#CBBBA5` | `#4A3428` | Líneas divisoras |

---

## Reglas de aplicación en componentes

### 1. Fondos y superficies
- Usa `bg-background` para el cuerpo principal de la página.
- Usa `bg-card` para contenedores elevados (tarjetas, modales, popovers).
- Usa `bg-muted` para áreas secundarias (sidebars de contenido, tooltips de ayuda).
- Nunca uses colores hardcodeados (`#fff`, `gray-100`, etc.): siempre usa las variables del tema.

### 2. Textos
- Texto principal → `text-foreground`
- Texto secundario / captions → `text-muted-foreground`
- Texto sobre botón primario → `text-primary-foreground`
- Texto sobre fondo de acento → `text-accent-foreground`

### 3. Botones
- **Primario**: `bg-primary text-primary-foreground hover:bg-primary/90`
- **Secundario**: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- **Ghost**: `hover:bg-accent hover:text-accent-foreground`
- **Destructivo**: `bg-destructive text-destructive-foreground hover:bg-destructive/90`

### 4. Bordes y separadores
- Siempre `border-border` para líneas divisoras.
- Inputs y campos de formulario: `border-input`.
- Focus ring: `ring-ring` (con `focus-visible:ring-2`).

### 5. Radio de bordes
- El tema usa `--radius: 0.625rem` como base.
- Componentes pequeños (badges, chips): `rounded-sm` → `calc(var(--radius) - 4px)`
- Botones y inputs: `rounded-md` → `calc(var(--radius) - 2px)`
- Tarjetas: `rounded-lg` → `var(--radius)`
- Modales y sheets: `rounded-xl` → `calc(var(--radius) + 4px)`

### 6. Sombras
Usa sombras con matiz cálido, no grises neutros:
```css
box-shadow: 0 1px 3px oklch(0.40 0.07 47 / 0.12),
            0 1px 2px oklch(0.40 0.07 47 / 0.08);
```

### 7. Modo oscuro
- Tailwind v4: dark mode se activa con la clase `.dark` en el elemento `<html>`.
- No uses `prefers-color-scheme` directamente en componentes; deja que el sistema de clases lo maneje.
- Snippet para toggle en JS:
```js
document.documentElement.classList.toggle('dark');
```

---

## Instalación rápida vía tweakcn CLI

Si el proyecto usa el registry de tweakcn, puedes instalar el tema directamente:

```bash
npx shadcn@latest add https://tweakcn.com/api/registry/theme/mocha-mousse
```

Esto inyecta las variables automáticamente en `globals.css`.

---

## Checklist antes de entregar cualquier UI con este tema

- [ ] Las variables CSS están definidas en `:root` y `.dark`
- [ ] Se usa `@theme inline` para mapear variables a colores de Tailwind (v4)
- [ ] Ningún color está hardcodeado (sin `#hex` o `rgb()` directos en componentes)
- [ ] Fondos, textos, bordes y botones usan las clases semánticas del tema
- [ ] El radio de bordes es consistente con `--radius: 0.625rem`
- [ ] El modo oscuro está probado con la clase `.dark` en `<html>`
---

## Referencia rápida de clases Tailwind más usadas

```
bg-background      text-foreground       border-border
bg-card            text-card-foreground  border-input
bg-primary         text-primary-foreground
bg-secondary       text-secondary-foreground
bg-muted           text-muted-foreground
bg-accent          text-accent-foreground
bg-destructive     text-destructive-foreground
ring-ring          rounded-lg            shadow-sm
```