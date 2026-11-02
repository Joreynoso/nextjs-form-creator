"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, animate, motion } from "framer-motion"
import { interpolate } from "flubber"
import { cn } from "@/lib/utils"
import { BRAND_F_PATH } from "./brand-mark"

const PATHS = [
    "M12,12 L12.01,12 L12,12.01 Z",
    "M12,2 L22,21 L2,21 Z",
    "M12,2 C17.523,2 22,6.477 22,12 C22,17.523 17.523,22 12,22 C6.477,22 2,17.523 2,12 C2,6.477 6.477,2 12,2 Z",
    "M12,1 L23,12 L12,23 L1,12 Z",
    BRAND_F_PATH,
]

const FRAME_MS = 650
const HOLD_MS = 1100

export const FORM_LOADER_CYCLE_MS =
    FRAME_MS * (PATHS.length - 1) + HOLD_MS

export function FormLoader({
    size = 32,
    className,
    captions,
}: {
    size?: number
    className?: string
    captions?: readonly string[]
}) {
    const pathRef = useRef<SVGPathElement>(null)
    const prev = useRef(0)
    const [frame, setFrame] = useState(0)

    useEffect(() => {
        const t = setTimeout(
            () => setFrame((f) => (f + 1) % PATHS.length),
            frame === PATHS.length - 1 ? HOLD_MS : FRAME_MS,
        )
        return () => clearTimeout(t)
    }, [frame])

    useEffect(() => {
        const morph = interpolate(PATHS[prev.current], PATHS[frame], {
            maxSegmentLength: 1.5,
        })
        const controls = animate(0, 1, {
            duration: 0.5,
            ease: [0.65, 0, 0.35, 1],
            onUpdate: (t) => pathRef.current?.setAttribute("d", morph(t)),
        })
        prev.current = frame
        return () => controls.stop()
    }, [frame])

    const caption = captions?.[frame]

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={caption ? undefined : "Cargando"}
            className={cn("flex flex-col items-center gap-4", className)}
        >
            <span
                aria-hidden
                style={{ width: size, height: size }}
                className="grid place-items-center rounded-badge bg-brand-yellow text-on-yellow"
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

            {caption ? (
                <p className="min-h-5 text-center text-body-sm font-medium text-slate">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={frame}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="inline-block"
                        >
                            {caption}
                        </motion.span>
                    </AnimatePresence>
                </p>
            ) : null}
        </div>
    )
}
