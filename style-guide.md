# Form Builder — Style Guide
**Estética:** Warm Dark Editorial / Terracotta Noir

---

## 1. Filosofía de diseño

Todo elemento visual debe sentirse **cálido, refinado y coherente**. Nunca usar negros fríos, grises azulados, ni contrastes agresivos. El contraste existe, pero es sutil — como una sombra, no un golpe. El ojo debe moverse con naturalidad por la pantalla.

Regla de oro: **un paso, no un salto**. Cada diferencia de tono entre elementos debe ser perceptible pero no disruptiva.

---

## 2. Tokens de color

Todos los colores provienen de variables CSS. **Nunca usar valores hardcodeados** salvo las excepciones indicadas. Usar siempre las clases de Tailwind correspondientes.

### Modo oscuro (principal)

| Token | Valor OKLCH | Clase Tailwind | Uso |
|:---|:---|:---|:---|
| `--background` | `oklch(0.2721 0.0141 48.1783)` | `bg-background` | Fondo base de página |
| `--foreground` | `oklch(0.9529 0.0146 102.4597)` | `text-foreground` | Texto principal |
| `--card` | `oklch(0.3291 0.0156 50.8936)` | `bg-card` | Fondo de cards |
| `--card-foreground` | `oklch(0.9529 0.0146 102.4597)` | `text-card-foreground` | Texto dentro de cards |
| `--primary` | `oklch(0.7272 0.0539 52.3320)` | `bg-primary` / `text-primary` | Botones CTA, acentos principales |
| `--primary-foreground` | `oklch(0.2721 0.0141 48.1783)` | `text-primary-foreground` | Texto sobre fondo primary |
| `--secondary` | `oklch(0.5416 0.0512 37.2132)` | `bg-secondary` | Elementos de apoyo, fondos secundarios |
| `--muted` | `oklch(0.4063 0.0255 40.3627)` | `bg-muted` | Fondos de inputs, chips, áreas desactivadas |
| `--muted-foreground` | `oklch(0.7575 0.0380 50.8610)` | `text-muted-foreground` | Texto secundario, placeholders, labels |
| `--border` | `oklch(0.4063 0.0255 40.3627)` | `border-border` | Bordes de todos los elementos |
| `--input` | `oklch(0.4063 0.0255 40.3627)` | `bg-input` | Fondo base de inputs (usar con opacidad reducida) |
| `--ring` | `oklch(0.7272 0.0539 52.3320)` | `ring-ring` | Focus ring |
| `--destructive` | `oklch(0.6875 0.1420 21.4566)` | `text-destructive` / `bg-destructive` | Acciones destructivas (eliminar) |
| `--sidebar` | `oklch(0.2225 0.0098 52.9636)` | `bg-sidebar` | Fondo de sidebar |

### Modo claro

| Token | Valor OKLCH | Uso |
|:---|:---|:---|
| `--background` | `oklch(0.9529 0.0146 102.4597)` | Fondo cálido crema |
| `--foreground` | `oklch(0.4063 0.0255 40.3627)` | Texto oscuro terracota |
| `--primary` | `oklch(0.6083 0.0623 44.3588)` | Acento terracota medio |
| `--muted` | `oklch(0.8502 0.0389 49.0874)` | Fondos suaves |
| `--muted-foreground` | `oklch(0.5416 0.0512 37.2132)` | Texto de apoyo |

### Reglas de uso de color

- **Bordes:** siempre `border-border` con opacidad reducida. Nunca borde sólido puro.
  - Estándar: `border-border/40`
  - Sutil: `border-border/20` (separadores internos)
  - Enfocado: `border-border/60`
- **Fondos de inputs:** `bg-muted/30` o el valor hardcodeado `oklch(0.24 0.013 48)` para un paso más oscuro que la card.
- **Sombras:** usar las variables `--shadow-sm` / `--shadow-md`. Para sombras de color de marca: `shadow-primary/10`.
- **Nunca usar:** negro puro `#000`, blanco puro `#fff` fuera de `--primary-foreground`, grises azulados, o cualquier color fuera de la paleta.

