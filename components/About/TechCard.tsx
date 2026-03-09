// TechCard — card de tecnología para la página About

type TechCardProps = {
    name: string
    description: string
    icon: React.ReactNode
}

export default function TechCard({ name, description, icon }: TechCardProps) {
    return (
        <div className="bg-linear-to-br from-card via-card to-muted/20 border border-border/50 p-8 rounded-2xl text-center flex flex-col justify-center items-center hover:bg-secondary transition-colors duration-300 ease-in-out">

            {/* icon — igual al círculo de CardsHome */}
            <div className="aspect-square w-12 h-12 mx-auto bg-muted rounded-full flex justify-center items-center mb-6">
                <div className="w-6 h-6 text-primary flex items-center justify-center">
                    {icon}
                </div>
            </div>

            {/* name */}
            <h2 className="font-serif text-lg font-medium mb-2">{name}</h2>

            {/* description */}
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
    )
}
