(function () {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const siteNav = document.querySelector('[data-site-nav]');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            siteNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let index = 0;
        let timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.dataset.heroDot || 0));
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        const container = panel.parentElement || document;
        const list = container.querySelector('[data-filter-list]');
        const cards = list ? Array.from(list.querySelectorAll('[data-movie-card]')) : [];
        const searchInput = panel.querySelector('[data-search-input]');
        const selects = Array.from(panel.querySelectorAll('[data-filter-select]'));
        const countNode = panel.querySelector('[data-visible-count]');

        function fillSelect(select) {
            const key = select.dataset.filterSelect;
            const values = Array.from(new Set(cards.map(function (card) {
                return card.dataset[key] || '';
            }).filter(Boolean))).sort(function (a, b) {
                return b.localeCompare(a, 'zh-Hans-CN');
            });
            values.forEach(function (value) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function applyQueryFromUrl() {
            const params = new URLSearchParams(window.location.search);
            selects.forEach(function (select) {
                const key = select.dataset.filterSelect;
                const value = params.get(key);
                if (value) {
                    select.value = value;
                }
            });
        }

        function textOf(card) {
            return [
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.year,
                card.dataset.genre,
                card.dataset.tags
            ].join(' ').toLowerCase();
        }

        function update() {
            const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const filterValues = {};
            selects.forEach(function (select) {
                filterValues[select.dataset.filterSelect] = select.value;
            });
            let visible = 0;
            cards.forEach(function (card) {
                const matchesKeyword = !keyword || textOf(card).includes(keyword);
                const matchesSelects = Object.keys(filterValues).every(function (key) {
                    return !filterValues[key] || card.dataset[key] === filterValues[key];
                });
                const shouldShow = matchesKeyword && matchesSelects;
                card.classList.toggle('is-hidden', !shouldShow);
                if (shouldShow) {
                    visible += 1;
                }
            });
            if (countNode) {
                countNode.textContent = String(visible);
            }
        }

        selects.forEach(fillSelect);
        applyQueryFromUrl();

        if (searchInput) {
            searchInput.addEventListener('input', update);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', update);
        });
        update();
    });
}());
