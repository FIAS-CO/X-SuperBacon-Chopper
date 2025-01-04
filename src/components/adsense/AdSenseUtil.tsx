import { useEffect } from "react";
import SEOMetaTags from "../seo/SEOMetaTag";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}
const hostname = "x-shadowban-checker.fia-s.com";

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

function Adsense(adSlot: string, adFormat: string) {
  useEffect(() => {
    if (window.location.hostname === hostname) {
      window.adsbygoogle = window.adsbygoogle || [];
      setTimeout(() => {
        window.adsbygoogle.push({});
      }, 1000);
    }
  }, []);

  return (
    <>
      <SEOMetaTags />
      <div>
        <div style={{ fontSize: "13px" }}>スポンサーリンク</div>
        {window.location.hostname == hostname ?
          (
            <ins className="adsbygoogle"
              style={{ display: "block", textAlign: "center" }}
              data-ad-layout="in-article"
              data-ad-format={adFormat} //"auto"
              data-ad-client="ca-pub-8151928728657048"
              data-ad-slot={adSlot}//"5127709417"
              data-full-width-responsive="false"></ins>
          ) :
          (
            <div style={{ padding: "10px", border: "1px solid #333" }}>
              広告
            </div>
          )}
      </div>
    </>
  )
}

export function TopPageAdsense1() {
  return Adsense("5127709417", "horizontal")
}

export function TopPageAdsense2() {
  return Adsense("7827668563", "auto")
}

export function TopPageAdsense3() {
  return Adsense("8366553175", "autorelaxed")
}

export function ResultPageAdsense1() {
  return Adsense("6044114922", "horizontal")
}

export function ResultPageAdsense2() {
  return Adsense("2575341880", "auto")
}

export function ResultPageAdsense3() {
  return Adsense("3963439584", "autorelaxed")
}

