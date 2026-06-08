(function () {
    var header = document.querySelector('.site-header');
    var menuButton = document.querySelector('.menu-button');
    var mobilePanel = document.querySelector('.mobile-panel');
    var backTop = document.querySelector('.back-top');

    function updateScrollState() {
        var active = window.scrollY > 18;
        if (header) {
            header.classList.toggle('is-scrolled', active);
        }
        if (backTop) {
            backTop.classList.toggle('is-visible', window.scrollY > 520);
        }
    }

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    if (backTop) {
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var libraryBlocks = Array.prototype.slice.call(document.querySelectorAll('[data-library]'));
    libraryBlocks.forEach(function (block) {
        var search = block.querySelector('[data-search]');
        var year = block.querySelector('[data-year]');
        var type = block.querySelector('[data-type]');
        var chips = Array.prototype.slice.call(block.querySelectorAll('[data-filter]'));
        var cards = Array.prototype.slice.call(block.querySelectorAll('[data-card]'));
        var empty = block.querySelector('.empty-state');
        var activeTag = '';

        function apply() {
            var query = search ? search.value.trim().toLowerCase() : '';
            var yearValue = year ? year.value : '';
            var typeValue = type ? type.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var hay = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region')).toLowerCase();
                var cardYear = card.getAttribute('data-year');
                var cardType = card.getAttribute('data-kind');
                var ok = true;

                if (query && hay.indexOf(query) === -1) {
                    ok = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    ok = false;
                }
                if (typeValue && cardType.indexOf(typeValue) === -1) {
                    ok = false;
                }
                if (activeTag && hay.indexOf(activeTag.toLowerCase()) === -1) {
                    ok = false;
                }

                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (search) {
            search.addEventListener('input', apply);
        }
        if (year) {
            year.addEventListener('change', apply);
        }
        if (type) {
            type.addEventListener('change', apply);
        }
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var value = chip.getAttribute('data-filter');
                activeTag = activeTag === value ? '' : value;
                chips.forEach(function (item) {
                    item.classList.toggle('is-active', item.getAttribute('data-filter') === activeTag);
                });
                apply();
            });
        });
    });
})();

(function () {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (!query) {
        return;
    }
    var input = document.querySelector('[data-search]');
    if (input) {
        input.value = query;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
})();
