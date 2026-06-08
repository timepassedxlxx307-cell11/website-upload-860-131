(function () {
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var existing = document.querySelector('script[src="' + src + '"]');
            if (existing) {
                existing.addEventListener('load', resolve);
                existing.addEventListener('error', reject);
                return;
            }
            var script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function setMessage(box, text) {
        var message = box.querySelector('[data-player-message]');
        if (message) {
            message.textContent = text || '';
        }
    }

    function initPlayer(box) {
        var video = box.querySelector('video[data-src]');
        var overlay = box.querySelector('[data-play-button]');
        if (!video || !overlay) {
            return;
        }
        var source = video.getAttribute('data-src');
        var started = false;

        function playVideo() {
            if (!source) {
                setMessage(box, '当前影片未找到播放源。');
                return;
            }
            overlay.classList.add('is-hidden');
            setMessage(box, '正在初始化高清播放源...');
            if (started) {
                video.play().catch(function () {});
                return;
            }
            started = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    setMessage(box, '');
                    video.play().catch(function () {});
                }, { once: true });
                video.load();
                return;
            }

            function attachHls() {
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        setMessage(box, '');
                        video.play().catch(function () {});
                    });
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            setMessage(box, '播放源加载失败，请刷新页面后重试。');
                        }
                    });
                    return true;
                }
                return false;
            }

            if (attachHls()) {
                return;
            }

            loadScript('https://cdn.jsdelivr.net/npm/hls.js@latest')
                .then(function () {
                    if (!attachHls()) {
                        video.src = source;
                        video.load();
                        video.play().catch(function () {});
                        setMessage(box, '浏览器不支持 HLS.js，已尝试使用原生播放。');
                    }
                })
                .catch(function () {
                    video.src = source;
                    video.load();
                    video.play().catch(function () {});
                    setMessage(box, 'HLS 组件加载失败，已尝试使用原生播放。');
                });
        }

        overlay.addEventListener('click', playVideo);
        video.addEventListener('play', playVideo, { once: true });
    }

    if (document.readyState !== 'loading') {
        document.querySelectorAll('[data-player-box]').forEach(initPlayer);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('[data-player-box]').forEach(initPlayer);
        });
    }
})();
