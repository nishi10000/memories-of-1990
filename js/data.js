export async function fetchData() {
  // !!! 【要設定】GAS_SETUP.md の手順に従って、デプロイしたウェブアプリのURLに書き換えてください
  const gasUrl = 'YOUR_GAS_WEB_APP_URL';

  if (gasUrl === 'YOUR_GAS_WEB_APP_URL') {
    console.error("GASのURLが設定されていません。gas/GAS_SETUP.md を確認してください。");
    throw new Error("GAS URL is not configured.");
  }

  try {
    const response = await fetch(gasUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    throw error;
  }
}