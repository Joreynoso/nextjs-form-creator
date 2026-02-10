import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative flex min-h-[calc(100vh-125px)] items-center justify-center overflow-hidden px-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary)_0%,transparent_100%)] opacity-[0.03] dark:opacity-[0.07]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.15] dark:opacity-[0.1]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 text-center">
        <Badge
          asChild
          className="rounded-full border-border/50 bg-background/50 backdrop-blur-sm px-4 py-1 hover:bg-background/80 transition-colors"
          variant="outline"
        >
          <Link href="#" className="flex items-center gap-2 text-xs font-medium">
            <Sparkles className="size-3 text-primary" />
            <span>¡Lanzamiento v1.0.0!</span>
            <ArrowRight className="size-3 opacity-50" />
          </Link>
        </Badge>

        <h1 className="mt-8 font-serif font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1]">
          Crea y Comparte <br className="hidden sm:block" />
          <span className="relative inline-block">
            <span className="relative z-10 text-primary italic">Formularios</span>
            <span className="absolute bottom-2 left-0 h-3 w-full bg-primary/10 -z-10 rounded-full blur-sm" />
          </span> de Manera Sencilla
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-muted-foreground/90 text-lg md:text-xl leading-relaxed">
          Diseña interfaces intuitivas sin conocimientos técnicos. Agrega campos, valida datos y personaliza cada detalle en segundos.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={'/dashboard'} >
            <Button className="h-12 rounded-full px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" size="lg">
              Empezar ahora <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link> 
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-muted-foreground grayscale opacity-50 select-none">
          <span className="text-sm font-semibold tracking-widest uppercase">Trusted</span>
          <span className="text-sm font-semibold tracking-widest uppercase">Simple</span>
          <span className="text-sm font-semibold tracking-widest uppercase">Fast</span>
        </div>
      </div>
    </div>
  );
}
