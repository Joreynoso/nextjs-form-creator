import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SubmissionResponsesSchema } from "@/lib/schemas/submission.schema"
import { validateSubmission } from "@/lib/validators/submission.validator"
import { FormField } from "@/types/form.types"

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
    try {
        const { token } = await params

        // Buscar submission por token
        const submission = await prisma.formSubmission.findUnique({
            where: { token }
        })

        if (!submission) {
            return NextResponse.json(
                { error: "Not found" },
                { status: 404 }
            )
        }


        // Buscar formulario asociado
        const form = await prisma.form.findUnique({
            where: { id: submission.formId }
        })

        if (!form) {
            return NextResponse.json(
                { error: "Form not found" },
                { status: 404 }
            )
        }

        if (!form.isActive || !form.isPublicOpen) {
            return NextResponse.json(
                { error: "Form unavailable" },
                { status: 403 }
            )
        }

        // Devolver solo lo necesario
        return NextResponse.json({
            name: form.name,
            description: form.description,
            fields: form.fields,
            status: submission.status
        })

    } catch (error) {
        console.error("GET /api/public/submissions/[token] error:", error)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    context: { params: Promise<{ token: string }> }
) {
    try {

        const token = (await context.params).token

        const submission = await prisma.formSubmission.findUnique({
            where: { token },
            include: {
                form: true
            }
        })

        if (!submission) {
            return NextResponse.json(
                { error: "Not found" },
                { status: 404 }
            )
        }

        // 🚨 Validaciones de seguridad
        if (!submission.form.isActive) {
            return NextResponse.json(
                { error: "Form disabled" },
                { status: 403 }
            )
        }

        if (!submission.form.isPublicOpen) {
            return NextResponse.json(
                { error: "Form closed" },
                { status: 403 }
            )
        }

        if (submission.status === "completed") {
            return NextResponse.json(
                { error: "Form already completed" },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { responses } = body

        const parsed = SubmissionResponsesSchema.safeParse(responses)
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Respuestas inválidas", details: parsed.error.issues },
                { status: 400 }
            )
        }

        const fields = submission.form.fields as unknown as FormField[]
        const validation = validateSubmission(fields, parsed.data)

        if (!validation.isValid) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.errors },
                { status: 400 }
            )
        }

        const updatedSubmission = await prisma.formSubmission.update({
            where: { token },
            data: {
                responses: parsed.data,
                status: "completed",
                completedAt: new Date()
            }
        })

        return NextResponse.json({
            message: "Form submitted successfully",
            status: updatedSubmission.status
        })

    } catch (error) {
        console.error("POST PUBLIC SUBMISSION ERROR:", error)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
