
import { openLightbox } from './ui.js';

const categoryClassMap = {
    'ニュース': 'news',
    '音楽': 'music',
    'エンタメ': 'entertainment',
    'ゲーム': 'game',
    '流行・ファッション': 'fashion',
    'テクノロジー': 'tech',
    '流行語': 'buzzword',
    '映画': 'movie',
    'スポーツ': 'sports'
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

export function createTimeline(data) {
    const timeline = document.getElementById('timeline');
    const yearNav = document.getElementById('year-nav');

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
                const imageIcon = document.createElement('span');
                imageIcon.className = 'image-icon';
                imageIcon.innerHTML = '📷';
                imageIcon.addEventListener('click', () => {
                    openLightbox(eventData.imageUrl);
                });
                eventItem.appendChild(imageIcon);
            }
            eventList.appendChild(eventItem);
        });

        yearContent.appendChild(eventList);
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
}
