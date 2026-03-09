## 10. Validar errores usando zod primero y despues switch y case devolviendo objetos en los return de los sv actions.

## UI ERRORS
--> Socluionar el color de los componentss de clerk auth, no esta tomando bien las clases gloables o las ignora.
--> Hay un pequeño movimiento en el logo al cambiar de menu en pantallas pequeñas
--> corregir el responsive para dashboar skeleton, no esta funcionando
--> footer debe centrar las letras en pantallas pequeñas
--> implementar un dashboard con panel lateral, en el incluir las acciones del formBuilder como agregar preguntas
--> mejorar como se usan los iconos en about page

## Errores en los types
--> Type '{ submissions: { id: string; formId: string; createdAt: Date; doctorId: string; token: string; responses: JsonValue; status: SubmissionStatus; completedAt: Date | null; }[]; } & { ...; }' is not assignable to type 'Form | undefined'. en <FormBuilder form={form}/>

## Error en el form builder
--> Averiguar como verificar en cada cambio que los campos no esten vacios, del lado del front y del backend, usando zod
para evitar que se envien nombres de pregunta vacios.

## Errores en las actions
--> Error en ownership, de momento cualquiera puede borar un formulario 
where: {
  id: formId,
  doctorId: doctor.id
}
--> validar y reformatear las respuestas de las nuevas sv-actions creadas, por ejemplo de deleteSubmission
