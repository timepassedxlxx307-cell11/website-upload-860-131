import { H as Hls } from './hls-vendor-dru42stk.js';

export function setupMoviePlayer(options) {
    const video = document.getElementById(options.videoId);
    const overlay = document.getElementById(options.overlayId);
    const streamUrl = options.streamUrl;
    let attached = false;
    let hls = null;

    if (!video || !streamUrl) {
        return;
    }

    function attachStream() {
        if (attached) {
            return;
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            return;
        }

        video.src = streamUrl;
    }

    function startPlayback() {
        attachStream();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        const attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(() => {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    }

    if (overlay) {
        overlay.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', () => {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener('play', () => {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', () => {
        if (video.currentTime === 0 && overlay) {
            overlay.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', () => {
        if (hls) {
            hls.destroy();
        }
    });
}
