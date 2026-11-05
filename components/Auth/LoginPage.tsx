import Link from 'next/link'

import { BrandMark } from '@/components/ui/brand-mark'

import { AuthCarousel } from './AuthCarousel'
import { AuthSignIn } from './AuthSignIn'

export function LoginPage() {
    return (
        <div className="flex min-h-dvh w-full flex-col bg-canvas lg:h-dvh lg:flex-row lg:overflow-hidden">
            <section className="flex min-h-dvh w-full flex-col bg-canvas lg:h-full lg:min-h-0 lg:w-[40%] lg:min-w-[420px] lg:overflow-y-auto lg:border-r lg:border-hairline">
                <header className="flex h-20 shrink-0 items-center px-6 sm:px-10 lg:px-8 xl:px-12">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <BrandMark />
                        <span className="font-serif text-xl font-medium tracking-tight text-ink">
                            Form Builder
                        </span>
                    </Link>
                </header>

                <div className="flex flex-1 items-center justify-center px-6 pb-10 pt-2 sm:px-10 lg:px-8 xl:px-12">
                    <div className="w-full max-w-[380px]">
                        <AuthSignIn />
                    </div>
                </div>
            </section>

            <AuthCarousel />
        </div>
    )
}
