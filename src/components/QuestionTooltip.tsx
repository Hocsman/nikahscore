'use client'

import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionTooltipProps {
  hint: string
  className?: string
}

export default function QuestionTooltip({ hint, className = '' }: QuestionTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-all duration-200 shadow-sm ${className}`}
        aria-label="Aide pour comprendre la question"
      >
        <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-yellow-400 dark:fill-yellow-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-72 p-4 mt-2 -left-32 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-600 rounded-xl shadow-xl"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {hint}
              </p>
            </div>
            {/* Petite flèche pointant vers le bouton */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-50 dark:bg-yellow-900/20 border-t-2 border-l-2 border-yellow-200 dark:border-yellow-600 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
