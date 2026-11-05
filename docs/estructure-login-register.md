Estructura del Login
1. Panel izquierdo --- Formulario (40%)
Contenido centrado verticalmente y organizado en este orden:
1. Logotipo, alineado arriba a la izquierda.
2. Título: "Log in".
3. Descripción breve.
4. Botón: Google.
5. Separador.
6. Campos de email y contraseña.
7. Botón principal: "Continue with email".
8. Opción de acceso mediante SSO.
9. Separador y enlace de registro: "Sign up".

> El formulario utiliza el componente `<SignIn />` preconstruido de Clerk, por lo que conserva todas las modalidades de acceso (OAuth, email/contraseña, SSO empresarial, MFA y recuperación de contraseña) y la localización configurada en la aplicación.
2. Panel derecho --- Carrusel (60%)
Área independiente para un carrusel informativo. Por ahora, utilizar
wireframes vacíos:
1. Espacio para título y descripción.
2. Área central con tres bloques o diapositivas horizontales.
3. Controles de navegación e indicadores de posición.
Mantener el contenido centrado, con márgenes y separación uniforme.
3. Distribución y adaptación
- Ocupar el 100% del ancho y alto del viewport (100vh).
- Distribuir horizontalmente: 40% formulario y 60% carrusel.
- Mantener el formulario centrado verticalmente.
- En móviles, adaptar las secciones; el carrusel puede ocultarse o
  ubicarse debajo del formulario.
