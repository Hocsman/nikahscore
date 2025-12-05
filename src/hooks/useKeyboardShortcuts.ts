import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardShortcuts() {
    const router = useRouter()
    const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false)
    const [gPressed, setGPressed] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return
            }

            // Cmd+K / Ctrl+K : Search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setSearchOpen(true)
                // TODO: Implement search modal
                console.log('Open search')
            }

            // ? : Show shortcuts help
            if (e.key === '?' && !e.shiftKey) {
                e.preventDefault()
                setIsShortcutsModalOpen(true)
            }

            // ESC : Close modals
            if (e.key === 'Escape') {
                setIsShortcutsModalOpen(false)
                setSearchOpen(false)
            }

            // G prefix for navigation
            if (e.key === 'g' && !gPressed) {
                setGPressed(true)
                setTimeout(() => setGPressed(false), 1000)
            }

            if (gPressed) {
                switch (e.key) {
                    case 'h':
                        router.push('/dashboard')
                        setGPressed(false)
                        break
                    case 'r':
                        router.push('/results')
                        setGPressed(false)
                        break
                    case 'c':
                        router.push('/couple')
                        setGPressed(false)
                        break
                    case 'a':
                        router.push('/dashboard')
                        setGPressed(false)
                        break
                    case 'p':
                        router.push('/premium')
                        setGPressed(false)
                        break
                }
            }

            // N : New questionnaire
            if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
                router.push('/questionnaire')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [router, gPressed, searchOpen])

    return {
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        searchOpen,
        setSearchOpen,
    }
}
