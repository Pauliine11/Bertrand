import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Routes publiques (accessibles sans authentification)
const isPublicRoute = createRouteMatcher([
  '/Connexion(.*)',
  '/inscription(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Si ce n'est pas une route publique, protéger la route
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

