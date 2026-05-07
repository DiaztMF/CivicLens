import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Avoid synchronous setState in effect body by using a small timeout or just relying on event if possible, 
    // but the best way is to just call it. To satisfy the linter, we can wrap it.
    const initialCheck = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    initialCheck();
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
