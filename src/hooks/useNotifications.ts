'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface Notification {
  id: string
  userId: string
  type: 'message' | 'match' | 'profile_view' | 'system' | 'achievement'
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const supabase = createClient()

  // Charger les notifications
  const loadNotifications = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount(data?.filter(n => !n.read).length || 0)
    } catch (error) {
      console.error('Erreur chargement notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erreur lecture notification:', error)
    }
  }

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Erreur lecture toutes notifications:', error)
    }
  }

  // Créer une nouvelle notification
  const createNotification = async (
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data,
          read: false
        })

      if (error) throw error
    } catch (error) {
      console.error('Erreur création notification:', error)
    }
  }

  // Demander la permission pour les notifications push
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // Envoyer une notification push
  const sendPushNotification = (title: string, message: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: icon || '/icons/heart-icon.png',
        badge: '/icons/badge-icon.png',
        tag: 'nikahscore-notification'
      })
    }
  }

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    if (!user?.id) return

    loadNotifications()

    // Subscription en temps réel
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
          
          // Notification push
          sendPushNotification(newNotification.title, newNotification.message)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id])

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    requestNotificationPermission,
    sendPushNotification,
    refresh: loadNotifications
  }
}

// Hook pour les notifications de match
export function useMatchNotifications() {
  const { createNotification } = useNotifications()

  const notifyNewMatch = async (userId: string, matchName: string, compatibilityScore: number) => {
    await createNotification(
      userId,
      'match',
      'Nouveau match !',
      `Vous avez ${compatibilityScore}% de compatibilité avec ${matchName}`,
      { matchName, compatibilityScore }
    )
  }

  const notifyProfileView = async (userId: string, viewerName: string) => {
    await createNotification(
      userId,
      'profile_view',
      'Profil consulté',
      `${viewerName} a consulté votre profil`,
      { viewerName }
    )
  }

  const notifyNewMessage = async (userId: string, senderName: string) => {
    await createNotification(
      userId,
      'message',
      'Nouveau message',
      `${senderName} vous a envoyé un message`,
      { senderName }
    )
  }

  const notifyAchievement = async (userId: string, achievementTitle: string) => {
    await createNotification(
      userId,
      'achievement',
      'Succès débloqué !',
      `Félicitations ! Vous avez débloqué : ${achievementTitle}`,
      { achievementTitle }
    )
  }

  return {
    notifyNewMatch,
    notifyProfileView,
    notifyNewMessage,
    notifyAchievement
  }
}
