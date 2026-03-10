import { FileText, Send, CheckCircle2, XCircle } from "lucide-react"
import StatisticCard from "./StatisticCard"

interface StatisticListProps {
    totalForms: number
    totalSubmissions: number
    totalActiveForms: number
    totalInactiveForms: number
}

export default function StatisticList({
    totalForms, 
    totalSubmissions, 
    totalActiveForms, 
    totalInactiveForms
}: StatisticListProps) {
    
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatisticCard
                title="Total Formularios"
                value={totalForms.toString()}
                description="Formularios creados en tu cuenta"
                icon={FileText}
            />
            <StatisticCard
                title="Envíos Recibidos"
                value={totalSubmissions.toString()}
                description="Respuestas totales recolectadas"
                icon={Send}
            />
            <StatisticCard
                title="Formularios Activos"
                value={totalActiveForms.toString()}
                description="Formularios visibles para pacientes"
                icon={CheckCircle2}
            />
            <StatisticCard
                title="Formularios Inactivos"
                value={totalInactiveForms.toString()}
                description="Formularios pausados o en borrador"
                icon={XCircle}
            />
        </div>
    )
}