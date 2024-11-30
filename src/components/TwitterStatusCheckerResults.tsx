import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { apiClient } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { loadAd, ResultPageAdsense1, ResultPageAdsense2 } from './adsense/AdSenseUtil';
import { clientEncryption } from './util/ClientEncryption';

interface TweetStatus {
  url: string; // APIの方のTweetStatusには無い項目
  code: number;
  status: Status;
  message: string;
}

// ステータスの型定義
type Status = 'AVAILABLE' | 'FORBIDDEN' | 'NOT_FOUND' | 'UNKNOWN' | 'INVALID_URL' | 'QUATE_FORBIDDEN';

// ステータスに関する情報を一元管理するオブジェクト
const STATUS_CONFIG = {
  AVAILABLE: {
    text: '検索OK',
    className: 'bg-green-100 text-green-700'
  },
  FORBIDDEN: {
    text: '検索除外',
    className: 'bg-red-100 text-red-700'
  },
  NOT_FOUND: {
    text: 'エラー',
    className: 'bg-gray-100 text-gray-700'
  },
  UNKNOWN: {
    text: 'エラー',
    className: 'bg-gray-100 text-gray-700'
  },
  INVALID_URL: {
    text: 'エラー',
    className: 'bg-gray-100 text-gray-700'
  },
  QUATE_FORBIDDEN: {
    text: '引用元除外',
    className: 'bg-red-100 text-red-700'
  }
} as const;

// ステータス表示用のコンポーネント
const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`px-3 py-1 rounded-md inline-flex items-center w-fit ${config.className}`}>
      {config.text}
    </div>
  );
};

const FilterCheckbox: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
    </label>
  );
};

const TwitterStatusResults = () => {
  const [results, setResults] = useState<TweetStatus[]>([]);
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

        const formattedResults: TweetStatus[] = results.map((result: TweetStatus) => ({
          url: result.url,
          code: result.code,
          status: result.status,
          message: result.message
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

  // 結果をフィルタリング
  const filteredResults = results.filter(result => {
    if (result.status === 'AVAILABLE') return filters.searchOk;
    if (result.status === 'FORBIDDEN') return filters.searchForbidden;
    if (result.status === 'QUATE_FORBIDDEN') return filters.quoteForbidden;
    return filters.error; // NOT_FOUND, UNKNOWN, INVALID_URLはすべてerrorとして扱う
  });

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">チェック中...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <ResultPageAdsense1 />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>チェック結果</CardTitle>
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
        <div className="space-y-2">
          {filteredResults.map((result, index) => (
            <div
              key={index}
              className="flex flex-col text-left md:flex-row md:items-center md:justify-between p-4 rounded-lg border gap-2 md:gap-4"
            >
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all md:flex-1 md:min-w-0"
              >
                {result.url}
              </a>
              <StatusBadge status={result.status} />
            </div>
          ))}
        </div>
      </CardContent>
      <div className="ml-7 mt-4 text-left text-sm text-slate-500">
        <p className="mb-2">＜凡例＞</p>
        <div className="space-y-2">
          <p>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs mr-2">検索OK</span>
            検索除外されていないポストです。
          </p>
          <p>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs mr-2">検索除外</span>
            検索除外されているポストです。
          </p>
          <p>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs mr-2">引用元除外</span>
            引用元が検索除外されているポストです。
          </p>
          <p>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs mr-2">エラー</span>
            ポストが存在しない、URLが間違っているなどです。
          </p>
        </div>
      </div>

      <ResultPageAdsense2 />
    </Card>

  );
};

export default TwitterStatusResults;