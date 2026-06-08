(function () {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  function updateHeader() {
    if (!header) {
      return;
    }

    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && mobileNav && header) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      header.classList.toggle('is-open', mobileNav.classList.contains('is-open'));
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const next = hero.querySelector('[data-hero-next]');
    const prev = hero.querySelector('[data-hero-prev]');
    let activeIndex = 0;
    let timer = null;

    function setSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        setSlide(activeIndex + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setSlide(index);
        startTimer();
      });
    });

    if (next) {
      next.addEventListener('click', function () {
        setSlide(activeIndex + 1);
        startTimer();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(activeIndex - 1);
        startTimer();
      });
    }

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  document.querySelectorAll('[data-filter-input]').forEach(function (input) {
    const grid = document.getElementById(input.getAttribute('data-filter-input'));
    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      const query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        card.hidden = query.length > 0 && !text.includes(query);
      });
    });
  });

  const searchPage = document.getElementById('search-page');
  if (searchPage && typeof MOVIE_INDEX !== 'undefined') {
    const input = searchPage.querySelector('[data-search-input]');
    const results = searchPage.querySelector('[data-search-results]');
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';

    function movieCard(movie) {
      const tags = movie.tags.slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">',
        '    <span class="poster" style="--poster-image: url(\'' + movie.cover + '\');">',
        '      <span class="poster-year">' + escapeHtml(movie.year) + '</span>',
        '    </span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
        '    <h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
        '    <p>' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"]/g, function (character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[character];
      });
    }

    function render() {
      const query = input.value.trim().toLowerCase();
      const matched = MOVIE_INDEX.filter(function (movie) {
        if (!query) {
          return movie.hot;
        }

        const text = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.category,
          movie.tags.join(' '),
          movie.oneLine
        ].join(' ').toLowerCase();
        return text.includes(query);
      }).slice(0, 120);

      if (!matched.length) {
        results.innerHTML = '<div class="empty-result">没有找到匹配的影片</div>';
        return;
      }

      results.innerHTML = matched.map(movieCard).join('');
    }

    input.value = initialQuery;
    input.addEventListener('input', render);
    render();
  }
}());
