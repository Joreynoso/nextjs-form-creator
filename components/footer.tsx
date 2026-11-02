import { GithubIcon } from "lucide-react"
import Link from "next/link"
import { BrandMark } from "@/components/ui/brand-mark"

const footerLinks = [
    {
        title: "Producto",
        links: [
            { name: "Dashboard", href: "/dashboard" },
            { name: "Chat IA", href: "/dashboard/chat" },
        ],
    },
    {
        title: "Recursos",
        links: [
            { name: "Inicio", href: "/" },
            { name: "Acerca de", href: "/about" },
        ],
    },
    {
        title: "Cuenta",
        links: [
            { name: "Iniciar sesión", href: "/sign-in" },
            { name: "Registrarse", href: "/sign-up" },
        ],
    },
]

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-footer text-on-dark">
            <div className="mx-auto w-full max-w-7xl px-4 xl:px-0">
                <div className="grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="flex items-center gap-2.5">
                            <BrandMark />
                            <span className="font-serif text-xl font-medium tracking-tight text-on-dark">
                                Form Builder
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-body-sm leading-relaxed text-on-dark-muted">
                            Crea formularios, comparte experiencias y entiende las respuestas sin fricción.
                        </p>
                    </div>

                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h2 className="mb-4 text-body-sm font-medium text-on-dark">
                                {group.title}
                            </h2>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-body-sm text-on-dark-muted transition-colors hover:text-on-dark"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-caption text-on-dark-muted">
                        &copy; {new Date().getFullYear()}{" "}
                        <Link
                            href="https://github.com/Joreynoso"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-on-dark"
                        >
                            Creado y desarrollado por José Reynoso
                        </Link>
                        . Todos los derechos reservados.
                    </p>

                    <Link
                        href="https://github.com/Joreynoso"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub de José Reynoso"
                        className="text-on-dark-muted transition-colors hover:text-on-dark"
                    >
                        <GithubIcon className="size-5" />
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
