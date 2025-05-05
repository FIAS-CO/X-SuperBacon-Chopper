import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

declare global {
    interface Window {
        turnstile?: any;
    }
}

type TurnstileProps = {
    onSuccess?: (token: string) => void;
};

export type TurnstileHandle = {
    execute: () => void;
};

export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(
    ({ onSuccess }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const widgetIdRef = useRef<string | null>(null);
        const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

        useEffect(() => {
            if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;

            const id = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                size: 'invisible',
                callback: (token: string) => onSuccess?.(token),
            });
            widgetIdRef.current = id;

            // クリーンアップが必要な場合のみこの return を有効にする
            // return () => {
            //   if (widgetIdRef.current) {
            //     window.turnstile.remove(widgetIdRef.current);
            //     widgetIdRef.current = null;
            //   }
            // };
        }, [siteKey, onSuccess]);

        useImperativeHandle(ref, () => ({
            execute: () => {
                if (widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                    window.turnstile.execute(widgetIdRef.current);
                }
            },
        }));

        return <div ref={containerRef}></div>;
    }
);
