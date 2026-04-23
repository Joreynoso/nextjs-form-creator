import { prisma } from '@/lib/prisma'
import FormPlayer from '@/components/FormPlayer/FormPlayer'
import FormDisabled from '@/components/FormPlayer/FormDisabled'
import { FormField } from '@/types/form.types'

export default async function FormPage({ params }: { params: Promise<{ token: string }> }) {

  const { token } = await params

  // Buscar formulario público
  const form = await prisma.form.findUnique({
    where: { publicToken: token }
  })

  // Validaciones
  if (!form) {
    return <FormDisabled message="Formulario inexistente" />
  }

  if (!form.isActive) {
    return <FormDisabled message="Formulario desactivado por el profesional" />
  }

  if (!form.isPublicOpen) {
    return <FormDisabled message="Este formulario aún no está abierto" />
  }

  const fields = Array.isArray(form.fields) ? form.fields : []

  if (fields.length === 0) {
    return <FormDisabled message="Este formulario aún no está listo, contacte al profesional" />
  }

  // NO creamos submission aquí — se crea solo cuando el usuario envía sus respuestas
  return (
    <div className="w-full py-5">
      <FormPlayer
        fields={fields as unknown as FormField[]}
        formPublicToken={token}
      />
    </div>
  )
}