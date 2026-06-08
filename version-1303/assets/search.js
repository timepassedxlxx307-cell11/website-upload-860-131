(function () {
    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return (params.get('q') || '').trim();
    }

    function movieCard(movie) {
        var tags = (movie.tags || []).slice(0, 2).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return [
            '<article class="movie-card small-card">',
            '    <a class="movie-poster" href="' + escapeHtml(movie.url) + '">',
            '        <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="poster-gradient"></span>',
            '        <span class="play-mark">▶</span>',
            '        <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
            '        <span class="tag-row">' + tags + '</span>',
            '    </a>',
            '    <div class="movie-card-body">',
            '        <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p>' + escapeHtml(movie.oneLine) + '</p>',
            '        <div class="movie-meta">',
            '            <span>' + escapeHtml(movie.region) + '</span>',
            '            <span>' + escapeHtml(movie.type) + '</span>',
            '            <span>' + escapeHtml(movie.genre) + '</span>',
            '        </div>',
            '    </div>',
            '</article>'
        ].join('\n');
    }

    function searchMovies(query) {
        var normalized = query.toLowerCase();
        if (!normalized) {
            return (window.MOVIE_SEARCH_INDEX || []).slice(0, 24);
        }
        return (window.MOVIE_SEARCH_INDEX || []).filter(function (movie) {
            var haystack = [
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                movie.oneLine,
                (movie.tags || []).join(' ')
            ].join(' ').toLowerCase();
            return haystack.indexOf(normalized) !== -1;
        }).slice(0, 120);
    }

    function initSearchPage() {
        var results = document.querySelector('[data-search-results]');
        var title = document.querySelector('[data-search-title]');
        var count = document.querySelector('[data-search-count]');
        var input = document.querySelector('[data-search-page-input]');
        if (!results) {
            return;
        }
        var query = getQuery();
        if (input) {
            input.value = query;
        }
        var matched = searchMovies(query);
        if (query) {
            title.textContent = '搜索结果：' + query;
            count.textContent = '共找到 ' + matched.length + ' 部相关影片。';
            results.innerHTML = matched.length ? matched.map(movieCard).join('\n') : '<p class="empty-state">未找到相关内容，请尝试更换关键词。</p>';
        }
    }

    if (document.readyState !== 'loading') {
        initSearchPage();
    } else {
        document.addEventListener('DOMContentLoaded', initSearchPage);
    }
})();
