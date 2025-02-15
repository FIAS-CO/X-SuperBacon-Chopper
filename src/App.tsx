import './App.css'
import { TopPageAdsense3 } from './components/adsense/AdSenseUtil';
import TwitterStatusChecker from './components/TwitterStatusChecker';
import TwitterStatusResults from './components/TwitterStatusCheckerResults';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TwitterStatusHistory from './components/TwitterStatusHistory';
import ShadowbanChecker from './components/ShadowbanChecker';

function App() {
  return (
    <div className="fixed inset-0 bg-slate-100 overflow-auto"> {/* 画面全体をカバーする背景レイヤー */}
      <div className="relative min-h-full"> {/* コンテンツを配置するための相対位置の親要素 */}
        <Router>
          <div className="max-w-3xl mx-auto py-8 bg-slate-100">
            <Routes>
              <Route path="/" element={<ShadowbanChecker />} />
              <Route path="/tweetcheck" element={<TwitterStatusChecker />} />
              <Route path="/tweetcheck/results" element={<TwitterStatusResults />} />
              <Route path="/tweetcheck/history/:sessionId" element={<TwitterStatusHistory />} />
            </Routes>
            <div className="mt-4 text-center text-sm text-slate-500">
              <p>Xの投稿URLを入力することで、その投稿が検索除外されているかどうかを確認できます。</p>
            </div>
            <TopPageAdsense3 />
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App