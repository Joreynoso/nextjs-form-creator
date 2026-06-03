const store = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, resetIn: record.resetAt - now }
  }

  record.count++
  return { success: true, remaining: maxRequests - record.count, resetIn: record.resetAt - now }
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    'unknown'
  )
}

// Limpieza periódica cada 5 minutos para evitar memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store) {
    if (now > record.resetAt) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)
