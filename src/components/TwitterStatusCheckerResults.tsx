import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Card, CardContent } from './ui/card';
import { loadAd, ResultPageAdsense1, ResultPageAdsense2 } from './adsense/AdSenseUtil';
import { clientEncryption } from './util/ClientEncryption';
import { FilterCheckbox, Legend, LoadingCard, ResultList, StatusHeader, StatusResult } from './results/StatusComponents';

const TwitterStatusResults = () => {
  const [results, setResults] = useState<StatusResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // フィルターの状態
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
      console.log("start check urls")
      const urlsJson = sessionStorage.getItem('checkUrls');
      if (!urlsJson) {
        navigate('/');
        return;
      }

      const urlList = JSON.parse(urlsJson);
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      const encryptedKey = clientEncryption.encrypt(ip || '');

      try {
        const results = await apiClient.checkUrlBatch(urlList, encryptedKey);
        console.log(results)

        const formattedResults: StatusResult[] = results.map((result: StatusResult) => ({
          url: result.url,
          status: result.status
        }));

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
      </CardContent>
      <Legend />

      <ResultPageAdsense2 />
    </Card>

  );
};

export default TwitterStatusResults;