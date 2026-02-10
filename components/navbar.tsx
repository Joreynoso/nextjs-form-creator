'use client'

import { ModeToggle } from "./themetoggle"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from './ui/button'

// react
import { useState } from 'react'
import { SignedIn, UserButton } from '@clerk/nextjs'

export default function Navbar() {

    // state to open the navbar
    const [open, setOpen] = useState(false)

    // navigation links
    const links = [
        { name: 'About', href: '/about' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Iniciar sesión', href: '/sign-in' },
        { name: 'Registrarse', href: '/sign-up' },
    ]

    // render return
    return (
        <nav className="w-full py-4 flex justify-center items-center px-4 sm:px-0">
            <nav className='w-full max-w-7xl mx-auto flex justify-between items-center'>
                <Link href="/" className="text-xl font-semibold">Form <span className="text-primary italic">Builder</span></Link>

                {/* desktop view */}
                <div className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium hover:text-primary transition-colors font-sans"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* user button de clerk */}
                    <SignedIn>
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
                            <div className="flex justify-between items-center mb-12">
                                <Link href="/" onClick={() => setOpen(false)} className="text-xl font-semibold">
                                    Form <span className="text-primary italic">Builder</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="flex flex-col gap-5">
                                {links.map((link, idx) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="text-2xl tracking-tight hover:text-primary transition-colors animate-in slide-in-from-left duration-500 fill-mode-both"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
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