// TechCard — card de tecnología para la página About

type TechCardProps = {
    name: string
    description: string
    icon: React.ReactNode
}

export default function TechCard({ name, description, icon }: TechCardProps) {
    return (
        <div className="group relative bg-card/50 hover:bg-card border border-border hover:shadow-lg p-10 rounded-2xl text-center flex flex-col justify-center items-center h-full transition-all duration-300">

            {/* icon — igual al círculo de CardsHome */}
            <div className="w-14 h-14 mx-auto bg-background text-muted-foreground rounded-full flex justify-center items-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-sm">
                <div className="w-7 h-7 flex items-center justify-center">
                    {icon}
                </div>
            </div>

            {/* name */}
            <h2 className="font-serif text-xl tracking-tight text-foreground mb-3 duration-300">{name}</h2>

            {/* description */}
            <p className="text-muted-foreground/70 text-sm leading-relaxed font-sans">{description}</p>
        </div>
    )
}
