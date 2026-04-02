
// import prisma
import { prisma } from "@/lib/prisma";

// import getOrCreateDoctor
import { getOrCreateDoctor } from "@/actions/doctors/sync";
import { notFound } from 'next/navigation';
import { FormBuilder } from '@/components/FormBuilder';
import { FormField } from '@/types/form.types';

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