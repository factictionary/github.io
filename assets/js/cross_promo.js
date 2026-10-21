/**
 * Factictionary Cross-Promotion Ad Network (Web Engine)
 * Integrated from c:\tools\projects\antigravity\cross_promo_ads
 * 
 * Provides automated, weighted fallback to portfolio apps whenever
 * Google AdSense banner ads have no fill (unfilled) or are blocked.
 */

(function () {
    'use strict';

    // Portfolio campaigns configuration (mirrors campaigns.json from cross_promo_ads)
    const CAMPAIGNS = [
        {
            id: 'duo_cards',
            packageName: 'in.factictionary.uno_card_game',
            appName: 'Duo Cards',
            tagline: 'Skip, Reverse & Shout DUO!',
            description: 'Classic Crazy 8s • 100% Offline Play',
            iconUrl: '/assets/images/cross_promo/icons/duo_cards.png',
            fallbackIconUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/icons/duo_cards.png',
            bannerUrl: '/assets/images/cross_promo/banners/duo_cards_320x50.png',
            fallbackBannerUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/duo_cards_320x50.png',
            bannerMediumUrl: '/assets/images/cross_promo/banners/duo_cards_300x250.png',
            fallbackBannerMediumUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/duo_cards_300x250.png',
            rating: 4.8,
            downloads: '10K+',
            targetUrl: 'https://play.google.com/store/apps/details?id=in.factictionary.uno_card_game',
            ctaText: 'PLAY NOW',
            color: '#EF4444',
            weight: 20
        },
        {
            id: 'tambola_host',
            packageName: 'in.factictionary.tambola_housie_host',
            appName: 'Tambola Host',
            tagline: 'Host Housie & Tambola Parties',
            description: 'Automatic Number Caller & Ticket Checker',
            iconUrl: '/assets/images/cross_promo/icons/tambola_host.png',
            fallbackIconUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/icons/tambola_host.png',
            bannerUrl: '/assets/images/cross_promo/banners/tambola_host_320x50.png',
            fallbackBannerUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/tambola_host_320x50.png',
            bannerMediumUrl: '/assets/images/cross_promo/banners/tambola_host_300x250.png',
            fallbackBannerMediumUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/tambola_host_300x250.png',
            rating: 4.7,
            downloads: '50K+',
            targetUrl: 'https://play.google.com/store/apps/details?id=in.factictionary.tambola_housie_host',
            ctaText: 'HOST FREE',
            color: '#F59E0B',
            weight: 20
        },
        {
            id: 'vocab_iq',
            packageName: 'in.factictionary.crosssearch',
            appName: 'VocabIQ',
            tagline: 'Crosswords + Wordle + Search',
            description: 'Daily Brain Workout • 1,000+ Puzzles',
            iconUrl: '/assets/images/cross_promo/icons/vocab_iq.png',
            fallbackIconUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/icons/vocab_iq.png',
            bannerUrl: '/assets/images/cross_promo/banners/vocab_iq_320x50.png',
            fallbackBannerUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/vocab_iq_320x50.png',
            bannerMediumUrl: '/assets/images/cross_promo/banners/vocab_iq_300x250.png',
            fallbackBannerMediumUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/vocab_iq_300x250.png',
            rating: 4.9,
            downloads: 'Verified',
            targetUrl: 'https://play.google.com/store/apps/details?id=in.factictionary.crosssearch',
            ctaText: 'PLAY FREE',
            color: '#10B981',
            weight: 20
        },
        {
            id: 'teleprompter',
            packageName: 'in.factictionary.speak_smart',
            appName: 'Teleprompter & Coach',
            tagline: 'Record Videos in 1 Single Take',
            description: 'Floating Camera Script & Speech Pacing',
            iconUrl: '/assets/images/cross_promo/icons/teleprompter.png',
            fallbackIconUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/icons/teleprompter.png',
            bannerUrl: '/assets/images/cross_promo/banners/teleprompter_320x50.png',
            fallbackBannerUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/teleprompter_320x50.png',
            bannerMediumUrl: '/assets/images/cross_promo/banners/teleprompter_300x250.png',
            fallbackBannerMediumUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/teleprompter_300x250.png',
            rating: 4.8,
            downloads: 'Verified',
            targetUrl: 'https://play.google.com/store/apps/details?id=in.factictionary.speak_smart',
            ctaText: 'RECORD NOW',
            color: '#6366F1',
            weight: 20
        },
        {
            id: 'mind_bites',
            packageName: 'in.factictionary.mind_bites',
            appName: 'MindBites',
            tagline: 'Get Smarter in 2 Minutes a Day',
            description: 'Curated Daily Insights & Science',
            iconUrl: '/assets/images/cross_promo/icons/mind_bites.png',
            fallbackIconUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/icons/mind_bites.png',
            bannerUrl: '/assets/images/cross_promo/banners/mind_bites_320x50.png',
            fallbackBannerUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/mind_bites_320x50.png',
            bannerMediumUrl: '/assets/images/cross_promo/banners/mind_bites_300x250.png',
            fallbackBannerMediumUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/mind_bites_300x250.png',
            rating: 4.8,
            downloads: 'Verified',
            targetUrl: 'https://play.google.com/store/apps/details?id=in.factictionary.mind_bites',
            ctaText: 'READ FREE',
            color: '#EC4899',
            weight: 20
        },
        {
            id: 'stack_blitz',
            packageName: 'in.factictionary.stack_blitz',
            appName: 'Stack Blitz 3D',
            tagline: 'Tap, Stack & Reach The Clouds!',
            description: 'Satisfying 3D Tower Stacker • No WiFi',
            iconUrl: '/assets/images/cross_promo/icons/stack_blitz.png',
            fallbackIconUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/icons/stack_blitz.png',
            bannerUrl: '/assets/images/cross_promo/banners/stack_blitz_320x50.png',
            fallbackBannerUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/stack_blitz_320x50.png',
            bannerMediumUrl: '/assets/images/cross_promo/banners/stack_blitz_300x250.png',
            fallbackBannerMediumUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/stack_blitz_300x250.png',
            rating: 4.7,
            downloads: 'Verified',
            targetUrl: 'https://play.google.com/store/apps/details?id=in.factictionary.stack_blitz',
            ctaText: 'PLAY NOW',
            color: '#3B82F6',
            weight: 20
        },
        {
            id: 'test_pilot_pro',
            packageName: 'in.factictionary.test_pilot_pro',
            appName: 'Test Pilot Pro',
            tagline: 'Pass 14-Day Google Play Testing',
            description: '12 Verified Dedicated Real Devices',
            iconUrl: '/assets/images/cross_promo/icons/test_pilot_pro.png',
            fallbackIconUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/icons/test_pilot_pro.png',
            bannerUrl: '/assets/images/cross_promo/banners/test_pilot_pro_320x50.png',
            fallbackBannerUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/test_pilot_pro_320x50.png',
            bannerMediumUrl: '/assets/images/cross_promo/banners/test_pilot_pro_300x250.png',
            fallbackBannerMediumUrl: 'https://cdn.jsdelivr.net/gh/factictionary/cross_promo_network@main/assets/banners/test_pilot_pro_300x250.png',
            rating: 4.9,
            downloads: 'Verified',
            targetUrl: 'https://play.google.com/store/apps/details?id=in.factictionary.test_pilot_pro',
            ctaText: 'GET TESTERS',
            color: '#14B8A6',
            weight: 20
        }
    ];

    let usedIndices = [];

    // Weighted random selection avoiding back-to-back duplicates
    function getNextCampaign() {
        if (CAMPAIGNS.length === 0) return null;
        if (usedIndices.length >= CAMPAIGNS.length) {
            usedIndices = [];
        }

        const available = CAMPAIGNS.map((c, i) => ({ campaign: c, index: i }))
            .filter(item => !usedIndices.includes(item.index));

        const pool = available.length > 0 ? available : CAMPAIGNS.map((c, i) => ({ campaign: c, index: i }));

        const totalWeight = pool.reduce((sum, item) => sum + (item.campaign.weight || 10), 0);
        let randomVal = Math.random() * totalWeight;

        for (const item of pool) {
            randomVal -= (item.campaign.weight || 10);
            if (randomVal <= 0) {
                usedIndices.push(item.index);
                return item.campaign;
            }
        }

        const fallback = pool[0];
        usedIndices.push(fallback.index);
        return fallback.campaign;
    }

    // Generate responsive HTML for a banner
    function buildAdHtml(campaign, format) {
        const isMedium = format === 'medium' || format === 'mrec';
        const bannerImgSrc = isMedium ? campaign.bannerMediumUrl : campaign.bannerUrl;
        const fallbackBannerImgSrc = isMedium ? campaign.fallbackBannerMediumUrl : campaign.fallbackBannerUrl;

        return `
            <div class="xp-banner-container xp-format-${format}" data-campaign-id="${campaign.id}">
                <a href="${campaign.targetUrl}" target="_blank" rel="noopener noreferrer" class="xp-ad-link" title="${campaign.appName} on Google Play">
                    <div class="xp-ad-content">
                        <!-- Graphic Banner with Automatic Fallback -->
                        <img src="${bannerImgSrc}" 
                             alt="${campaign.appName} - ${campaign.tagline}" 
                             class="xp-ad-image" 
                             loading="lazy"
                             onerror="this.onerror=null; this.src='${fallbackBannerImgSrc}'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='flex';};" />
                        
                        <!-- Rich Native Card Fallback (Shown if image fails) -->
                        <div class="xp-native-card" style="display: none;">
                            <img src="${campaign.iconUrl}" 
                                 alt="${campaign.appName}" 
                                 class="xp-native-icon"
                                 onerror="this.src='${campaign.fallbackIconUrl}'" />
                            <div class="xp-native-body">
                                <div class="xp-native-title-row">
                                    <span class="xp-native-title">${campaign.appName}</span>
                                    <span class="xp-native-rating">★ ${campaign.rating}</span>
                                </div>
                                <div class="xp-native-tagline">${campaign.tagline}</div>
                                <div class="xp-native-desc">${campaign.description}</div>
                            </div>
                            <button class="xp-native-cta" style="background-color: ${campaign.color}">${campaign.ctaText}</button>
                        </div>
                    </div>
                </a>
                <div class="xp-ad-badge" title="Official Factictionary App Portfolio">
                    <span>Ad · Portfolio</span>
                    <a href="https://play.google.com/store/apps/developer?id=Factictionary" target="_blank" rel="noopener noreferrer" class="xp-badge-info">ⓘ</a>
                </div>
            </div>
        `;
    }

    // Replace or populate an unfilled ad element
    function serveFallbackAd(element, format) {
        if (!element || element.dataset.xpFilled === 'true') return;

        const campaign = getNextCampaign();
        if (!campaign) return;

        // Auto-detect format if not explicitly passed
        if (!format) {
            const rect = element.getBoundingClientRect();
            if (rect.height > 120 || element.classList.contains('adsense-tool')) {
                format = 'medium';
            } else {
                format = 'banner';
            }
        }

        element.dataset.xpFilled = 'true';
        element.innerHTML = buildAdHtml(campaign, format);
        element.classList.add('xp-ad-active');
        element.style.minHeight = format === 'medium' ? '250px' : '50px';
        element.style.display = 'block';

        // Track impressions if analytics is available
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'cross_promo_impression', {
                event_category: 'cross_promo',
                campaign_id: campaign.id,
                format: format
            });
        }
    }

    // Inspect Google AdSense elements (<ins class="adsbygoogle"> and .adsense-tool)
    function checkAndFillAds() {
        // 1. Check existing .adsense-tool placeholder containers
        const toolContainers = document.querySelectorAll('.adsense-tool');
        toolContainers.forEach(container => {
            if (container.dataset.xpFilled === 'true') return;
            
            // Check if it's still showing the empty text placeholder
            const insChild = container.querySelector('ins.adsbygoogle');
            if (!insChild) {
                serveFallbackAd(container, 'medium');
            }
        });

        // 2. Check all Google AdSense <ins> tags
        const adsbygoogleElements = document.querySelectorAll('ins.adsbygoogle');
        adsbygoogleElements.forEach(ins => {
            if (ins.dataset.xpFilled === 'true') return;

            // Check if explicitly marked unfilled by Google AdSense
            const adStatus = ins.getAttribute('data-ad-status');
            const googleStatus = ins.getAttribute('data-adsbygoogle-status');

            if (adStatus === 'unfilled') {
                const targetContainer = ins.closest('.adsense-tool') || ins.parentElement || ins;
                serveFallbackAd(targetContainer);
                return;
            }

            // Watch for future attribute changes
            if (!ins._xpObserverAttached) {
                ins._xpObserverAttached = true;
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
                            if (ins.getAttribute('data-ad-status') === 'unfilled') {
                                const targetContainer = ins.closest('.adsense-tool') || ins.parentElement || ins;
                                serveFallbackAd(targetContainer);
                            }
                        }
                    });
                });
                observer.observe(ins, { attributes: true });
            }
        });
    }

    // Set a safety timeout: If Google AdSense hasn't filled after 2.5 seconds, show cross-promo
    function scheduleAdSafetyCheck() {
        setTimeout(() => {
            const adsbygoogleElements = document.querySelectorAll('ins.adsbygoogle');
            adsbygoogleElements.forEach(ins => {
                if (ins.dataset.xpFilled === 'true') return;

                const hasIframe = ins.querySelector('iframe');
                const adStatus = ins.getAttribute('data-ad-status');
                
                // If AdSense didn't render an iframe, or status is unfilled, or height is zero:
                if (!hasIframe || adStatus === 'unfilled' || ins.offsetHeight === 0) {
                    const targetContainer = ins.closest('.adsense-tool') || ins.parentElement || ins;
                    serveFallbackAd(targetContainer);
                }
            });

            // Also check .adsense-tool containers
            const toolContainers = document.querySelectorAll('.adsense-tool');
            toolContainers.forEach(container => {
                if (container.dataset.xpFilled !== 'true') {
                    serveFallbackAd(container, 'medium');
                }
            });
        }, 2200);
    }

    // Inject cross promo CSS styles into head
    function injectStyles() {
        if (document.getElementById('cross-promo-styles')) return;

        const style = document.createElement('style');
        style.id = 'cross-promo-styles';
        style.textContent = `
            .xp-banner-container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #FFFFFF;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                border: 1px solid rgba(0, 0, 0, 0.08);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                margin: 0 auto;
                width: 100%;
                box-sizing: border-box;
            }
            .xp-banner-container:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            }
            .xp-ad-link {
                display: block;
                width: 100%;
                text-decoration: none;
                color: inherit;
            }
            .xp-ad-content {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .xp-ad-image {
                max-width: 100%;
                height: auto;
                display: block;
                object-fit: contain;
                border-radius: 8px;
            }
            .xp-format-medium {
                max-width: 320px;
                min-height: 250px;
            }
            .xp-format-medium .xp-ad-image {
                width: 300px;
                height: 250px;
            }
            .xp-format-banner {
                max-width: 728px;
                min-height: 50px;
            }
            .xp-format-banner .xp-ad-image {
                max-height: 90px;
            }
            .xp-native-card {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                width: 100%;
                box-sizing: border-box;
                background: linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%);
            }
            .xp-native-icon {
                width: 52px;
                height: 52px;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                flex-shrink: 0;
            }
            .xp-native-body {
                flex: 1;
                min-width: 0;
            }
            .xp-native-title-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 2px;
            }
            .xp-native-title {
                font-weight: 700;
                font-size: 15px;
                color: #0F172A;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .xp-native-rating {
                font-size: 12px;
                font-weight: 600;
                color: #F59E0B;
                background: #FEF3C7;
                padding: 2px 6px;
                border-radius: 12px;
            }
            .xp-native-tagline {
                font-size: 13px;
                font-weight: 600;
                color: #2563EB;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .xp-native-desc {
                font-size: 11px;
                color: #64748B;
                margin-top: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .xp-native-cta {
                padding: 8px 14px;
                font-size: 13px;
                font-weight: 800;
                color: #FFFFFF;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                white-space: nowrap;
                flex-shrink: 0;
            }
            .xp-ad-badge {
                position: absolute;
                bottom: 2px;
                right: 4px;
                font-size: 9px;
                color: #94A3B8;
                background: rgba(255, 255, 255, 0.85);
                padding: 1px 5px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 3px;
                pointer-events: auto;
            }
            .xp-badge-info {
                color: #64748B;
                text-decoration: none;
                font-weight: bold;
            }
            .adsense-tool.xp-ad-active {
                border: none !important;
                background: transparent !important;
                padding: 0 !important;
                min-height: unset !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Public API
    window.CrossPromo = {
        campaigns: CAMPAIGNS,
        serveFallbackAd: serveFallbackAd,
        checkAndFillAds: checkAndFillAds
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            checkAndFillAds();
            scheduleAdSafetyCheck();
        });
    } else {
        injectStyles();
        checkAndFillAds();
        scheduleAdSafetyCheck();
    }
})();
