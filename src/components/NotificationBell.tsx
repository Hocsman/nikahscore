'use client'

import { useState } from 'react'
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'error': return 'bg-red-50 border-red-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="relative">
      {/* Bell Icon avec badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown des notifications */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />

            {/* Panneau notifications */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-800">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/50 rounded"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {unreadCount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-600 font-medium">
                      {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Tout marquer lu
                    </button>
                  </div>
                )}
              </div>

              {/* Liste notifications */}
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucune notification</p>
                    <p className="text-sm mt-1">Vous êtes à jour ! 🎉</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Icône type */}
                          <div className="text-2xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-semibold text-sm ${
                                !notification.read ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                  locale: fr
                                })}
                              </span>

                              <div className="flex gap-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    Marquer lu
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
