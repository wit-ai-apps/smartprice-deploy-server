// api/deploy.js (Multi-Project Version)
// CADS v2.0 - 複数プロジェクト対応

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { filename, content, message, project, deployKey } = req.body;

    // バリデーション
    if (!filename || !content) {
      return res.status(400).json({
        success: false,
        error: 'filename と content は必須です'
      });
    }

    // デプロイキー確認（セキュリティ強化）
    const DEPLOY_KEY = process.env.DEPLOY_KEY;
    if (DEPLOY_KEY && deployKey !== DEPLOY_KEY) {
      return res.status(401).json({
        success: false,
        error: 'デプロイキーが一致しません'
      });
    }

    // プロジェクト選択（複数プロジェクト対応）
    let targetRepo;
    let GITHUB_TOKEN;

    if (project) {
      // 指定されたプロジェクト
      targetRepo = process.env[`GITHUB_REPO_${project.toUpperCase()}`];
      GITHUB_TOKEN = process.env[`GITHUB_TOKEN_${project.toUpperCase()}`] || process.env.GITHUB_TOKEN;
    } else {
      // デフォルト（Smart-Price-Book）
      targetRepo = process.env.GITHUB_REPO;
      GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    }

    if (!GITHUB_TOKEN || !targetRepo) {
      return res.status(500).json({
        success: false,
        error: `プロジェクト設定が見つかりません: ${project || 'default'}`
      });
    }

    // Base64エンコード
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

    // 既存ファイルのSHA取得
    let sha = null;
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${targetRepo}/contents/${filename}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CADS-v2.0'
          }
        }
      );
      if (getResponse.ok) {
        const data = await getResponse.json();
        sha = data.sha;
      }
    } catch (error) {
      console.log('新規ファイル作成:', filename);
    }

    // ファイル作成/更新
    const commitMessage = message || `CADS: Update ${filename}`;
    
    const putResponse = await fetch(
      `https://api.github.com/repos/${targetRepo}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CADS-v2.0'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          ...(sha && { sha })
        })
      }
    );

    if (!putResponse.ok) {
      const errorData = await putResponse.json();
      throw new Error(errorData.message || 'Github API error');
    }

    const result = await putResponse.json();

    // 成功レスポンス
    return res.status(200).json({
      success: true,
      message: 'デプロイ成功',
      data: {
        project: project || 'default',
        repo: targetRepo,
        filename: filename,
        url: result.content.html_url,
        sha: result.content.sha,
        commit: result.commit.sha,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Deploy error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
