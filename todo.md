## 10. Validar errores usando zod primero y despues switch y case devolviendo objetos en los return de los sv actions.

## UI ERRORS
--> Socluionar el color de los componentss de clerk auth, no esta tomando bien las clases gloables o las ignora.
--> implementar un dashboard con panel lateral, en el incluir las acciones del formBuilder como agregar preguntas

## Error en el form builder
--> Averiguar como verificar en cada cambio que los campos no esten vacios, del lado del front y del backend, usando zod
para evitar que se envien nombres de pregunta vacios.

## Error en las sumbissions
-- > evitar el ratelimit para los envios de formularios, que no se puedan enviar milesa
a la vez.

## Error en FormPlayer
Encountered two children with the same key, `Nueva opción`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.

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
--> agregar un boton con un icono de "tools" que sea un menú desplegable donde esten todas las herramientas disponibles
--> considerar mapear los nombres de mis tools con unos mas amables al usurio