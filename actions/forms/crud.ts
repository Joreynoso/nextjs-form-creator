"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/actions/doctors/sync"
import { FormField } from '@/types/form.types'

// import validadores
import { validateFormFields } from '@/lib/validators/form.validator'
import { FormNameSchema } from '@/lib/schemas/form.schema'
import { getActionErrorMessage } from '@/lib/action-errors'

export async function createEmptyForm() {
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
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "crear el formulario",
        logContext: "createEmptyForm"
      })
    }
  }
}

export async function createForm(title: string, description: string) {
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
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "crear el formulario",
        logContext: "createForm"
      })
    }
  }
}

export async function deleteForm(id: string) {
  try {
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
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "eliminar el formulario",
        logContext: "deleteForm"
      })
    }
  }
}

export async function updateForm(formId: string,
  name: string,
  description: string,
  fields: FormField[]) {

  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: "No autorizado"
      }
    }

    const validation = validateFormFields(fields)
    if (!validation.success) {
      return {
        success: false,
        message: validation.error
      }
    }

    const doctor = await getOrCreateDoctor()

    if (!doctor) {
      return { success: false, message: "No autorizado" }
    }

    const form = await prisma.form.update({
      where: {
        id: formId,
        doctorId: doctor.id
      },
      data: {
        name,
        description,
        fields: validation.data as unknown as Prisma.InputJsonValue
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
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "actualizar el formulario",
        logContext: "updateForm"
      })
    }
  }
}

export async function renameForm(formId: string, name: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: "No autorizado"
      }
    }

    const parsedName = FormNameSchema.safeParse(name)

    if (!parsedName.success) {
      return {
        success: false,
        message: parsedName.error.issues[0]?.message ?? "Nombre inválido"
      }
    }

    const doctor = await getOrCreateDoctor()

    if (!doctor) {
      return { success: false, message: "No autorizado" }
    }

    const existingForm = await prisma.form.findFirst({
      where: {
        id: formId,
        doctorId: doctor.id
      },
      select: {
        id: true
      }
    })

    if (!existingForm) {
      return {
        success: false,
        message: "Formulario no encontrado"
      }
    }

    const form = await prisma.form.update({
      where: {
        id: existingForm.id
      },
      data: {
        name: parsedName.data
      }
    })

    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/${formId}`)
    revalidatePath(`/dashboard/${formId}/edit`)

    return {
      success: true,
      message: "Nombre actualizado correctamente",
      form: {
        id: form.id,
        name: form.name
      }
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "actualizar el nombre del formulario",
        logContext: "renameForm"
      })
    }
  }
}

export async function findForm(doctorId: string, query?: string) {
  try {
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
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "cargar los formularios",
        logContext: "findForm"
      }),
      forms: []
    }
  }
}

export async function saveGeneratedForm(
  title: string,
  description: string,
  fields: FormField[]
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, message: 'No autorizado' }
    }

    const doctor = await getOrCreateDoctor()

    if (!doctor) {
      return { success: false, message: 'No autorizado' }
    }

    const validation = validateFormFields(fields)
    if (!validation.success) {
      return {
        success: false,
        message: validation.error
      }
    }

    const form = await prisma.form.create({
      data: {
        name: title,
        description,
        doctorId: doctor.id,
        fields: validation.data as unknown as Prisma.InputJsonValue
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
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error, {
        action: "guardar el formulario",
        logContext: "saveGeneratedForm"
      })
    }
  }
}