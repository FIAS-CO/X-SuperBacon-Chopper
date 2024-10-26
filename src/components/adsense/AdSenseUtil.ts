
declare global {
    interface Window {
        adsbygoogle: any;
    }
}
const hostname = "x-searchban-checker.fia-s.com";

export function loadAd() {
    if (window.location.hostname === hostname) {
        // AdSenseスクリプトの初期化
        const adsbygoogle = document.createElement('script');
        adsbygoogle.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8151928728657048";
        adsbygoogle.async = true;
        adsbygoogle.crossOrigin = "anonymous";
        document.head.appendChild(adsbygoogle);

        // DOMが更新された後にAdSenseを再実行
        window.adsbygoogle = window.adsbygoogle || [];
        setTimeout(() => {
            window.adsbygoogle.push({});
        }, 1000);
    }
}
