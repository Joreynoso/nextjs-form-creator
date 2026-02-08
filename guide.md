# Guía de Implementación: Sistema de Formularios Médicos
## Versión Simplificada - Sin Webhooks

Sistema para que médicos/nutricionistas creen formularios personalizados y envíen links únicos a pacientes para recopilar información de primera consulta.

---

## 📋 Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Base de datos**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Autenticación**: Clerk (sin webhooks)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS

---

## 🚀 Fase 1: Configuración Inicial del Proyecto

### 1.1 Crear proyecto Next.js

```bash
npx create-next-app@latest medical-forms
```

Opciones recomendadas:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ✅ `src/` directory
- ❌ Turbopack (opcional)

```bash
cd medical-forms
```

### 1.2 Instalar dependencias necesarias

```bash
npm install @prisma/client @clerk/nextjs nanoid
npm install -D prisma
```

**Dependencias:**
- `@prisma/client`: Cliente de Prisma para queries
- `@clerk/nextjs`: Autenticación de usuarios
- `nanoid`: Generación de tokens únicos
- `prisma`: CLI de Prisma (dev dependency)

---

## 🔐 Fase 2: Configurar Clerk (Autenticación Simple)

### 2.1 Crear cuenta en Clerk

1. Ve a [clerk.com](https://clerk.com)
2. Crea una cuenta
3. Crea una nueva aplicación
4. Nombra tu aplicación: "Medical Forms"

### 2.2 Obtener credenciales

En el dashboard de Clerk:
1. Ve a **API Keys**
2. Copia las claves:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2.3 Configurar variables de entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Clerk (sin webhooks)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.4 Configurar Clerk en Next.js

**Archivo: `src/middleware.ts`**

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Rutas públicas (sin autenticación)
  publicRoutes: [
    "/", 
    "/f/(.*)",  // Formularios públicos
    "/gracias"
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Archivo: `src/app/layout.tsx`**

```typescript
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 2.5 Crear páginas de autenticación

**Archivo: `src/app/sign-in/[[...sign-in]]/page.tsx`**

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn />
    </div>
  );
}
```

**Archivo: `src/app/sign-up/[[...sign-up]]/page.tsx`**

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp />
    </div>
  );
}
```

---

## 🗄️ Fase 3: Configurar Supabase y Prisma

### 3.1 Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Nombra tu proyecto: "medical-forms"
4. Elige región más cercana
5. Crea contraseña segura para la base de datos

### 3.2 Obtener credenciales de Supabase

En el dashboard de Supabase:
1. Ve a **Settings** → **Database**
2. En **Connection String** → **URI**, copia la cadena de conexión
3. Reemplaza `[YOUR-PASSWORD]` con tu contraseña

### 3.3 Agregar a variables de entorno

En `.env.local`, agregar:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Nota:** `DATABASE_URL` usa connection pooling, `DIRECT_URL` es para migraciones.

### 3.4 Inicializar Prisma

```bash
npx prisma init
```

### 3.5 Configurar Prisma Schema

**Archivo: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Doctor {
  id        String   @id @default(cuid())
  userId    String   @unique // Clerk User ID
  email     String
  firstName String
  lastName  String
  createdAt DateTime @default(now())
  
  forms     Form[]
  patients  Patient[]
}

model Form {
  id          String   @id @default(cuid())
  doctorId    String
  name        String
  description String?
  fields      Json     // Array de preguntas con todos los tipos
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  doctor      Doctor   @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  patients    Patient[]
  
  @@index([doctorId])
}

model Patient {
  id              String    @id @default(cuid())
  token           String    @unique
  doctorId        String
  formId          String
  
  // Datos del paciente
  firstName       String?
  lastName        String?
  
  // Respuestas del formulario (soporta todos los tipos)
  formResponses   Json?
  
  // Estado
  formCompleted   Boolean   @default(false)
  completedAt     DateTime?
  
  // Timestamps
  createdAt       DateTime  @default(now())
  linkSentAt      DateTime  @default(now())
  
  doctor          Doctor    @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  form            Form      @relation(fields: [formId], references: [id])
  
  @@index([doctorId])
  @@index([token])
  @@index([formCompleted])
}
```

### 3.6 Ejecutar migración inicial

```bash
npx prisma migrate dev --name init
```

