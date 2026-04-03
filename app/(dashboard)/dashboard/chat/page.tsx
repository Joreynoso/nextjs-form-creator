'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useUser } from "@clerk/nextjs"
import { Send } from "lucide-react"
import { useState } from 'react'

type Message = {
    role: 'user' | 'assistant' | 'tool'
    content: string
}


export default function ChatPage() {

    // get user name
    const { user } = useUser()
    const firstName = user?.firstName

    // initial states
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    // sendMessage to api/chat
    const sendMessage = async () => {
        if (!input.trim() || loading) return

        const userMessage: Message = { role: 'user', content: input }
        const updatedMessages = [...messages, userMessage]

        setMessages(updatedMessages)
        setInput('')
        setLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
            })

            const data = await response.json()

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message
            }])

        } catch (error) {
            console.error('Error en chat:', error)
        } finally {
            setLoading(false)
        }
    }

    // handleKeyDown to send message
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    // hasMessages to check if there are messages
    const hasMessages = messages.length > 0

    // render return
    return (
        <div className="w-full py-5">
            {/* Breadcrumb — no tocar */}
            <Breadcrumb className='mb-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chat</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Layout principal */}
            <div className="max-w-3xl mx-auto w-full flex flex-col min-h-[70vh]">

                {/* === ESTADO: SIN MENSAJES === */}
                {!hasMessages && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-8">

                        {/* Saludo */}
                        <div className="text-center">
                            <h1 className="font-serif text-4xl font-medium text-foreground mb-2">
                                ¡Hola, <span className='text-primary'>{firstName}</span>!
                            </h1>
                            <p className="text-base text-muted-foreground">
                                ¿En qué puedo ayudarte hoy?
                            </p>
                        </div>

                        {/* Input prominente */}
                        <div className="w-full relative">
                            <textarea
                                rows={3}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe tu consulta..."
                                disabled={loading}
                                className="w-full rounded-2xl border border-border/40 bg-[oklch(0.24_0.013_48)] px-6 py-5 text-base text-foreground placeholder:text-muted-foreground/50 placeholder:italic focus:outline-none focus:border-border/60 resize-none"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="absolute bottom-4 right-4 rounded-xl bg-primary text-primary-foreground px-5 py-2 text-sm font-medium disabled:opacity-40 flex items-center gap-2 transition-opacity"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Enviar
                            </button>
                        </div>

                    </div>
                )}

                {/* === ESTADO: CON MENSAJES === */}
                {hasMessages && (
                    <div className="flex flex-col flex-1">

                        {/* Área de mensajes */}
                        <div className="flex-1 overflow-y-auto space-y-6 py-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm ${msg.role === 'user'
                                            ? 'bg-primary/90 text-primary-foreground ml-auto'
                                            : 'bg-muted/30 text-foreground border border-border/30'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {/* Indicador de carga */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted/30 text-foreground border border-border/30 rounded-2xl px-5 py-3 text-sm flex gap-1.5 items-center h-[44px]">
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-pulse" />
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input fijo al fondo */}
                        <div className="mt-auto pt-4 relative">
                            <textarea
                                rows={2}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe tu consulta..."
                                disabled={loading}
                                className="w-full rounded-2xl border border-border/40 bg-[oklch(0.24_0.013_48)] px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 placeholder:italic focus:outline-none focus:border-border/60 resize-none pr-28"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="absolute bottom-3 right-3 rounded-xl bg-primary text-primary-foreground px-5 py-2 text-sm font-medium disabled:opacity-40 flex items-center gap-2 transition-opacity"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Enviar
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}