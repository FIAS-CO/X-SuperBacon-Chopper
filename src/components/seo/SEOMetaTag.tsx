import { Helmet } from 'react-helmet';

interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

const SEOMetaTags = ({
  title = 'Xポスト検索除外チェッカー',
  description = 'Xのポストが検索から除外されているかどうかを簡単にチェックできるツールです。複数URLの一括チェックに対応しています。',
  keywords = 'X,ポスト,Twitter,ツイート,検索除外,チェッカー,SNS,ソーシャルメディア,検索除外,除外検索,調べ方,検索',
  ogTitle,
  ogDescription,
  ogImage = '/api/placeholder/1200/630',
  twitterCard = 'summary_large_image',
  canonicalUrl,
}: SEOMetaTagsProps) => {
  const siteUrl = window.location.origin;
  const currentUrl = canonicalUrl || window.location.href;

  return (
    <Helmet>
      {/* 基本的なメタタグ */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph メタタグ */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content={title} />

      {/* Twitter Card メタタグ */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* その他の重要なメタタグ */}
      <link rel="canonical" href={currentUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />

      {/* PWAサポート用のメタタグ */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};

export default SEOMetaTags;