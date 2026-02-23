// import breadcrumb components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
}
    from "@/components/ui/breadcrumb";

// import prisma
import { prisma } from "@/lib/prisma";

// import getOrCreateDoctor
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor";
import { notFound } from 'next/navigation';
import FormBuilder from '@/components/FormBuilder/FormBuilder';

interface Props {
    params: Promise<{ formId: string }>
}

export default async function EditFormPage({ params }: Props) {

    const { formId } = await params

    const doctor = await getOrCreateDoctor()

    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: {
            submissions: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    if (!form || form.doctorId !== doctor.id) {
        notFound()
    }

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
                        <BreadcrumbPage>{form.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full mb-5">
                <p className="text-base text-muted-foreground leading-relaxed">
                    Personaliza tu formulario
                </p>
            </div>

            <div className="w-full">
                <FormBuilder form={form}/>
            </div>

        </div>
    )
}