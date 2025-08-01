function doGet(e) {
  // 紐づいているスプレッドシートを取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  
  // ヘッダーを除いた全てのデータを取得 (2行目から)
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  // ヘッダー行を取得
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const data = {};

  rows.forEach(row => {
    const event = {};
    const year = row[0]; // 1列目が年

    headers.forEach((header, index) => {
      // "year" はイベントオブジェクトに含めない
      if (header !== 'year') {
        event[header] = row[index];
      }
    });

    if (!data[year]) {
      data[year] = {
        year: year,
        events: []
      };
    }
    data[year].events.push(event);
  });

  // オブジェクトを年順でソートするために配列に変換
  const result = Object.values(data).sort((a, b) => a.year - b.year);

  // JSONとして出力
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