### 3.7 Generar Prisma Client

```bash
npx prisma generate
```

### 3.8 Crear utilidad de Prisma

**Archivo: `src/lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 👤 Fase 4: Sistema de Usuarios (Sin Webhooks)

### 4.1 Crear utilidad para obtener o crear doctor

**Archivo: `src/lib/get-or-create-doctor.ts`**

```typescript
import { currentUser } from '@clerk/nextjs';
import { prisma } from './prisma';

export async function getOrCreateDoctor() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error('No autenticado');
  }

  // Buscar doctor existente
  let doctor = await prisma.doctor.findUnique({
    where: { userId: user.id }
  });

  // Si no existe, crear automáticamente
  if (!doctor) {
    doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }
    });
  }

  return doctor;
}
```

**Nota:** Este código crea el doctor automáticamente la primera vez que accede a la app. No necesitas webhooks ni sincronización manual.

### 4.2 Ejemplo de uso

```typescript
// En cualquier página o API route
import { getOrCreateDoctor } from '@/lib/get-or-create-doctor';

export default async function DashboardPage() {
  const doctor = await getOrCreateDoctor();
  
  return <div>Bienvenido, Dr. {doctor.firstName}</div>;
}
```

---

## 📝 Fase 5: Tipos de TypeScript

**Archivo: `src/types/index.ts`**

```typescript
// Tipos de campos soportados
export type FieldType = 
  | 'text'        // Texto corto
  | 'number'      // Números
  | 'textarea'    // Texto largo
  | 'select'      // Dropdown
  | 'radio'       // Opción única
  | 'checkbox'    // Múltiples opciones
  | 'section';    // Separador visual

// Operadores para lógica condicional
export type ConditionalOperator = 
  | 'equals'      // Igual a un valor
  | 'includes'    // Incluye un valor (para checkbox)
  | 'notEmpty';   // Tiene algún valor

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];           // Para select, radio, checkbox
  allowOther?: boolean;         // Permite "Otro: ___"
  required?: boolean;
  showIf?: {
    fieldId: string;
    operator: ConditionalOperator;
    value: string | string[];
  };
}

