/**
 * Factictionary Unified Monetization Engine
 * Integrates:
 * 1. Monetag (Zero traffic minimum, instant approval, high fill for utility tools)
 * 2. Adsterra (Zero traffic minimum, instant approval, native banners & social bar)
 * 3. EthicalAds (Privacy-first developer ad network - requires 50k+ monthly PVs)
 * 4. Contextual Affiliate Cards (Niche-matched high-converting affiliate recommendations)
 * 5. Fallback to Factictionary Google Play Apps & Cross-Promo
 */

(function () {
    'use strict';

    // Global configuration - Easy to toggle and customize
    window.FACTI_MONETIZATION = window.FACTI_MONETIZATION || {
        // 1. Monetag Configuration - PERMANENTLY DISABLED to eliminate popunders / popup ads
        monetag: {
            enabled: false,
            domain: null,
            swZoneId: null,
            scriptUrl: null,
            dataZone: null
        },

        // 2. Adsterra Configuration - ONLY clean static native banner enabled (no popups, no social bar, no smartlinks)
        adsterra: {
            enabled: true,
            socialBarScriptUrl: null, // Disabled: Social Bar causes floating/popup notifications
            nativeBannerScriptUrl: 'https://bauval.org/21/eb572ce7a2181b8df4a88738ae9b9ee8', // Clean static in-page recommendation grid
            nativeContainerId: 'container-eb572ce7a2181b8df4a88738ae9b9ee8',
            banner300x250Key: null, // Disabled: Prevent banner popups/redirects
            banner300x250ScriptUrl: null,
            smartlinkUrl: null // Disabled: Prevent smartlink CPA redirects
        },

        // 3. EthicalAds Configuration (https://www.ethicalads.io/ - requires 50k+ pageviews/month)
        ethicalAds: {
            enabled: false, // Keep false until your site reaches 50k+ monthly pageviews
            publisherId: 'factictionary-in',
            type: 'image', // 'image' or 'text'
            theme: 'light' // 'light' or 'dark'
        },

        // 4. Affiliate Recommendations (Active immediately, highest earnings per conversion)
        affiliates: {
            enabled: true,
            // Replace with your personalized referral / affiliate links
            links: {
                digitalocean: 'https://m.do.co/c/22866c63f7a5',
                canva: 'https://partner.canva.com/factictionary',
                descript: 'https://www.descript.com/?lmref=factictionary',
                fiverr: 'https://go.fiverr.com/visit/?bta=factictionary',
                publisherRocket: 'https://publisherrocket.com/?ref=factictionary',
                invideo: 'https://invideo.io/?ref=factictionary',
                freepik: 'https://freepik.com/?ref=factictionary'
            }
        }
    };

    const config = window.FACTI_MONETIZATION;

    /**
     * Detects page category from current URL and pathname
     */
    function detectCategory() {
        const path = window.location.pathname.toLowerCase();

        if (path.includes('pdf') || path.includes('document')) return 'pdf';
        if (path.includes('video') || path.includes('screen_recorder') || path.includes('frame_extractor')) return 'video';
        if (path.includes('audio')) return 'audio';
        if (path.includes('image') || path.includes('svg') || path.includes('qr_') || path.includes('background_remover')) return 'image';
        if (path.includes('json') || path.includes('base64') || path.includes('hash') || path.includes('diff') || path.includes('url_') || path.includes('case_')) return 'dev';
        if (path.includes('epub') || path.includes('docx') || path.includes('excel') || path.includes('cbz')) return 'readers';
        if (path.includes('kdp') || path.includes('product-generator')) return 'kdp';
        if (path.includes('play_store') || path.includes('tester') || path.includes('ats_') || path.includes('tuition')) return 'productivity';
        if (path.includes('/guides/')) return 'guides';
        if (path.includes('/games/') || path.includes('tambola') || path.includes('sudoku') || path.includes('word_games')) return 'games';

        return 'general';
    }

    /**
     * Checks if the current page is an interactive web tool (e.g. /tools/pdf_merger.html)
     * where file uploads, canvas, or audio/video inputs must NEVER be obstructed by popups.
     */
    function isToolPage() {
        const path = window.location.pathname.toLowerCase();
        return path.includes('/tools/') && !path.endsWith('/tools/') && !path.endsWith('/tools/index.html');
    }

    /**
     * Category-specific affiliate offers
     */
    const AFFILIATE_OFFERS = {
        pdf: {
            badge: '☁️ S3 Cloud Storage & CDN',
            badgeBg: '#EFF6FF',
            badgeColor: '#0284C7',
            title: 'DigitalOcean Spaces — Secure S3 Cloud Storage for Documents',
            description: 'Need to store, archive, or distribute large PDF files and backups? Get S3-compatible cloud object storage with built-in worldwide CDN and 99.99% uptime.',
            cta: 'Claim $200 Free Storage Credit ➔',
            linkKey: 'digitalocean',
            icon: '🗄️',
            features: ['$200 free credit for 60 days', 'S3-compatible API & automatic SSL', 'Built-in global CDN with zero bandwidth fees']
        },
        image: {
            badge: '🎨 Design & Graphic Suite',
            badgeBg: '#FDF2F8',
            badgeColor: '#BE185D',
            title: 'Canva Pro — Turn Processed Images into Viral Designs',
            description: '1-click AI background remover, 100M+ premium stock photos, fonts, and instant social media banner templates.',
            cta: 'Start 30-Day Free Pro Trial ➔',
            linkKey: 'canva',
            icon: '✨',
            features: ['Instant AI background remover', '1-click auto magic resize', '100+ million photos & graphics']
        },
        video: {
            badge: '🎬 AI Video & Screen Suite',
            badgeBg: '#F5F3FF',
            badgeColor: '#6D28D9',
            title: 'Descript — Edit Video & Podcasts as Easily as a Doc',
            description: 'Transcribe recordings instantly, remove filler words ("um", "uh") in one click, and generate studio-grade AI audio voiceovers.',
            cta: 'Try Descript Free ➔',
            linkKey: 'descript',
            icon: '🎙️',
            features: ['1-click filler word removal', 'Studio Sound AI audio filter', 'Automatic multi-language captions']
        },
        audio: {
            badge: '🎧 Studio Audio Production',
            badgeBg: '#ECFDF5',
            badgeColor: '#047857',
            title: 'InVideo AI — Turn Audio & Scripts into Full HD Videos',
            description: 'Generate complete narrated videos from your audio clips and scripts. Automated voiceovers, media matching, and viral subtitles.',
            cta: 'Create Free AI Video ➔',
            linkKey: 'invideo',
            icon: '⚡',
            features: ['Human-like AI voiceovers', 'Automatic media sync', 'Instant TikTok & YouTube Shorts export']
        },
        dev: {
            badge: '⚡ Cloud & Developer Stack',
            badgeBg: '#EFF6FF',
            badgeColor: '#1E40AF',
            title: 'DigitalOcean — $200 Free Cloud Hosting Credits',
            description: 'Deploy web apps, Docker containers, databases, and APIs in seconds on high-performance cloud droplets with global SSD storage.',
            cta: 'Claim $200 Free Developer Credit ➔',
            linkKey: 'digitalocean',
            icon: '🚀',
            features: ['$200 free credit for 60 days', 'Fast NVMe SSD droplets', '1-click Docker & Node.js deploy']
        },
        kdp: {
            badge: '📚 Self-Publishing Growth',
            badgeBg: '#FFFBEB',
            badgeColor: '#B45309',
            title: 'Publisher Rocket — Find Low-Competition Amazon KDP Keywords',
            description: 'Stop guessing what sells on Amazon. Discover exact customer search volume, book competitor royalties, and profitable categories in minutes.',
            cta: 'Explore Publisher Rocket ➔',
            linkKey: 'publisherRocket',
            icon: '📈',
            features: ['Real Amazon search volume data', 'Competitor revenue analysis', 'Unlocks secret bestseller categories']
        },
        productivity: {
            badge: '👥 Developer & Freelance Marketplace',
            badgeBg: '#F0FDF4',
            badgeColor: '#15803D',
            title: 'Fiverr — Hire Verified Google Play Testers & Designers',
            description: 'Need 12 daily active testers for Google Play closed testing? Or professional resume review & app icon design? Verified gigs starting at $5.',
            cta: 'Find Verified Freelancers ➔',
            linkKey: 'fiverr',
            icon: '🤝',
            features: ['12 Testers / 14 Days testing gigs', 'App icons, ASO & screenshots', '24/7 buyer protection guarantee']
        },
        readers: {
            badge: '🚀 Zero-Ops App Platform',
            badgeBg: '#F0FDF4',
            badgeColor: '#16A34A',
            title: 'DigitalOcean App Platform — Deploy Web Apps from GitHub',
            description: 'Build, host, and scale web applications, APIs, and microservices without managing servers. Auto-deploys on every git push with free automatic SSL.',
            cta: 'Launch Apps with $200 Credit ➔',
            linkKey: 'digitalocean',
            icon: '🌐',
            features: ['$200 free credit for new accounts', 'Auto-deploys from GitHub/GitLab', 'Zero infrastructure management required']
        },
        general: {
            badge: '☁️ Cloud Infrastructure Partner',
            badgeBg: '#EFF6FF',
            badgeColor: '#1D4ED8',
            title: 'DigitalOcean — $200 Free Cloud Server & Database Credit',
            description: 'Supercharge your web projects with developer-friendly cloud infrastructure. Claim $200 in free credit across Droplets, Kubernetes, and Managed Databases.',
            cta: 'Claim Your $200 Free Credit ➔',
            linkKey: 'digitalocean',
            icon: '🚀',
            features: ['$200 free credit for 60 days', 'Developer-first control panel', '15 global data centers with 99.99% uptime']
        }
    };

    /**
     * Injects CSS styles for Ad containers and Contextual Affiliate Cards
     */
    function injectMonetizationStyles() {
        if (document.getElementById('facti-monetization-styles')) return;

        const style = document.createElement('style');
        style.id = 'facti-monetization-styles';
        style.textContent = `
            .facti-monetization-wrapper {
                margin: 40px auto;
                max-width: 900px;
                width: 100%;
                box-sizing: border-box;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* UX CLICK SHIELD: Ensure tool dropzones, file pickers & buttons are never blocked by ad overlays */
            .drop-zone, #dropZone, .pdf-tool-card, .file-card, .tool-workspace,
            .action-button-group, input[type="file"], select, button, .btn,
            #hero-live-search, .hero-search-wrapper, .search-result-item {
                position: relative !important;
                z-index: 100 !important;
                pointer-events: auto !important;
            }

            /* Generic Ad Container (Adsterra / Monetag / EthicalAds) */
            .facti-ad-container {
                margin-bottom: 24px;
                text-align: center;
                background: #FFFFFF;
                border-radius: 16px;
                padding: 14px;
                border: 1px solid #E2E8F0;
                box-shadow: 0 4px 14px rgba(0,0,0,0.03);
                min-height: 50px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .facti-ad-label {
                font-size: 0.68rem;
                color: #94A3B8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 6px;
                font-weight: 700;
            }

            /* Contextual Affiliate Recommendation Card */
            .facti-affiliate-card {
                background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
                border: 1.5px solid #E2E8F0;
                border-radius: 20px;
                padding: 28px 32px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
                transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
                display: flex;
                flex-direction: column;
                gap: 16px;
                position: relative;
                overflow: hidden;
            }

            .facti-affiliate-card:hover {
                transform: translateY(-3px);
                border-color: #38BDF8;
                box-shadow: 0 16px 36px rgba(0, 102, 255, 0.08);
            }

            .facti-affiliate-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
            }

            .facti-affiliate-badge {
                font-size: 0.78rem;
                font-weight: 800;
                padding: 4px 12px;
                border-radius: 20px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }

            .facti-affiliate-disclosure {
                font-size: 0.72rem;
                color: #94A3B8;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .facti-affiliate-body {
                display: flex;
                align-items: flex-start;
                gap: 20px;
            }

            .facti-affiliate-icon {
                font-size: 2.5rem;
                line-height: 1;
                flex-shrink: 0;
                padding: 12px;
                background: #FFFFFF;
                border: 1px solid #E2E8F0;
                border-radius: 16px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            }

            .facti-affiliate-info {
                flex: 1;
                min-width: 0;
            }

            .facti-affiliate-title {
                font-size: 1.25rem;
                font-weight: 800;
                color: #0F172A;
                margin: 0 0 8px;
                line-height: 1.3;
            }

            .facti-affiliate-desc {
                font-size: 0.95rem;
                color: #475569;
                line-height: 1.6;
                margin: 0 0 14px;
            }

            .facti-affiliate-features {
                display: flex;
                flex-wrap: wrap;
                gap: 10px 16px;
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .facti-affiliate-features li {
                font-size: 0.85rem;
                color: #334155;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .facti-affiliate-features li::before {
                content: "✓";
                color: #10B981;
                font-weight: 900;
            }

            .facti-affiliate-cta-btn {
                align-self: flex-start;
                background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%);
                color: #FFFFFF !important;
                font-weight: 800;
                font-size: 0.95rem;
                padding: 12px 26px;
                border-radius: 50px;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 14px rgba(0, 102, 255, 0.28);
                transition: all 0.2s ease;
                margin-top: 6px;
            }

            .facti-affiliate-cta-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(0, 102, 255, 0.4);
                color: #FFFFFF !important;
            }

            .facti-affiliate-commission-notice {
                margin-top: 14px;
                padding-top: 10px;
                border-top: 1px dashed #CBD5E1;
                font-size: 0.74rem;
                color: #64748B;
                line-height: 1.5;
            }

            .facti-affiliate-commission-notice a {
                color: #0284C7;
                text-decoration: underline;
                font-weight: 600;
            }

            @media (max-width: 680px) {
                .facti-affiliate-card {
                    padding: 20px;
                }
                .facti-affiliate-body {
                    flex-direction: column;
                    gap: 14px;
                }
                .facti-affiliate-icon {
                    font-size: 2rem;
                    padding: 8px;
                }
                .facti-affiliate-title {
                    font-size: 1.1rem;
                }
                .facti-affiliate-cta-btn {
                    width: 100%;
                    justify-content: center;
                    text-align: center;
                    box-sizing: border-box;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initializes EthicalAds (if enabled and reaching 50k PVs/mo)
     */
    function initEthicalAds(container, category) {
        if (!config.ethicalAds.enabled || !config.ethicalAds.publisherId) return;

        const keywordMap = {
            pdf: 'pdf|document|security',
            video: 'video|multimedia|streaming',
            audio: 'audio|sound|multimedia',
            image: 'design|image|graphics',
            dev: 'developer|programming|javascript|python',
            readers: 'books|reading|documents',
            productivity: 'tools|productivity|freelance',
            kdp: 'publishing|books|writing',
            guides: 'tutorial|software|development',
            games: 'gaming|puzzles|casual'
        };

        const keywords = keywordMap[category] || 'developer|tools|tech';

        const eaWrapper = document.createElement('div');
        eaWrapper.className = 'facti-ad-container';

        const eaUnit = document.createElement('div');
        eaUnit.className = 'horizontal';
        eaUnit.setAttribute('data-ea-publisher', config.ethicalAds.publisherId);
        eaUnit.setAttribute('data-ea-type', config.ethicalAds.type || 'image');
        eaUnit.setAttribute('data-ea-keywords', keywords);
        if (config.ethicalAds.theme) {
            eaUnit.setAttribute('data-ea-theme', config.ethicalAds.theme);
        }

        eaWrapper.appendChild(eaUnit);
        container.appendChild(eaWrapper);

        if (!document.querySelector('script[src*="ethicalads.min.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    /**
     * Initializes Monetag Ads: Permanently disabled.
     * Monetag MultiTag triggers OnClick popunders and popup tabs that ruin site usability.
     */
    function initMonetag() {
        return;
    }

    /**
     * Initializes Adsterra Ads
     * ONLY loads the non-intrusive Native Banner (a static recommendation grid placed
     * at the bottom of the page above the donation card).
     * Social Bar, 300x250 iframe, and Smartlinks are completely removed to prevent all popup ads.
     */
    function initAdsterra(container) {
        if (!config.adsterra.enabled) return;

        // Native Banner (Clean recommendation cards placed at the bottom, above donation card)
        if (config.adsterra.nativeBannerScriptUrl) {
            const nativeWrap = document.createElement('div');
            nativeWrap.className = 'facti-ad-container facti-native-wrap';
            nativeWrap.style.marginBottom = '20px';
            nativeWrap.innerHTML = `
                <div class="facti-ad-label">Sponsored Highlights</div>
                <div id="${config.adsterra.nativeContainerId || 'container-eb572ce7a2181b8df4a88738ae9b9ee8'}"></div>
            `;
            container.appendChild(nativeWrap);

            if (!document.querySelector('script[src*="eb572ce7a2181b8df4a88738ae9b9ee8"]')) {
                const script = document.createElement('script');
                script.src = config.adsterra.nativeBannerScriptUrl;
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                document.head.appendChild(script);
            }
        }
    }

    /**
     * Renders Contextual Affiliate Card
     */
    function renderAffiliateCard(container, category) {
        if (!config.affiliates.enabled) return;

        const offer = AFFILIATE_OFFERS[category] || AFFILIATE_OFFERS.general;
        const targetUrl = config.affiliates.links[offer.linkKey] || '#';

        const card = document.createElement('div');
        card.className = 'facti-affiliate-card';

        const featuresHtml = offer.features.map(f => `<li>${f}</li>`).join('');

        card.innerHTML = `
            <div class="facti-affiliate-header">
                <span class="facti-affiliate-badge" style="background:${offer.badgeBg}; color:${offer.badgeColor};">
                    ${offer.badge}
                </span>
                <span class="facti-affiliate-disclosure">Sponsored • We may earn a commission</span>
            </div>
            <div class="facti-affiliate-body">
                <div class="facti-affiliate-icon">${offer.icon}</div>
                <div class="facti-affiliate-info">
                    <h3 class="facti-affiliate-title">${offer.title}</h3>
                    <p class="facti-affiliate-desc">${offer.description}</p>
                    <ul class="facti-affiliate-features">
                        ${featuresHtml}
                    </ul>
                    <div style="margin-top:16px;">
                        <a href="${targetUrl}" target="_blank" rel="noopener sponsored" class="facti-affiliate-cta-btn">
                            ${offer.cta}
                        </a>
                    </div>
                    <div class="facti-affiliate-commission-notice">
                        💡 <strong>Affiliate Disclosure:</strong> If you sign up or purchase through this partner link, Factictionary may earn a referral commission or credit at zero extra cost to you. This directly funds our infrastructure and keeps our 85+ web utilities 100% free and private. <a href="/disclaimer.html#affiliate" target="_blank" rel="noopener">Learn more</a>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    }

    /**
     * Injects monetization units into the page
     */
    function setupMonetization() {
        injectMonetizationStyles();
        initMonetag();

        const category = detectCategory();

        // Find the best insertion point
        let insertionSlot = document.getElementById('facti-monetization-slot');

        if (!insertionSlot) {
            const donationBanner = document.querySelector('.donation-banner-card');
            if (donationBanner && donationBanner.parentNode) {
                insertionSlot = document.createElement('div');
                insertionSlot.id = 'facti-monetization-slot';
                insertionSlot.className = 'facti-monetization-wrapper';
                donationBanner.parentNode.insertBefore(insertionSlot, donationBanner);
            }
        }

        if (!insertionSlot) {
            const main = document.querySelector('main') || document.querySelector('.container') || document.body;
            insertionSlot = document.createElement('div');
            insertionSlot.id = 'facti-monetization-slot';
            insertionSlot.className = 'facti-monetization-wrapper';
            main.appendChild(insertionSlot);
        }

        // 1. Adsterra Ad Unit (0 traffic requirement)
        if (config.adsterra.enabled) {
            initAdsterra(insertionSlot);
        }

        // 2. EthicalAds Unit (50k+ PVs)
        if (config.ethicalAds.enabled) {
            initEthicalAds(insertionSlot, category);
        }

        // 3. Category-Specific Affiliate Card (Highest direct ROI)
        if (config.affiliates.enabled) {
            renderAffiliateCard(insertionSlot, category);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMonetization);
    } else {
        setupMonetization();
    }
})();
