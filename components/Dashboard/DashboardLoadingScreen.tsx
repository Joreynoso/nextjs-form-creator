import { FormLoader } from "@/components/ui/form-loader"

export const DASHBOARD_LOADER_CAPTIONS = [
    "Cargando formularios...",
    "Ordenando tus preguntas...",
    "Poniendo todo en su lugar...",
    "Afinando los últimos detalles...",
    "Casi listo, un momento más...",
] as const

export function DashboardLoadingScreen() {
    return (
        <div className="flex h-[60vh] w-full flex-1 flex-col items-center justify-center animate-in fade-in duration-500">
            <FormLoader size={48} captions={DASHBOARD_LOADER_CAPTIONS} />
        </div>
    )
}
