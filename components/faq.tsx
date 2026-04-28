'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: "¿Qué es Form Builder?",
    answer: "Form Builder es una plataforma para crear formularios profesionales de forma rápida e intuitiva. Diseñá evaluaciones, encuestas y registros personalizados sin necesidad de conocimientos técnicos."
  },
  {
    question: "¿Cómo funciona?",
    answer: "Creá tu formulario agregando y configurando campos desde el editor visual. Una vez listo, activá el acceso público y compartí el link con tu audiencia o clientes. Las respuestas llegan directo a tu dashboard."
  },
  {
    question: "¿Cómo completan el formulario mis clientes?",
    answer: "Tus clientes reciben un link único y completan el formulario paso a paso, una pregunta a la vez. No necesitan crear una cuenta ni registrarse — solo abren el link y responden. La experiencia es limpia y optimizada para cualquier dispositivo."
  },
  {
    question: "¿Puedo crear formularios con inteligencia artificial?",
    answer: "Sí. Desde el chat de Form Builder describís la temática y la IA generará una propuesta de formulario con preguntas y tipos de campo adecuados para que solo tengas que revisar y guardar."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

 return (
    <section className="w-full max-w-4xl mx-auto py-24 px-6">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-foreground mb-4 italic">Preguntas Frecuentes</h2>
        <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">Todo lo que necesitas saber</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={cn(
              "group border rounded-lg px-4 transition-all duration-300 overflow-hidden hover:bg-card hover:shadow-lg",
              openIndex === index ? "bg-card border-border shadow-lg" : "bg-muted/20 border-border"
            )}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full px-4 py-6 flex items-center justify-between text-left transition-all"
            >
              <span className={cn(
                "font-serif text-lg md:text-xl tracking-tight transition-colors duration-300",
                openIndex === index ? "text-primary" : "text-foreground"
              )}>
                {faq.question}
              </span>
              <div className={cn(
                "shrink-0 p-2 rounded-full border transition-all duration-500 shadow-sm",
                openIndex === index 
                  ? "bg-primary text-primary-foreground border-primary rotate-180" 
                  : "bg-background text-muted-foreground border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
              )}>
                {openIndex === index ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </div>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-6 text-muted-foreground font-sans leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