---

## 3. Tipografía

### Familias

| Familia | Variable CSS | Clase Tailwind | Uso |
|:---|:---|:---|:---|
| **Source Serif 4** | `--font-serif` | `font-serif` | Títulos de página, nombres de formularios, números de stats, headings principales |
| **DM Sans** | `--font-sans` | `font-sans` | Todo el cuerpo: párrafos, labels, botones, inputs, navegación |
| **JetBrains Mono** | `--font-mono` | `font-mono` | Identificadores técnicos, IDs, código |

#| Uso | Fuente | Tamaño | Peso | Color |
|:---|:---|:---|:---|:---|
| Título de página (Hero/Editor) | serif | `text-4xl` / `text-3xl` | `font-medium` | `text-foreground` |
| Título de card / formulario | serif | `text-xl` | `font-medium` | `text-foreground` |
| Números de stats | serif | `text-4xl` | `font-medium` | `text-foreground` |
| Cuerpo / descripción | sans | `text-base` | `font-normal` | `text-foreground` |
| Labels en caps | sans | `text-[0.65rem]` | `font-medium` | `text-muted-foreground` |
| Texto secundario / subtítulos | sans | `text-sm` | `font-normal` | `text-muted-foreground` |
| Placeholder de inputs | sans | `text-sm` | `font-normal` | `text-muted-foreground/50` + `italic` |
| Texto de botones | sans | `text-sm` | `font-medium` | según variante |
| Badges / chips | sans | `text-xs` | `font-medium` | según variante |
| Identificadores / IDs | mono | `text-xs` | `font-normal` | `text-muted-foreground` |

### Labels en caps (sistema unificado)

Todos los labels de sección ("PREGUNTA", "AÑADIR CAMPO", "TOTAL FORMULARIOS", etc.) siguen este sistema exacto:

```
font-sans text-[0.65rem] font-medium tracking-[0.12em] uppercase text-muted-foreground
```

---

## 4. Componentes

### Cards

```
rounded-2xl border border-border/40 bg-gradient-to-b from-card to-muted/10 p-6
```

- Radio: siempre `rounded-2xl`
- Borde: `border border-border/40`
- Fondo: degradado sutil `from-card to-muted/10`
- Padding: `p-6` estándar, `p-4` compacto

### Inputs

```
rounded-xl border border-border/40 bg-muted/30 px-4 py-3 text-sm text-foreground
placeholder:text-muted-foreground/50 placeholder:italic focus:outline-none focus:border-border/60
```

- Sin `focus:ring`. El borde cambia de opacidad al enfocar.
- Para inputs que necesitan más contraste con la card (modo oscuro): `bg-[oklch(0.24_0.013_48)]`
- Textareas: misma clase + `min-h-[5rem] resize-none`

### Botones

**Primary (CTA principal):**
```
rounded-2xl bg-primary text-primary-foreground px-6 py-3 text-sm font-medium
shadow-[0_2px_12px_hsl(var(--primary)/0.2)] disabled:opacity-40
```

**Outline / Ghost:**
```
rounded-2xl border border-border/40 bg-transparent text-foreground px-4 py-2 text-sm font-medium
```

**Destructivo (solo icono o texto):**
```
text-destructive text-sm font-medium
```

### Badges / Pills de estado

Sistema unificado para todos los estados. Mismo radio, mismo padding, mismo tamaño en toda la app:

```
rounded-full px-3 py-1 text-xs font-medium
```

| Estado | Clases adicionales |
|:---|:---|
| Activo / Guardado | `bg-primary/20 text-primary border border-primary/30` |
| Cerrado / Inactivo | `bg-muted/40 text-muted-foreground border border-border/30` |
| Pendiente | `bg-secondary/20 text-secondary-foreground border border-secondary/30` |
| Con punto pulsante | Agregar `<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1.5">` |

### Chips de acción (barra de tipos de campo)

```
rounded-xl border border-border/30 bg-muted/20 px-3 py-1.5 text-sm text-muted-foreground
flex items-center gap-1.5
```

### Estado vacío (empty state)

