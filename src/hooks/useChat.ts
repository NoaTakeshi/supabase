// src/hooks/useChat.ts
import { useState, useEffect } from 'react'
import { supabase }            from '../lib/supabaseClient'

interface Mensaje { id: string; texto: string; usuario: string; hora: string }

export function useChat(sala: string) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])

  useEffect(() => {
    const channel = supabase
      .channel(sala)
      .on('broadcast', { event: 'mensaje' }, ({ payload }) => {
        setMensajes(prev => [...prev, payload as Mensaje])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sala])

  const enviarMensaje = async (texto: string, usuario: string) => {
    const canal = supabase.channel(sala)
    await canal.send({ type: 'broadcast', event: 'mensaje', payload: {
      id:      crypto.randomUUID(),
      texto,
      usuario,
      hora:    new Date().toLocaleTimeString()
    }})
  }

  return { mensajes, enviarMensaje }
}