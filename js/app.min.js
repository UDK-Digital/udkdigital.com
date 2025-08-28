(function () {
    'use strict';

    // GSAP Eklentilerini ve temel değişkenleri tanımla
    gsap.registerPlugin(ScrollTrigger, Flip);
    const content = document.querySelector("body");
    const imgLoad = imagesLoaded(content);

    // --- YÜKLEYİCİ ANİMASYONLARI ---
    function initLoader() {
        const loadingWrap = document.querySelector(".loading-wrap");
        if (!loadingWrap) return;

        const loadingItems = loadingWrap.querySelectorAll(".loading__item");
        const fadeInItems = document.querySelectorAll(".loading__fade");
        const loaderCountEl = document.querySelector(".loader__count .count__text");
        let count = 0;

        function startLoader() {
            if (!loaderCountEl) return;
            (function animateCount() {
                if (count < 100) {
                    let randomIncrement = Math.floor(10 * Math.random()) + 1;
                    count = Math.min(count + randomIncrement, 100);
                    loaderCountEl.textContent = count;
                    let randomDelay = Math.floor(120 * Math.random()) + 25;
                    setTimeout(animateCount, randomDelay);
                }
            })();
        }

        function hideLoader() {
            gsap.to(".loader__count", { duration: 0.8, ease: "power2.in", y: "100%", delay: 1.8 });
            gsap.to(".loader__wrapper", { duration: 0.8, ease: "power4.in", y: "-100%", delay: 2.2 });
            setTimeout(() => {
                const loader = document.getElementById("loader");
                if (loader) loader.classList.add("loaded");
            }, 3200);
        }

        function pageAppearance() {
            gsap.set(loadingItems, { opacity: 0 });
            gsap.to(loadingItems, { duration: 1.1, ease: "power4", startAt: { y: 120 }, y: 0, opacity: 1, delay: 0.8, stagger: 0.08 }, ">-=1.1");
            gsap.set(fadeInItems, { opacity: 0 });
            gsap.to(fadeInItems, { duration: 0.8, ease: "none", opacity: 1, delay: 3.2 });
        }

        startLoader();
        imgLoad.on("done", () => {
            hideLoader();
            pageAppearance();
        });
    }

    // --- LENIS SMOOTH SCROLL ---
    function initLenis() {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        
        // MagnificPopup açıldığında Lenis'i durdur/başlat
        $('#showreel-trigger').magnificPopup({
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
            callbacks: {
                beforeOpen: function () {
                    $('body').addClass('overflow-hidden');
                    lenis.stop();
                },
                close: function () {
                    $('body').removeClass('overflow-hidden');
                    lenis.start();
                },
            },
        });
    }

    // --- SCROLLTRIGGER ANİMASYONLARI ---
    
    // Tekrarlanan animasyonlar için yardımcı fonksiyon
    function createScrubAnimation(selector, trigger, start, end, fromVars, toVars, ease = "none") {
        const elements = gsap.utils.toArray(selector);
        elements.forEach(el => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: trigger,
                    start: start,
                    end: end,
                    scrub: true,
                    ease: ease
                }
            }).fromTo(el, fromVars, toVars);
        });
    }

    function initScrollTriggers() {
        // Header'ın gizlenmesi
        ScrollTrigger.create({
            trigger: "body",
            start: "top top-=-10",
            end: "bottom top",
            toggleClass: { targets: ".mxd-header", className: "is-hidden" }
        });

        // Hero 02 Animasyonları
        createScrubAnimation(
            ".hero-02-static-anim-el", ".hero-02-static__tl-trigger", "top 14%", "top 0.2%",
            { transform: "translate3d(0, 0, 0)", scaleY: 1, opacity: 1 },
            { transform: "translate3d(0, -5rem, 0)", scaleY: 1.3, opacity: 0 },
            "sine"
        );
        createScrubAnimation(
            ".hero-02-fade-out-scroll", ".mxd-pinned-fullscreen__tl-trigger", "top 80%", "top 10%",
            { opacity: 1 }, { opacity: 0 }, "sine"
        );

        // Hero 07 Animasyonları
        createScrubAnimation(
            ".hero-07-slide-out-scroll", ".mxd-hero-07__tl-trigger", "top 86%", "top 10%",
            { transform: "translate3d(0, 0, 0)", scaleY: 1 },
            { transform: "translate3d(0, -26rem, 0)", scaleY: 0.8 },
            "power4.out"
        );
        createScrubAnimation(
            ".hero-07-fade-out-scroll", ".mxd-hero-07__tl-trigger", "top 70%", "top 40%",
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
            { opacity: 0, transform: "translate3d(0, -10rem, 0)" },
            "elastic.out(1,0.3)"
        );

        // Hero 08 Animasyonları
        createScrubAnimation(
            ".hero-08-slide-out-scroll", ".mxd-hero-08__tl-trigger", "top 80%", "top 40%",
            { transform: "translate3d(0, 0, 0)", opacity: 1 },
            { transform: "translate3d(0, -5rem, 0)", opacity: 0 },
            "power4.inOut"
        );
        createScrubAnimation(
            ".hero-08-scale-out-scroll", ".mxd-hero-08__tl-trigger", "top 40%", "top 10%",
            { transform: "translate3d(0, 0, 0)", scaleY: 1, opacity: 1 },
            { transform: "translate3d(0, -5rem, 0)", scaleY: 1.2, opacity: 0 },
            "power4.inOut"
        );
        
        // Pinned Section
        $(".mxd-pinned").each(function () {
            const textItems = $(this).find(".mxd-pinned__text-item");
            const imgItems = $(this).find(".mxd-pinned__img-item");

            function setActive(index) {
                textItems.removeClass("is-active");
                imgItems.removeClass("is-active");
                textItems.eq(index).addClass("is-active");
                imgItems.eq(index).addClass("is-active");
            }
            setActive(0);
            textItems.each(function (index) {
                ScrollTrigger.create({
                    trigger: this,
                    start: "top center",
                    end: "bottom center",
                    onToggle: (self) => {
                        if (self.isActive) {
                            setActive(index);
                        }
                    },
                });
            });
        });

        // Stack-item
        const cards = document.querySelectorAll(".stack-item");
        if (cards.length > 0) {
            const stickySpace = document.querySelector(".stack-offset");
            const animation = gsap.timeline();
            let cardHeight;

            const initCards = () => {
                animation.clear();
                cardHeight = cards[0].offsetHeight;
                cards.forEach((card, index) => {
                    if (index > 0) {
                        gsap.set(card, { y: index * cardHeight });
                        animation.to(card, { y: 0, duration: 0.5 * index, ease: "none" }, 0);
                    }
                });
            };

            initCards();
            ScrollTrigger.create({
                trigger: ".stack-wrapper",
                start: "top top",
                pin: true,
                end: () => `+=${cards.length * cardHeight + (stickySpace ? stickySpace.offsetHeight : 0)}`,
                scrub: true,
                animation: animation,
                invalidateOnRefresh: true,
            });
            ScrollTrigger.addEventListener("refreshInit", initCards);
        }

        // Text & Universal Animations
        const splitTypes = document.querySelectorAll(".reveal-type");
        splitTypes.forEach((char) => {
            const text = new SplitType(char, { types: "words, chars" });
            gsap.from(text.chars, {
                scrollTrigger: { trigger: char, start: "top 80%", end: "top 20%", scrub: true },
                opacity: 0.2,
                stagger: 0.1,
            });
        });

        const animInUp = document.querySelectorAll(".reveal-in-up");
        animInUp.forEach((char) => {
            const text = new SplitType(char);
            gsap.from(text.chars, {
                scrollTrigger: { trigger: char, start: "top 90%", end: "top 20%", scrub: true },
                transformOrigin: "top left",
                y: 10,
                stagger: 0.2,
                delay: 0.2,
                duration: 2,
            });
        });

        gsap.utils.toArray(".animate-rotation").forEach(el => {
            gsap.fromTo(el, { rotate: 0 }, {
                rotate: $(el).data("value"),
                ease: "none",
                scrollTrigger: { trigger: el, scrub: true }
            });
        });
        
        gsap.utils.toArray(".anim-uni-in-up").forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 50, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" }
            });
        });

        // Batch animations for cards
        function createBatchAnimation(selector, batchMax) {
            if (document.querySelector(selector)) {
                gsap.set(selector, { y: 50, opacity: 0 });
                ScrollTrigger.batch(selector, {
                    interval: 0.1,
                    batchMax: batchMax,
                    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, ease: "sine", stagger: 0.15, overwrite: true }),
                    onLeave: batch => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
                    onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
                    onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
                });
                ScrollTrigger.addEventListener("refreshInit", () => gsap.set(selector, { y: 0, opacity: 1 }));
            }
        }
        createBatchAnimation(".animate-card-2", 2);
        createBatchAnimation(".animate-card-3", 3);
        createBatchAnimation(".animate-card-4", 4);
        createBatchAnimation(".animate-card-5", 5);

        // Zoom Container Animations
        const docStyle = getComputedStyle(document.documentElement);
        const radiusL = docStyle.getPropertyValue("--_radius-l");

        document.querySelectorAll(".anim-zoom-in-container").forEach(el => {
            gsap.fromTo(el, 
                { borderRadius: "200px", transform: "scale3d(0.94, 1, 1)" },
                { borderRadius: radiusL, transform: "scale3d(1, 1, 1)",
                scrollTrigger: { trigger: el, start: "top 82%", end: "top 14%", scrub: true, ease: "power4.inOut" }
            });
        });

        document.querySelectorAll(".anim-zoom-out-container").forEach(el => {
            gsap.fromTo(el,
                { borderRadius: "200px", transform: "scale3d(1.14, 1, 1)" },
                { borderRadius: radiusL, transform: "scale3d(1, 1, 1)",
                scrollTrigger: { trigger: el, start: "top 82%", end: "top 14%", scrub: true, ease: "power4.inOut" }
            });
        });

        // Universal Parallax
        gsap.to("[data-speed]", {
            y: (i, target) => (1 - parseFloat(target.getAttribute("data-speed"))) * ScrollTrigger.maxScroll(window),
            ease: "none",
            scrollTrigger: {
                start: 0,
                end: "max",
                invalidateOnRefresh: true,
                scrub: 0
            }
        });
        
        // Scroll to Top Button
        const toTop = document.querySelector(".btn-to-top");
        if (toTop) {
            toTop.addEventListener("click", (e) => {
                e.preventDefault();
                lenis.scrollTo(0, { duration: 1.3, ease: 'power4.inOut' });
            });
            gsap.set(toTop, { opacity: 0, visibility: 'hidden' });
            gsap.to(toTop, {
                opacity: 1,
                autoAlpha: 1,
                scrollTrigger: {
                    trigger: "body",
                    start: "top -20%",
                    end: "top -20%",
                    toggleActions: "play none reverse none"
                }
            });
        }
    }

    // --- EVENT LISTENERS & PLUGINS ---
    function initEventListeners() {
        // Typed.js
        if ($(".animated-type").length) {
            new Typed("#typed", {
                stringsElement: "#typed-strings",
                showCursor: true,
                cursorChar: "_",
                loop: true,
                typeSpeed: 70,
                backSpeed: 30,
                backDelay: 2500,
            });
        }
        
        // Menu & Hamburger Logic
        $(".mxd-nav__wrap").each(function () {
            const navWrap = $(this);
            const hamburger = navWrap.find(".mxd-nav__hamburger");
            const lines = navWrap.find(".hamburger__line");
            const menuContain = navWrap.find(".mxd-menu__contain");
            const hamburgerBase = navWrap.find(".hamburger__base");
            const menuWrapper = navWrap.find(".mxd-menu__wrapper");
            const menuBase = navWrap.find(".mxd-menu__base");
            const menuItems = navWrap.find(".main-menu__item");
            const menuPromo = navWrap.find(".menu-promo__video");
            const fadeInItems = navWrap.find(".menu-fade-in");
            
            const tl = gsap.timeline({ paused: true });

            function moveHamburgerBase(isOpening) {
                const state = Flip.getState(hamburgerBase);
                if (isOpening) {
                    hamburgerBase.appendTo(menuContain);
                } else {
                    hamburgerBase.appendTo(hamburger);
                }
                Flip.from(state, { ease: "power4.inOut", duration: 0.8 });
            }

            function toggleMenu(open) {
                if (tl.isActive()) return;
                if (open) {
                    tl.play();
                    hamburger.addClass("nav-open");
                } else {
                    tl.reverse();
                    hamburger.removeClass("nav-open");
                }
            }

            tl.set(menuWrapper, { display: "flex" })
              .from(menuBase, { opacity: 0, duration: 0.6, ease: "none", onStart: () => moveHamburgerBase(true) })
              .to(lines.eq(0), { y: 5, duration: 0.16 }, "<")
              .to(lines.eq(1), { y: -5, duration: 0.16 }, "<")
              .to(lines.eq(0), { rotate: 45, duration: 0.16 }, 0.2)
              .to(lines.eq(1), { rotate: -45, duration: 0.16 }, 0.2)
              .add("fade-in-up")
              .from(menuItems, { opacity: 0, yPercent: 50, duration: 0.2, stagger: { amount: 0.2 }, onReverseComplete: () => moveHamburgerBase(false) }, "fade-in-up")
              .from(menuPromo, { opacity: 0, yPercent: 20, duration: 0.2 }, "fade-in-up")
              .from(fadeInItems, { opacity: 0, duration: 0.3 });

            hamburger.on("click", function (event) {
                event.preventDefault();
                toggleMenu(!$(this).hasClass("nav-open"));
            });

            menuBase.on("click", () => toggleMenu(false));
            $(document).on("keydown", (e) => {
                if (e.key === "Escape") toggleMenu(false);
            });
            window.addEventListener("beforeunload", () => toggleMenu(false));
        });

        $(".mxd-nav__hamburger").on("click", function () {
            if ($(this).hasClass("nav-open")) {
                $(".mxd-header").addClass("menu-is-visible");
            } else {
                setTimeout(() => $(".mxd-header").removeClass("menu-is-visible"), 1100);
            }
        });

        // Accordion
        $(".mxd-accordion__title").on("click", function (e) {
            e.preventDefault();
            const $this = $(this);
            if (!$this.hasClass("accordion-active")) {
                $(".mxd-accordion__content").slideUp(400);
                $(".mxd-accordion__title").removeClass("accordion-active");
                $(".mxd-accordion__arrow").removeClass("accordion-rotate");
            }
            $this.toggleClass("accordion-active");
            $this.next().slideToggle(400);
            $(".mxd-accordion__arrow", this).toggleClass("accordion-rotate");
        });

        // Mailchimp & Contact Forms
        $(".notify-form").ajaxChimp({
            url: "https://club.us10.list-manage.com/subscribe/post?u=e8d650c0df90e716c22ae4778&amp;id=54a7906900&amp;f_id=00b64ae4f0",
            callback: function (resp) {
                const formContainer = $(".notify");
                const form = formContainer.find(".form");
                const successMsg = formContainer.find(".subscription-ok");
                const errorMsg = formContainer.find(".subscription-error");

                if (resp.result === "success") {
                    form.addClass("is-hidden");
                    successMsg.addClass("is-visible");
                    setTimeout(() => {
                        successMsg.removeClass("is-visible");
                        form.delay(300).removeClass("is-hidden");
                        $(".notify-form").trigger("reset");
                    }, 5000);
                } else if (resp.result === "error") {
                    form.addClass("is-hidden");
                    errorMsg.addClass("is-visible");
                    setTimeout(() => {
                        errorMsg.removeClass("is-visible");
                        form.delay(300).removeClass("is-hidden");
                        $(".notify-form").trigger("reset");
                    }, 5000);
                }
            }
        });
        
        $("#contact-form").submit(function (event) {
            event.preventDefault();
            const form = $(this);
            $.ajax({
                type: "POST",
                url: "mail.php",
                data: form.serialize()
            }).done(function () {
                const contactContainer = $(".contact");
                contactContainer.find(".form").addClass("is-hidden");
                contactContainer.find(".form__reply").addClass("is-visible");
                setTimeout(function () {
                    contactContainer.find(".form__reply").removeClass("is-visible");
                    contactContainer.find(".form").delay(300).removeClass("is-hidden");
                    form.trigger("reset");
                }, 5000);
            });
            return false;
        });
    }

    // --- BAŞLANGIÇ FONKSİYONLARI ---
    function initPlugins() {
        // SVG Fallback for old browsers
        if (!Modernizr.svg) {
            $("img[src*='svg']").attr("src", function () {
                return $(this).attr("src").replace(".svg", ".png");
            });
        }
        
        // Masonry Layout
        const masonryGallery = $(".mxd-projects-masonry__gallery");
        if (masonryGallery.length) {
            masonryGallery.imagesLoaded().progress(function () {
                masonryGallery.masonry("layout");
                ScrollTrigger.refresh();
            });
        }

        // Ukiyo Parallax
        new Ukiyo('.parallax-img', { scale: 1.5, speed: 1.5 });
        new Ukiyo('.parallax-img-small', { scale: 1.2, speed: 1.5 });
        new Ukiyo('.parallax-video', { scale: 1.5, speed: 1.5 });
        
        // Color Switcher
        const themeBtn = document.querySelector("#color-switcher");
        if (themeBtn) {
            const getCurrentTheme = () => {
                let theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                if (localStorage.getItem("template.theme")) {
                    theme = localStorage.getItem("template.theme");
                }
                return theme;
            };
            const loadTheme = (theme) => {
                const root = document.querySelector(":root");
                themeBtn.innerHTML = theme === "light" ? '<i class="ph-bold ph-moon-stars"></i>' : '<i class="ph-bold ph-sun-horizon"></i>';
                root.setAttribute("color-scheme", theme);
            };
            themeBtn.addEventListener("click", () => {
                let theme = getCurrentTheme();
                theme = theme === "dark" ? "light" : "dark";
                localStorage.setItem("template.theme", theme);
                loadTheme(theme);
            });
            loadTheme(getCurrentTheme());
        }

        // SVG Injection
        const mySVGsToInject = document.querySelectorAll("img.inject-me");
        if (mySVGsToInject.length) {
            const injectorOptions = { evalScripts: "once", pngFallback: "assets/png" };
            SVGInjector(mySVGsToInject, injectorOptions);
        }
    }

    // --- ANA ÇALIŞTIRMA ---
    // DOM hazır olduğunda event listener'ları ve eklentileri başlat
    $(function() {
        initEventListeners();
        initPlugins();
    });

    // Sayfa tamamen yüklendiğinde scroll-tabanlı animasyonları başlat
    window.addEventListener('load', () => {
        initLoader();
        initLenis();
        initScrollTriggers();
    });

})();