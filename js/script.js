document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('timeline');
  const yearNav = document.getElementById('year-nav');

  const categoryClassMap = {
    'ニュース': 'news',
    '音楽': 'music',
    'エンタメ': 'entertainment',
    'ゲーム': 'game',
    '流行・ファッション': 'fashion',
    'テクノロジー': 'tech'
  };

  function getAgeAndGrade(year) {
    const age = year - 1990;
    let gradeString = '';
    const ageInApril = year - 1990;
    if (ageInApril >= 7 && ageInApril <= 12) {
      gradeString = ` / 小学${ageInApril - 6}年`;
    } else if (ageInApril >= 13 && ageInApril <= 15) {
      gradeString = ` / 中学${ageInApril - 12}年`;
    }
    return `(${age}歳${gradeString})`;
  }

  // 文字化け対策を強化したデータ取得処理
  fetch('data/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // レスポンスをバイナリ(ArrayBuffer)として取得
      return response.arrayBuffer();
    })
    .then(buffer => {
      // ArrayBufferをUTF-8として強制的にデコード
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(buffer);
      // デコードしたテキストをJSONとしてパース
      return JSON.parse(text);
    })
    .then(data => {
      data.forEach((yearData, index) => {
        const navLink = document.createElement('a');
        navLink.href = `#year-${yearData.year}`;
        navLink.textContent = yearData.year;
        yearNav.appendChild(navLink);

        const yearSection = document.createElement('div');
        yearSection.id = `year-${yearData.year}`;
        yearSection.className = `year-section ${index % 2 === 0 ? 'left' : 'right'}`;
        yearSection.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');

        const yearContent = document.createElement('div');
        yearContent.className = 'year-content';

        const yearTitle = document.createElement('h2');
        const personalInfo = getAgeAndGrade(yearData.year);
        yearTitle.innerHTML = `${yearData.year}年 <small class="personal-info">${personalInfo}</small>`;
        yearContent.appendChild(yearTitle);

        // イベントをカテゴリごとにグループ化
        const eventsByCategory = yearData.events.reduce((acc, event) => {
          const category = event.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(event);
          return acc;
        }, {});

        // カテゴリごと（順不同）にリストを生成
        for (const category in eventsByCategory) {
          const categoryGroup = document.createElement('div');
          categoryGroup.className = 'category-group';

          const categoryTitle = document.createElement('h3');
          const categoryClassName = categoryClassMap[category] || 'default';
          categoryTitle.className = `category-title category-${categoryClassName}`;
          categoryTitle.textContent = category;
          categoryGroup.appendChild(categoryTitle);

          const eventList = document.createElement('ul');
          eventList.className = 'event-list';

          eventsByCategory[category].forEach(eventData => {
            const eventItem = document.createElement('li');
            eventItem.className = 'event-item';

            const titleLink = document.createElement('a');
            titleLink.className = 'title';
            titleLink.textContent = eventData.title;
            titleLink.href = `https://ja.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(eventData.title)}`;
            titleLink.target = '_blank';
            titleLink.rel = 'noopener noreferrer';

            eventItem.appendChild(titleLink);
            eventList.appendChild(eventItem);
          });

          categoryGroup.appendChild(eventList);
          yearContent.appendChild(categoryGroup);
        }

        yearSection.appendChild(yearContent);
        timeline.appendChild(yearSection);
      });

      document.querySelectorAll('#year-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });

      AOS.init({
        duration: 800,
        once: true,
      });
    })
    .catch(error => {
      console.error('データの読み込みに失敗しました:', error);
      timeline.innerHTML = '<p>年表データの読み込みに失敗しました。</p>';
    });
});
