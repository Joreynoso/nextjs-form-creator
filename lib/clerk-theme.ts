import { dark } from "@clerk/themes";

export const clerkAppearance = {
    basetheme: dark,
    variables: {
        colorPrimary: 'var(--primary)',
        colorBackground: 'var(--background)',
        colorText: 'var(--foreground)',
        colorInputBackground: 'var(--card)',
        colorInputText: 'var(--foreground)',
        borderRadius: '0.5rem',
        fontFamily: 'var(--font-merriweather), sans-serif',
        colorTextSecondary: 'var(--muted-foreground)',
        colorSeparator: 'var(--border)',
        colorTextOnPrimaryBackground: 'var(--primary-foreground)',
    },
    elements: {
        card: "shadow-none border border-border",
        navbar: "hidden",
        headerTitle: "text-2xl font-bold tracking-tight",
        headerSubtitle: "text-muted-foreground",
        socialButtonsBlockButton: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border",
        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
        footerActionLink: "text-primary hover:text-primary/90",
    }
};
