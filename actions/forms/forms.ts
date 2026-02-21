"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor"

export async function createEmptyForm() {

  console.log('-->[ACTION] createEmptyForm...');
  const { userId } = await auth()

  if (!userId) {
    console.log('-->[ACTION] No autorizado');
    throw new Error("No autorizado")
  }

  const doctor = await getOrCreateDoctor()
  console.log('-->[ACTION] doctor:', doctor);

  const form = await prisma.form.create({
    data: {
      name: "Formulario sin título",
      description: "Descripción básica",
      doctorId: doctor.id,
      fields: []
    }
  })
  console.log('-->[ACTION] form created:', form);

  revalidatePath("/dashboard")

  return form.id
}