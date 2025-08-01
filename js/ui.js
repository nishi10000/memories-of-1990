
let lightbox, lightboxImg, lightboxClose, backToTopButton;

function initLightbox() {
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    lightboxClose = document.querySelector('.lightbox-close');

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    lightboxClose.addEventListener('click', closeLightbox);
}

export function openLightbox(imageUrl) {
    if (!lightbox) initLightbox();
    lightboxImg.src = imageUrl;
    lightbox.classList.add('show');
}

export function closeLightbox() {
    if (!lightbox) initLightbox();
    lightbox.classList.remove('show');
}

export function updateActiveNav() {
    const sections = document.querySelectorAll('.year-section');
    const navLinks = document.querySelectorAll('#year-nav a');
    let currentYear = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 65) {
            currentYear = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentYear}`) {
            link.classList.add('active');
        }
    });
}

export function initBackToTopButton() {
    backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
