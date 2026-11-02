# Morph del badge de carga: instrucciones

Pasos para recrear solo la animación morph: un cuadrado amarillo fijo en el que un punto se transforma en triángulo, círculo, rombo y F, en bucle.

## 1. Instalar dependencias

```bash
npm install framer-motion flubber
npm install -D @types/flubber
```

## 2. Cómo funciona

- El cuadrado amarillo con bordes redondeados nunca cambia.
- Hay cinco estados definidos como paths SVG en un `viewBox` de 24×24: punto, triángulo, círculo, rombo y F.
- `flubber` genera la interpolación entre dos paths y `animate` de `framer-motion` controla el tiempo y la curva. En cada fotograma se actualiza el atributo `d` del `<path>`.
- Cada 650 ms se pasa al siguiente estado; la F se mantiene 1100 ms y luego el ciclo vuelve al punto.

## 3. Componente

Crea `form-loader.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { interpolate } from "flubber";

// viewBox 24x24: punto, triángulo, círculo, rombo, F
const PATHS = [
    "M12,12 L12.01,12 L12,12.01 Z",
    "M12,2 L22,21 L2,21 Z",
    "M12,2 C17.523,2 22,6.477 22,12 C22,17.523 17.523,22 12,22 C6.477,22 2,17.523 2,12 C2,6.477 6.477,2 12,2 Z",
    "M12,1 L23,12 L12,23 L1,12 Z",
    "M4,2 L21,2 L21,8 L19,8 L18.5,5 L11,5 L11,10 L16,10 L16,13 L11,13 L11,19 L14,19.5 L14,22 L4,22 L4,19.5 L7,19 L7,5 L4,4.5 Z",
];

const FRAME_MS = 650;
const HOLD_MS = 1100;

export function FormLoader({ size = 32 }: { size?: number }) {
    const pathRef = useRef<SVGPathElement>(null);
    const prev = useRef(0);
    const [frame, setFrame] = useState(0);

    // Avanza al siguiente estado en bucle
    useEffect(() => {
        const t = setTimeout(
            () => setFrame((f) => (f + 1) % PATHS.length),
            frame === PATHS.length - 1 ? HOLD_MS : FRAME_MS,
        );
        return () => clearTimeout(t);
    }, [frame]);

    // Transforma el path anterior en el nuevo
    useEffect(() => {
        const morph = interpolate(PATHS[prev.current], PATHS[frame], {
            maxSegmentLength: 1.5,
        });
        const controls = animate(0, 1, {
            duration: 0.5,
            ease: [0.65, 0, 0.35, 1],
            onUpdate: (t) => pathRef.current?.setAttribute("d", morph(t)),
        });
        prev.current = frame;
        return () => controls.stop();
    }, [frame]);

    return (
        <span
            role="status"
            aria-label="Cargando"
            style={{ width: size, height: size }}
            className="grid place-items-center rounded-badge bg-brand-yellow text-ink"
        >
            <svg
                width={size * 0.5}
                height={size * 0.5}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
            >
                <path ref={pathRef} d={PATHS[0]} />
            </svg>
        </span>
    );
}
```

## 4. Uso

```tsx
import { FormLoader } from "./form-loader";

<FormLoader />          // 32px, tamaño del logo
<FormLoader size={64} /> // más grande
```

## 5. Ajustes

- **Velocidad de la transformación:** `duration` dentro de `animate` (0.5 s por defecto). Más alto es más lento.
- **Tiempo entre formas:** `FRAME_MS`; tiempo que se queda la F: `HOLD_MS`.
- **Curva de movimiento:** `ease` acepta una curva Bezier `[x1, y1, x2, y2]` o valores como `"easeInOut"`.
- **Suavidad de los bordes:** `maxSegmentLength` en `interpolate`. Un valor más bajo da curvas más suaves y más trabajo de cálculo.
- **Color de la forma:** la clase `text-ink` del contenedor (usa `currentColor`).
- **Forma de la F:** edita el último path de `PATHS`. Debe estar dentro del `viewBox` de 24×24.
