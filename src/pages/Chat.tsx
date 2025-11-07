import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Briefcase,
  MessageSquare,
  MoreVertical
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { ChatMessage } from '@/types'

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Assistant. I can help you with resume optimization, interview preparation, job search strategies, and career advice. How can I assist you today?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your question. Let me help you with that. This is a sample response demonstrating the chat functionality.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const quickPrompts = [
    { icon: FileText, text: 'Help me improve my resume', color: 'blue' },
    { icon: Briefcase, text: 'Find jobs matching my skills', color: 'purple' },
    { icon: MessageSquare, text: 'Prepare for interview', color: 'green' },
    { icon: Sparkles, text: 'Career advice', color: 'orange' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="glass-nav sticky top-0 z-50 border-b">
        <div className="container-padding py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                  AI Career Assistant
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto smooth-scroll">
        <div className="container-padding py-4 sm:py-6 space-y-4 sm:space-y-6">
          {messages.length === 1 && (
            <div className="mb-6 sm:mb-8">
              <Card glass className="p-4 sm:p-6 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-3 sm:py-4 justify-start text-left"
                      onClick={() => setInputValue(prompt.text)}
                    >
                      <prompt.icon className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-${prompt.color}-600`} />
                      <span className="text-xs sm:text-sm">{prompt.text}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 animate-fade-in ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Avatar */}
              <Avatar className="shrink-0">
                <AvatarFallback
                  className={
                    message.role === 'assistant'
                      ? 'bg-gradient-to-br from-blue-100 to-purple-100'
                      : 'bg-gradient-to-br from-green-100 to-teal-100'
                  }
                >
                  {message.role === 'assistant' ? (
                    <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  )}
                </AvatarFallback>
              </Avatar>

              {/* Message Content */}
              <div
                className={`flex-1 min-w-0 ${
                  message.role === 'user' ? 'flex flex-col items-end' : ''
                }`}
              >
                <div
                  className={`inline-block max-w-full sm:max-w-[85%] lg:max-w-[75%] ${
                    message.role === 'user'
                      ? 'glass-card bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                      : 'glass-card'
                  } p-3 sm:p-4 rounded-2xl ${
                    message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 mt-1 px-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(message.timestamp)}
                  </span>
                  {message.role === 'assistant' && (
                    <Badge variant="glass" className="text-xs">
                      AI
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 sm:gap-4 animate-fade-in">
              <Avatar className="shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <div className="glass-card p-3 sm:p-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                  <div
                    className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="glass-nav border-t sticky bottom-0">
        <div className="container-padding py-3 sm:py-4">
          <div className="flex gap-2 sm:gap-3">
            <Input
              type="text"
              placeholder="Ask me anything about your career..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 text-sm sm:text-base"
              glass
            />
            <Button
              variant="primary"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="shrink-0 touch-target"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Chat
