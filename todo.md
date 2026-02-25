## 10. Validar errores usando zod primero y despues switch y case devolviendo objetos en los return de los sv actions.

## UI ERRORS
--> Socluionar el color de los componentss de clerk auth, no esta tomando bien las clases gloables o las ignora.
--> Hay un pequeño movimiento en el logo al cambiar de menu en pantallas pequeñas
--> corregir el responsive para dashboar skeleton, no esta funcionando
--> footer debe centrar las letras en pantallas pequeñas

## Errores en los types
--> Type '{ submissions: { id: string; formId: string; createdAt: Date; doctorId: string; token: string; responses: JsonValue; status: SubmissionStatus; completedAt: Date | null; }[]; } & { ...; }' is not assignable to type 'Form | undefined'. en <FormBuilder form={form}/>
