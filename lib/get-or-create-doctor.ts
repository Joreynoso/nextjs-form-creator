
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from './prisma';

export async function getOrCreateDoctor() {
  console.log('-->[CLERK] get the doctor...');
  const user = await currentUser();

  console.log('-->[CLERK] user:', user);
  if (!user) {
    throw new Error('No autenticado');
  }

  // Buscar doctor existente
  console.log('-->[DB] search the doctor...');
  let doctor = await prisma.doctor.findUnique({
    where: { userId: user.id }
  });

  console.log('-->[DB] doctor:', doctor);
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