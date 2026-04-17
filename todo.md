## 10. Validar errores usando zod primero y despues switch y case devolviendo objetos en los return de los sv actions.

## Error en el form builder
--> Averiguar como verificar en cada cambio que los campos no esten vacios, del lado del front y del backend, usando zod
para evitar que se envien nombres de pregunta vacios.

## Error en las sumbissions
-- > evitar el ratelimit para los envios de formularios, que no se puedan enviar milesa
a la vez.

## Error en el dashboard
--> Crear la barra lateral para el dashboard, que permita navegar entre los formularios, las estadisticas y las sumbissions.

## Mejorar ui, crear el menu de acciones flotante para cuando el formulario
sea demasiado largo, considerar la opción de guardar cambios también en ese
mismo menú flotante

## Error en el middleware de clerk,  '/api/chat(.*)' deberia ser privada
pero si la coloco privada no puedo acceder.

## Error en el MPC
--> la ui no devuelve error cuando la solicitud falla, deberia personalizar los mensajes para hacerle
--> saber al usuario que hizo mal, en caso de busquedas o creaciones

## BUG: tool loop on short conversational replies
─────────────────────────────────────────────
Descripción: El modelo reutiliza tools innecesariamente cuando el 
usuario responde con mensajes cortos ("perfecto", "gracias", "ok") 
después de una ejecución exitosa de tool.

Causa: El historial enviado a Groq incluye mensajes con tool_calls 
previos. El modelo interpreta ese contexto como señal para continuar 
en modo agente en lugar de volver al modo conversacional.

Soluciones posibles:
  1. Instrucción explícita en system prompt (solución actual, frágil)
  2. Detectar mensajes cortos antes de llamar a Groq y omitir tools
  3. Limpiar tool_calls del historial antes de enviarlo

Severidad: Media — no rompe funcionalidad pero genera UX confusa.
Archivo: app/api/chat/route.ts

## Error en la Tool generateForm.tool
--> no esta usando el type divisor para separar las preguntas por categoria,
--> si le pido al modelo que haga unform con 10 preguntas sobre algo y 10 sobre otra, deberia
agregar un separador para estos casos

## BUG: back button missing in manual form creation
─────────────────────────────────────────────────
El botón "atrás" aparece cuando el formulario se crea desde el chat
pero no cuando se crea manualmente desde el FormBuilder.
Revisar: qué prop o estado controla la visibilidad del botón.
Archivo: components/FormBuilder/