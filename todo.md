## 10. Validar errores usando zod primero y despues switch y case devolviendo objetos en los return de los sv actions.

## Error en el form builder
--> Averiguar como verificar en cada cambio que los campos no esten vacios, del lado del front y del backend, usando zod
para evitar que se envien nombres de pregunta vacios.

## Error en las sumbissions
-- > evitar el ratelimit para los envios de formularios, que no se puedan enviar milesa
a la vez.


## Error en el dashboard
--> las estadisticas no se muestran correctamente, hay que verificar que se esten mostrando las estadisticas del formulario correcto.

## Error en el dashboard
--> Crear la barra lateral para el dashboard, que permita navegar entre los formularios, las estadisticas y las sumbissions.

## Unificar el borde de todas mis cards para que sea el mismo
y el diseño tenga coherencia en toda la pagina.

## Mejorar ui, crear el menu de acciones flotante para cuando el formulario
sea demasiado largo, considerar la opción de guardar cambios también en ese
mismo menú flotante

## Error en el middleware de clerk,  '/api/chat(.*)' deberia ser privada
pero si la coloco privada no puedo acceder.

## Verificar o provar modelos con capas gratuitas o modelos de gemini que no tengan costo
o intentar arreglar el mpc usando groq

## Error en el chat
--> el nombre del usuario tarda un poco en mostrarse, esto no deberia ser asi, deberia mostrarse inmediatamente al cargar la pagina.
-->  const { user } = useUser()
-->  const firstName = user?.firstName

## Errir en la ui
--> el chat debe permanercer con los chips igual que en el estado inicial, cuando hay mensajes.
--> que cuando no hay mensajes.

## Error en el MPC
--> la ui no devuelve error cuando la solicitud falla, deberia personalizar los mensajes para hacerle
--> saber al usuario que hizo mal, en caso de busquedas o creaciones

## Improve UI
--> agregar un boton con un icono de "tools" que sea un menú desplegable donde esten todas las herramientas disponibles, createForm, finForm. De momento solo esas dos, mapear los nombres para que queden mas amigables al usuario.

## Ui general
--> redondear todos los botones de la página para conservar la coherencia.

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