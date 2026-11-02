import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-dvh flex-col">
            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 xl:px-0">
                {children}
            </main>

            <Footer />
        </div>
    )
}
