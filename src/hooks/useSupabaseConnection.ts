import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useSupabaseConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase.from('_healthcheck').select('*').limit(1)
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 = tabela não existe, mas conexão funciona
          throw error
        }
        
        setIsConnected(true)
        setError(null)
      } catch (err: any) {
        console.error('Erro ao conectar com Supabase:', err)
        setError(err.message)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  return { isConnected, isLoading, error }
}
