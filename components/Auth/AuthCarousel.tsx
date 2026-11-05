'use client'

import { useEffect, useState } from 'react'
import { BarChart3, ChevronLeft, ChevronRight, Sparkles, Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const AUTO_ADVANCE_MS = 6500

const slides = [
    {
        id: 'builder',
        number: '01',
        label: 'Editor visual',
        icon: Wand2,
        tone: 'bg-yellow-light',
        content: <BuilderWireframe />,
    },
    {
        id: 'assistant',
        number: '02',
        label: 'Asistente IA',
        icon: Sparkles,
        tone: 'bg-coral-light',
        content: <AssistantWireframe />,
    },
    {
        id: 'analytics',
        number: '03',
        label: 'Analítica en vivo',
        icon: BarChart3,
        tone: 'bg-teal-light',
        content: <AnalyticsWireframe />,
    },
]

export function AuthCarousel() {
    const [index, setIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (isPaused) return
        if (
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return
        }

        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % slides.length)
        }, AUTO_ADVANCE_MS)

        return () => window.clearInterval(timer)
    }, [index, isPaused])

    const goTo = (nextIndex: number) => {
        setIndex((nextIndex + slides.length) % slides.length)
    }

    return (
        <aside className="relative hidden h-full flex-1 flex-col overflow-hidden border-l border-hairline bg-surface-soft lg:flex lg:w-[60%]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, var(--ds-hairline) 1px, transparent 0)',
                    backgroundSize: '22px 22px',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-32 -top-40 size-96 rounded-pill bg-brand-yellow/10 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-44 -left-24 size-[28rem] rounded-pill bg-brand-blue/5 blur-3xl"
            />

            <div className="relative flex h-full w-full items-center justify-center px-8 py-10 xl:px-16">
                <div className="w-full max-w-4xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-canvas px-3 py-1 text-caption font-semibold text-steel">
                            <span className="size-1.5 rounded-pill bg-brand-yellow" />
                            Constructor de formularios con IA
                        </span>

                        <h2 className="mt-5 text-heading-2 font-medium tracking-tight text-ink xl:text-heading-1">
                            Crea formularios que da gusto responder.
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-subtitle text-slate">
                            Diseña, publica y entiende cada formulario en un solo espacio.
                        </p>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carrusel"
                        aria-label="Destacados del producto"
                        className="mt-9"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="overflow-hidden rounded-banner border border-hairline-soft bg-canvas shadow-mockup">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${index * 100}%)` }}
                            >
                                {slides.map((slide) => {
                                    const Icon = slide.icon

                                    return (
                                        <div
                                            key={slide.id}
                                            className="w-full shrink-0 p-4 sm:p-6"
                                        >
                                            <div
                                                className={cn(
                                                    'relative h-[320px] overflow-hidden rounded-feature-card p-5 sm:h-[360px] sm:p-7 xl:h-[400px]',
                                                    slide.tone
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center gap-1.5 rounded-pill bg-canvas/80 px-3 py-1 text-caption font-semibold text-ink backdrop-blur">
                                                        <Icon className="size-3.5" />
                                                        {slide.label}
                                                    </span>
                                                    <span className="text-micro font-medium text-ink/40">
                                                        {slide.number} / 03
                                                    </span>
                                                </div>

                                                <div className="mt-5 h-[calc(100%_-_3.25rem)]">
                                                    {slide.content}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <p className="sr-only" aria-live="polite">
                            Diapositiva {index + 1} de {slides.length}: {slides[index].label}
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon-sm"
                                onClick={() => goTo(index - 1)}
                                aria-label="Diapositiva anterior"
                            >
                                <ChevronLeft className="size-4" />
                            </Button>

                            <div className="flex items-center">
                                {slides.map((slide, slideIndex) => (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        onClick={() => goTo(slideIndex)}
                                        aria-label={`Ir a ${slide.label}`}
                                        aria-current={slideIndex === index ? 'true' : undefined}
                                        className="grid size-8 place-items-center"
                                    >
                                        <span
                                            className={cn(
                                                'h-1.5 rounded-pill transition-all duration-300',
                                                slideIndex === index
                                                    ? 'w-6 bg-primary'
                                                    : 'w-1.5 bg-hairline-strong'
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="secondary"
                                size="icon-sm"
                                onClick={() => goTo(index + 1)}
                                aria-label="Diapositiva siguiente"
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

function BuilderWireframe() {
    return (
        <div className="flex h-full gap-3 sm:gap-4">
            <div className="hidden w-20 shrink-0 flex-col gap-2 rounded-panel border border-hairline-soft bg-canvas/70 p-3 sm:flex">
                <div className="size-6 rounded-chip bg-brand-yellow" />
                {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                        <div className="size-4 rounded-chip bg-ink/10" />
                        <div className="h-1.5 flex-1 rounded-pill bg-ink/10" />
                    </div>
                ))}
                <div className="mt-auto h-8 rounded-input border border-dashed border-ink/15" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col rounded-panel border border-hairline-soft bg-canvas p-3 shadow-card sm:p-4">
                <div className="flex items-center justify-between">
                    <div className="h-2.5 w-20 rounded-pill bg-ink/70" />
                    <div className="flex gap-1">
                        <div className="size-2 rounded-pill bg-ink/15" />
                        <div className="size-2 rounded-pill bg-ink/15" />
                        <div className="size-2 rounded-pill bg-ink/15" />
                    </div>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="h-1.5 w-28 rounded-pill bg-ink/15" />
                    <div className="h-7 rounded-input border border-hairline bg-surface-soft sm:h-8" />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="h-1.5 w-20 rounded-pill bg-ink/15" />
                    <div className="h-7 rounded-input border border-hairline bg-surface-soft sm:h-8" />
                </div>

                <div className="mt-3 flex flex-1 gap-2">
                    <div className="flex-1 rounded-input border border-hairline bg-surface-soft" />
                    <div className="w-1/3 rounded-input border border-dashed border-brand-blue/40 bg-brand-blue/5" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <div className="h-1.5 w-16 rounded-pill bg-ink/10" />
                    <div className="h-7 w-20 rounded-pill bg-primary sm:h-8" />
                </div>
            </div>
        </div>
    )
}

function AssistantWireframe() {
    return (
        <div className="flex h-full flex-col rounded-panel border border-hairline-soft bg-canvas p-3 shadow-card sm:p-4">
            <div className="flex items-center gap-2 border-b border-hairline-soft pb-3">
                <span className="grid size-7 place-items-center rounded-pill bg-brand-yellow text-on-yellow">
                    <Sparkles className="size-3.5" />
                </span>
                <div className="h-1.5 w-24 rounded-pill bg-ink/20" />
                <div className="ml-auto flex gap-1">
                    <div className="size-1.5 rounded-pill bg-ink/15" />
                    <div className="size-1.5 rounded-pill bg-ink/15" />
                    <div className="size-1.5 rounded-pill bg-ink/15" />
                </div>
            </div>

            <div className="mt-3 flex flex-1 flex-col gap-2.5 overflow-hidden">
                <div className="ml-auto max-w-[78%] rounded-panel rounded-br-chip bg-primary px-3 py-2">
                    <div className="h-1.5 w-24 rounded-pill bg-primary-foreground/80" />
                    <div className="mt-1.5 h-1.5 w-16 rounded-pill bg-primary-foreground/40" />
                </div>

                <div className="max-w-[88%] rounded-panel rounded-bl-chip border border-hairline-soft bg-surface-soft p-2.5">
                    <div className="grid grid-cols-2 gap-1.5">
                        {[0, 1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-6 rounded-input border border-hairline bg-canvas sm:h-7"
                            />
                        ))}
                    </div>
                    <div className="mt-1.5 h-6 rounded-input border border-dashed border-brand-blue/30 bg-brand-blue/5" />
                </div>

                <div className="flex items-center gap-1.5 self-start rounded-pill border border-hairline bg-canvas px-2.5 py-1">
                    <div className="size-1.5 rounded-pill bg-brand-teal" />
                    <div className="h-1.5 w-12 rounded-pill bg-ink/15" />
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-pill border border-hairline bg-surface-soft px-3 py-2">
                <div className="h-1.5 flex-1 rounded-pill bg-ink/10" />
                <div className="grid size-6 place-items-center rounded-pill bg-brand-yellow text-on-yellow">
                    <Sparkles className="size-3" />
                </div>
            </div>
        </div>
    )
}

function AnalyticsWireframe() {
    const bars = [42, 64, 52, 78, 58, 88, 70]

    return (
        <div className="flex h-full flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
                {['1,248', '86%', '4.9'].map((value) => (
                    <div
                        key={value}
                        className="rounded-panel border border-hairline-soft bg-canvas p-2.5 shadow-subtle"
                    >
                        <div className="h-1.5 w-8 rounded-pill bg-ink/15" />
                        <p className="mt-1.5 text-body-sm font-medium text-ink">{value}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-1 items-end gap-1.5 rounded-panel border border-hairline-soft bg-canvas p-3 shadow-card sm:gap-2 sm:p-4">
                {bars.map((height, barIndex) => (
                    <div key={barIndex} className="flex h-full flex-1 items-end">
                        <div
                            className={cn(
                                'w-full rounded-t-chip',
                                barIndex === 5
                                    ? 'bg-brand-teal'
                                    : barIndex % 2 === 0
                                      ? 'bg-brand-blue/70'
                                      : 'bg-brand-yellow'
                            )}
                            style={{ height: `${height}%` }}
                        />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between rounded-panel border border-hairline-soft bg-canvas px-3 py-2">
                <div className="h-1.5 w-20 rounded-pill bg-ink/15" />
                <div className="flex -space-x-1.5">
                    {[0, 1, 2].map((avatar) => (
                        <div
                            key={avatar}
                            className="size-4 rounded-pill border border-canvas bg-ink/15"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
