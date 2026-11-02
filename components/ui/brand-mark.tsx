import { cn } from "@/lib/utils"

export const BRAND_F_PATH =
    "M4,2 L21,2 L21,8 L19,8 L18.5,5 L11,5 L11,10 L16,10 L16,13 L11,13 L11,19 L14,19.5 L14,22 L4,22 L4,19.5 L7,19 L7,5 L4,4.5 Z"

export function BrandMark({
    size = 32,
    className,
}: {
    size?: number
    className?: string
}) {
    return (
        <span
            aria-hidden
            style={{ width: size, height: size }}
            className={cn(
                "grid place-items-center rounded-badge bg-brand-yellow text-on-yellow",
                className
            )}
        >
            <svg
                width={size * 0.5}
                height={size * 0.5}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
            >
                <path d={BRAND_F_PATH} />
            </svg>
        </span>
    )
}
