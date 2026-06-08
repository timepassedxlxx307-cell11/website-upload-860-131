document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var target = './search.html';
      if (value) {
        target += '?q=' + encodeURIComponent(value);
      }
      window.location.href = target;
    });
  });

  var carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function startTimer() {
      timer = window.setInterval(nextSlide, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-hero-index'), 10);
        showSlide(index);
        stopTimer();
        startTimer();
      });
    });

    var prev = carousel.querySelector('.hero-prev');
    var next = carousel.querySelector('.hero-next');

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        stopTimer();
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        stopTimer();
        startTimer();
      });
    }

    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var localForm = document.querySelector('[data-local-search-form]');
  var localInput = document.querySelector('[data-local-search-input]');
  var cardList = document.querySelector('[data-card-list]');
  var filterBar = document.querySelector('[data-filter-bar]');
  var emptyState = document.querySelector('[data-empty-state]');
  var activeFilter = { key: 'all', value: 'all' };

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function updateCards() {
    if (!cardList) {
      return;
    }
    var query = localInput ? normalize(localInput.value.trim()) : '';
    var visible = 0;
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var searchText = normalize(card.getAttribute('data-search'));
      var filterMatch = true;

      if (activeFilter.key !== 'all') {
        var cardValue = normalize(card.getAttribute('data-' + activeFilter.key));
        filterMatch = cardValue.indexOf(normalize(activeFilter.value)) !== -1;
      }

      var queryMatch = !query || searchText.indexOf(query) !== -1;
      var shouldShow = filterMatch && queryMatch;
      card.style.display = shouldShow ? '' : 'none';
      if (shouldShow) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (localForm && localInput) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');
    if (initialQuery) {
      localInput.value = initialQuery;
    }
    localForm.addEventListener('submit', function (event) {
      event.preventDefault();
      updateCards();
    });
    localInput.addEventListener('input', updateCards);
  }

  if (filterBar) {
    filterBar.querySelectorAll('.filter-pill').forEach(function (button) {
      button.addEventListener('click', function () {
        filterBar.querySelectorAll('.filter-pill').forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        activeFilter.key = button.getAttribute('data-filter-key') || 'all';
        activeFilter.value = button.getAttribute('data-filter-value') || 'all';
        updateCards();
      });
    });
  }

  updateCards();
});
