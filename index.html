// Vercel Serverless Function
// URL: https://your-project.vercel.app/api/deploy

export default async function handler(req, res) {
  // CORS設定（全AIからアクセス可能に）
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト対応（CORS Preflight）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { filename, content, message } = req.body;

    // バリデーション
    if (!filename || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: filename, content'
      });
    }

    // 環境変数から取得
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Missing Github credentials'
      });
    }

    // コンテンツをBase64エンコード
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

    // Step 1: 既存ファイルのSHA取得（更新時に必要）
    let sha = null;
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filename}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'SmartPrice-Deploy-Server'
          }
        }
      );

      if (getResponse.ok) {
        const data = await getResponse.json();
        sha = data.sha;
      }
    } catch (error) {
      // ファイルが存在しない場合は新規作成
      console.log('File does not exist, will create new file');
    }

    // Step 2: ファイル作成または更新
    const commitMessage = message || `Update ${filename} via AI`;
    
    const putResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'SmartPrice-Deploy-Server'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          ...(sha && { sha })  // SHAがあれば含める（更新時）
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
      message: 'Successfully deployed to Github',
      data: {
        filename: filename,
        url: result.content.html_url,
        sha: result.content.sha,
        commit: result.commit.sha
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
