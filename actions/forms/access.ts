"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/actions/doctors/sync"
import { nanoid } from "nanoid"
import { PublicAccessResult } from '@/types/form.types'
import { getActionErrorMessage } from '@/lib/action-errors'

export async function enablePublicAccess(formId: string): Promise<PublicAccessResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: "No autorizado" }
    }

    const doctor = await getOrCreateDoctor()

    if (!doctor) {
      return { success: false, message: "No autorizado" }
    }

    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        doctorId: doctor.id
      }
    })

    if (!form) {
      return {
        success: false,
        message: "No se encontró el formulario o no tienes permisos para modificarlo."
      }
    }

    const token = form.publicToken ?? nanoid(16)

    const updated = await prisma.form.update({
      where: { id: formId },
      data: {
        publicToken: token,
        isPublicOpen: true
      }
    })

    revalidatePath(`/dashboard`)
    revalidatePath(`/dashboard/${formId}`)

    return {
      success: true,
      isPublicOpen: updated.isPublicOpen,
      token: updated.publicToken
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "activar el acceso público del formulario",
        logContext: "enablePublicAccess"
      })
    }
  }
}

export async function disablePublicAccess(formId: string): Promise<PublicAccessResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: "No autorizado" }
    }

    const doctor = await getOrCreateDoctor()

    if (!doctor) {
      return { success: false, message: "No autorizado" }
    }

    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        doctorId: doctor.id
      }
    })

    if (!form) {
      return {
        success: false,
        message: "No se encontró el formulario o no tienes permisos para modificarlo."
      }
    }

    const updated = await prisma.form.update({
      where: { id: formId },
      data: {
        isPublicOpen: false
      }
    })

    revalidatePath(`/dashboard`)
    revalidatePath(`/dashboard/${formId}`)

    return {
      success: true,
      isPublicOpen: updated.isPublicOpen,
      token: updated.publicToken
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "desactivar el acceso público del formulario",
        logContext: "disablePublicAccess"
      })
    }
  }
}
