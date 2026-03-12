// src/components/Chat.tsx
import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { useAuthContext } from '../context/AuthContext'

interface ChatProps {
  isOpen: boolean
  onClose: () => void
}

export function Chat({ isOpen, onClose }: ChatProps) {
  const { user } = useAuthContext()
  const { mensajes, enviarMensaje } = useChat('sala-general')
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensajes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim() || !user || enviando) return

    setEnviando(true)
    try {
      await enviarMensaje(texto.trim(), user.email || 'Usuario')
      setTexto('')
    } finally {
      setEnviando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span className="chat-header__title">Chat en Tiempo Real</span>
        <button 
          className="chat-header__close" 
          onClick={onClose}
          aria-label="Cerrar chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="chat-messages">
        {mensajes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="empty-state__title">Sin mensajes aun</p>
            <p>Se el primero en enviar un mensaje</p>
          </div>
        ) : (
          mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.usuario === user?.email ? 'chat-message--self' : 'chat-message--other'
              }`}
            >
              <div>{msg.texto}</div>
              <div className="chat-message__meta">
                {msg.usuario !== user?.email && <span>{msg.usuario.split('@')[0]} - </span>}
                {msg.hora}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input__field"
          placeholder="Escribe un mensaje..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={enviando}
        />
        <button
          type="submit"
          className="chat-input__send"
          disabled={!texto.trim() || enviando}
        >
          {enviando ? (
            <svg className="loading__spinner" width="20" height="20" viewBox="0 0 24 24" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  )
}

// Chat toggle button component
export function ChatToggle({ onClick, hasUnread }: { onClick: () => void; hasUnread?: boolean }) {
  return (
    <button 
      className="chat-toggle" 
      onClick={onClick}
      aria-label="Abrir chat"
    >
      <svg className="chat-toggle__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {hasUnread && (
        <span 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 12,
            height: 12,
            backgroundColor: 'var(--destructive)',
            borderRadius: '50%',
            border: '2px solid var(--card)'
          }}
        />
      )}
    </button>
  )
}
