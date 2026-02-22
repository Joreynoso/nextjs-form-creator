export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="w-full py-5">
            {children}
        </div>
    )
}