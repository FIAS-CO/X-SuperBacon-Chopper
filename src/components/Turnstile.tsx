import { useEffect, useRef } from 'react'

declare global {
    interface Window {
        turnstile?: any
    }
}

type TurnstileProps = {
    onSuccess?: (token: string) => void
}

export const Turnstile = ({ onSuccess }: TurnstileProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const renderedRef = useRef(false)
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

    useEffect(() => {
        if (!window.turnstile) return

        if (ref.current && !renderedRef.current) {
            window.turnstile.render(ref.current, {
                sitekey: siteKey,
                callback: (token: string) => onSuccess?.(token),
            })
            renderedRef.current = true
        }
    }, [siteKey, onSuccess])

    return <div ref={ref}></div>
}