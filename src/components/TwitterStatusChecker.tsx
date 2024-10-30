import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { loadAd, TopPageAdsense1, TopPageAdsense2 } from './adsense/AdSenseUtil';

const TwitterStatusChecker = () => {
  const [urls, setUrls] = useState([{ id: Date.now(), value: '' }]);
  const navigate = useNavigate();

  const addUrlField = () => {
    setUrls(prev => [...prev, { id: Date.now(), value: '' }]);
  };

  const removeUrlField = (id: number) => {
    setUrls(prev => prev.filter(url => url.id !== id));
  };

  const handleUrlChange = (id: number, value: string) => {
    setUrls(prev => prev.map(url =>
      url.id === id ? { ...url, value } : url
    ));
  };

  const handleCheckAll = async () => {
    // フィルターして空のURLを除外
    const validUrls = urls.filter(url => url.value.trim()).map(url => url.value);
    if (validUrls.length === 0) return;

    // URLリストをセッションストレージに保存
    sessionStorage.setItem('checkUrls', JSON.stringify(validUrls));
    sessionStorage.setItem('inputUrls', JSON.stringify(urls));

    // 結果ページに遷移
    navigate('/results');
  };

  React.useEffect(() => {
    loadAd()

    const savedUrls = sessionStorage.getItem('inputUrls');
    if (savedUrls) {
      setUrls(JSON.parse(savedUrls));
      // 復元後にクリア
      sessionStorage.removeItem('inputUrls');
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <TopPageAdsense1 />
      <CardContent>
        <div className="space-y-4">
          {urls.map((urlObj) => (
            <div key={urlObj.id} className="flex gap-2">
              <Input
                placeholder="ツイートのURLを入力"
                value={urlObj.value}
                onChange={(e) => handleUrlChange(urlObj.id, e.target.value)}
                className="flex-1"
              />
              {urls.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeUrlField(urlObj.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={addUrlField}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              URLを追加
            </Button>

            <Button
              onClick={handleCheckAll}
              className="w-full"
            >
              check start
            </Button>
          </div>
        </div>
      </CardContent>
      <TopPageAdsense2 />
    </Card>
  );
};

export default TwitterStatusChecker;