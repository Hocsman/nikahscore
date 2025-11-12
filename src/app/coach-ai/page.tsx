'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Bot, Send, Loader2, Sparkles, MessageCircle, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import FeatureGate from '@/components/premium/FeatureGate'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function CoachAIPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger les conversations
  useEffect(() => {
    if (!user) return
    loadConversations()
  }, [user])

  // Charger les messages de la conversation courante
  useEffect(() => {
    if (!currentConversation) return
    loadMessages(currentConversation)
  }, [currentConversation])

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('coach_conversations')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setConversations(data || [])
      
      // Sélectionner automatiquement la première conversation
      if (data && data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0].id)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Erreur lors du chargement des conversations')
    } finally {
      setLoadingConversations(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Erreur lors du chargement des messages')
    }
  }

  const createNewConversation = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('coach_conversations')
        .insert({
          user_id: user!.id,
          title: 'Nouvelle conversation',
        })
        .select()
        .single()

      if (error) throw error
      
      setConversations([data, ...conversations])
      setCurrentConversation(data.id)
      setMessages([])
      toast.success('Nouvelle conversation créée')
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast.error('Erreur lors de la création de la conversation')
    }
  }

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('coach_conversations')
        .delete()
        .eq('id', conversationId)

      if (error) throw error

      setConversations(conversations.filter(c => c.id !== conversationId))
      
      if (currentConversation === conversationId) {
        setCurrentConversation(conversations[0]?.id || null)
        setMessages([])
      }

      toast.success('Conversation supprimée')
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !currentConversation || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    try {
      // Ajouter le message de l'utilisateur localement
      const tempUserMessage: Message = {
        id: 'temp-' + Date.now(),
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, tempUserMessage])

      // Appeler l'API du coach
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversation,
          message: userMessage,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message')
      }

      const data = await response.json()

      // Recharger les messages depuis la base de données
      await loadMessages(currentConversation)

      // Mettre à jour le titre de la conversation si c'est le premier message
      if (messages.length === 0) {
        const supabase = createClient()
        await supabase
          .from('coach_conversations')
          .update({ title: userMessage.substring(0, 50) + '...' })
          .eq('id', currentConversation)
        
        await loadConversations()
      }

    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Erreur lors de l\'envoi du message')
      // Retirer le message temporaire en cas d'erreur
      setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <FeatureGate featureCode="ai_coach">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    Coach AI Matrimonial
                    <Sparkles className="w-6 h-6 text-purple-500" />
                  </h1>
                  <p className="text-gray-600">Votre conseiller matrimonial intelligent, disponible 24/7</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2">
                👑 Exclusif Conseil
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Liste des conversations */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Conversations
                    </span>
                    <Button
                      size="sm"
                      onClick={createNewConversation}
                      className="h-8 px-2"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  {loadingConversations ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune conversation</p>
                      <Button
                        size="sm"
                        onClick={createNewConversation}
                        className="mt-3"
                        variant="outline"
                      >
                        Démarrer une conversation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={`group p-3 rounded-lg cursor-pointer transition-all ${
                            currentConversation === conv.id
                              ? 'bg-purple-100 border-2 border-purple-500'
                              : 'hover:bg-gray-100 border-2 border-transparent'
                          }`}
                          onClick={() => setCurrentConversation(conv.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conv.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(conv.updated_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteConversation(conv.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Zone de chat principale */}
            <div className="lg:col-span-3">
              <Card className="h-[calc(100vh-12rem)]">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!currentConversation ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Bienvenue sur le Coach AI</p>
                          <p className="text-sm mt-2">Créez une nouvelle conversation pour commencer</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-gray-500 max-w-md">
                          <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                          <p className="text-lg font-medium mb-2">Comment puis-je vous aider ?</p>
                          <div className="space-y-2 text-sm text-left">
                            <p>💬 Posez vos questions sur le mariage islamique</p>
                            <p>📊 Analysez vos résultats de compatibilité</p>
                            <p>💡 Obtenez des conseils personnalisés</p>
                            <p>🤝 Améliorez votre relation de couple</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex gap-3 ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.role === 'user'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-semibold">
                                  {user?.firstName?.[0] || user?.name?.[0] || 'U'}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Zone de saisie */}
                  {currentConversation && (
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Posez votre question au Coach AI..."
                          className="resize-none"
                          rows={2}
                          disabled={loading}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!input.trim() || loading}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          size="lg"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  )
}
