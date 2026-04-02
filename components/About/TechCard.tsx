// TechCard — card de tecnología para la página About

type TechCardProps = {
    name: string
    description: string
    icon: React.ReactNode
}

export default function TechCard({ name, description, icon }: TechCardProps) {
    return (
        <div className="relative bg-linear-to-br from-card to-muted/10 border border-border/40 p-10 rounded-2xl text-center flex flex-col justify-center items-center h-full">

            {/* icon — igual al círculo de CardsHome */}
            <div className="aspect-square w-14 h-14 mx-auto bg-muted/20 rounded-full flex justify-center items-center mb-6 transition-transform duration-500">
                <div className="w-7 h-7 text-primary/60 flex items-center justify-center">
                    {icon}
                </div>
            </div>

            {/* name */}
            <h2 className="font-serif text-xl tracking-tight text-foreground mb-3">{name}</h2>

            {/* description */}
            <p className="text-muted-foreground/70 text-sm leading-relaxed font-sans">{description}</p>
        </div>
    )
}
