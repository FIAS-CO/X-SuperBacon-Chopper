import React, { useState } from 'react';
import { Plus, Minus, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { loadAd, TopPageAdsense1, TopPageAdsense2, TopPageAdsense3 } from './adsense/AdSenseUtil';
import { CautionExpantionButton, ContactUsExpantionButton, HowToUseExpantionButton } from './ExpantionButton';
import TabNavigation from './results/TabNavigation';
import { ResponsiveDMMAd } from './adsense/DMMAffiliate';

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

  const clearUrlField = (id: number) => {
    handleUrlChange(id, '');
  };

  const handleCheckAll = async () => {
    // フィルターして空のURLを除外
    const validUrls = urls.filter(url => url.value.trim()).map(url => url.value);
    if (validUrls.length === 0) return;

    // URLリストをセッションストレージに保存
    sessionStorage.setItem('checkUrls', JSON.stringify(validUrls));
    sessionStorage.setItem('inputUrls', JSON.stringify(urls));

    // 結果ページに遷移
    navigate('/tweetcheck/results');
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
    <>
      <TabNavigation isShadowbanTab={false} />
      <h1 className="text-4xl font-bold text-center mb-8 mx-auto max-w-screen-xl px-4">
        Xポスト検索除外チェッカー
      </h1>
      <Card className="w-full max-w-2xl mx-auto">
        <div className="px-6 pt-6">
          <TopPageAdsense1 />
        </div>
        <CardContent>
          <div className="space-y-4 mb-4 mt-4">
            {urls.map((urlObj) => (
              <div key={urlObj.id} className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="ポストのURLを入力"
                    value={urlObj.value}
                    onChange={(e) => handleUrlChange(urlObj.id, e.target.value)}
                    className="pr-8"
                  />
                  {urlObj.value && (
                    <button
                      type="button"
                      onClick={() => clearUrlField(urlObj.id)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 px-2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer"
                      aria-label="入力をクリア"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
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
                <Search className="w-4 h-4 mr-2" />
                check start
              </Button>
            </div>
          </div>
          <ResponsiveDMMAd />
          <HowToUseExpantionButton />
          <CautionExpantionButton />
          <ContactUsExpantionButton />
          <TopPageAdsense2 />
        </CardContent>
      </Card>

      <TopPageAdsense3 />
    </>
  );
};

export default TwitterStatusChecker;