import { ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative flex min-h-[calc(100vh-125px)] items-center justify-center overflow-hidden px-6 bg-background">



      {/* Border Top Divider (para sustituir la malla si queda muy vacío) */}
      <div className="absolute top-0 left-0 w-full h-px bg-border/20" />

      <div className="max-w-4xl text-center">

        {/* Badge */}
        <Badge
          asChild
          variant="outline"
          className="rounded-md border-border bg-background backdrop-blur-sm px-4 py-1 transition-colors hover:bg-background"
        >
          <Link href="#" className="flex items-center gap-2 text-xs font-medium uppercase tracking-tight">
            <Sparkles className="size-3 text-primary" />
            <span>¡Lanzamiento v1.0.0!</span>
            <ArrowRight className="size-3" />
          </Link>
        </Badge>

        {/* Heading */}
        <h1 className="mt-12 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-balance text-foreground">
          Crea y Comparte{" "}
          <br className="hidden sm:block" />
          <span className="text-primary font-serif italic">
            Formularios
          </span>{" "}
          de Manera Sencilla
        </h1>

        {/* Description */}
        <p className="mx-auto mt-10 max-w-2xl font-sans text-muted-foreground text-lg md:text-xl leading-relaxed">
          Diseña interfaces intuitivas sin conocimientos técnicos. Agrega campos, valida datos y personaliza cada detalle en segundos.
        </p>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-10 text-base font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
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
