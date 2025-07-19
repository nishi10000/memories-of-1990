document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('timeline');

  // カテゴリ名とCSSクラスのマッピング
  const categoryClassMap = {
    'ニュース': 'news',
    '音楽': 'music',
    'エンタメ': 'entertainment',
    'ゲーム': 'game'
  };

  // data.jsonを非同期で読み込む
  fetch('data/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('ネットワークの応答が正しくありませんでした。');
      }
      return response.json();
    })
    .then(data => {
      // 読み込んだデータから年表を生成
      data.forEach(yearData => {
        // 各年のコンテナを作成
        const yearSection = document.createElement('section');
        yearSection.className = 'year-section';

        // 年の見出しを作成
        const yearTitle = document.createElement('h2');
        yearTitle.textContent = `${yearData.year}年`;
        yearSection.appendChild(yearTitle);

        // イベントリストのコンテナを作成
        const eventList = document.createElement('ul');
        eventList.className = 'event-list';

        // 各イベントをリストアイテムとして追加
        yearData.events.forEach(eventData => {
          const eventItem = document.createElement('li');
          eventItem.className = 'event-item';

          // カテゴリ
          const categorySpan = document.createElement('span');
          const categoryKey = eventData.category.replace(' ', '-').toLowerCase();
          const categoryClassName = categoryClassMap[eventData.category] || 'default';
          categorySpan.className = `category category-${categoryClassName}`;
          categorySpan.textContent = eventData.category;

          // タイトル
          const titleP = document.createElement('p');
          titleP.className = 'title';
          titleP.textContent = eventData.title;

          eventItem.appendChild(categorySpan);
          eventItem.appendChild(titleP);
          eventList.appendChild(eventItem);
        });

        yearSection.appendChild(eventList);
        timeline.appendChild(yearSection);
      });
    })
    .catch(error => {
      console.error('データの読み込みに失敗しました:', error);
      timeline.innerHTML = '<p>年表データの読み込みに失敗しました。ページを再読み込みしてみてください。</p>';
    });
});
