'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, AlertTriangle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  show: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', show, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`
            flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border-2
            ${type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
            }
          `}>
            {type === 'success' ? (
              <CheckCircle className="h-6 w-6 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-6 w-6 flex-shrink-0" />
            )}
            <p className="font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
