const BABEL_STANDALONE_PATH = '/node/babel-standalone';
const JS_FILES_PREFIX_TO_TRANSPILE = '/static/';
const BABEL_PRESETS_CONFIG = ['react'];

const EXCLUDE_PATHS_FROM_TRANSPILATION = [
    '/static/swr.js',
    '/static/sw.js',
    BABEL_STANDALONE_PATH
];


let babelIsReady = false;
try {
    importScripts(BABEL_STANDALONE_PATH);
    if (typeof Babel !== 'undefined' && typeof Babel.transform === 'function') {
        babelIsReady = true;
        console.info('Service Worker: Babel loaded successfully from', BABEL_STANDALONE_PATH);
    } else {
        throw new Error('`Babel` object or `Babel.transform` function not found after importing script.');
    }
} catch (error) {
    console.error('Service Worker: CRITICAL - Failed to import or initialize Babel:', error);
}


self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        self.clients.claim().then(() => {
            console.info('Service Worker: Activated and now controlling clients.');
        })
    );
});


self.addEventListener('fetch', (event) => {
    const request = event.request;
    const requestUrl = new URL(request.url);

    const isCandidateForTranspilation =
        request.method === 'GET' &&
        requestUrl.pathname.startsWith(JS_FILES_PREFIX_TO_TRANSPILE) &&
        requestUrl.pathname.endsWith('.js') &&
        !EXCLUDE_PATHS_FROM_TRANSPILATION.includes(requestUrl.pathname);

    if (isCandidateForTranspilation) {
        event.respondWith(
            processTranspilationRequest(request, requestUrl)
        );
    }
});

async function processTranspilationRequest(request, requestUrl) {
    if (!babelIsReady) {
        console.error(`Service Worker: Babel not available. Cannot transpile ${requestUrl.pathname}.`);
        try {
            const originalResponse = await fetch(request);
            return originalResponse;
        } catch (fetchError) {
            const errorMsg = `Service Worker: Babel not available AND failed to fetch original script for ${requestUrl.pathname}. Fetch error: ${fetchError.message}`;
            console.error(errorMsg);
            return new Response(errorMsg, {
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    }

    try {
        console.info(`Service Worker: Intercepting ${requestUrl.pathname} for Babel transpilation.`);
        const networkResponse = await fetch(request);

        if (!networkResponse.ok) {
            return networkResponse;
        }

        const originalScriptContent = await networkResponse.text();
        
        const transpiledResult = Babel.transform(originalScriptContent, {
            presets: BABEL_PRESETS_CONFIG,
            filename: requestUrl.pathname,
            sourceType: 'module',
            sourceMaps: "inline",
        });

        return new Response(transpiledResult.code, {
            headers: { 'Content-Type': 'application/javascript' },
        });

    } catch (error) {
        console.error(`Service Worker: Error during fetch or Babel transpilation for ${requestUrl.pathname}:`, error);
        let errorResponseMessage = `/* Service Worker: Babel Transpilation Error for ${requestUrl.pathname} */\n`;
        errorResponseMessage += `/* Error type: ${error.name} - ${error.message} */\n`;
        if (error.code === 'BABEL_PARSING_ERROR' || error.filename) {
            errorResponseMessage += `/* File: ${error.filename || requestUrl.pathname} */\n`;
            if (error.loc) {
                errorResponseMessage += `/* Location: Line ${error.loc.line}, Column ${error.loc.column} */\n`;
            }
        }
        errorResponseMessage += `\n// Check the Service Worker console and the browser console for more details.`;

        return new Response(errorResponseMessage, {
            status: 500,
            headers: { 'Content-Type': 'application/javascript' },
        });
    }
}
