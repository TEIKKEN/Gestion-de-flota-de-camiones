import { useState, useEffect } from 'react'

/**
 * useLocalStorage
 * Sincroniza automáticamente el estado con localStorage.
 * Cada vez que el valor cambia, se guarda.
 * Al cargar la app, recupera lo que había guardado.
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error leyendo localStorage["${key}"]:`, error)
      return initialValue
    }
  })

  // Cada vez que storedValue cambie, guardarlo en localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error guardando localStorage["${key}"]:`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export default useLocalStorage