(function () {
    function attachPlayer(card) {
        var video = card.querySelector('video');
        var button = card.querySelector('.play-trigger');
        if (!video || !button) {
            return;
        }

        function start() {
            var stream = video.getAttribute('data-stream');
            if (!stream) {
                return;
            }

            button.classList.add('is-hidden');

            function playVideo() {
                var action = video.play();
                if (action && typeof action.catch === 'function') {
                    action.catch(function () {
                        button.classList.remove('is-hidden');
                    });
                }
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!video.hlsReady) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    video.hlsReady = true;
                    hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                    hls.on(window.Hls.Events.ERROR, function () {
                        if (video.paused) {
                            button.classList.remove('is-hidden');
                        }
                    });
                } else {
                    playVideo();
                }
            } else {
                if (!video.getAttribute('src')) {
                    video.setAttribute('src', stream);
                }
                playVideo();
            }
        }

        button.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                button.classList.remove('is-hidden');
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('.player-card')).forEach(attachPlayer);
})();
