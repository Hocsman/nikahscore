import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

interface Shortcut {
    keys: string[]
    description: string
    category: string
}

const shortcuts: Shortcut[] = [
    // General
    { keys: ['⌘', 'K'], description: 'Rechercher', category: 'Général' },
    { keys: ['?'], description: 'Afficher les raccourcis', category: 'Général' },
    { keys: ['Esc'], description: 'Fermer les modales', category: 'Général' },

    // Navigation
    { keys: ['G', 'H'], description: 'Accueil Dashboard', category: 'Navigation' },
    { keys: ['G', 'R'], description: 'Mes résultats', category: 'Navigation' },
    { keys: ['G', 'C'], description: 'Mon couple', category: 'Navigation' },
    { keys: ['G', 'P'], description: 'Premium', category: 'Navigation' },

    // Actions
    { keys: ['N'], description: 'Nouveau questionnaire', category: 'Actions' },
]

interface ShortcutsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ShortcutsModal({ open, onOpenChange }: ShortcutsModalProps) {
    const categories = [...new Set(shortcuts.map(s => s.category))]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="dark:text-gray-100">Raccourcis Clavier</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                        Utilisez ces raccourcis pour naviguer plus rapidement
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {shortcuts
                                    .filter(s => s.category === category)
                                    .map((shortcut, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {shortcut.description}
                                            </span>
                                            <div className="flex gap-1">
                                                {shortcut.keys.map((key, j) => (
                                                    <kbd
                                                        key={j}
                                                        className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded shadow-sm"
                                                    >
                                                        {key}
                                                    </kbd>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        💡 Astuce : Appuyez sur <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 font-mono">?</kbd> à tout moment pour afficher ces raccourcis
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
