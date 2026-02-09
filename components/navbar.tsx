'use client'

import { ModeToggle } from "./themetoggle"
import Link from "next/link"

export default function Navbar() {

    // render return
    return (
        <nav className="w-full py-4 flex justify-center items-center px-4 sm:px-0">
            <nav className='w-full max-w-7xl mx-auto flex justify-between items-center'>
                <Link href="/" className="text-xl font-semibold">Form <span className="text-primary">Builder</span></Link>
                <div className="flex items-center gap-4">
                    <Link href='/about' className="text-sm font-medium hover:text-primary transition-colors">About</Link>
                    <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                    <Link href='/sign-in' className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
                    <Link href='/sign-up' className="text-sm font-medium hover:text-primary transition-colors">Sign Up</Link>
                    <ModeToggle />
                </div>
            </nav>
        </nav>
    )
}   