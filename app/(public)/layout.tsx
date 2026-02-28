export default function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      {children}
    </main>
  )
}