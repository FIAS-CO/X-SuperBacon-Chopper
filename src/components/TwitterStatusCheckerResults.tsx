import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Card, CardContent } from './ui/card';
import { loadAd, ResultPageAdsense1, ResultPageAdsense2 } from './adsense/AdSenseUtil';
import { clientEncryption } from './util/ClientEncryption';
import { FilterCheckbox, Legend, LoadingCard, ResultList, SessionResult, StatusHeader, StatusResult } from './results/StatusComponents';
import { Share } from 'lucide-react';
import { Button } from './ui/button';

const TwitterStatusResults = () => {
  const [results, setResults] = useState<StatusResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [checkTimestamp, setCheckTimestamp] = useState("");
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
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      const encryptedKey = clientEncryption.encrypt(ip || '');

      try {
        const results = await apiClient.checkUrlBatch(urlList, encryptedKey);
        const formattedResults: StatusResult[] = results.sessionResults.map((result: StatusResult) => ({
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

  const handleTweet = () => {
    const totalCount = results.length;
    const forbiddenCount = results.filter(r =>
      r.status === 'FORBIDDEN' || r.status === 'QUATE_FORBIDDEN'
    ).length;

    const tweetText = `${checkTimestamp}に${totalCount}件の投稿をチェックし${forbiddenCount}件が検索除外されていました`;
    const url = `https://x-searchban-checker.fia-s.com/history/${sessionId}`;
    const encodedText = encodeURIComponent(`${tweetText}\n${url}\n#検索除外チェッカー`);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  if (loading) {
    return <LoadingCard message='チェック中...' />
  }

  return (
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

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg break-all">
            <p className="text-sm text-gray-600 mb-2">履歴ページ:</p>
            <a
              href={`https://x-searchban-checker.fia-s.com/history/${sessionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://x-searchban-checker.fia-s.com/history/{sessionId}
            </a>
          </div>

          <Button
            onClick={handleTweet}
            className="w-full"
          >
            <Share className="w-4 h-4 mr-2" />
            結果をツイート
          </Button>
        </div>
      </CardContent>
      <Legend />

      <ResultPageAdsense2 />
    </Card>
  );
};

export default TwitterStatusResults;