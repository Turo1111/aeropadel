import { useState } from "react"

const useLocalStorage = (key: string, initialValue: any) => {
  const [state, setState] = useState(() => {

    if (typeof window !== "undefined") {
        try {
            const value = window.localStorage.getItem(key)
            return value ? JSON.parse(value) : initialValue
          } catch (error) {
            console.log(error)
          }
    }
  })

  const setValue = (value: any)=> {
    if (typeof window !== "undefined"){
        try {
          const valueToStore = value instanceof Function ? value(state) : value
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          setState(value)
        } catch (error) {
          console.log(error)
        }
    }
  }

  const clearValue = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
        setState(initialValue);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return [state, setValue, clearValue]
}

export default useLocalStorage