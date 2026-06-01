# 🌟 Funcionalidades del Sistema (Features)

Este documento detalla cada una de las funcionalidades implementadas en **Form Creator**, agrupadas por módulos del sistema.

---

## 🔐 1. Autenticación y Sincronización de Perfiles

*   **Autenticación Premium**: Inicio de sesión y registro seguros mediante **Clerk NextJS**. Soporta autenticación por correo electrónico y proveedores sociales (Google).
*   **Sincronización Transparente (Sync On-demand)**: Al iniciar sesión por primera vez, el sistema detecta si el usuario existe en la base de datos de PostgreSQL a través de Server Actions (`sync.ts`). Si no existe, crea automáticamente un perfil `Doctor` sincronizando sus datos (`userId` de Clerk, correo, nombre y apellido) para asociar sus futuros formularios y respuestas de forma nativa.
*   **Soporte de Temas Integrado**: Los componentes de Clerk se adaptan automáticamente al tema visual activo (oscuro o claro) usando un wrapper de temas personalizado.

---

## 📊 2. Panel de Control del Doctor (Dashboard)

El Dashboard es la pantalla principal para el médico autenticado, diseñada para dar visibilidad total al estado de sus formularios.

*   **Tarjetas Estadísticas (KPIs)**:
    *   **Envíos Totales**: Cantidad acumulada de respuestas recibidas de pacientes.
    *   **Formularios Abiertos/Cerrados**: Muestra el total de formularios activos y habilitados al público frente a los que están en borrador o inactivos.
    *   **Tasa de Finalización**: Porcentaje de respuestas completadas exitosamente en comparación con los accesos registrados.
*   **Listado de Formularios**:
    *   Tarjetas visuales por cada formulario que muestran su título, descripción, fecha de última actualización, y cantidad de respuestas.
    *   Acceso directo al **Editor**, visualizador de **Respuestas (Submissions)**, y la opción de compartir el formulario público.
*   **Acciones Rápidas**:
    *   Botón flotante e interactivo para crear un nuevo formulario vacío de manera inmediata.

---

## 🛠️ 3. Constructor Visual de Formularios (FormBuilder)

El constructor visual permite a los médicos diseñar cuestionarios clínicos complejos sin tocar código.

*   **Tipos de Campos Soportados**:
    1.  `text`: Campo de entrada de texto corto (ej. Nombre, Edad).
    2.  `textarea`: Área de texto largo para descripciones detalladas (ej. Síntomas, Antecedentes).
    3.  `number`: Entrada numérica con validaciones nativas.
    4.  `select`: Menú desplegable para selección única estructurada.
    5.  `radio`: Botones de selección única para opciones visibles.
    6.  `checkbox`: Casillas de verificación múltiple para síntomas o condiciones.
    7.  `section`: Divisores visuales o títulos de sección para organizar formularios largos.
*   **Propiedades por Campo**:
    *   Etiqueta de pregunta (Label) y texto de sugerencia (Placeholder).
    *   Marcador de campo **Obligatorio / Requerido** (Required).
    *   Opción **Permitir "Otro"** (`allowOther`): Para campos selectores o radio, añade automáticamente una opción para que el paciente ingrese texto personalizado.
*   **Lógica Condicional Dinámica (`showIf`)**:
    *   Permite ocultar o mostrar preguntas en función de respuestas previas del paciente.
    *   Soporta operadores condicionales como `equals` (es igual a), `includes` (incluye, útil para checkboxes) y `notEmpty` (tiene algún valor).
*   **Controles de Publicación**:
    *   **Switch de Estado Público**: Activa o desactiva la URL pública de cara a los pacientes instantáneamente.
    *   **Token Público**: Generación de un `publicToken` único y seguro que previene la adivinación o indexación de formularios por personas ajenas.

---

## 🧠 4. Asistente Creador con Inteligencia Artificial (AI Chat)

El sistema integra un chat conversacional que permite delegar la creación y administración de formularios a una IA.

*   **Motor Llama 3.3 Versatile**: Respuestas ultra-rápidas basadas en Groq Cloud.
*   **Capacidad de Ejecución de Herramientas (Tool Calling)**:
    *   **Crear formulario vacío**: Crea una plantilla en blanco si el doctor lo solicita.
    *   **Generar formulario con preguntas**: Genera dinámicamente un formulario completo y estructurado a partir de indicaciones en lenguaje natural (ej: *"Crea un formulario para evaluación de asma con 5 preguntas"*).
    *   **Buscar formularios**: Permite filtrar y encontrar formularios creados anteriormente buscando por palabras clave de forma automática.
*   **Previsualización en Chat (Preview)**:
    *   Cuando la IA genera un formulario, se muestra una tarjeta con el diseño estructural e interactivo en el chat. El doctor puede revisar las preguntas sugeridas antes de guardarlas definitivamente en la base de datos.
*   **Mitigación de Tool Loops y Fugas de Prompt**:
    *   La lógica interna limpia el historial para evitar que el LLM se cicle ejecutando herramientas innecesarias y restringe la exposición de nombres de funciones técnicas, comunicándose siempre en lenguaje amigable.

---

## 🖥️ 5. Visualizador del Paciente (FormPlayer)

Cuando un paciente abre un enlace público (`/form/[token]`), entra en una interfaz de alto impacto visual diseñada para minimizar el abandono del formulario.

*   **Experiencia Paso a Paso (Estilo Typeform)**:
    *   Se presenta una sola pregunta en pantalla a la vez para mantener el foco del paciente.
*   **Animaciones y Micro-Interacciones**:
    *   Transiciones suaves controladas por **Framer Motion** al avanzar o retroceder de pregunta.
    *   Animaciones de hover y active en botones de selección y casillas de verificación.
*   **Validaciones en Tiempo Real**:
    *   Validaciones dinámicas (campo obligatorio, formato numérico correcto) antes de permitir que el paciente avance al siguiente paso.
*   **Diseño Responsivo Total (Mobile-First)**:
    *   Optimizado para su completado desde smartphones y tablets con interfaces de botones amplios y cómodos para tocar.

---

## 📥 6. Gestión de Respuestas (Submissions)

*   **Control del Ciclo de Vida**:
    *   Las sesiones de formulario tienen estados (`pending`, `completed`, `expired`, `cancelled`).
*   **Tabla de Respuestas del Doctor**:
    *   El doctor puede visualizar la lista completa de pacientes que han respondido, la fecha y hora de completado, y acceder al desglose de respuestas detallado para incorporarlo a la ficha médica.
