import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor"
import { nanoid } from "nanoid"

export async function POST(req: Request, { params }: { params: { formId: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const doctor = await getOrCreateDoctor()
        const { formId } = await params

        // Buscar el formulario
        const form = await prisma.form.findUnique({
            where: { id: formId }
        })

        if (!form || form.doctorId !== doctor.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        // Crear submission con token único
        const submission = await prisma.formSubmission.create({
            data: {
                token: nanoid(),
                doctorId: doctor.id,
                formId: form.id
            }
        })

        return NextResponse.json(
            {
                token: submission.token,
                url: `/form/${submission.token}`
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("POST submission error:", error)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
