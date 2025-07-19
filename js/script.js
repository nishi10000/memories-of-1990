document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('timeline');
  const yearNav = document.getElementById('year-nav');

  const categoryClassMap = {
    'ニュース': 'news',
    '音楽': 'music',
    'エンタメ': 'entertainment',
    'ゲーム': 'game'
  };

  /**
   * 指定された西暦から、1990年4月生まれの人の年齢と学年を計算して返す
   * @param {number} year 西暦
   * @returns {string} 例: "(15歳 / 中学3年)"
   */
  function getAgeAndGrade(year) {
    const age = year - 1990;
    let gradeString = '';

    // 1990年4月生まれと仮定して学年を計算
    const ageInApril = year - 1990;
    if (ageInApril >= 7 && ageInApril <= 12) {
      gradeString = ` / 小学${ageInApril - 6}年`;
    } else if (ageInApril >= 13 && ageInApril <= 15) {
      gradeString = ` / 中学${ageInApril - 12}年`;
    }

    return `(${age}歳${gradeString})`;
  }

  fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      // 年表とナビゲーションを生成
      data.forEach((yearData, index) => {
        // 1. 年別ナビゲーションのリンクを生成
        const navLink = document.createElement('a');
        navLink.href = `#year-${yearData.year}`;
        navLink.textContent = yearData.year;
        yearNav.appendChild(navLink);

        // 2. タイムラインのセクションを生成
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

        const eventList = document.createElement('ul');
        eventList.className = 'event-list';

        yearData.events.forEach(eventData => {
          const eventItem = document.createElement('li');
          eventItem.className = 'event-item';

          const categorySpan = document.createElement('span');
          const categoryClassName = categoryClassMap[eventData.category] || 'default';
          categorySpan.className = `category category-${categoryClassName}`;
          categorySpan.textContent = eventData.category;

          const titleLink = document.createElement('a');
          titleLink.className = 'title';
          titleLink.textContent = eventData.title;
          titleLink.href = `https://ja.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(eventData.title)}`;
          titleLink.target = '_blank';
          titleLink.rel = 'noopener noreferrer';

          eventItem.appendChild(categorySpan);
          eventItem.appendChild(titleLink);
          eventList.appendChild(eventItem);
        });

        yearContent.appendChild(eventList);
        yearSection.appendChild(yearContent);
        timeline.appendChild(yearSection);
      });

      // 3. スムーズスクロールの実装
      document.querySelectorAll('#year-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });

      // 4. AOSライブラリを初期化
      AOS.init({
        duration: 800, // アニメーションの時間
        once: true,    // アニメーションを1回だけ実行
      });
    })
    .catch(error => {
      console.error('データの読み込みに失敗しました:', error);
      timeline.innerHTML = '<p>年表データの読み込みに失敗しました。</p>';
    });
});