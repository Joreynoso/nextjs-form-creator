"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/actions/doctors/sync"
import { FormField } from '@/types/form.types'

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

export async function createForm(title: string, description: string) {
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
      name: title,
      description,
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

  if (!form) {
    return {
      success: false,
      message: "Error al actualizar el formulario"
    }
  }

  revalidatePath(`/dashboard/${formId}`)
  revalidatePath(`/dashboard/${formId}/edit`)
  revalidatePath("/dashboard")

  return {
    success: true,
    message: "Formulario actualizado correctamente",
    form: form
  }
}

export async function findForm(doctorId: string, query?: string) {
  // traer todos los formularios del doctor con fields
  const forms = await prisma.form.findMany({
    where: { doctorId },
    select: {
      id: true,
      name: true,
      description: true,
      isPublicOpen: true,
      fields: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  // si no hay query devolver todos
  if (!query) {
    return {
      success: true,
      forms: forms.map(f => ({
        id: f.id,
        name: f.name,
        description: f.description,
        isPublicOpen: f.isPublicOpen,
        editUrl: `/dashboard/${f.id}/edit`,
      }))
    }
  }

  // filtrar en JS con case insensitive — busca en nombre, descripción y labels de campos
  const q = query.toLowerCase()
  const filtered = forms.filter(f => {
    const matchesName = f.name?.toLowerCase().includes(q)
    const matchesDescription = f.description?.toLowerCase().includes(q)
    const fields = f.fields as { label: string }[]
    const matchesField = Array.isArray(fields) && fields.some(field =>
      field.label?.toLowerCase().includes(q)
    )
    return matchesName || matchesDescription || matchesField
  })

  return {
    success: true,
    forms: filtered.slice(0, 10).map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
      isPublicOpen: f.isPublicOpen,
      editUrl: `/dashboard/${f.id}/edit`,
    }))
  }
}

export async function saveGeneratedForm(
  title: string,
  description: string,
  fields: FormField[]
) {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, message: 'No autorizado' }
  }

  const doctor = await getOrCreateDoctor()

  const form = await prisma.form.create({
    data: {
      name: title,
      description,
      doctorId: doctor.id,
      fields: fields as unknown as Prisma.InputJsonValue
    }
  })

  if (!form) {
    return { success: false, message: 'Error al guardar el formulario' }
  }

  revalidatePath('/dashboard')

  return {
    success: true,
    message: 'Formulario guardado correctamente',
    form: {
      id: form.id,
      name: form.name,
      description: form.description ?? undefined,
      editUrl: `/dashboard/${form.id}/edit`
    }
  }
}