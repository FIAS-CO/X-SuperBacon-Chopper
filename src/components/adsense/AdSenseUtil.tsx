
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

function Adsense() {
  return (
    <div style={{ margin: "1.5rem 0" }}>
      <div style={{ fontSize: "13px" }}>スポンサーリンク</div>
      {window.location.hostname == hostname ?
        (
          <ins className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-layout="in-article"
            data-ad-format="auto"
            data-ad-client="ca-pub-8151928728657048"
            data-ad-slot="5127709417"
            data-full-width-responsive="true"></ins>
        ) :
        (
          <div style={{ padding: "10px", border: "1px solid #333" }}>
            広告
          </div>
        )}
    </div>
  )
}

export default Adsense
