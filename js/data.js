
export async function fetchData() {
  try {
    const response = await fetch('data/data.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    return JSON.parse(text);
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    throw error;
  }
}
