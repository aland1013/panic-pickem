import { useRef, useEffect } from 'react'

export const useAutoFocus = (dependencies: Array<any> = [], enabled) => {
  const ref = useRef(null)

  useEffect(() => {
    if (enabled) {
      ref.current.focus()
    }
  }, dependencies)

  return ref
}
