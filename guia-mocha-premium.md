# 🎨 Guía Mocha Premium --- Reglas para Aplicarlo en Todo el Proyecto

Guía práctica para mantener una estética SaaS moderna, oscura, limpia y
consistente usando tu theme.

------------------------------------------------------------------------

# 1️⃣ Reglas Base (Obligatorias)

## ✅ Nunca uses colores hardcodeados

❌ bg-white\
❌ text-black\
❌ border-gray-200

✅ bg-card\
✅ text-foreground\
✅ border-border

Todo debe salir del theme.

------------------------------------------------------------------------

## ✅ No uses colores al 100%

Siempre bajá opacidad para crear profundidad.

Ejemplos:

-   bg-card/70\
-   border-border/40\
-   bg-secondary/30\
-   text-muted-foreground/70

El look premium se logra con capas, no con colores planos.

------------------------------------------------------------------------

# 2️⃣ Jerarquía de Texto (Regla de Oro)

Nunca todo con el mismo contraste.

### Nivel 1 --- Título

    text-foreground font-semibold text-lg

### Nivel 2 --- Descripción

    text-muted-foreground text-sm

### Nivel 3 --- Meta / Fechas / Info secundaria

    text-muted-foreground/70 text-xs

------------------------------------------------------------------------

# 3️⃣ Layout Global Correcto

Siempre centrado y con aire.

``` tsx
<div className="min-h-screen bg-background">
  <main className="max-w-6xl mx-auto px-6 py-16 space-y-12">
    {children}
  </main>
</div>
```

Reglas: - max-w fijo - mx-auto - Mucho padding vertical - space-y amplio

Nada apretado.

------------------------------------------------------------------------

# 4️⃣ Cards Estilo Premium

No cajas planas. Siempre con profundidad suave.

``` tsx
<div className="
  bg-card/70
  backdrop-blur-sm
  border border-border/40
  rounded-xl
  p-6
  space-y-3
  shadow-sm
  hover:shadow-md
  transition
">
```

Claves: - Opacidad - Border sutil - Radio más grande - Sombra leve -
Hover suave

------------------------------------------------------------------------

# 5️⃣ Badges Elegantes (No Planos)

Nunca solo `bg-secondary`.

``` tsx
<span className="
  inline-block
  bg-secondary/30
  text-secondary-foreground
  border border-secondary/40
  rounded-full
  px-3
  py-1
  text-xs
">
```

Siempre: - Opacidad - Border leve - Rounded full

------------------------------------------------------------------------

# 6️⃣ Botones Estilo Mocha

Nada cuadrado y duro.

``` tsx
<button className="
  bg-primary/90
  hover:bg-primary
  text-primary-foreground
  rounded-full
  px-5
  py-2
  transition
">
```

Reglas: - rounded-full o rounded-xl - hover suave - sin sombras
exageradas

------------------------------------------------------------------------

# 7️⃣ Espaciado Premium

Usar siempre:

-   space-y-8
-   space-y-10
-   py-16
-   py-20

Lo que hace que se vea caro es el aire.

------------------------------------------------------------------------

# 8️⃣ Lo Que Nunca Debes Hacer

❌ Negro puro\
❌ Blanco puro\
❌ Bordes sólidos fuertes\
❌ Sombras grandes\
❌ Saturación alta\
❌ Todo con el mismo contraste

------------------------------------------------------------------------

# 9️⃣ Fórmula Visual Final

Si algo se ve plano, agregá:

-   /70
-   /40
-   backdrop-blur-sm
-   Más espacio
-   Mejor jerarquía de texto

------------------------------------------------------------------------

# 🔥 Resumen Mental

Capas\
Aire\
Contraste controlado\
Nada al 100%\
Nada exagerado

Si seguís estas reglas, todo tu proyecto va a mantener coherencia visual
estilo SaaS premium oscuro.