export interface Form {
  id: string;
  doctorId: string;
  name: string;
  description?: string;
  fields: FormField[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  token: string;
  doctorId: string;
  formId: string;
  firstName?: string;
  lastName?: string;
  formResponses?: FormResponse;
  formCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  linkSentAt: Date;
}

export interface FormResponse {
  [fieldId: string]: string | number | string[]; // string[] para checkbox
}
```

---

## 🎨 Fase 6: Ejemplos de Formularios

### Ejemplo 1: Formulario Nutricional Completo

Basado en el formulario real analizado:

```typescript
const nutricionForm: FormField[] = [
  // Sección: Datos Personales
  {
    id: 'seccion_datos',
    type: 'section',
    label: 'Datos Personales'
  },
  {
    id: 'nombre',
    type: 'text',
    label: 'Escriba su nombre y apellido',
    required: true
  },
  {
    id: 'edad',
    type: 'number',
    label: 'Escriba su edad',
    required: true
  },
  {
    id: 'peso_altura',
    type: 'text',
    label: 'Indica tu peso y altura',
    placeholder: 'Ej: 70kg, 1.75m',
    required: true
  },
  {
    id: 'cintura',
    type: 'text',
    label: 'En caso de que puedas medir tu circunferencia de cintura, indícala',
    placeholder: 'Ej: 85cm'
  },
  
  // Sección: Condiciones Médicas
  {
    id: 'seccion_medica',
    type: 'section',
    label: 'Condiciones Médicas'
  },
  {
    id: 'condiciones',
    type: 'checkbox',
    label: '¿Tienes alguna de estas condiciones?',
    options: [
      'Hipotiroidismo',
      'Diabetes',
      'Resistencia a la insulina',
      'Problemas renales',
      'Problemas digestivos crónicos',
      'Colesterol elevado',
      'Hipertensión',
      'Hígado graso',
      'Enfermedades autoinmunes',
      'Ninguna'
    ],
    allowOther: true
  },
  {
    id: 'medicamentos',
    type: 'textarea',
    label: '¿Tomas medicamentos o suplementos? Por favor, menciónalos.',
    placeholder: 'Lista tus medicamentos y suplementos...'
  },
  {
    id: 'alergias',
    type: 'textarea',
    label: '¿Presentas alergias o intolerancias alimentarias?',
    placeholder: 'Describe tus alergias...'
  },
  
  // Sección: Síntomas Digestivos
  {
    id: 'seccion_digestivo',
    type: 'section',
    label: 'Síntomas Digestivos'
  },
  {
    id: 'sintomas',
    type: 'checkbox',
    label: '¿Presentas alguno de estos síntomas?',
    options: [
      'Acidez',
      'Hinchazón',
      'Estreñimiento',
      'Diarrea',
      'Ninguno'
    ]
  },
  
  // Sección: Hábitos Alimentarios
  {
    id: 'seccion_habitos',
    type: 'section',
    label: 'Hábitos Alimentarios'
  },
  {
    id: 'nivel_apetito',
    type: 'radio',
    label: '¿Cómo describirías tu nivel de apetito?',
    options: ['Alto', 'Normal', 'Bajo']
  },
  {
    id: 'hambre_entre_comidas',
    type: 'radio',
    label: '¿Sientes hambre entre comidas?',
    options: ['Nunca', 'A veces', 'Siempre']
  },
  {
    id: 'picoteo',
    type: 'radio',
    label: '¿Picoteas durante el día?',
    options: ['Nunca', 'A veces', 'Siempre']
  },
  {
    id: 'ansiedad_comer',
    type: 'radio',
    label: '¿Comes por ansiedad o emociones?',
    options: ['Frecuente', 'Ocasional', 'Nunca']
  },
  {
    id: 'recuerdo_alimentario',
    type: 'textarea',
    label: 'Recuerdo alimentario',
    placeholder: 'Describe qué comiste ayer desde que te levantaste hasta que te acostaste...'
  },
  {
    id: 'come_fuera',
    type: 'select',
    label: '¿Comes fuera de tu casa?',
    options: ['Nunca', 'A veces', 'Frecuentemente', 'Siempre']
  },
  {
    id: 'come_fuera_detalle',
    type: 'textarea',
    label: 'Si comes afuera, ¿qué sueles comer y qué eliges usualmente?',
    showIf: {
      fieldId: 'come_fuera',
      operator: 'includes',
      value: ['A veces', 'Frecuentemente', 'Siempre']
    }
  },
  {
    id: 'fin_semana',
    type: 'textarea',
    label: '¿Cambias tu dieta los fines de semana? ¿Qué sueles comer diferente?'
  },
  
  // Sección: Actividad Física
  {
    id: 'seccion_fisica',
    type: 'section',
    label: 'Actividad Física y Sueño'
  },
  {
    id: 'nivel_actividad',
    type: 'select',
    label: 'Nivel de actividad física',
    options: [
      'Sedentaria',
      'Ligeramente activa',
      'Moderadamente activa',
      'Muy activa',
      'Extremadamente activa'
    ]
  },
  {
    id: 'tipo_actividad',
    type: 'textarea',
    label: 'Tipo de actividad física que realizas',
    placeholder: 'Describe tu rutina de ejercicio...'
  },
  {
    id: 'horas_sueno',
    type: 'select',
    label: '¿Cuántas horas dormís por noche?',
    options: [
      'Menos de 5 horas',
      '5-6 horas',
      '6-7 horas',
      '7-8 horas',
      'Más de 8 horas'
    ]
  },
  
  // Sección: Preferencias Alimentarias
  {
    id: 'seccion_preferencias',
    type: 'section',
    label: 'Preferencias Alimentarias'
  },
  {
    id: 'alimentos_favoritos',
    type: 'textarea',
    label: '¿Cuáles son los alimentos que más disfrutas?'
  },
  {
    id: 'alimentos_evitas',
    type: 'textarea',
    label: '¿Cuáles son los alimentos que evitas?'
  },
  
  // Sección: Equipamiento de Cocina
  {
    id: 'seccion_equipamiento',
    type: 'section',
    label: 'Equipamiento de Cocina'
  },
  {
    id: 'equipamiento',
    type: 'checkbox',
    label: '¿Con qué equipamiento cuentas en tu cocina?',
    options: [
      'Cocina',
      'Batidora',
      'Sartén',
      'Olla',
      'Tostadora',
      'Airfryer',
      'Licuadora',
      'Mixer',
      'Freezer',
      'Horno',
      'Microondas',
      'Tuppers',
      'Recipientes térmicos'
    ]
  },
  
  // Comentarios adicionales
  {
    id: 'comentarios',
    type: 'textarea',
    label: '¿Quieres mencionar algún dato extra que no haya preguntado?',
    placeholder: 'Cualquier información adicional que consideres relevante...'
  }
];
```

### Ejemplo 2: Formulario Simple

```typescript
const simpleForm: FormField[] = [
  {
    id: 'nombre',
    type: 'text',
    label: '¿Cuál es tu nombre completo?',
    required: true
  },
  {
    id: 'objetivo',
    type: 'select',
    label: '¿Cuál es tu objetivo principal?',
    options: [
      'Bajar de peso',
      'Ganar masa muscular',
      'Mejorar salud general',
      'Control de enfermedad'
    ],
    required: true
  },
  {
    id: 'peso',
    type: 'number',
    label: '¿Cuál es tu peso actual? (kg)',
    required: true
  },
  {
    id: 'ejercicio',
    type: 'radio',
    label: '¿Con qué frecuencia haces ejercicio?',
    options: [
      'No hago ejercicio',
      '1-2 veces por semana',
      '3-4 veces por semana',
      '5+ veces por semana'
    ],
    showIf: {
      fieldId: 'objetivo',
      operator: 'equals',
      value: 'Ganar masa muscular'
    }
  }
];
```

---

## 🏗️ Fase 7: Estructura de Carpetas

```
medical-forms/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── forms/
│   │   │   │   └── route.ts
│   │   │   ├── patients/
│   │   │   │   ├── route.ts
│   │   │   │   └── generate-link/
│   │   │   │       └── route.ts
│   │   │   └── public/
│   │   │       └── form/
│   │   │           └── [token]/
│   │   │               ├── route.ts
│   │   │               └── submit/
│   │   │                   └── route.ts
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── forms/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── patients/
│   │   │       └── page.tsx
│   │   ├── f/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   ├── gracias/
│   │   │   └── page.tsx
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── FormBuilder/
│   │   │   ├── FormBuilder.tsx
│   │   │   ├── FieldEditor.tsx
│   │   │   └── FieldList.tsx
│   │   ├── PatientForm/
│   │   │   ├── DynamicForm.tsx
│   │   │   ├── FieldInput.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── Dashboard/
│   │   │   ├── PatientTable.tsx
│   │   │   └── FormCard.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── get-or-create-doctor.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.local
├── .gitignore
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 Fase 8: API Routes

### 8.1 Crear formulario

**Archivo: `src/app/api/forms/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { getOrCreateDoctor } from '@/lib/get-or-create-doctor';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const doctor = await getOrCreateDoctor();
    const { name, description, fields } = await req.json();

    const form = await prisma.form.create({
      data: {
        doctorId: doctor.id,
        name,
        description,
        fields
      }
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error creando formulario:', error);
    return NextResponse.json(
      { error: 'Error al crear formulario' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const doctor = await getOrCreateDoctor();

    const forms = await prisma.form.findMany({
      where: { doctorId: doctor.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error obteniendo formularios:', error);
    return NextResponse.json(
      { error: 'Error al obtener formularios' },
      { status: 500 }
    );
  }
}
```

### 8.2 Generar link para paciente

**Archivo: `src/app/api/patients/generate-link/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getOrCreateDoctor } from '@/lib/get-or-create-doctor';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const doctor = await getOrCreateDoctor();
    const { formId } = await req.json();

    // Verificar que el formulario pertenezca al doctor
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        doctorId: doctor.id
      }
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado' },
        { status: 404 }
      );
    }

    // Generar token único
    const token = nanoid(16);

    // Crear registro de paciente
    const patient = await prisma.patient.create({
      data: {
        token,
        doctorId: doctor.id,
        formId: form.id
      }
    });

    // Generar URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${baseUrl}/f/${token}`;

