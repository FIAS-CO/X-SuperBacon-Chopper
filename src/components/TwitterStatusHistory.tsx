import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FilterCheckbox, Legend, LoadingCard, ResultList, StatusResult } from './results/StatusComponents';
import { apiClient } from '../services/api';
import { loadAd, ResultPageAdsense1, ResultPageAdsense2 } from './adsense/AdSenseUtil';

const TwitterStatusHistory = () => {
  const [results, setResults] = useState<StatusResult[]>([]);
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
        const results = await apiClient.getHistory(sessionId);
        console.log(results)
        setResults(results);
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
    <Card className="w-full max-w-2xl mx-auto">
      <ResultPageAdsense1 />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>チェック履歴</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          入力画面に戻る
        </Button>
      </CardHeader>
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
      </CardContent>
      <Legend />
      <ResultPageAdsense2 />
    </Card>
  );
};

export default TwitterStatusHistory;
