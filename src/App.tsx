import './App.css'
import { TopPageAdsense3 } from './components/adsense/AdSenseUtil';
import TwitterStatusChecker from './components/TwitterStatusChecker';
import TwitterStatusResults from './components/TwitterStatusCheckerResults';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TwitterStatusHistory from './components/TwitterStatusHistory';

function App() {
  return (
    <div className="fixed inset-0 bg-slate-100 overflow-auto"> {/* 画面全体をカバーする背景レイヤー */}
      <div className="relative"> {/* コンテンツを配置するための相対位置の親要素 */}
        <Router>
          <div className="max-w-2xl mx-auto py-8 bg-slate-100">
            <h1 className="text-4xl font-bold text-center mb-8">
              Xポスト検索除外チェッカー
            </h1>
            <Routes>
              <Route path="/" element={<TwitterStatusChecker />} />
              <Route path="/results" element={<TwitterStatusResults />} />
              <Route path="/history/:sessionId" element={<TwitterStatusHistory />} />
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