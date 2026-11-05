'use client'

import { SignIn } from '@clerk/nextjs'

import { authPanelAppearance } from '@/lib/clerk-auth-appearance'

export function AuthSignIn() {
    return (
        <SignIn
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
            appearance={authPanelAppearance}
        />
    )
}
