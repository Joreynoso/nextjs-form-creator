import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// rutas publicas
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/',
])

// middleware
export default clerkMiddleware(async (auth, request) => {
  console.log('-->[CLERK PROXY] Running for:', request.url)
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

// configuración de exportación
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}