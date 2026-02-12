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
        <div className='w-full py-8 flex flex-col'>

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

            {/* profile card */}
            {/* <div className='bg-card border border-border rounded-lg p-4 max-w-xl'>
                <h1 className='font-medium text-xl'>Profile</h1>
                <p className='text-muted-foreground mt-2'>{user?.emailAddresses[0].emailAddress}</p>
                <p className='text-muted-foreground mt-2'>{user?.firstName} {user?.lastName}</p>
                <div className='w-12 h-12 aspect-square flex justify-center items-center bg-primary rounded-full overflow-hidden mt-2'>
                    <img src={user?.imageUrl || ''} alt={user?.username || ''} />
                </div>
            </div> */}
        </div>
    )
}