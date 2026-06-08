import { H as Hls } from './hls-vendor-dru42stk.js';

document.querySelectorAll('[data-player]').forEach(function (shell) {
    const video = shell.querySelector('video');
    const button = shell.querySelector('.play-overlay');
    const source = shell.dataset.videoSrc;
    let hls = null;
    let ready = false;

    function prepare() {
        if (!video || !source || ready) {
            return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }
        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            return;
        }
        video.src = source;
    }

    async function play() {
        prepare();
        if (button) {
            button.classList.add('hidden');
        }
        try {
            await video.play();
        } catch (error) {
            if (button) {
                button.classList.remove('hidden');
            }
        }
    }

    if (button) {
        button.addEventListener('click', play);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (!ready) {
                play();
            }
        });
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('hidden');
            }
        });
        video.addEventListener('ended', function () {
            if (button) {
                button.classList.remove('hidden');
            }
        });
    }

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
});
