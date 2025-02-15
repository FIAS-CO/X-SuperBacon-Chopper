import React, { useEffect, useRef } from 'react';

export const ResponsiveDMMAd = () => {
    const width = window.innerWidth
    const id = width >= 728 ? "92588f6af3d070a657f0c15b8941e8f1"
        : width >= 370 ? "38de82848cc7f4e9c7973c5f2a04dbc0"
            : "6d604a977999f8116e8f60236365088b;";

    return (
        <div className="mb-3">
            <DMMAffiliate id={id} />
        </div>
    );
}

export const ResponsiveDMMAd2 = () => {
    const width = window.innerWidth
    const id = width >= 728 ? "92588f6af3d070a657f0c15b8941e8f1"
        : width >= 370 ? "38de82848cc7f4e9c7973c5f2a04dbc0"
            : "6d604a977999f8116e8f60236365088b;";

    return (
        <div className="mb-3">
            <DMMAffiliate id={id} />
        </div>
    );
}


/*
2つ以上配置すると一番下の広告しか表示されない
*/
interface DMMProps {
    id: string;
}
export const DMMAffiliate: React.FC<DMMProps> = ({ id }) => {
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
        <div ref={adRef} />
    );
};