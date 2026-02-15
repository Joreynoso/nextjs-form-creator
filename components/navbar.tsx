'use client'

import Link from "next/link"

// import components
import { ModeToggle } from "./themetoggle"
import { Menu, X } from "lucide-react"
import { Button } from './ui/button'

// react
import { useState } from 'react'

// clerk auth
import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {

    // state to open the navbar
    const [open, setOpen] = useState(false)

    // navigation links, iniciar sesión y registrarse solo se muestran si no estás logueado
    const publicLinks = [
        { name: 'Acerca de', href: '/about' },
    ]

    // guest links, visibles solo para usuarios no registrados
    const guestLinks = [
        { name: 'Iniciar sesión', href: '/sign-in' },
        { name: 'Registrarse', href: '/sign-up' },
    ]

    // auth links, visibles solo para usuarios registrados
    const authLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Perfil', href: '/profile' },
    ]

    // render return
    return (
        <nav className="w-full py-5 flex justify-center items-center px-4 lg:px-0 border-b border-border/40">
            <nav className='w-full max-w-7xl mx-auto flex justify-between items-center'>
                <Link href="/" className="text-xl font-medium">Form <span className="text-primary">Builder</span></Link>

                {/* desktop view */}
                <div className="hidden md:flex items-center gap-6">
                    {publicLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium hover:text-primary transition-colors font-sans"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <SignedOut>
                        {guestLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium hover:text-primary transition-colors font-sans"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </SignedOut>

                    <SignedIn>
                        {authLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium hover:text-primary transition-colors font-sans"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* salir, deberia mostrar un mensaje toast de despedida */}
                        <SignOutButton>
                            <button className="text-sm font-medium hover:text-primary transition-colors font-sans">
                                Salir
                            </button>
                        </SignOutButton>
                        <UserButton />
                    </SignedIn>

                    {/* theme toggle */}
                    <ModeToggle />
                </div>

                {/* mobile view trigger */}
                <div className="md:hidden flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(true)}
                        className="hover:bg-transparent"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>

                {/* mobile menu overlay */}
                {open && (
                    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md md:hidden animate-in fade-in duration-300">
                        <div className="flex flex-col h-full p-4">
                            <div className="flex justify-between items-center mb-16">
                                <Link href="/" onClick={() => setOpen(false)} className="text-xl font-medium">
                                    Form <span className="text-primary">Builder</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="flex flex-col gap-8">
                                {publicLinks.map((link, idx) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="text-2xl tracking-tight hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <SignedOut>
                                    {guestLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            className="text-2xl tracking-tight hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </SignedOut>

                                <SignedIn>
                                    {authLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            className="text-2xl tracking-tight hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <SignOutButton>
                                        <Button variant="ghost" className='p-0 text-2xl tracking-tight hover:text-primary transition-colors justify-start font-normal h-auto'>Salir</Button>
                                    </SignOutButton>
                                </SignedIn>
                            </div>

                            <div className="mt-auto pb-10">
                                <p className="text-muted-foreground text-sm font-mono">© 2026 Form Builder</p>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </nav>
    )
}   