Patrón unificado para toda la app (sin respuestas, sin preguntas, etc.):

```jsx
<div className="rounded-2xl border border-border/40 bg-linear-to-b from-card to-muted/10 p-12 text-center">
  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
    {/* Ícono contextual, tamaño 2rem, color text-muted-foreground */}
  </div>
  <h2 className="font-serif text-xl font-medium text-foreground mb-2">
    Título contextual
  </h2>
  <p className="text-sm text-muted-foreground">
    Subtítulo explicativo.
  </p>
</div>
```

### Separadores internos

```
border-border/20
```
Nunca usar separadores más oscuros. La separación debe ser casi imperceptible.

---

## 5. Espaciado y layout

- **Base de espaciado:** `--spacing: 0.25rem` (escala de 4px)
- **Contenedor principal:** `max-w-4xl mx-auto w-full` para páginas de contenido
- **Gap entre secciones:** `gap-8` / `space-y-8`
- **Gap entre cards de stats:** `gap-4`
- **Padding de página:** `py-8 px-4` o `py-5` según contexto

---

## 6. Border radius

| Clase | Valor | Uso |
|:---|:---|:---|
| `rounded-sm` | `calc(0.5rem - 4px)` | Muy pequeño, casi sin radio |
| `rounded-md` | `calc(0.5rem - 2px)` | Elementos compactos |
| `rounded-lg` | `0.5rem` | Default del sistema |
| `rounded-xl` | `calc(0.5rem + 4px)` | Inputs, chips |
| `rounded-2xl` | `1rem` aprox. | Cards, botones principales, burbujas |
| `rounded-full` | `9999px` | Badges, pills, avatares, chips de estado |

**Regla:** cards siempre `rounded-2xl`, botones CTA `rounded-2xl`, inputs `rounded-xl`, badges `rounded-full`.

---

## 7. Sombras

Usar las variables del sistema. Nunca sombras personalizadas salvo la excepción del botón primary.

```
shadow-sm   → elementos sutiles
shadow-md   → cards con elevación
shadow-[0_2px_12px_hsl(var(--primary)/0.2)]  → botón primary únicamente
```

---

## 8. Patrones de jerarquía visual

### Pregunta / Respuesta (tabla de submissions)
- Pregunta: `text-muted-foreground font-normal`
- Respuesta: `text-foreground font-medium`

### Header interno de submission
- Fondo: `bg-muted/15`
- Padding: `px-4 py-3`

### Contador de submissions
- `text-sm text-muted-foreground` sin caps ni tracking especial

---

## 9. Lo que nunca hacer

- ❌ Bordes sólidos sin opacidad (`border-border` sin `/XX`)
- ❌ `focus:ring` en inputs — usar cambio de opacidad en borde
- ❌ Negro puro o blanco puro fuera de los tokens
- ❌ Grises azulados o neutros fríos
- ❌ `rounded-lg` en cards — siempre `rounded-2xl`
- ❌ Texto en caps sin el sistema de label (`text-[0.65rem] tracking-[0.12em]`)
- ❌ Sombras sin color de marca
- ❌ Hovers en prompts de rediseño (complican la lectura del código)
- ❌ Valores hardcodeados de color salvo `oklch(0.24 0.013 48)` para inputs en dark mode

---

## 10. Checklist antes de entregar cualquier componente

- [ ] ¿Los títulos principales están en `font-serif`?
- [ ] ¿Los labels en caps siguen el sistema (`text-[0.65rem] tracking-[0.12em]`)?
- [ ] ¿Los bordes tienen opacidad reducida (`/40` o menos)?
- [ ] ¿Las cards tienen `rounded-2xl` y degradado sutil?
- [ ] ¿Los inputs tienen placeholder en italic y muted/50?
- [ ] ¿Los badges siguen el sistema unificado de pills?
- [ ] ¿El estado vacío sigue el patrón con círculo + serif + muted?
- [ ] ¿Ningún color es hardcodeado fuera de las excepciones permitidas?
con círculo + serif + muted?
- [ ] ¿Ningún color es hardcodeado fuera de las excepciones permitidas?