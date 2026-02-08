"use client"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from '@/components/ui/button'

export function ModeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Evitar problemas de hidratación
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        const newTheme = resolvedTheme === "light" ? "dark" : "light"

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                setTheme(newTheme)
            })
        } else {
            setTheme(newTheme)
        }
    }

    // Mostrar un placeholder mientras se monta el componente
    if (!mounted) {
        return (
            <Button variant="secondary" size="icon" className="w-full md:w-[35px]" disabled>
                <Sun className="h-[1.2rem] w-[1.2rem] opacity-50" />
                <span className="sr-only">Loading theme</span>
            </Button>
        )
    }

    const isDark = resolvedTheme === "dark"

    // render return
    return (
        <Button
            variant="secondary"
            size="icon"
            onClick={toggleTheme}
            className="w-full md:w-[35px] relative overflow-hidden transition-all hover:scale-110 active:scale-95"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? (
                <Moon className="h-[1.2rem] w-[1.2rem] animate-in spin-in-180 zoom-in-75 duration-500" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] animate-in spin-in-180 zoom-in-75 duration-500" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}