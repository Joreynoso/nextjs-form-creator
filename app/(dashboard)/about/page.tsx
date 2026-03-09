import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import TechCard from "@/components/About/TechCard"

// ── SVG icons ────────────────────────────────────────────────
const NextjsIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6H36.5V36.6h13.7l40.5 62.4C99.4 90.6 107 78.2 107 64c0-23.7-15.5-43.8-36.9-50.8L64 0z" />
        <path d="M91.4 36.6h11.4V91L91.4 74V36.6z" />
    </svg>
)

const ReactIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <circle cx="64" cy="64" r="11" />
        <path d="M64 30c-19.8 0-38 4.9-51.4 13C5.9 48.5 2 54.6 2 61s3.9 12.5 10.6 18c13.4 8.1 31.6 13 51.4 13s38-4.9 51.4-13C122.1 73.5 126 67.4 126 61s-3.9-12.5-10.6-18C102 34.9 83.8 30 64 30zm0 6c18.6 0 35.7 4.6 47.8 12 5.9 3.6 8.2 7.3 8.2 11s-2.3 7.4-8.2 11C99.7 77.4 82.6 82 64 82S28.3 77.4 16.2 70C10.3 66.4 8 62.7 8 59s2.3-7.4 8.2-11C28.3 40.6 45.4 36 64 36z" />
        <path d="M42.6 15.9C33.3 31.7 28 51.7 28 73s5.3 41.3 14.6 57.1c4.6 8 9.8 13.5 14.9 15.9 2.5 1.2 4.9 1.5 7 1s4.3-1.9 6.4-4.6c4.6-5.8 8.4-15.4 10.8-27.7C83.8 102.8 85 88.3 85 73s-1.2-29.8-3.3-41.7C79.3 19.1 75.5 9.5 70.9 3.7c-2.1-2.7-4.3-4.1-6.4-4.6s-4.5-.2-7 1C52.4 2.5 47.2 7.9 42.6 15.9zm5.2 3c4-6.9 8.3-11.3 12-13.1 1.8-.9 3.3-1.1 4.6-.8 1.3.3 2.9 1.3 4.6 3.5 3.9 4.9 7.4 13.8 9.6 25.6 2.1 11.7 3.3 26 3.3 40.9s-1.2 29.2-3.3 40.9c-2.2 11.8-5.7 20.7-9.6 25.6-1.7 2.2-3.3 3.2-4.6 3.5-1.3.3-2.8.1-4.6-.8-3.7-1.8-8-6.2-12-13.1C37.7 118.8 34 99.3 34 79s3.7-39.8 13.8-60.1z" />
    </svg>
)

const TypeScriptIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <path d="M74.2 73.4v7.2c1.2.6 2.6 1.1 4.1 1.4 1.5.3 3.1.5 4.7.5 1.6 0 3.1-.2 4.5-.5 1.4-.3 2.6-.9 3.6-1.7 1-.8 1.8-1.8 2.4-3 .6-1.2.9-2.7.9-4.4 0-1.3-.2-2.4-.6-3.3-.4-.9-1-1.8-1.7-2.5-.7-.7-1.6-1.4-2.7-2-1-.6-2.2-1.2-3.5-1.8-1-.4-1.8-.8-2.6-1.2-.7-.4-1.3-.7-1.8-1.1-.5-.4-.9-.8-1.1-1.2-.3-.4-.4-.9-.4-1.5 0-.5.1-1 .4-1.4.2-.4.6-.8 1-1.1.4-.3.9-.5 1.5-.7.6-.2 1.2-.2 1.9-.2 1.3 0 2.5.2 3.7.7 1.2.5 2.2 1.2 3.1 2.1V59c-.9-.7-2-1.3-3.2-1.6-1.2-.4-2.6-.6-4.1-.6-1.6 0-3 .2-4.4.6-1.3.4-2.5 1-3.5 1.8-1 .8-1.7 1.8-2.3 2.9-.6 1.1-.8 2.4-.8 3.8 0 2.4.7 4.4 2.2 5.9 1.5 1.5 3.7 2.8 6.7 3.9 1 .4 2 .8 2.8 1.2.8.4 1.5.8 2 1.3.5.4.9.9 1.2 1.4.3.5.4 1.1.4 1.8 0 .6-.1 1.1-.3 1.6-.2.5-.6.9-1 1.2-.4.3-1 .6-1.6.8-.6.2-1.3.3-2.1.3-2.7 0-5.3-1-7.7-3zM60 57.6H71V51H41v6.6h11v31.8h8V57.6z" />
    </svg>
)

const PrismaIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <path d="M4.12 101.77 60.42 4.6a4.17 4.17 0 0 1 7.42.54l55.93 97.17a4.17 4.17 0 0 1-3.22 6.2L64.8 114.4a4.17 4.17 0 0 1-2.62-.74L7.4 108.03a4.17 4.17 0 0 1-3.28-6.26zM30.63 99.3l47.31 7.28L64.2 22.15 30.63 99.3z" />
    </svg>
)

const PostgreSQLIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <path d="M93.8 24.6c-5.5-1.9-11.9-2.6-18.1-1.9 2.7-4.4 5.8-8.4 9.4-11.8-11-4.2-23.6-3.1-33.8 2.9C41.2 8.5 28.6 8.3 18 13.8l1.4 2.8C12.8 22 8.4 30.1 7 39.1c-1.5 9.2.4 18.7 5.3 26.4 2.9 4.6 7 8.4 11.8 10.8l.5.3c-.6 2.4-1 4.9-1.2 7.4-.5 8.7 2.1 17 7.7 22.8 5.3 5.6 13 8.3 21.4 7.1 3.6-.5 7.3-1.8 10.9-3.9 1.4.8 2.8 1.5 4.3 2.1 6.4 2.5 13.4 2.5 19.4-.2 8.5-3.8 14.4-11.8 16-21.8.8-4.9.6-10-.3-14.9 5.4-3.5 9.5-8.6 11.4-14.5 2.1-6.6 1.5-14.3-1.7-21.1-3.2-6.7-8.7-12.3-15.4-15.8" />
        <path d="M74.7 26a37.4 37.4 0 0 0-17.3.3c-9.7 2.6-17.6 9.1-21.9 17.7-2.5 5-3.7 10.6-3.7 16.3 0 3.9.6 7.8 1.8 11.5l.3.9-.9.1c-4.1.4-7.9-1.3-10.2-4.5-1.5-2.1-2.2-4.8-2.2-7.6-.1-4.1 1.4-8.1 4.2-11.2-1.9 10.9 2.2 22.1 10.9 29.1 1.9 1.5 4 2.7 6.3 3.5-.4 1.7-.9 3.4-1.5 5.1-2 6-5.1 11.5-9 16.1 5.1-1.9 9.7-5.1 13.3-9.3 2-2.2 3.6-4.8 4.8-7.5 1.8.2 3.6.3 5.4.1-1.3 3.8-2 7.8-2.1 11.8 0 3.7.5 7.4 1.6 10.9 2 6.2 6.1 11 11.6 13.1 5.5 2.1 11.9 1.3 17-2.1 5.1-3.4 8.4-9.2 9-15.8.3-3.2.1-6.4-.6-9.5-.6-2.9-1.4-5.6-2.4-8.3 4-1.2 7.6-3.5 10.2-6.7 3.9-4.7 5.6-11 4.7-17.1C103.3 53 98.4 44 90.9 39c-4.6-3.1-10.1-4.7-15.9-5" fillOpacity=".6" />
    </svg>
)

const ClerkIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <circle cx="64" cy="64" r="64" />
        <path d="M82 48.4a26 26 0 1 1-36.8 36.8A26 26 0 0 1 82 48.4z" fillOpacity=".3" />
        <circle cx="64" cy="64" r="16" fillOpacity=".8" />
        <path d="M87.5 40.5 94 34a44 44 0 0 1 0 60L87.5 87.5A34 34 0 0 0 87.5 40.5z" fillOpacity=".6" />
    </svg>
)

const TailwindIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <path d="M64 16c-16 0-26 8-30 24 6-8 13-11 21-9 5 1 8 4 12 8 6 6 12 13 26 13 16 0 26-8 30-24-6 8-13 11-21 9-5-1-8-4-12-8-6-6-12-13-26-13zm-32 32C16 48 6 56 2 72c6-8 13-11 21-9 5 1 8 4 12 8 6 6 12 13 26 13 16 0 26-8 30-24-6 8-13 11-21 9-5-1-8-4-12-8-6-6-12-13-26-13z" />
    </svg>
)

const ShadcnIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <path d="M107.5 20.5 20.5 107.5M67.5 107.5 107.5 60.5" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
    </svg>
)

const SonnerIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <rect x="16" y="72" width="96" height="40" rx="8" />
        <rect x="24" y="52" width="80" height="33" rx="6" fillOpacity=".5" />
        <rect x="32" y="32" width="64" height="33" rx="6" fillOpacity=".25" />
    </svg>
)

const LucideIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="64" cy="64" r="40" />
        <line x1="64" y1="24" x2="64" y2="40" />
        <line x1="64" y1="88" x2="64" y2="104" />
        <line x1="24" y1="64" x2="40" y2="64" />
        <line x1="88" y1="64" x2="104" y2="64" />
    </svg>
)

const VercelIcon = () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5" fill="currentColor">
        <path d="M64 8 120 104H8z" />
    </svg>
)

// ── Tech stack data ───────────────────────────────────────────
const techStack = [
    {
        name: "Next.js 16",
        description: "Framework de React con App Router, Server Components y renderizado híbrido.",
        icon: <NextjsIcon />,
        color: "bg-white/5",
    },
    {
        name: "React 19",
        description: "Librería UI con las últimas APIs: use(), Server Actions y streaming.",
        icon: <ReactIcon />,
        color: "bg-cyan-500/10",
    },
    {
        name: "TypeScript",
        description: "Tipado estático para un código más robusto y mantenible.",
        icon: <TypeScriptIcon />,
        color: "bg-blue-500/10",
    },
    {
        name: "Prisma ORM",
        description: "ORM type-safe para modelado de datos y queries con PostgreSQL.",
        icon: <PrismaIcon />,
        color: "bg-indigo-500/10",
    },
    {
        name: "PostgreSQL",
        description: "Base de datos relacional robusta con soporte de JSON y conexión via pg.",
        icon: <PostgreSQLIcon />,
        color: "bg-blue-700/10",
    },
    {
        name: "Clerk",
        description: "Autenticación completa con usuarios, sesiones y middleware de protección.",
        icon: <ClerkIcon />,
        color: "bg-violet-500/10",
    },
    {
        name: "Tailwind CSS v4",
        description: "Utility-first CSS con la nueva engine de Oxide y diseño token-based.",
        icon: <TailwindIcon />,
        color: "bg-sky-500/10",
    },
    {
        name: "shadcn/ui",
        description: "Componentes accesibles sobre Radix UI para una UI consistente y customizable.",
        icon: <ShadcnIcon />,
        color: "bg-zinc-500/10",
    },
    {
        name: "Sonner",
        description: "Sistema de notificaciones toast moderno, ligero y fácil de integrar.",
        icon: <SonnerIcon />,
        color: "bg-amber-500/10",
    },
    {
        name: "Lucide React",
        description: "Librería de íconos SVG consistentes y tree-shakeable para React.",
        icon: <LucideIcon />,
        color: "bg-orange-500/10",
    },
    {
        name: "Vercel",
        description: "Plataforma de deploy con edge network, previews automáticos y analytics.",
        icon: <VercelIcon />,
        color: "bg-white/5",
    },
]

// ─────────────────────────────────────────────────────────────

export default function AboutPage() {
    return (
        <div className="w-full py-5">
            <Breadcrumb className='mb-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Acerca de</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* header */}
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="font-serif text-2xl text-foreground">Stack tecnológico</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Tecnologías y herramientas que potencian este proyecto.
                </p>
            </div>

            {/* grid de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {techStack.map((tech) => (
                    <TechCard
                        key={tech.name}
                        name={tech.name}
                        description={tech.description}
                        icon={tech.icon}
                    />
                ))}
            </div>
        </div>
    )
}
