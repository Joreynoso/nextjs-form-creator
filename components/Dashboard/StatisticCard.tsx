export default function StatisticCard({
    title,
    value,
    description
}: {
    title: string,
    value: string,
    description: string
}) {
    return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md bg-background border-2 border-primary/10">
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}