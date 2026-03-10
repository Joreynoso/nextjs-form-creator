import StatisticCard from "./StatisticCard"

export default function StatisticList() {
    
    // rendere return
    return(
        <div className="flex flex-col gap-4">
            <StatisticCard
                title="Formularios"
                value="10"
                description="Formularios creados"
            />
            <StatisticCard
                title="Formularios"
                value="10"
                description="Formularios creados"
            />
            <StatisticCard
                title="Formularios"
                value="10"
                description="Formularios creados"
            />
            <StatisticCard
                title="Formularios"
                value="10"
                description="Formularios creados"
            />
        </div>
    )
}