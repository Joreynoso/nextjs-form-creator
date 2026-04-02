"use server"

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export async function getOrCreateDoctor() {
  const user = await currentUser();

  if (!user) {
    throw new Error('No autenticado');
  }

  // Buscar doctor existente
  let doctor = await prisma.doctor.findUnique({
    where: { userId: user.id }
  });

  // Si no existe, crear automáticamente
  if (!doctor) {
    doctor = await prisma.doctor.create({
      data: {
        userId: user.id, // ID del usuario de Clerk
        email: user.emailAddresses[0].emailAddress,// Email del usuario de Clerk
        firstName: user.firstName || '',// Nombre del usuario de Clerk
        lastName: user.lastName || '', // Apellido del usuario de Clerk
      }
    });
  }

  return doctor;
}
