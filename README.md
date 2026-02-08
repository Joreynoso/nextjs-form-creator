# Sistema de Formularios Médicos

Sistema web que permite a médicos y nutricionistas crear formularios personalizados y enviar links únicos a sus pacientes para recopilar información de primera consulta.

## ¿Qué hace este proyecto?

Este sistema permite:

- **Médicos/Nutricionistas**: Crear formularios personalizados con diferentes tipos de preguntas (texto, opciones múltiples, checkboxes, etc.)
- **Pacientes**: Recibir un link único para completar el formulario antes de su primera consulta
- **Gestión**: Ver y administrar las respuestas de los pacientes desde un dashboard

## Tecnologías principales

- **Next.js 14+** - Framework de React
- **Supabase** - Base de datos PostgreSQL
- **Prisma** - ORM para manejo de base de datos
- **Clerk** - Autenticación de usuarios
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Copia .env.local.example a .env.local y completa las credenciales

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Flujo de trabajo

1. El médico se registra y crea un formulario personalizado
2. El médico genera un link único para cada paciente
3. El paciente recibe el link y completa el formulario
4. El médico visualiza las respuestas en su dashboard

## Documentación completa

Para una guía detallada de implementación, consulta el archivo `guide.md`.
