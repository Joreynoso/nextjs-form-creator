import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
    try {

        console.log('obtener token')
        const token = (await context.params).token

        console.log('obtener submission', token)
        const submission = await prisma.formSubmission.findUnique({
            where: { token }
        })

        console.log('submission', submission)
        if (!submission) {
            return NextResponse.json(
                { error: "Not found" },
                { status: 404 }
            )
        }

        console.log('submission status', submission.status)
        if (submission.status === "completed") {
            return NextResponse.json(
                { error: "Form already completed" },
                { status: 400 }
            )
        }

        console.log('obtener body')
        const body = await request.json()
        const { responses } = body

        console.log('actualizar submission')
        const updatedSubmission = await prisma.formSubmission.update({
            where: { token },
            data: {
                responses,
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

