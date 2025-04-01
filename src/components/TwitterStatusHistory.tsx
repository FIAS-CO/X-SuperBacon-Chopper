import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { FilterCheckbox, Legend, LoadingCard, ResultList, ShareResults, StatusHeader, TweetCheckResult } from './results/StatusComponents';
import { apiClient } from '../services/api';
import { loadAd, ResultPageAdsense1, ResultPageAdsense2 } from './adsense/AdSenseUtil';
import TabNavigation from './results/TabNavigation';
import { ApiErrorNotification } from './alert/ApiErrorNotification';

const TwitterStatusHistory = () => {
  const [results, setResults] = useState<TweetCheckResult[]>([]);
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { sessionId } = useParams();

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
    const fetchHistory = async () => {
      try {
        if (!sessionId) {
          navigate('/');
          return;
        }
        const data = await apiClient.getHistory(sessionId);
        setResults(data.results);
        setTimestamp(data.timestamp);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchHistory();
    }
  }, [sessionId]);

  if (loading) {
    return <LoadingCard message="履歴を取得中..." />;
  }

  return (
    <>
      <TabNavigation isShadowbanTab={false} />
      <h1 className="text-4xl font-bold text-center mb-8 mx-auto max-w-screen-xl px-4">
        Xポスト検索除外チェッカー
      </h1>
      <ApiErrorNotification />
      <Card className="w-full max-w-screen-xl mx-auto">
        <div className="px-6 pt-6">
          <ResultPageAdsense1 />
        </div>
        <StatusHeader title="チェック履歴" />
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
          <ResultList results={results} filters={filters} messageForNoData={'No Data.'} />
          {sessionId && <ShareResults sessionId={sessionId} results={results} timestamp={timestamp} />}
          <Legend />
          <ResultPageAdsense2 />
        </CardContent>
      </Card>
    </>
  );
};

export default TwitterStatusHistory;