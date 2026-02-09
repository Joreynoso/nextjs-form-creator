import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="flex min-h-[calc(100vh-125px)] items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <Badge
          asChild
          className="rounded-full border-border py-1"
          variant="secondary"
        >
          <Link href="#">
            ¡Lanzamiento v1.0.0! <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-source-serif">
          Crea Formularios de Manera Sencilla
        </h1>
        <p className="mt-6 text-foreground/80 md:text-lg">
          Crea formularios de manera sencilla y rápida, con una interfaz intuitiva y amigable, sin necesidad de conocimientos técnicos, agrega campos, valida datos, personaliza el diseño y comparte tus formularios con el mundo.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button className="rounded-full text-base" size="lg">
            Comenzar <ArrowUpRight className="size-5" />
          </Button>
          <Button
            className="rounded-full text-base shadow-none hover:text-primary"
            size="lg"
            variant="outline"
          >
            <CirclePlay className="size-5" /> Ver Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
