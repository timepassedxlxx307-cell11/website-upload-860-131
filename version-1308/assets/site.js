(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var header = document.querySelector("[data-site-header]");
        var menuToggle = document.querySelector("[data-menu-toggle]");
        var mobileMenu = document.querySelector("[data-mobile-menu]");

        function updateHeader() {
            if (!header) {
                return;
            }
            header.classList.toggle("is-scrolled", window.scrollY > 24);
        }

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });

        if (menuToggle && mobileMenu && header) {
            menuToggle.addEventListener("click", function () {
                var isOpen = mobileMenu.classList.toggle("is-open");
                header.classList.toggle("is-open", isOpen);
                document.body.classList.toggle("is-menu-open", isOpen);
            });
        }

        document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function start() {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            show(0);
            start();
        });

        document.querySelectorAll("[data-filter-area]").forEach(function (area) {
            var searchInput = area.querySelector("[data-search-input]");
            var categorySelect = area.querySelector("[data-category-filter]");
            var yearSelect = area.querySelector("[data-year-filter]");
            var sortSelect = area.querySelector("[data-sort-select]");
            var list = area.querySelector("[data-card-list]");
            var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".movie-card")) : [];

            function applyFilters() {
                var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
                var category = categorySelect ? categorySelect.value : "all";
                var year = yearSelect ? yearSelect.value : "all";

                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var cardCategory = card.getAttribute("data-category") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var visible = true;

                    if (query && text.indexOf(query) === -1) {
                        visible = false;
                    }

                    if (category !== "all" && cardCategory !== category) {
                        visible = false;
                    }

                    if (year !== "all" && cardYear !== year) {
                        visible = false;
                    }

                    card.hidden = !visible;
                });
            }

            function applySort() {
                if (!list || !sortSelect) {
                    return;
                }
                var mode = sortSelect.value;
                var sorted = cards.slice().sort(function (a, b) {
                    if (mode === "index-asc") {
                        return Number(a.getAttribute("data-index")) - Number(b.getAttribute("data-index"));
                    }
                    if (mode === "year-desc") {
                        return String(b.getAttribute("data-year")).localeCompare(String(a.getAttribute("data-year")), "zh-CN");
                    }
                    if (mode === "title-asc") {
                        return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-CN");
                    }
                    return Number(b.getAttribute("data-index")) - Number(a.getAttribute("data-index"));
                });

                sorted.forEach(function (card) {
                    list.appendChild(card);
                });
                cards = sorted;
                applyFilters();
            }

            [searchInput, categorySelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilters);
                    control.addEventListener("change", applyFilters);
                }
            });

            if (sortSelect) {
                sortSelect.addEventListener("change", applySort);
                applySort();
            } else {
                applyFilters();
            }
        });
    });
}());
