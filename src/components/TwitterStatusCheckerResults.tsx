import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Card, CardContent } from './ui/card';
import { loadAd, ResultPageAdsense1, ResultPageAdsense2 } from './adsense/AdSenseUtil';
import { FilterCheckbox, Legend, LoadingCard, ResultList, ShareResults, StatusHeader, TweetCheckResult } from './results/StatusComponents';

const TwitterStatusResults = () => {
  const [results, setResults] = useState<TweetCheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [timestamp, setCheckTimestamp] = useState("");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchOk: true,
    searchForbidden: true,
    quoteForbidden: true,
    error: true
  });

  useEffect(() => {
    loadAd()
  }, []);

  useEffect(() => {
    const checkUrls = async () => {
      const urlsJson = sessionStorage.getItem('checkUrls');
      if (!urlsJson) {
        navigate('/');
        return;
      }

      const now = new Date();
      setCheckTimestamp(now.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));

      const urlList = JSON.parse(urlsJson);
      const encryptedKey = await apiClient.getEncryptedIpAsync();

      try {
        const results = await apiClient.checkUrlBatch(urlList, encryptedKey);
        const formattedResults: TweetCheckResult[] = results.sessionResults.map((result: TweetCheckResult) => ({
          url: result.url,
          status: result.status
        }));

        setSessionId(results.sessionId);
        setResults(formattedResults);
        setLoading(false);
        sessionStorage.removeItem('checkUrls');
      } catch (error) {
        console.error('Error checking URL:', error);
        setResults(urlList.map((url: string) => ({
          url,
          code: 500,
          status: 'UNKNOWN' as const,
          message: 'Failed to check status'
        })));
      }
    };

    checkUrls();
  }, [navigate]);

  if (loading) {
    return <LoadingCard message='チェック中...' />
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8">
        Xポスト検索除外チェッカー
      </h1>
      <Card className="w-full max-w-2xl mx-auto">
        <ResultPageAdsense1 />
        <StatusHeader title="チェック結果" />
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <FilterCheckbox
              id="searchOk"
              label="検索OK"
              checked={filters.searchOk}
              onChange={(checked) => setFilters(prev => ({ ...prev, searchOk: checked }))}
            />
            <FilterCheckbox
              id="searchForbidden"
              label="検索除外"
              checked={filters.searchForbidden}
              onChange={(checked) => setFilters(prev => ({ ...prev, searchForbidden: checked }))}
            />
            <FilterCheckbox
              id="quoteForbidden"
              label="引用元除外"
              checked={filters.quoteForbidden}
              onChange={(checked) => setFilters(prev => ({ ...prev, quoteForbidden: checked }))}
            />
            <FilterCheckbox
              id="error"
              label="エラー"
              checked={filters.error}
              onChange={(checked) => setFilters(prev => ({ ...prev, error: checked }))}
            />
          </div>
          <ResultList results={results} filters={filters} />
          {sessionId && <ShareResults sessionId={sessionId} results={results} timestamp={timestamp} />}
        </CardContent>
        <Legend />

        <ResultPageAdsense2 />
      </Card>
    </>
  );
};

export default TwitterStatusResults;