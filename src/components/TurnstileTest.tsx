import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

declare global {
    interface Window {
        turnstile?: any;
    }
}

type TurnstileProps = {
    onSuccess?: (token: string) => void;
    onReady?: () => void;
};

export type TurnstileHandle = {
    execute: () => void;
};

export const TurnstileTest = forwardRef<TurnstileHandle, TurnstileProps>(
    ({ onSuccess, onReady }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const widgetIdRef = useRef<string | null>(null);
        const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

        useEffect(() => {
            const loadTurnstile = (): Promise<void> => {
                return new Promise((resolve) => {
                    if (window.turnstile) {
                        resolve();
                        return;
                    }

                    const script = document.createElement('script');
                    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
                    script.async = true;
                    script.defer = true;
                    script.onload = () => resolve();
                    document.head.appendChild(script);
                });
            };

            let isMounted = true;

            loadTurnstile().then(() => {
                console.log('Turnstile script loaded');
                if (!isMounted) return;
                console.log('Is mounted.');
                if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
                console.log('before render');

                const id = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    size: 'invisible',
                    callback: (token: string) => onSuccess?.(token),
                });
                console.log('after render', id);
                widgetIdRef.current = id;
                onReady?.();
            });


            // クリーンアップが必要な場合のみこの return を有効にする
            // return () => {
            //   if (widgetIdRef.current) {
            //     window.turnstile.remove(widgetIdRef.current);
            //     widgetIdRef.current = null;
            //   }
            // };
            return () => {
                isMounted = false;
                if (widgetIdRef.current) {
                    try {
                        window.turnstile?.remove(widgetIdRef.current);
                    } catch (e) {
                        console.warn('Failed to remove Turnstile widget', e);
                    }
                    widgetIdRef.current = null;
                }
            };
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
