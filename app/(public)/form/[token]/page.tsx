import { prisma } from '@/lib/prisma'
import FormPlayer from '@/components/FormPlayer/FormPlayer'
import FormDisabled from '@/components/FormPlayer/FormDisabled'
import { nanoid } from 'nanoid'

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

  // Crear submission automáticamente
  const submission = await prisma.formSubmission.create({
    data: {
      token: nanoid(),
      formId: form.id,
      doctorId: form.doctorId
    }
  })

  if (!submission) {
    return <FormDisabled message="No se pudo iniciar el formulario" />
  }

  // Pasar token REAL al player
  return (
    <div className="w-full py-5">
      <FormPlayer
        fields={fields as any}
        submissionToken={submission.token}
      />
    </div>
  )
}