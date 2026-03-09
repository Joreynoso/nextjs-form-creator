'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { useTheme } from 'next-themes'
import { getClerkAppearance } from '@/lib/clerk-theme'

export default function ClerkProviderWithTheme({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme()
    const appearance = getClerkAppearance(resolvedTheme)

    return (
        <ClerkProvider appearance={appearance} localization={esES}>
            {children}
        </ClerkProvider>
    )
}
