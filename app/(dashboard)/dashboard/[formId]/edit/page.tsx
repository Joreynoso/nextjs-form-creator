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
import { FormField } from '@/@types/types';

interface Props {
    params: Promise<{ formId: string }>
}

export default async function EditFormPage(props: Props) {

    const { formId } = await props.params

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

    const mappedForm = {
        ...form,
        description: form.description ?? undefined,
        fields: (form.fields ?? []) as unknown as FormField[]
    }

    return (
        <div className="w-full py-5">
            <FormBuilder
                form={mappedForm}
                initialFields={mappedForm.fields}
            />
        </div>
    )
}