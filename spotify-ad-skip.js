/// spotify-ad-skip.js
/// alias sas.js
(function () {
    'use strict';
    console.log('--- [SUCCESS] Spotify Ad-Skip Scriptlet is Active ---');

    const AD_HOSTNAMES = new Set([
        'heads-fa.spotify.com',
        'audio-fa.spotifycdn.com',
        'audio4-fa.spotifycdn.com',
        'audio-guc3.spotifycdn.com',
    ]);

    const AD_PATHS_ON_SPCLIENT = /\/(ad-logic|ads)\//i;

    function isAdRequest(rawUrl) {
        try {
            const parsed = new URL(rawUrl, location.origin); // ← CHANGED: handles relative URLs
            const host   = parsed.hostname;
            if (AD_HOSTNAMES.has(host)) return true;
            if (host === 'spclient.wg.spotify.com' &&
                AD_PATHS_ON_SPCLIENT.test(parsed.pathname)) return true;
            return false;
        } catch (e) {
            return false;
        }
    }

    const _fetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
        const url = (input instanceof Request) ? input.url
                  : (input instanceof URL)     ? input.href
                  : String(input);
        if (isAdRequest(url)) {
            return Promise.resolve(
                new Response(JSON.stringify({ version: 0, adSlots: [] }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        }
        return _fetch(input, init);
    };

    const _xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._spotifyUrl = url;
        return _xhrOpen.apply(this, arguments);
    };

    const _xhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (this._spotifyUrl && isAdRequest(this._spotifyUrl)) {
            Object.defineProperty(this, 'readyState',   { get: () => 4,    configurable: true });
            Object.defineProperty(this, 'status',       { get: () => 200,  configurable: true });
            Object.defineProperty(this, 'responseText', { get: () => '{}', configurable: true });
            setTimeout(() => {
                if (typeof this.onreadystatechange === 'function') this.onreadystatechange();
                if (typeof this.onload === 'function') this.onload();
                try {
                    this.dispatchEvent(new ProgressEvent('readystatechange'));
                    this.dispatchEvent(new ProgressEvent('load'));
                    this.dispatchEvent(new ProgressEvent('loadend'));
                } catch (e) {}
            }, 1);
            return;
        }
        return _xhrSend.apply(this, arguments);
    };

    const AD_SELECTORS = [
        '[data-testid="ad-label"]',
        '[aria-label*="Advertisement" i]',
        '.encore-advertising-set',
        '[data-testid="advertisement"]',
    ];

    function isAdActive() {
        return AD_SELECTORS.some(sel => document.querySelector(sel) !== null);
    }

    function trySkip() {
        const skipBtn = document.querySelector('[data-testid="control-button-skip-forward"]');
        if (skipBtn && !skipBtn.disabled) {
            skipBtn.click();
            return;
        }
        const progressBar = document.querySelector('[data-testid="progress-bar"]');
        if (progressBar) {
            const rect = progressBar.getBoundingClientRect();
            progressBar.dispatchEvent(new MouseEvent('click', {
                bubbles: true, clientX: rect.right - 2, clientY: rect.top + rect.height / 2
            }));
        }
    }

    let skipCooldown = false;

    const observer = new MutationObserver(() => {
        if (skipCooldown) return;
        if (isAdActive()) {
            skipCooldown = true;
            trySkip();
            setTimeout(() => { skipCooldown = false; }, 3000);
        }
    });

    function startObserver() {
        if (!document.body) { setTimeout(startObserver, 200); return; }
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-testid', 'aria-label'] // ← CHANGED: dropped 'class'
        });
    }

    startObserver();

    setInterval(() => {
        if (!skipCooldown && isAdActive()) {
            skipCooldown = true;
            trySkip();
            setTimeout(() => { skipCooldown = false; }, 3000);
        }
    }, 1000);

})();
```

That's genuinely the final version — the relative URL fix is the last real correctness issue. Everything else was already solid.
