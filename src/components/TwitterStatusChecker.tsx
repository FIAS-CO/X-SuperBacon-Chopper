import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiClient } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const TwitterStatusChecker = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tweetBody, setTweetBody] = useState(null);

  const handleCheck = async () => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.checkUrl(url);
      setResult(response.isUnavailable);
      setTweetBody(response.oembedData.html)
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    // scriptを読み込み

    const script = document.createElement('script');

    script.src = "https://platform.twitter.com/widgets.js";

    document.body.appendChild(script);

    // アンマウント時に一応scriptタグを消しておく

    return () => {

      document.body.removeChild(script);

    }

  }, [tweetBody])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ツイート検索除外チェッカー</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ツイートのURLを入力"
              value={url}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCheck}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  確認中
                </>
              ) : (
                '確認'
              )}
            </Button>
          </div>

          {result !== null && (
            <div className="space-y-4">
              <div className="mt-4 p-4 rounded-lg bg-slate-100">
                {result ?
                  "検索除外されています" :
                  "検索除外されていません"
                }
              </div>

              {!result && tweetBody && (
                <div
                  className="mt-4"
                  dangerouslySetInnerHTML={{ __html: tweetBody }}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitterStatusChecker;
