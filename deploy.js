# SmartPrice Deploy Server

Vercelサーバーレス関数を使用して、AIから直接GithubにデプロイするためのAPI

## 🚀 セットアップ手順

### 1. Vercelアカウント作成
https://vercel.com/signup にアクセスしてアカウント作成（無料）

### 2. このプロジェクトをGithubにpush

```bash
# 新しいGithubリポジトリを作成
# リポジトリ名例: smartprice-deploy-server

# ローカルでGit初期化
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/smartprice-deploy-server.git
git push -u origin main
```

### 3. VercelにImport

1. Vercel Dashboardにログイン
2. "Add New..." → "Project" をクリック
3. "Import Git Repository" を選択
4. `smartprice-deploy-server` リポジトリを選択
5. "Import" をクリック

### 4. 環境変数を設定

Vercel Dashboard → Settings → Environment Variables

追加する変数:

| Key | Value | 説明 |
|-----|-------|------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxxx` | Github Personal Access Token |
| `GITHUB_REPO` | `username/smartprice` | デプロイ先のリポジトリ |

#### Github Tokenの取得方法:

1. Github → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" をクリック
3. Note: "SmartPrice Deploy"
4. Expiration: "No expiration"
5. Scopes: ✅ `repo` (Full control of private repositories)
6. "Generate token" をクリック
7. 表示されたトークンをコピー（二度と表示されないので注意）

### 5. デプロイ

環境変数を保存すると自動的に再デプロイされます。

---

## 📡 API使用方法

### デプロイAPI

**Endpoint**: `POST https://your-project.vercel.app/api/deploy`

**Request Body**:
```json
{
  "filename": "index.html",
  "content": "<!DOCTYPE html>...",
  "message": "Update from AI"
}
```

**Response** (成功時):
```json
{
  "success": true,
  "message": "Successfully deployed to Github",
  "data": {
    "filename": "index.html",
    "url": "https://github.com/user/repo/blob/main/index.html",
    "sha": "abc123...",
    "commit": "def456..."
  }
}
```

### ステータス確認API

**Endpoint**: `GET https://your-project.vercel.app/api/status`

**Response**:
```json
{
  "status": "online",
  "service": "SmartPrice Deploy Server",
  "version": "1.0.0",
  "configured": true,
  "repo": "username/smartprice"
}
```

---

## 🤖 AIからの使用方法

### Claude (bash_tool)

```bash
curl -X POST https://your-project.vercel.app/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "index.html",
    "content": "<!DOCTYPE html><html>...</html>",
    "message": "Deploy SmartPrice v22.8"
  }'
```

### ChatGPT / Gemini (ブラウザコンソール)

```javascript
const deployToGithub = async (filename, content, message) => {
  const response = await fetch('https://your-project.vercel.app/api/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content, message })
  });
  
  const result = await response.json();
  console.log(result);
  return result;
};

// 使用例
await deployToGithub('index.html', htmlContent, 'Update from ChatGPT');
```

---

## 🔧 トラブルシューティング

### デプロイが失敗する

1. **環境変数を確認**
   - GITHUB_TOKEN が正しいか
   - GITHUB_REPO の形式が `username/repo` か

2. **Tokenの権限を確認**
   - `repo` スコープがあるか
   - Token が有効期限切れでないか

3. **ログを確認**
   - Vercel Dashboard → Deployments → 最新のデプロイ → Functions タブ

### CORS エラーが出る

APIコードに既にCORS設定が含まれています。
もし問題が出る場合は、Vercel Dashboard → Settings → Headers で追加設定可能。

---

## 📊 使用制限

### Vercel無料枠
- ✅ 関数実行: 無制限
- ✅ 実行時間: 10秒/リクエスト
- ✅ 帯域: 100GB/月
- ✅ ビルド: 6000分/月

通常の使用では制限に引っかかることはありません。

---

## 🎯 次のステップ

1. ✅ セットアップ完了
2. ステータスAPIでテスト: `https://your-project.vercel.app/api/status`
3. AIから実際にデプロイしてみる
4. 完了！

---

## 📝 注意事項

- Github Tokenは絶対に公開しないでください
- 環境変数に保存されているので、コードには含まれません
- VercelのログにもTokenは表示されません（安全）
