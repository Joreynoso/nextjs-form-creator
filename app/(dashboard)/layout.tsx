import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />

            <main className="flex-1 w-full flex mx-auto min-h-[calc(100vh-64px)] px-4 xl:px-0 max-w-7xl">
                {children}
            </main>

            <Footer />
        </>
    )
}
