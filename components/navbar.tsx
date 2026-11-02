'use client'

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from 'react'
import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/nextjs'

import { BrandMark } from './ui/brand-mark'
import { Button } from './ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import { ModeToggle } from "./themetoggle"

const publicLinks = [
    { name: 'Acerca de', href: '/about' },
]

const authLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Chat', href: '/dashboard/chat' },
]

const desktopLinkClass = 'rounded-pill px-3 py-2 text-body-sm font-medium text-steel transition-colors hover:bg-accent hover:text-ink'
const mobileLinkClass = 'rounded-panel px-3 py-3 font-serif text-heading-4 font-medium tracking-tight text-ink transition-colors hover:bg-accent'

function Brand() {
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-serif text-xl font-medium tracking-tight text-ink">
                Form Builder
            </span>
        </Link>
    )
}

export default function Navbar() {
    const [open, setOpen] = useState(false)

    const closeMenu = () => setOpen(false)

    return (
        <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 xl:px-0">
                <Brand />

                {/* desktop view */}
                <div className="hidden items-center gap-6 md:flex">
                    <nav className="flex items-center gap-1">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={desktopLinkClass}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <SignedOut>
                            <Link href="/sign-in" className={desktopLinkClass}>
                                Iniciar sesión
                            </Link>
                            <Button asChild size="sm">
                                <Link href="/sign-up">Registrarse</Link>
                            </Button>
                        </SignedOut>

                        <SignedIn>
                            {authLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={desktopLinkClass}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <SignOutButton>
                                <Button variant="ghost" size="sm">
                                    Salir
                                </Button>
                            </SignOutButton>
                            <UserButton />
                        </SignedIn>

                        <ModeToggle />
                    </div>
                </div>

                {/* mobile view */}
                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Abrir menú"
                            >
                                <Menu className="size-6" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent
                            showCloseButton={false}
                            className="inset-0 left-0 top-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-canvas p-0 shadow-none"
                        >
                            <DialogTitle className="sr-only">
                                Menú de navegación
                            </DialogTitle>

                            <div className="flex h-16 items-center justify-between border-b border-hairline px-4">
                                <Brand />
                                <DialogClose asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Cerrar menú"
                                    >
                                        <X className="size-6" />
                                    </Button>
                                </DialogClose>
                            </div>

                            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8">
                                <nav className="flex flex-col gap-1">
                                    {publicLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={closeMenu}
                                            className={mobileLinkClass}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}

                                    <SignedIn>
                                        {authLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={closeMenu}
                                                className={mobileLinkClass}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </SignedIn>
                                </nav>

                                <div className="mt-auto space-y-6 pt-10">
                                    <SignedOut>
                                        <div className="flex flex-col gap-3">
                                            <Button asChild size="lg" className="w-full">
                                                <Link href="/sign-up" onClick={closeMenu}>
                                                    Registrarse
                                                </Link>
                                            </Button>
                                            <Button asChild variant="secondary" size="lg" className="w-full">
                                                <Link href="/sign-in" onClick={closeMenu}>
                                                    Iniciar sesión
                                                </Link>
                                            </Button>
                                        </div>
                                    </SignedOut>

                                    <SignedIn>
                                        <div className="flex items-center justify-between rounded-panel border border-hairline bg-surface-soft p-4">
                                            <div className="flex items-center gap-3">
                                                <UserButton />
                                                <span className="text-body-sm font-medium text-steel">
                                                    Tu cuenta
                                                </span>
                                            </div>
                                            <SignOutButton>
                                                <Button variant="ghost" size="sm" onClick={closeMenu}>
                                                    Salir
                                                </Button>
                                            </SignOutButton>
                                        </div>
                                    </SignedIn>

                                    <div className="border-t border-hairline pt-6">
                                        <p className="text-caption text-muted-foreground">
                                            © 2026 Form Builder
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    )
}
