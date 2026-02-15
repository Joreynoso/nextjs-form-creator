import { ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative flex min-h-[calc(100vh-125px)] items-center justify-center overflow-hidden px-6 bg-background">

      {/* Radial Light */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_50%_0%,var(--primary)_0%,transparent_100%)] opacity-[0.04] dark:opacity-[0.08]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.12] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-4xl text-center">

        {/* Badge */}
        <Badge
          asChild
          variant="outline"
          className="rounded-full border-border/50 bg-background/60 backdrop-blur-sm px-4 py-1 transition-colors hover:bg-background/80"
        >
          <Link href="#" className="flex items-center gap-2 text-xs font-medium">
            <Sparkles className="size-3 text-primary" />
            <span>¡Lanzamiento v1.0.0!</span>
            <ArrowRight className="size-3 opacity-50" />
          </Link>
        </Badge>

        {/* Heading */}
        <h1 className="mt-12 font-serif font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-balance">
          Crea y Comparte{" "}
          <br className="hidden sm:block" />
          <span className="bg-linear-to-b from-primary to-foreground/60 bg-clip-text text-transparent">
            Formularios
          </span>{" "}
          de Manera Sencilla
        </h1>

        {/* Description */}
        <p className="mx-auto mt-10 max-w-2xl text-muted-foreground/80 text-lg md:text-xl leading-relaxed">
          Diseña interfaces intuitivas sin conocimientos técnicos. Agrega campos, valida datos y personaliza cada detalle en segundos.
        </p>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 text-base font-medium transition-all shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              Empezar ahora
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
