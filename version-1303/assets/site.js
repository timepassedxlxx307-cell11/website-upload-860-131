(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function initMobileMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-nav-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initGlobalSearchForms() {
        document.querySelectorAll('[data-global-search]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    input && input.focus();
                }
            });
        });
    }

    function initBackToTop() {
        var button = document.querySelector('[data-back-to-top]');
        if (!button) {
            return;
        }
        window.addEventListener('scroll', function () {
            if (window.scrollY > 320) {
                button.classList.add('is-visible');
            } else {
                button.classList.remove('is-visible');
            }
        });
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initLocalFilters() {
        var input = document.querySelector('[data-filter-input]');
        var list = document.querySelector('[data-filter-list]');
        var count = document.querySelector('[data-filter-count]');
        if (!input || !list) {
            return;
        }
        var items = Array.prototype.slice.call(list.children);
        function applyFilter() {
            var keyword = input.value.trim().toLowerCase();
            var visible = 0;
            items.forEach(function (item) {
                var haystack = (item.getAttribute('data-title') || item.textContent || '').toLowerCase();
                var matched = !keyword || haystack.indexOf(keyword) !== -1;
                item.classList.toggle('is-filtered-out', !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = visible + ' 部';
            }
        }
        input.addEventListener('input', applyFilter);
    }

    function initHeroCarousel() {
        var root = document.querySelector('[data-hero-carousel]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
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
            }
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var nextIndex = parseInt(dot.getAttribute('data-hero-dot'), 10) || 0;
                show(nextIndex);
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        start();
    }

    ready(function () {
        initMobileMenu();
        initGlobalSearchForms();
        initBackToTop();
        initLocalFilters();
        initHeroCarousel();
    });
})();
