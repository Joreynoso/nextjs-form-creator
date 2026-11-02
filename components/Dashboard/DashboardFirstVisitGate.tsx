"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import { FORM_LOADER_CYCLE_MS } from "@/components/ui/form-loader"
import { DashboardLoadingScreen } from "./DashboardLoadingScreen"

const STORAGE_KEY = "dashboard-intro-seen"

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect

function hasSeenIntro() {
    try {
        return sessionStorage.getItem(STORAGE_KEY) === "1"
    } catch {
        return false
    }
}

function markIntroAsSeen() {
    try {
        sessionStorage.setItem(STORAGE_KEY, "1")
    } catch {
        return
    }
}

export function DashboardFirstVisitGate({
    children,
}: {
    children: React.ReactNode
}) {
    const [ready, setReady] = useState(false)

    useIsomorphicLayoutEffect(() => {
        if (hasSeenIntro()) {
            setReady(true)
            return
        }

        const timer = setTimeout(() => {
            markIntroAsSeen()
            setReady(true)
        }, FORM_LOADER_CYCLE_MS)

        return () => clearTimeout(timer)
    }, [])

    if (!ready) {
        return <DashboardLoadingScreen />
    }

    return <>{children}</>
}
