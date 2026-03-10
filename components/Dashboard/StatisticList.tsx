import StatisticCard from "./StatisticCard"

interface StatisticListProps {
    totalForms: number
    totalSubmissions: number
    totalActiveForms: number
    totalInactiveForms: number
}

export default function StatisticList({totalForms, totalSubmissions, totalActiveForms, totalInactiveForms}: StatisticListProps) {
    
    // rendere return
    return(
        <div className="flex flex-col gap-4">
            <StatisticCard
                title="Formularios"
                value={totalForms.toString()}
                description="Formularios creados"
            />
            <StatisticCard
                title="Envíos"
                value={totalSubmissions.toString()}
                description="Total de envíos"
            />
            <StatisticCard
                title="Formularios Activos"
                value={totalActiveForms.toString()}
                description="Formularios activos"
            />
            <StatisticCard
                title="Formularios Inactivos"
                value={totalInactiveForms.toString()}
                description="Formularios inactivos"
            />
        </div>
    )
}