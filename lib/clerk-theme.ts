import { dark } from "@clerk/themes";

// Colores concretos extraídos de globals.css — los CSS vars no se resuelven dentro del contexto de Clerk
const lightColors = {
    colorBackground: 'oklch(0.9529 0.0146 102.4597)',
    colorText: 'oklch(0.4063 0.0255 40.3627)',
    colorTextSecondary: 'oklch(0.5416 0.0512 37.2132)',
    colorPrimary: 'oklch(0.6083 0.0623 44.3588)',
    colorTextOnPrimaryBackground: 'oklch(1 0 0)',
    colorInputBackground: 'oklch(0.9529 0.0146 102.4597)',
    colorInputText: 'oklch(0.4063 0.0255 40.3627)',
    colorNeutral: 'oklch(0.4063 0.0255 40.3627)',
    colorSeparator: 'oklch(0.7473 0.0387 80.5476)',
}

const darkColors = {
    colorBackground: 'oklch(0.2721 0.0141 48.1783)',
    colorText: 'oklch(0.9529 0.0146 102.4597)',
    colorTextSecondary: 'oklch(0.7575 0.0380 50.8610)',
    colorPrimary: 'oklch(0.7272 0.0539 52.3320)',
    colorTextOnPrimaryBackground: 'oklch(0.2721 0.0141 48.1783)',
    colorInputBackground: 'oklch(0.3291 0.0156 50.8936)',
    colorInputText: 'oklch(0.9529 0.0146 102.4597)',
    colorNeutral: 'oklch(0.9529 0.0146 102.4597)',
    colorSeparator: 'oklch(0.4063 0.0255 40.3627)',
}

export function getClerkAppearance(resolvedTheme: string | undefined) {
    const isDark = resolvedTheme === 'dark'
    const colors = isDark ? darkColors : lightColors

    return {
        baseTheme: isDark ? dark : undefined,
        variables: {
            ...colors,
            borderRadius: '0.5rem',
            fontFamily: 'DM Sans, sans-serif',
        },
        elements: {
            card: 'shadow-none border border-border',
            navbar: 'hidden',
            headerTitle: 'text-2xl font-bold tracking-tight',
            headerSubtitle: isDark ? 'text-[oklch(0.7575_0.0380_50.8610)]' : 'text-[oklch(0.5416_0.0512_37.2132)]',
            socialButtonsBlockButton: isDark
                ? 'bg-[oklch(0.5416_0.0512_37.2132)] text-[oklch(0.9529_0.0146_102.4597)] hover:opacity-80 border-[oklch(0.4063_0.0255_40.3627)]'
                : 'bg-[oklch(0.7473_0.0387_80.5476)] text-white hover:opacity-80 border-[oklch(0.7473_0.0387_80.5476)]',
            formButtonPrimary: isDark
                ? 'bg-[oklch(0.7272_0.0539_52.3320)] text-[oklch(0.2721_0.0141_48.1783)] hover:opacity-90'
                : 'bg-[oklch(0.6083_0.0623_44.3588)] text-white hover:opacity-90',
            footerActionLink: isDark
                ? 'text-[oklch(0.7272_0.0539_52.3320)] hover:opacity-80'
                : 'text-[oklch(0.6083_0.0623_44.3588)] hover:opacity-80',
            userButtonAvatarBox: 'border border-primary/20!',
            userButtonAvatarImage: isDark
                ? 'bg-[oklch(0.7272_0.0539_52.3320)]! text-[oklch(0.2721_0.0141_48.1783)]!'
                : 'bg-[oklch(0.6083_0.0623_44.3588)]! text-white!',
            avatarBox: 'border border-primary/20!',
            avatarImage: isDark
                ? 'bg-[oklch(0.7272_0.0539_52.3320)]! text-[oklch(0.2721_0.0141_48.1783)]!'
                : 'bg-[oklch(0.6083_0.0623_44.3588)]! text-white!',
        }
    }
}
