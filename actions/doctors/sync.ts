"use server"

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export async function getOrCreateDoctor() {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    let doctor = await prisma.doctor.findUnique({
      where: { userId: user.id }
    });

    if (!doctor) {
      doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        }
      });
    }

    return doctor;
  } catch (error) {
    console.error("getOrCreateDoctor error:", error)
    return null;
  }
}
