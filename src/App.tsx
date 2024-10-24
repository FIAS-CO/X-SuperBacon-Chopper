import './App.css'
import TwitterStatusChecker from './components/TwitterStatusChecker';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <TwitterStatusChecker />
        <div className="mt-4 text-center text-sm text-slate-500">
          <p>Xの投稿URLを入力することで、その投稿が検索除外されているかどうかを確認できます。</p>
        </div>
      </div>
    </div>
  );
}

export default App