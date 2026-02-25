"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor"
import { FormField } from '@/@types/types'

/**
 * Crea un formulario con campos vacíos para el doctor autenticado.
 * @returns {success: true, message: "Formulario creado correctamente", data: form.id } 
 * Objeto que indica el éxito de la operación, un mensaje descriptivo y el ID del formulario creado.
 */
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

/**
 * Elimina un formulario por su ID.
 * @param id - ID del formulario a eliminar.
 * @returns {success: true, message: "Formulario eliminado correctamente"} 
 * Objeto que indica el éxito de la operación y un mensaje descriptivo.
 */
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

/**
 * Actualiza un formulario por su ID.
 * @param formId - ID del formulario a actualizar.
 * @param name - Nuevo nombre del formulario.
 * @param description - Nueva descripción del formulario.
 * @param fields - Nuevos campos del formulario.
 * @returns {success: true, message: "Formulario actualizado correctamente", form: form} 
 * Objeto que indica el éxito de la operación y un mensaje descriptivo.
 */
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

  revalidatePath("/dashboard")

  return {
    success: true,
    message: "Formulario actualizado correctamente",
    form: form
  }
}