const navButton = document.querySelector('[data-nav-toggle]');
const mobilePanel = document.querySelector('[data-mobile-panel]');

if (navButton && mobilePanel) {
    navButton.addEventListener('click', () => {
        mobilePanel.classList.toggle('is-open');
    });
}

const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
let currentSlide = 0;
let heroTimer = null;

function showSlide(index) {
    if (!slides.length) {
        return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
}

function startHero() {
    if (slides.length < 2) {
        return;
    }

    heroTimer = window.setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5200);
}

function resetHero() {
    if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
    }
    startHero();
}

const previousHero = document.querySelector('[data-hero-prev]');
const nextHero = document.querySelector('[data-hero-next]');

if (previousHero) {
    previousHero.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetHero();
    });
}

if (nextHero) {
    nextHero.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetHero();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetHero();
    });
});

showSlide(0);
startHero();

const searchInput = document.querySelector('[data-search-input]');
const yearFilter = document.querySelector('[data-year-filter]');
const typeFilter = document.querySelector('[data-type-filter]');
const searchableCards = Array.from(document.querySelectorAll('[data-movie-card]'));
const noResults = document.querySelector('[data-no-results]');

function normalizeText(value) {
    return String(value || '').trim().toLowerCase();
}

function applyFilters() {
    if (!searchableCards.length) {
        return;
    }

    const keyword = normalizeText(searchInput ? searchInput.value : '');
    const year = yearFilter ? yearFilter.value : '';
    const type = typeFilter ? typeFilter.value : '';
    let visible = 0;

    searchableCards.forEach((card) => {
        const haystack = normalizeText(card.dataset.title + ' ' + card.dataset.region + ' ' + card.dataset.type + ' ' + card.dataset.genre + ' ' + card.dataset.tags);
        const matchesKeyword = !keyword || haystack.includes(keyword);
        const matchesYear = !year || card.dataset.year === year;
        const matchesType = !type || card.dataset.type === type;
        const keep = matchesKeyword && matchesYear && matchesType;

        card.style.display = keep ? '' : 'none';
        if (keep) {
            visible += 1;
        }
    });

    if (noResults) {
        noResults.classList.toggle('is-visible', visible === 0);
    }
}

if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
}

if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
}
