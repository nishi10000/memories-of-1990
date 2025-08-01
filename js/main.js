
import { fetchData } from './data.js';
import { createTimeline } from './timeline.js';
import { updateActiveNav, initBackToTopButton } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchData();
        createTimeline(data);

        AOS.init({
            duration: 800,
            once: true,
        });

        window.addEventListener('scroll', updateActiveNav);
        initBackToTopButton();

    } catch (error) {
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '<p>年表データの読み込みに失敗しました。</p>';
    }
});
