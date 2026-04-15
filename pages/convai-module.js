// Module for convai-anna-frank page: enhance video behaviour and fallback
document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('convai-video');
    if (!video) return;

    const source = video.querySelector('source');
    const src = source ? source.src : null;

    // If the local mp4 is not available, replace the video with an iframe fallback.
    if (src) {
        try {
            const res = await fetch(src, { method: 'HEAD' });
            if (!res.ok) throw new Error('missing');
        } catch (err) {
            const wrapper = video.parentElement;
            const iframe = document.createElement('iframe');
            iframe.src = 'https://convai.example.com/anna-frank';
            iframe.width = '100%';
            iframe.height = '560';
            iframe.style.border = '0';
            iframe.setAttribute('title', 'Convai — Anna Frank');
            wrapper.replaceChild(iframe, video);
            return;
        }
    }

    // Add simple keyboard control: Space toggles play/pause when not focused on inputs
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (e.code === 'Space' && active && !['INPUT', 'TEXTAREA'].includes(active.tagName)) {
            e.preventDefault();
            if (video.paused) video.play(); else video.pause();
        }
    });

    // Basic playback analytics (console only) — can be replaced with real tracking
    video.addEventListener('play', () => console.log('Convai video: play'));
    video.addEventListener('pause', () => console.log('Convai video: pause'));
    video.addEventListener('ended', () => console.log('Convai video: ended'));
});
