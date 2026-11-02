"use server"

import { prisma } from "@/lib/prisma"
import { SubmissionStatus } from "@/lib/generated/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/actions/doctors/sync"
import { getActionErrorMessage } from "@/lib/action-errors"

export async function expireOldSubmissions(formId: string) {
  try {
    const expired = await prisma.formSubmission.updateMany({
      where: {
        formId,
        status: SubmissionStatus.pending,
        createdAt: {
          lt: new Date(Date.now() - 1000 * 60 * 30)
        }
      },
      data: {
        status: SubmissionStatus.expired
      }
    })

    return {
      success: true,
      count: expired.count
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "actualizar las respuestas pendientes",
        logContext: "expireOldSubmissions"
      }),
      count: 0
    }
  }
}

export async function deleteSubmission(submissionId: string, formId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: "No autorizado"
      }
    }

    const doctor = await getOrCreateDoctor()

    if (!doctor) {
      return { success: false, message: "No autorizado" }
    }

    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: {
        form: true
      }
    })

    if (!submission || submission.form.doctorId !== doctor.id) {
      return {
        success: false,
        message: "No autorizado"
      }
    }

    await prisma.formSubmission.delete({
      where: { id: submissionId }
    })

    revalidatePath(`/dashboard/${formId}`)

    return {
      success: true,
      message: "Respuesta eliminada correctamente"
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "eliminar la respuesta",
        logContext: "deleteSubmission"
      })
    }
  }
}
