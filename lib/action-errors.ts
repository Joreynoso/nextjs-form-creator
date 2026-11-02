import { Prisma } from "@/lib/generated/prisma"

type ActionErrorContext = {
  action: string
  logContext: string
}

const UNAVAILABLE_CODES = new Set([
  "P1000",
  "P1001",
  "P1002",
  "P1008",
  "P1017",
  "P2024",
])

const UNAVAILABLE_MESSAGE =
  "el servicio de datos no está disponible en este momento. Intenta de nuevo en unos instantes."

export function getActionErrorMessage(
  error: unknown,
  { action, logContext }: ActionErrorContext
): string {
  console.error(`[server-action:${logContext}]`, error)

  const prefix = `No se pudo ${action}`

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return `${prefix}: ya existe un registro con esos datos.`
    }

    if (error.code === "P2003") {
      return `${prefix}: hay información relacionada que impide completar la operación.`
    }

    if (error.code === "P2025") {
      return `${prefix}: el registro no existe, ya fue eliminado o no tienes permisos para acceder a él.`
    }

    if (UNAVAILABLE_CODES.has(error.code)) {
      return `${prefix}: ${UNAVAILABLE_MESSAGE}`
    }

    return `${prefix}. Intenta de nuevo.`
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return `${prefix}: los datos enviados no son válidos.`
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return `${prefix}: ${UNAVAILABLE_MESSAGE}`
  }

  return `${prefix}. Intenta de nuevo.`
}
