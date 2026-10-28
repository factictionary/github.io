/**
 * Factictionary Universal FFmpeg Engine & Compatibility Layer
 * ==========================================================
 * Ensures seamless, 100% reliable in-browser video processing across all
 * 16 Factictionary video utilities (video_compressor, video_trimmer,
 * video_converter, video_filter, video_resizer, video_merger, etc.).
 *
 * Key Capabilities:
 * 1. Multi-CDN Fallback (jsDelivr -> unpkg) with automatic toBlobURL()
 *    conversion to bypass browser cross-origin Web Worker restrictions.
 * 2. Works on static GitHub Pages, custom domain, and Android PWA WebView
 *    without requiring COOP/COEP headers or SharedArrayBuffer.
 * 3. Backward-compatibility normalization for both v0.12 and v0.11 API calls
 *    (window.FFmpeg, window.fetchFile, window.toBlobURL, createFFmpeg, .FS, .run).
 * 4. Automatic ArrayBuffer/Blob to Uint8Array normalization for writeFile().
 */
(function(window) {
    'use strict';

    const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/npm/@ffmpeg';
    const UNPKG_BASE = 'https://unpkg.com/@ffmpeg';

    let cachedCoreBlobUrl = null;
    let cachedWasmBlobUrl = null;
    let enginePromise = null;

    // Dynamically load external scripts with promise
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                if (existing.dataset.loaded === 'true') return resolve();
                existing.addEventListener('load', () => resolve());
                existing.addEventListener('error', () => reject(new Error('Failed to load ' + src)));
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.crossOrigin = 'anonymous';
            s.onload = () => {
                s.dataset.loaded = 'true';
                resolve();
            };
            s.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(s);
        });
    }

    // Ensure @ffmpeg/ffmpeg and @ffmpeg/util libraries are loaded
    async function ensureLibraries() {
        if (!window.FFmpegWASM) {
            try {
                await loadScript(`${JSDELIVR_BASE}/ffmpeg@0.12.10/dist/umd/ffmpeg.js`);
            } catch (e1) {
                console.warn('[FFmpegEngine] jsDelivr ffmpeg.js failed, trying unpkg...', e1);
                await loadScript(`${UNPKG_BASE}/ffmpeg@0.12.10/dist/umd/ffmpeg.js`);
            }
        }
        if (!window.FFmpegUtil) {
            try {
                await loadScript(`${JSDELIVR_BASE}/util@0.12.1/dist/umd/index.js`);
            } catch (e2) {
                console.warn('[FFmpegEngine] jsDelivr util.js failed, trying unpkg...', e2);
                await loadScript(`${UNPKG_BASE}/util@0.12.1/dist/umd/index.js`);
            }
        }

        normalizeGlobals();
    }

    // Expose normalized global objects so every legacy script finds what it needs
    function normalizeGlobals() {
        if (window.FFmpegWASM && window.FFmpegWASM.FFmpeg) {
            window.FFmpeg = window.FFmpegWASM.FFmpeg;
            patchFFmpegClass(window.FFmpegWASM.FFmpeg);
        }
        if (window.FFmpegUtil) {
            window.fetchFile = window.FFmpegUtil.fetchFile;
            window.toBlobURL = window.FFmpegUtil.toBlobURL;
            if (!window.FFmpegWASM) window.FFmpegWASM = {};
            if (!window.FFmpegWASM.fetchFile) window.FFmpegWASM.fetchFile = window.FFmpegUtil.fetchFile;
            if (!window.FFmpegWASM.toBlobURL) window.FFmpegWASM.toBlobURL = window.FFmpegUtil.toBlobURL;
        }
        if (window.FFmpeg && !window.createFFmpeg) {
            window.createFFmpeg = function(options) {
                return window.FFmpeg.createFFmpeg(options);
            };
        }
    }

    // Safe download to blob URL with multi-CDN fallback
    async function fetchAsBlobURL(filename, mimeType) {
        await ensureLibraries();
        const { toBlobURL } = window.FFmpegUtil;
        const bases = [
            `${JSDELIVR_BASE}/core@0.12.6/dist/umd`,
            `${UNPKG_BASE}/core@0.12.6/dist/umd`
        ];

        let lastError = null;
        for (const base of bases) {
            try {
                const url = await toBlobURL(`${base}/${filename}`, mimeType);
                if (url) return url;
            } catch (err) {
                console.warn(`[FFmpegEngine] Failed loading ${filename} from ${base}:`, err);
                lastError = err;
            }
        }
        throw new Error(`Failed to load ${filename} from all CDNs: ` + (lastError ? lastError.message : 'Network error'));
    }

    // Patch the FFmpeg class prototype with robust shims
    function patchFFmpegClass(FFmpegClass) {
        if (!FFmpegClass || FFmpegClass._factictionaryPatched) return;
        FFmpegClass._factictionaryPatched = true;

        // 1. Intercept load() to guarantee blob URLs
        const originalLoad = FFmpegClass.prototype.load;
        FFmpegClass.prototype.load = async function(config) {
            config = config || {};
            let coreURL = config.coreURL;
            let wasmURL = config.wasmURL;

            // If missing or an external HTTP URL, convert to local same-origin Blob URL
            if (!coreURL || (typeof coreURL === 'string' && !coreURL.startsWith('blob:'))) {
                if (!cachedCoreBlobUrl) {
                    console.log('[FFmpegEngine] Preparing coreURL as blob...');
                    cachedCoreBlobUrl = await fetchAsBlobURL('ffmpeg-core.js', 'text/javascript');
                }
                coreURL = cachedCoreBlobUrl;
            }

            if (!wasmURL || (typeof wasmURL === 'string' && !wasmURL.startsWith('blob:'))) {
                if (!cachedWasmBlobUrl) {
                    console.log('[FFmpegEngine] Preparing wasmURL as blob...');
                    cachedWasmBlobUrl = await fetchAsBlobURL('ffmpeg-core.wasm', 'application/wasm');
                }
                wasmURL = cachedWasmBlobUrl;
            }

            return originalLoad.call(this, {
                ...config,
                coreURL,
                wasmURL
            });
        };

        // 2. Intercept writeFile() to handle ArrayBuffer / Blob automatically
        const originalWriteFile = FFmpegClass.prototype.writeFile;
        FFmpegClass.prototype.writeFile = async function(filePath, data, options) {
            if (data instanceof ArrayBuffer) {
                data = new Uint8Array(data);
            } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
                data = new Uint8Array(await data.arrayBuffer());
            }
            return originalWriteFile.call(this, filePath, data, options);
        };

        // 3. Backwards-compatibility for v0.11 .FS() calls
        FFmpegClass.prototype.FS = async function(action, ...args) {
            if (action === 'writeFile') {
                let data = args[1];
                if (data instanceof ArrayBuffer) data = new Uint8Array(data);
                else if (typeof Blob !== 'undefined' && data instanceof Blob) data = new Uint8Array(await data.arrayBuffer());
                return this.writeFile(args[0], data);
            } else if (action === 'readFile') {
                return this.readFile(args[0]);
            } else if (action === 'unlink') {
                try {
                    return await this.deleteFile(args[0]);
                } catch (e) {
                    return;
                }
            }
            throw new Error(`Unsupported FFmpeg FS action: ${action}`);
        };

        // 4. Backwards-compatibility for v0.11 .run() calls
        FFmpegClass.prototype.run = async function(...args) {
            const flatArgs = args.flat ? args.flat() : [].concat(...args);
            return this.exec(flatArgs);
        };

        // 5. Backwards-compatibility for v0.11 createFFmpeg() factory
        FFmpegClass.createFFmpeg = function(options) {
            const instance = new FFmpegClass();
            if (options && options.log) {
                instance.on('log', ({ message }) => console.log('[FFmpeg]', message));
            }
            return instance;
        };
    }

    // High-level universal engine getter
    window.FactictionaryFFmpeg = {
        async getEngine(onProgress, onLog) {
            await ensureLibraries();
            const { FFmpeg } = window.FFmpegWASM;
            const ffmpeg = new FFmpeg();
            if (typeof onLog === 'function') ffmpeg.on('log', onLog);
            if (typeof onProgress === 'function') ffmpeg.on('progress', onProgress);
            await ffmpeg.load();
            return ffmpeg;
        },
        ensureReady() {
            return ensureLibraries();
        }
    };

    // Run immediate initialization & also on DOMContentLoaded
    ensureLibraries().catch(err => console.warn('[FFmpegEngine] Initial setup warning:', err));
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ensureLibraries());
    }
})(window);
