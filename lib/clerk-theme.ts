import { dark } from "@clerk/themes";

const lightColors = {
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorTextSecondary: '#5c5c5c',
    colorPrimary: '#111111',
    colorTextOnPrimaryBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#1a1a1a',
    colorNeutral: '#1a1a1a',
    colorSeparator: '#e6e6e2',
}

const darkColors = {
    colorBackground: '#0f0f0f',
    colorText: '#f5f5f5',
    colorTextSecondary: '#b3b3b3',
    colorPrimary: '#f5f5f5',
    colorTextOnPrimaryBackground: '#111111',
    colorInputBackground: '#171717',
    colorInputText: '#f5f5f5',
    colorNeutral: '#f5f5f5',
    colorSeparator: '#2e2e2e',
}

export function getClerkAppearance(resolvedTheme: string | undefined) {
    const isDark = resolvedTheme === 'dark'
    const colors = isDark ? darkColors : lightColors

    return {
        baseTheme: isDark ? dark : undefined,
        variables: {
            ...colors,
            borderRadius: '0.75rem',
            fontFamily: '"Plus Jakarta Sans", "Noto Sans", system-ui, sans-serif',
        },
        elements: {
            card: 'shadow-none border border-hairline bg-canvas',
            navbar: 'hidden',
            headerTitle: 'text-2xl font-semibold tracking-tight text-ink',
            headerSubtitle: 'text-slate',
            socialButtonsBlockButton: 'bg-surface text-ink border-hairline hover:bg-surface-soft',
            formButtonPrimary: 'bg-ds-primary text-ds-on-primary hover:bg-charcoal',
            footerActionLink: 'text-brand-blue hover:opacity-80',
            userButtonAvatarBox: 'border border-hairline!',
            userButtonAvatarImage: 'bg-ds-primary! text-ds-on-primary!',
            avatarBox: 'border border-hairline!',
            avatarImage: 'bg-ds-primary! text-ds-on-primary!',
        }
    }
}
