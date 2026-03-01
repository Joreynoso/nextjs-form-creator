"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor"
import { nanoid } from "nanoid"
import { FormField, PublicAccessResult } from '@/@types/types'


export async function createEmptyForm() {
  const { userId } = await auth()

  if (!userId) {
    return {
      success: false,
      message: "No autorizado"
    }
  }

  const doctor = await getOrCreateDoctor()

  const form = await prisma.form.create({
    data: {
      name: "Formulario sin título",
      description: "Descripción básica",
      doctorId: doctor.id,
      fields: []
    }
  })

  if (!form) {
    return {
      success: false,
      message: "Error al crear el formulario"
    }
  }

  revalidatePath("/dashboard")

  return {
    success: true,
    message: "Formulario creado correctamente",
    data: form.id
  }
}

export async function deleteForm(id: string) {
  const { userId } = await auth()

  if (!userId) {
    return {
      success: false,
      message: "No autorizado"
    }
  }

  const form = await prisma.form.delete({
    where: {
      id
    }
  })

  if (!form) {
    return {
      success: false,
      message: "Error al eliminar el formulario"
    }
  }

  revalidatePath("/dashboard")

  return {
    success: true,
    message: "Formulario eliminado correctamente"
  }
}

export async function updateForm(formId: string,
  name: string,
  description: string,
  fields: FormField[]) {

  const { userId } = await auth()

  if (!userId) {
    return {
      success: false,
      message: "No autorizado"
    }
  }

  const doctor = await getOrCreateDoctor()

  const form = await prisma.form.update({
    where: {
      id: formId,
      doctorId: doctor.id
    },
    data: {
      name,
      description,
      fields: fields as unknown as Prisma.InputJsonValue
    }
  })

  console.log('-->[FORM]', form)

  if (!form) {
    return {
      success: false,
      message: "Error al actualizar el formulario"
    }
  }

  // debe revalidarse donde vive el formulario sino
  // nextjs sigue sirviendo el snapshot viejo
  // los server components se cachean por ruta
  revalidatePath(`/dashboard/${formId}`)
  revalidatePath(`/dashboard/${formId}/edit`)
  revalidatePath("/dashboard")

  return {
    success: true,
    message: "Formulario actualizado correctamente",
    form: form
  }
}

export async function enablePublicAccess(formId: string): Promise<PublicAccessResult> {
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

  let token = form.publicToken ?? nanoid(16)

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
}

export async function disablePublicAccess(formId: string): Promise<PublicAccessResult> {
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
    token: updated.publicToken // 👈 SIEMPRE presente
  }
}