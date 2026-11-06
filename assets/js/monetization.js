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
        // 1. Monetag Configuration (https://monetag.com/ - 0 traffic requirement, fast approval)
        monetag: {
            enabled: false, // Set to true once you get your Monetag tag
            scriptUrl: '',  // e.g., 'https://alwingulla.com/88/tag.min.js' or MultiTag URL
            inPagePushZoneId: '',
            nativeZoneId: ''
        },

        // 2. Adsterra Configuration (https://adsterra.com/ - 0 traffic requirement, instant approval)
        adsterra: {
            enabled: false, // Set to true once you get your Adsterra tag
            socialBarScriptUrl: '', // Social Bar / In-Page Push script tag URL
            bannerScriptUrl: '',    // Native banner or 728x90/300x250 script URL
            bannerContainerId: ''   // Container ID if provided by Adsterra
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
                nordvpn: 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=factictionary',
                canva: 'https://partner.canva.com/factictionary',
                descript: 'https://www.descript.com/?lmref=factictionary',
                digitalocean: 'https://m.do.co/c/factictionary',
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
     * Category-specific affiliate offers
     */
    const AFFILIATE_OFFERS = {
        pdf: {
            badge: '🔒 Privacy & Security Recommendation',
            badgeBg: '#EFF6FF',
            badgeColor: '#1D4ED8',
            title: 'NordVPN — Encrypt & Shield Your Confidential Files',
            description: 'You care about zero-server client privacy. Pair browser utilities with military-grade internet encryption and malware threat protection.',
            cta: 'Claim 70% Off + 3 Months Free ➔',
            linkKey: 'nordvpn',
            icon: '🛡️',
            features: ['Zero logs verified audit', 'Threat Protection stops malware', '6,000+ ultra-fast global servers']
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
        general: {
            badge: '🛡️ Privacy & Utility Power',
            badgeBg: '#EFF6FF',
            badgeColor: '#1D4ED8',
            title: 'NordVPN — Ultimate Privacy for In-Browser Workflows',
            description: 'Protect your browser activity and data integrity with the world\'s leading privacy shield and threat blocker.',
            cta: 'Get 70% Off + Threat Protection ➔',
            linkKey: 'nordvpn',
            icon: '🔒',
            features: ['Military-grade encryption', 'Shields against intrusive trackers', 'Works across all desktop & mobile devices']
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
     * Initializes Monetag Ads (0 traffic requirement)
     */
    function initMonetag() {
        if (!config.monetag.enabled) return;

        if (config.monetag.scriptUrl && !document.querySelector(`script[src*="${config.monetag.scriptUrl}"]`)) {
            const script = document.createElement('script');
            script.src = config.monetag.scriptUrl;
            script.setAttribute('data-cfasync', 'false');
            script.async = true;
            document.head.appendChild(script);
        }
    }

    /**
     * Initializes Adsterra Ads (0 traffic requirement)
     */
    function initAdsterra(container) {
        if (!config.adsterra.enabled) return;

        // Social Bar script
        if (config.adsterra.socialBarScriptUrl && !document.querySelector(`script[src*="${config.adsterra.socialBarScriptUrl}"]`)) {
            const script = document.createElement('script');
            script.src = config.adsterra.socialBarScriptUrl;
            script.async = true;
            document.head.appendChild(script);
        }

        // Native / Display banner placement
        if (config.adsterra.bannerScriptUrl) {
            const adWrap = document.createElement('div');
            adWrap.className = 'facti-ad-container';
            adWrap.innerHTML = '<div class="facti-ad-label">Advertisement</div>';
            
            const bannerContainer = document.createElement('div');
            if (config.adsterra.bannerContainerId) {
                bannerContainer.id = config.adsterra.bannerContainerId;
            }
            adWrap.appendChild(bannerContainer);
            container.appendChild(adWrap);

            const script = document.createElement('script');
            script.src = config.adsterra.bannerScriptUrl;
            script.async = true;
            document.head.appendChild(script);
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
                <span class="facti-affiliate-disclosure">Partner Recommendation</span>
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
