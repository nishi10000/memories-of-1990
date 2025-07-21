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

        // アコーディオンのラッパーを追加
        const accordionContent = document.createElement('div');
        accordionContent.className = 'accordion-content';
        
        // イベントリストをアコーディオン内に移動
        const eventList = document.createElement('ul');
        eventList.className = 'event-list';

        yearData.events.forEach(eventData => {
          const eventItem = document.createElement('li');
          const categoryClassName = categoryClassMap[eventData.category] || 'default';
          eventItem.className = `event-item category-${categoryClassName}`;

          const categoryTag = document.createElement('span');
          categoryTag.className = 'event-category-tag';
          categoryTag.textContent = eventData.category;
          eventItem.appendChild(categoryTag);

          const titleLink = document.createElement('a');
          titleLink.className = 'title';
          titleLink.textContent = eventData.title;
          titleLink.href = `https://ja.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(eventData.title)}`;
          titleLink.target = '_blank';
          titleLink.rel = 'noopener noreferrer';
          eventItem.appendChild(titleLink);

          if (eventData.imageUrl) {
            eventItem.addEventListener('mouseenter', () => {
              const yearContent = eventItem.closest('.year-content');
              yearContent.style.backgroundImage = `url(${eventData.imageUrl})`;
              yearContent.classList.add('has-bg-image');
            });
            eventItem.addEventListener('mouseleave', () => {
              const yearContent = eventItem.closest('.year-content');
              yearContent.style.backgroundImage = 'none';
              yearContent.classList.remove('has-bg-image');
            });
          }
          eventList.appendChild(eventItem);
        });

        accordionContent.appendChild(eventList);

        // --- ▼▼▼ 思い出投稿機能 ▼▼▼ ---
        const memorySection = document.createElement('div');
        memorySection.className = 'memory-section';
        const memoryTitle = document.createElement('h4');
        memoryTitle.className = 'memory-section-title';
        memoryTitle.textContent = 'みんなの思い出';
        const memoryList = document.createElement('ul');
        memoryList.className = 'memory-list';
        memorySection.appendChild(memoryTitle);
        memorySection.appendChild(memoryList);
        accordionContent.appendChild(memorySection);

        const memoryForm = document.createElement('form');
        memoryForm.className = 'memory-form';
        memoryForm.style.display = 'none';
        memoryForm.innerHTML = `
          <input type="text" class="memory-nickname" placeholder="ニックネーム" required>
          <textarea class="memory-comment" placeholder="あの頃の思い出をどうぞ..." required></textarea>
          <button type="submit">投稿する</button>
        `;
        accordionContent.appendChild(memoryForm);

        const addMemoryBtn = document.createElement('button');
        addMemoryBtn.className = 'add-memory-btn';
        addMemoryBtn.textContent = '＋ 思い出を投稿する';
        addMemoryBtn.addEventListener('click', () => {
          memoryForm.style.display = memoryForm.style.display === 'none' ? 'block' : 'none';
        });
        accordionContent.appendChild(addMemoryBtn);
        
        yearContent.appendChild(accordionContent);

        // クリックイベントでアコーディオンを開閉
        yearTitle.addEventListener('click', () => {
          yearContent.classList.toggle('open');
        });

        const loadMemories = (year, listElement) => {
          const memories = JSON.parse(localStorage.getItem(`memories_${year}`) || '[]');
          listElement.innerHTML = '';
          memories.forEach(memory => {
            const item = document.createElement('li');
            item.className = 'memory-item';
            item.innerHTML = `<strong class="memory-item-nickname">${memory.nickname}</strong>: <span>${memory.comment}</span>`;
            listElement.appendChild(item);
          });
        };

        memoryForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const nicknameInput = memoryForm.querySelector('.memory-nickname');
          const commentInput = memoryForm.querySelector('.memory-comment');
          const newMemory = {
            nickname: nicknameInput.value,
            comment: commentInput.value
          };
          const memories = JSON.parse(localStorage.getItem(`memories_${yearData.year}`) || '[]');
          memories.push(newMemory);
          localStorage.setItem(`memories_${yearData.year}`, JSON.stringify(memories));
          loadMemories(yearData.year, memoryList);
          nicknameInput.value = '';
          commentInput.value = '';
          memoryForm.style.display = 'none';
        });

        loadMemories(yearData.year, memoryList);

        // --- ▲▲▲ 思い出投稿機能 ▲▲▲ ---

        yearSection.appendChild(yearContent);
        timeline.appendChild(yearSection);
      });

      // 初期状態で最初の年だけ開く
      const firstYearContent = document.querySelector('.year-content');
      if (firstYearContent) {
        firstYearContent.classList.add('open');
      }

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
