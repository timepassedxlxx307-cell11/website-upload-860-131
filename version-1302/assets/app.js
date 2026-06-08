(function () {
    function selectAll(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-button]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var previous = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (!slides.length) {
            return;
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        if (previous) {
            previous.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }
        show(0);
        start();
    }

    function initLibraryFilters() {
        selectAll('[data-library]').forEach(function (library) {
            var input = library.querySelector('[data-library-search]');
            var year = library.querySelector('[data-year-filter]');
            var type = library.querySelector('[data-type-filter]');
            var cards = selectAll('[data-movie-card]', library);
            var empty = library.querySelector('[data-empty-state]');

            function valueOf(select) {
                return select ? select.value.trim() : '';
            }

            function run() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var yearValue = valueOf(year);
                var typeValue = valueOf(type);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute('data-title'),
                        card.getAttribute('data-tags'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-type')
                    ].join(' ').toLowerCase();
                    var matchQuery = !query || haystack.indexOf(query) !== -1;
                    var matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
                    var matchType = !typeValue || card.getAttribute('data-type') === typeValue;
                    var show = matchQuery && matchYear && matchType;
                    card.hidden = !show;
                    if (show) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            if (input) {
                input.addEventListener('input', run);
            }
            if (year) {
                year.addEventListener('change', run);
            }
            if (type) {
                type.addEventListener('change', run);
            }
            run();
        });
    }

    initMenu();
    initHero();
    initLibraryFilters();
}());
