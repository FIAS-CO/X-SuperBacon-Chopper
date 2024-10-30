import './App.css'
import { TopPageAdsense3 } from './components/adsense/AdSenseUtil';
import TwitterStatusChecker from './components/TwitterStatusChecker';
import TwitterStatusResults from './components/TwitterStatusCheckerResults';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          ツイート検索除外チェッカー
        </h1>
        <Routes>
          <Route path="/" element={<TwitterStatusChecker />} />
          <Route path="/results" element={<TwitterStatusResults />} />
        </Routes>
        <div className="mt-4 text-center text-sm text-slate-500">
          <p>Xの投稿URLを入力することで、その投稿が検索除外されているかどうかを確認できます。</p>
        </div>

        <TopPageAdsense3 />
      </div>
    </Router>
  );
}

export default App