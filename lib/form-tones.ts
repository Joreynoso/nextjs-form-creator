export const FORM_CARD_TONES = [
    {
        surface: "bg-surface-yellow border-brand-yellow/30",
        accent: "bg-brand-yellow",
    },
    {
        surface: "bg-coral-light border-coral-dark/20",
        accent: "bg-brand-coral",
    },
    {
        surface: "bg-teal-light border-moss-dark/20",
        accent: "bg-brand-teal",
    },
    {
        surface: "bg-rose-light border-coral-dark/15",
        accent: "bg-brand-rose",
    },
    {
        surface: "bg-brand-orange-light border-brand-coral/20",
        accent: "bg-brand-coral",
    },
] as const

export function getFormCardToneIndex(id: string) {
    let hash = 0

    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0
    }

    return hash % FORM_CARD_TONES.length
}

export function getFormCardTones<T extends { id: string; createdAt: Date | string }>(forms: T[]) {
    const tones = new Map<string, number>()
    const ordered = [...forms].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    let previous: number | null = null

    for (const form of ordered) {
        let index = getFormCardToneIndex(form.id)

        if (previous !== null && index === previous) {
            index = (index + 1) % FORM_CARD_TONES.length
        }

        tones.set(form.id, index)
        previous = index
    }

    return tones
}