    return NextResponse.json({
      link,
      patientId: patient.id,
      token
    });
  } catch (error) {
    console.error('Error generando link:', error);
    return NextResponse.json(
      { error: 'Error al generar link' },
      { status: 500 }
    );
  }
}
```

### 8.3 Obtener formulario público (paciente)

**Archivo: `src/app/api/public/form/[token]/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const patient = await prisma.patient.findUnique({
      where: { token },
      include: {
        form: true
      }
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 404 }
      );
    }

    if (patient.formCompleted) {
      return NextResponse.json(
        { error: 'Formulario ya completado' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName
      },
      form: patient.form
    });
  } catch (error) {
    console.error('Error obteniendo formulario:', error);
    return NextResponse.json(
      { error: 'Error al obtener formulario' },
      { status: 500 }
    );
  }
}
```

### 8.4 Guardar respuestas del paciente

**Archivo: `src/app/api/public/form/[token]/submit/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const { firstName, lastName, responses } = await req.json();

    const patient = await prisma.patient.findUnique({
      where: { token }
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 404 }
      );
    }

    if (patient.formCompleted) {
      return NextResponse.json(
        { error: 'Formulario ya completado' },
        { status: 400 }
      );
    }

    // Guardar respuestas
    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        firstName,
        lastName,
        formResponses: responses,
        formCompleted: true,
        completedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error guardando respuestas:', error);
    return NextResponse.json(
      { error: 'Error al guardar respuestas' },
      { status: 500 }
    );
  }
}
```

### 8.5 Obtener pacientes del doctor

**Archivo: `src/app/api/patients/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { getOrCreateDoctor } from '@/lib/get-or-create-doctor';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const doctor = await getOrCreateDoctor();

    const patients = await prisma.patient.findMany({
      where: {
        doctorId: doctor.id,
        formCompleted: true
      },
      include: {
        form: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    return NextResponse.json(
      { error: 'Error al obtener pacientes' },
      { status: 500 }
    );
  }
}
```

---

## 🎨 Fase 9: Componentes Principales

### 9.1 Renderizador de campos dinámicos

**Archivo: `src/components/PatientForm/FieldInput.tsx`**

```typescript
'use client';

import { FormField, FormResponse } from '@/types';

interface FieldInputProps {
  field: FormField;
  value: string | number | string[] | undefined;
  onChange: (value: string | number | string[]) => void;
}

export function FieldInput({ field, value, onChange }: FieldInputProps) {
  const inputClass = "w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors";

  // Sección (solo visual, no tiene input)
  if (field.type === 'section') {
    return (
      <div className="pt-6 pb-2 border-b-2 border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700">{field.label}</h3>
      </div>
    );
  }

  // Texto corto
  if (field.type === 'text') {
    return (
      <input
        type="text"
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
        autoFocus
      />
    );
  }

  // Número
  if (field.type === 'number') {
    return (
      <input
        type="number"
        value={(value as number) || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
        autoFocus
      />
    );
  }

  // Texto largo
  if (field.type === 'textarea') {
    return (
      <textarea
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className={`${inputClass} resize-none`}
        autoFocus
      />
    );
  }

  // Select (dropdown)
  if (field.type === 'select') {
    return (
      <select
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        autoFocus
      >
        <option value="">Selecciona una opción</option>
        {field.options?.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  // Radio buttons (una opción)
  if (field.type === 'radio') {
    return (
      <div className="space-y-3">
        {field.options?.map(option => (
          <label
            key={option}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              value === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input
              type="radio"
              name={field.id}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 text-blue-600"
            />
            <span className="ml-3 text-lg">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  // Checkbox (múltiples opciones)
  if (field.type === 'checkbox') {
    const currentValues = (value as string[]) || [];

    const handleCheckboxChange = (option: string, checked: boolean) => {
      if (checked) {
        onChange([...currentValues, option]);
      } else {
        onChange(currentValues.filter(v => v !== option));
      }
    };

    return (
      <div className="space-y-3">
        {field.options?.map(option => (
          <label
            key={option}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              currentValues.includes(option)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input
              type="checkbox"
              checked={currentValues.includes(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="ml-3 text-lg">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return null;
}
```

### 9.2 Formulario dinámico para pacientes

**Archivo: `src/components/PatientForm/DynamicForm.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, FormResponse } from '@/types';
import { FieldInput } from './FieldInput';
import { ProgressBar } from './ProgressBar';

interface DynamicFormProps {
  form: Form;
  token: string;
  patientName?: {
    firstName: string;
    lastName: string;
  };
}

export function DynamicForm({ form, token, patientName }: DynamicFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<FormResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar campos visibles según condicionales
  const visibleFields = form.fields.filter(field => {
    if (!field.showIf) return true;

    const { fieldId, operator, value: conditionValue } = field.showIf;
    const fieldValue = responses[fieldId];

    if (operator === 'equals') {
      return fieldValue === conditionValue;
    }

    if (operator === 'includes') {
      const values = Array.isArray(conditionValue) ? conditionValue : [conditionValue];
      if (Array.isArray(fieldValue)) {
        return values.some(v => fieldValue.includes(v));
      }
      return values.includes(fieldValue as string);
    }

    if (operator === 'notEmpty') {
      if (Array.isArray(fieldValue)) {
        return fieldValue.length > 0;
      }
      return !!fieldValue;
    }

    return true;
  });

  const currentField = visibleFields[currentStep];
  const isLastStep = currentStep === visibleFields.length - 1;
  
  // Validar si puede avanzar
  const canGoNext = () => {
    if (currentField.type === 'section') return true;
    
    const value = responses[currentField.id];
    
    if (currentField.required) {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== '';
    }
    
    return true;
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
    } else {
      // Saltar secciones automáticamente
      let nextStep = currentStep + 1;
      while (nextStep < visibleFields.length && visibleFields[nextStep].type === 'section') {
        nextStep++;
      }
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Saltar secciones al retroceder
      let prevStep = currentStep - 1;
      while (prevStep >= 0 && visibleFields[prevStep].type === 'section') {
        prevStep--;
      }
      setCurrentStep(Math.max(0, prevStep));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/public/form/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: patientName?.firstName,
          lastName: patientName?.lastName,
          responses
        })
      });

      if (res.ok) {
        router.push('/gracias');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al enviar el formulario');
      }
    } catch (error) {
      alert('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <ProgressBar
          current={currentStep + 1}
          total={visibleFields.length}
        />

        <div className="mb-8">
          <FieldInput
            field={currentField}
            value={responses[currentField.id]}
            onChange={(value) => setResponses(prev => ({
              ...prev,
              [currentField.id]: value
            }))}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext() || isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isSubmitting ? 'Enviando...' : isLastStep ? '✓ Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 9.3 Barra de progreso

**Archivo: `src/components/PatientForm/ProgressBar.tsx`**

```typescript
interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Pregunta {current} de {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

---

## 🚢 Fase 10: Deployment

### 10.1 Preparar para producción

1. **Actualizar variables de entorno en Vercel/Railway**
2. **Ejecutar migraciones en producción**:

```bash
npx prisma migrate deploy
```

3. **Generar Prisma Client**:

```bash
npx prisma generate
```

### 10.2 Deploy en Vercel (recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar deploy
vercel

# Configurar variables de entorno en dashboard de Vercel
# Hacer deploy a producción
vercel --prod
```

---

## ✅ Checklist Final

- [ ] Clerk configurado y funcionando
- [ ] Supabase conectado
- [ ] Prisma migraciones ejecutadas
- [ ] Doctor se crea automáticamente al login
- [ ] Puede crear formularios con todos los tipos de campos
- [ ] Puede generar links únicos
- [ ] Pacientes pueden completar formularios
- [ ] Respuestas se guardan correctamente
- [ ] Dashboard muestra pacientes y respuestas
- [ ] Lógica condicional funciona
- [ ] Campos checkbox permiten múltiples selecciones
- [ ] Deployed en producción

---

## 📚 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Ver base de datos
npx prisma studio

# Crear migración
npx prisma migrate dev --name descripcion

# Reset DB (CUIDADO)
npx prisma migrate reset

# Deploy
vercel --prod
```

---

## 🎯 Próximos Pasos Opcionales

1. **Email notifications**: Enviar email al doctor cuando un paciente completa
2. **Exportar a PDF**: Generar PDF con las respuestas
3. **Analytics**: Tracking de cuántos pacientes completan
4. **Múltiples formularios**: Permitir al doctor tener varios formularios activos
5. **Edición de formularios**: Permitir editar formularios existentes
6. **Temas personalizados**: Colores y logos personalizados

---

¿Listo para empezar a construir? 🚀