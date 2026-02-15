import { currentUser } from "@clerk/nextjs/server";

// import breadcrumb components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function ProfilePage() {
    // get user from clerk
    const user = await currentUser();

    // render return
    return (
        <div className='w-full py-5 flex flex-col'>

            <Breadcrumb className='mb-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Mi Perfil</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='flex flex-col mb-5'>
                <p className='text-base text-muted-foreground leading-relaxed'>
                    Administra tu información personal y seguridad.
                </p>
            </div>
        </div>
    )
}