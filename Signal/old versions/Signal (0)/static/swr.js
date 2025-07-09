if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js', { scope: '/' })
            .then(registration => {
                console.info('Service Worker registered successfully with scope:', registration.scope);

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.info('Service Worker: New content is available and will be used when all tabs for this scope are closed. Or, refresh manually.');
                                } else {
                                    console.info('Service Worker: Content is cached for offline use.');
                                }
                            }
                        };
                    }
                };
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}