// src/hooks/useChat.ts
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Mensaje { 
  id: string
  texto: string
  usuario: string
  hora: string 
}

export function useChat(sala: string) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    // Crear canal con configuracion de self-broadcast
    const channel = supabase.channel(sala, {
      config: {
        broadcast: { self: true } // Recibir los propios mensajes
      }
    })

    channel
      .on('broadcast', { event: 'mensaje' }, ({ payload }) => {
        console.log('[v0] Mensaje recibido:', payload)
        setMensajes(prev => [...prev, payload as Mensaje])
      })
      .subscribe((status) => {
        console.log('[v0] Estado del canal:', status)
      })

    channelRef.current = channel

    return () => { 
      console.log('[v0] Limpiando canal')
      supabase.removeChannel(channel) 
    }
  }, [sala])

  const enviarMensaje = async (texto: string, usuario: string) => {
    if (!channelRef.current) {
      console.log('[v0] Error: Canal no disponible')
      return
    }

    const mensaje: Mensaje = {
      id: crypto.randomUUID(),
      texto,
      usuario,
      hora: new Date().toLocaleTimeString()
    }

    console.log('[v0] Enviando mensaje:', mensaje)
    
    await channelRef.current.send({ 
      type: 'broadcast', 
      event: 'mensaje', 
      payload: mensaje
    })
  }

  return { mensajes, enviarMensaje }
}
