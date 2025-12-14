# X-SuperBacon-Chopper

Twitter/Xのシャドウバン状態をチェックするWebアプリケーション

## プロジェクト概要

このプロジェクトは、Twitter/Xアカウントのシャドウバン状態を確認できるReactベースのWebアプリケーションです。

## 技術スタック

- **フレームワーク**: React 18.3 + TypeScript
- **ビルドツール**: Vite 6.0
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui (Radix UI ベース)
- **ルーティング**: React Router DOM
- **セキュリティ**: Cloudflare Turnstile
- **広告**: Google AdSense, DMMアフィリエイト

## プロジェクト構成

```
/
├── src/
│   ├── components/
│   │   ├── ShadowbanChecker.tsx       # メインのシャドウバンチェッカー
│   │   ├── TwitterStatusChecker.tsx    # Twitterステータスチェッカー
│   │   ├── TwitterStatusHistory.tsx    # 履歴表示
│   │   ├── Turnstile.tsx              # Cloudflare Turnstileコンポーネント
│   │   ├── results/                    # チェック結果表示コンポーネント
│   │   ├── adsense/                    # 広告関連コンポーネント
│   │   ├── alert/                      # 通知・アラートコンポーネント
│   │   ├── seo/                        # SEO関連コンポーネント
│   │   ├── ui/                         # shadcn/ui UIコンポーネント
│   │   └── util/                       # ユーティリティ
│   ├── services/
│   │   └── api.ts                      # APIクライアント
│   ├── lib/                            # ユーティリティライブラリ
│   ├── App.tsx                         # アプリケーションルート
│   └── main.tsx                        # エントリーポイント
├── public/                             # 静的ファイル
└── announcements/                      # お知らせ・アナウンスメント

```

## 開発スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm run build:dev` - 開発モードでビルド
- `npm run build:staging` - ステージング環境用ビルド
- `npm run publish` - 本番環境用ビルド
- `npm run lint` - ESLintでコードチェック
- `npm run preview` - ビルドしたアプリケーションをプレビュー

## 主な機能

1. **シャドウバンチェック**: Twitter/Xアカウントのシャドウバン状態を確認
2. **ステータス履歴**: 過去のチェック結果を表示
3. **セキュリティ**: Cloudflare Turnstileによるボット対策
4. **暗号化**: クライアント側での暗号化処理
5. **SEO最適化**: React Helmetによるメタタグ管理

## Coding Guidelines

- Use TypeScript strict mode
- Follow ESLint configuration
- Prefer shadcn/ui components
- Style with Tailwind CSS
- Organize components by feature in directories
- Write code comments focusing on "why" (rationale) not "what" (implementation)

## Git Workflow Rules

### Commit and Push Policy
- **NEVER commit or push without explicit user approval**
- Always present changes and commit message together in a single response
- Wait for user confirmation before executing git commands
- Workflow:
  1. Show code changes AND proposed commit message together
  2. Wait for user's "OK" or approval
  3. Only then execute git add, commit, and push

### Commit Message Format
- **Write commit messages in Japanese**
- Follow Conventional Commits format (feat:, fix:, docs:, etc.)

### When to Commit
- Only when user explicitly requests it
- After user reviews and approves the changes
- Never assume user wants immediate commit

## ビルド設定

複数のビルドモードをサポート：
- **development**: 開発環境用
- **staging**: ステージング環境用
- **production**: 本番環境用

JavaScript難読化とコード最適化を含む。

## Important Notes

- API calls require proper error handling
- Always validate Turnstile tokens
- Handle personal information with care
