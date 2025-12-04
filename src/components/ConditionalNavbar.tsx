'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './NavbarSimple'

export function ConditionalNavbar() {
    const pathname = usePathname()

    // Cacher le Navbar sur les routes dashboard
    if (pathname?.startsWith('/dashboard')) {
        return null
    }

    return <Navbar />
}
