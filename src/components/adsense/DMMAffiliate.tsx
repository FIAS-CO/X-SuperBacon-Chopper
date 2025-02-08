import React, { useEffect, useRef } from 'react';

interface DMMProps {
    id: string;
    size: string;
    isSmartphone?: boolean;
}

export const DMMAffiliate: React.FC<DMMProps> = ({ id, size, isSmartphone }) => {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ins = document.createElement('ins');
        ins.className = 'dmm-widget-placement';
        ins.dataset.id = id;
        ins.style.background = 'transparent';

        if (adRef.current) {
            adRef.current.innerHTML = '';
            adRef.current.appendChild(ins);
        }

        const script = document.createElement('script');
        script.src = 'https://widget-view.dmm.com/js/placement.js';
        script.className = 'dmm-widget-scripts';
        script.dataset.id = id;

        if (adRef.current) {
            adRef.current.appendChild(script);
        }

        return () => {
            if (adRef.current) {
                adRef.current.innerHTML = '';
            }
        };
    }, [id]);

    return (
        <div>
            <div className="text-sm text-gray-600 mb-1">
                {size} ID={id.substring(0, 6)} {isSmartphone && 'スマホフラグ=1'}
            </div>
            <div ref={adRef} />
        </div>
    );
};