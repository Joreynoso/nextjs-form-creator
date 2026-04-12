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
import { ArrowUp, ChartBar, PenLine, FileText, Lightbulb } from "lucide-react"
import FormCard from '@/components/Chat/FormCard'
import { useState, useRef, useEffect } from 'react'

type ToolResult = {
    name: string
    data: any
}

type Message = {
    role: 'user' | 'assistant'
    content: string
    toolResult?: ToolResult
}

export default function ChatPage() {

    // get user name
    const { user } = useUser()
    const firstName = user?.firstName

    // initial states
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    // ref for auto-resize textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // auto-resize effect
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [input])

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
                content: data.message,
                toolResult: data.toolResult ?? null
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

    // suggestions
    const suggestions = [
        { label: "Analizar Respuestas", icon: ChartBar },
        { label: "Crear preguntas", icon: PenLine },
        { label: "Resumir datos", icon: FileText },
        { label: "Sugerir formulario", icon: Lightbulb }
    ]

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
            <div className="max-w-6xl mx-auto w-full flex flex-col">

                {/* === ESTADO: SIN MENSAJES === */}
                {!hasMessages && (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">

                        {/* Saludo */}
                        <div className="text-center">
                            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-2">
                                ¡Hola, <span className='text-primary'>{firstName}!</span>
                            </h1>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                ¿En qué puedo ayudarte hoy?
                            </p>
                        </div>

                        {/* Input prominente */}
                        <div className="w-full max-w-4xl flex flex-col gap-3">
                            <div className="rounded-xl border border-border/50 bg-card flex items-end gap-2 p-2">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu consulta..."
                                    disabled={loading}
                                    className="flex-1 bg-transparent border-none focus:outline-none resize-none text-base leading-7 text-foreground placeholder:text-muted-foreground/50 placeholder:italic py-3 px-4 min-h-[44px] max-h-[200px] overflow-y-auto"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    className="rounded-lg bg-primary text-primary-foreground p-2 flex items-center justify-center disabled:opacity-40 shrink-0 self-end transition-opacity"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Chips de sugerencia */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mt-2">
                                {suggestions.map((chip) => {
                                    const Icon = chip.icon
                                    return (
                                        <button
                                            key={chip.label}
                                            onClick={() => setInput(chip.label)}
                                            disabled={loading}
                                            className="rounded-xl border border-border/30 bg-muted/20 px-3 py-1.5 text-base md:text-sm text-muted-foreground hover:bg-muted/40 transition-colors flex items-center justify-center gap-1.5 w-full"
                                        >
                                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                            {chip.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* === ESTADO: CON MENSAJES === */}
                {hasMessages && (
                    <div className="flex flex-col flex-1 min-h-[70vh]">

                        {/* Área de mensajes */}
                        <div className="flex-1 overflow-y-auto space-y-6 py-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={msg.role === 'user'
                                        ? "bg-primary/90 text-primary-foreground rounded-2xl px-5 py-3 text-base leading-7 max-w-[90%] sm:max-w-[75%] shadow-[0_2px_12px_hsl(var(--primary)/0.1)]"
                                        : "bg-card text-foreground border border-border/40 rounded-2xl px-5 py-3 text-base leading-7 max-w-[90%] sm:max-w-[75%]"
                                    }>
                                        {msg.content}
                                    </div>

                                    {/* Tarjetas de formularios */}
                                    {msg.toolResult && (
                                        <FormCard toolResult={msg.toolResult} />
                                    )}
                                </div>
                            ))}

                            {/* Indicador de carga */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-card text-foreground border border-border/40 rounded-2xl px-5 py-3 text-sm flex gap-1.5 items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse [animation-delay:200ms]" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse [animation-delay:400ms]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input fijo al fondo */}
                        <div className="mt-auto pt-6 pb-2 border-t border-border/20 px-4 sm:px-0">
                            <div className="rounded-xl border border-border/50 bg-card flex items-end gap-2 p-2">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu consulta..."
                                    disabled={loading}
                                    className="flex-1 bg-transparent border-none focus:outline-none resize-none text-base leading-7 text-foreground placeholder:text-muted-foreground/50 placeholder:italic py-3 px-4 min-h-[44px] max-h-[200px] overflow-y-auto"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    className="rounded-lg bg-primary text-primary-foreground p-2 flex items-center justify-center disabled:opacity-40 shrink-0 self-end transition-opacity"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Chips de sugerencia */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mt-2">
                                {suggestions.map((chip) => {
                                    const Icon = chip.icon
                                    return (
                                        <button
                                            key={chip.label}
                                            onClick={() => setInput(chip.label)}
                                            disabled={loading}
                                            className="rounded-xl border border-border/30 bg-muted/20 px-3 py-1.5 text-base md:text-sm text-muted-foreground hover:bg-muted/40 transition-colors flex items-center justify-center gap-1.5 w-full"
                                        >
                                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                            {chip.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}