"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/actions/doctors/sync"
import { nanoid } from "nanoid"
import { PublicAccessResult } from '@/types/form.types'

export async function enablePublicAccess(formId: string): Promise<PublicAccessResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: "No autorizado" }
    }

    const doctor = await getOrCreateDoctor()

    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        doctorId: doctor.id
      }
    })

    if (!form) {
      return { success: false, message: "Form not found" }
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
    console.error("enablePublicAccess error:", error)
    return { success: false, message: "Error inesperado. Intenta de nuevo." }
  }
}

export async function disablePublicAccess(formId: string): Promise<PublicAccessResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: "No autorizado" }
    }

    const doctor = await getOrCreateDoctor()

    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        doctorId: doctor.id
      }
    })

    if (!form) {
      return { success: false, message: "Form not found" }
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
    console.error("disablePublicAccess error:", error)
    return { success: false, message: "Error inesperado. Intenta de nuevo." }
  }
}
