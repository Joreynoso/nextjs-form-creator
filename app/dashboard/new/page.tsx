
// import breadcrumb components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// import button component
import { Button } from "@/components/ui/button"

export default function NewFormPage() {

    // render return
    return (
        <div className="w-full py-5">
            <Breadcrumb className='mb-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Nuevo formulario</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* titulo y crear nuevo formulario */}
            <div className="w-full mb-5 flex items-center justify-between">
                <p className="text-base text-muted-foreground leading-relaxed">
                    Crear un nuevo formulario.
                </p>

                <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                    Crear formulario
                </Button>
            </div>
        </div>
    )
}