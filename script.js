// DoorLah website behaviour: theme, navigation, scroll reveal and the app demos.
// Demos only run while on screen and are replaced by their final state under reduced motion.

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.body.classList.remove("no-js");

    // Small timer set so a demo can cancel everything it scheduled when it leaves the screen.
    const timers = () => {
        const ids = new Set();
        return {
            after(ms, fn) {
                const id = setTimeout(() => { ids.delete(id); fn(); }, ms);
                ids.add(id);
            },
            clear() {
                ids.forEach(clearTimeout);
                ids.clear();
            },
        };
    };

    // Runs start() while el is at least partly visible and the tab is in front, stop() otherwise.
    const whileVisible = (el, start, stop, threshold = 0.35) => {
        if (!el) return;
        let onScreen = false;
        let running = false;
        const sync = () => {
            const want = onScreen && !document.hidden;
            if (want && !running) { running = true; start(); }
            if (!want && running) { running = false; stop(); }
        };
        new IntersectionObserver((entries) => {
            onScreen = entries[0].isIntersecting;
            sync();
        }, { threshold }).observe(el);
        document.addEventListener("visibilitychange", sync);
    };

    const onceVisible = (el, fn, threshold = 0.35) => {
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            io.disconnect();
            fn();
        }, { threshold });
        io.observe(el);
    };

    // ---------- Theme: System / Light / Dark, like the app's Appearance setting ----------

    const themeSwitch = document.querySelector(".theme-switch");
    const themeOrder = ["system", "light", "dark"];

    const applyTheme = (choice) => {
        if (choice === "light" || choice === "dark") {
            root.setAttribute("data-theme", choice);
        } else {
            root.removeAttribute("data-theme");
        }
        if (!themeSwitch) return;
        themeSwitch.style.setProperty("--theme-index", themeOrder.indexOf(choice));
        themeSwitch.querySelectorAll("[data-theme-choice]").forEach((btn) => {
            btn.setAttribute("aria-pressed", String(btn.dataset.themeChoice === choice));
        });
    };

    let savedTheme = "system";
    try {
        savedTheme = localStorage.getItem("doorlah-theme") || "system";
    } catch (e) { /* storage unavailable: follow the system */ }
    applyTheme(themeOrder.includes(savedTheme) ? savedTheme : "system");

    themeSwitch?.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-theme-choice]");
        if (!btn) return;
        const choice = btn.dataset.themeChoice;
        applyTheme(choice);
        try {
            if (choice === "system") localStorage.removeItem("doorlah-theme");
            else localStorage.setItem("doorlah-theme", choice);
        } catch (e) { /* not persisted, still applied */ }
    });

    // ---------- Top bar ----------

    const topBar = document.querySelector(".site-nav");
    const onScroll = () => topBar?.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---------- Scroll reveal ----------

    const revealEls = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach((el) => el.classList.add("reveal-in"));
    } else {
        const revealIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("reveal-in");
                revealIO.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach((el) => revealIO.observe(el));
    }

    // ---------- Footer year ----------

    document.querySelectorAll(".footer-year").forEach((el) => {
        el.textContent = String(new Date().getFullYear());
    });

    // ---------- Greeting and date in Singapore time, as on the app's Home tab ----------

    const sgParts = Object.fromEntries(
        new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Singapore",
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "numeric",
            hourCycle: "h23",
        }).formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    const sgHour = Number(sgParts.hour);
    const greeting = document.querySelector("[data-greeting]");
    if (greeting) {
        const part = sgHour < 12 ? "morning" : sgHour < 18 ? "afternoon" : "evening";
        greeting.textContent = `Good ${part}, Wei.`;
    }
    const todayDate = document.querySelector("[data-today-date]");
    if (todayDate) todayDate.textContent = `${sgParts.weekday}, ${sgParts.day} ${sgParts.month}`;

    // ---------- Floating nav pill: appears after the hero and follows the section in view ----------

    const dock = document.querySelector("[data-dock]");
    const hero = document.querySelector(".hero");
    const pill = dock?.querySelector(".nav-pill");

    if (dock && hero) {
        new IntersectionObserver((entries) => {
            dock.classList.toggle("is-visible", !entries[0].isIntersecting);
        }, { threshold: 0, rootMargin: "-120px 0px 0px 0px" }).observe(hero);
    }

    if (pill) {
        const links = pill.querySelectorAll("a");
        const setTab = (index) => {
            pill.dataset.index = String(index);
            if (index >= 0) pill.style.setProperty("--nav-index", index);
            links.forEach((a, i) => {
                if (i === index) a.setAttribute("aria-current", "true");
                else a.removeAttribute("aria-current");
            });
        };
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setTab(Number(entry.target.dataset.tab));
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        document.querySelectorAll("[data-tab]").forEach((section) => spy.observe(section));
    }

    // ---------- + button morphs into the "Get DoorLah" card ----------

    const fab = document.querySelector("[data-fab]");
    if (fab) {
        const toggleBtn = fab.querySelector(".fab-toggle");
        const closeBtn = fab.querySelector("[data-fab-close]");
        const setOpen = (open) => {
            fab.classList.toggle("is-open", open);
            toggleBtn.setAttribute("aria-expanded", String(open));
            if (open) {
                setTimeout(() => fab.querySelector(".create-row")?.focus({ preventScroll: true }), reduceMotion ? 0 : 300);
            } else {
                toggleBtn.focus({ preventScroll: true });
            }
        };
        toggleBtn.addEventListener("click", () => setOpen(true));
        closeBtn.addEventListener("click", () => setOpen(false));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && fab.classList.contains("is-open")) setOpen(false);
        });
        document.addEventListener("click", (event) => {
            if (fab.classList.contains("is-open") && !fab.contains(event.target)) {
                fab.classList.remove("is-open");
                toggleBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ---------- Hero phone: Today carousel advances, island toast pops ----------

    const today = document.querySelector("[data-today]");
    const island = document.querySelector("[data-island]");
    if (today && !reduceMotion) {
        const t = timers();
        let slide = 0;
        const cards = today.children.length;
        const step = () => {
            slide = (slide + 1) % cards;
            const card = today.children[0];
            const shift = (card.offsetWidth + 10) * slide;
            today.style.transform = `translateX(${-shift}px)`;
            t.after(2800, step);
        };
        const toast = () => {
            island?.classList.add("is-toast");
            t.after(2400, () => island?.classList.remove("is-toast"));
            t.after(9000, toast);
        };
        whileVisible(today.closest(".device"), () => {
            t.after(2600, step);
            t.after(1400, toast);
        }, () => {
            t.clear();
            island?.classList.remove("is-toast");
        }, 0.2);
    }

    // ---------- Community: segmented control and chat thread ----------

    const community = document.querySelector("[data-community]");
    if (community) {
        const seg = community.querySelector(".segmented");
        const tabs = [...seg.querySelectorAll("[role=tab]")];
        const panes = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
        const thread = community.querySelector("[data-thread]");
        const bubbles = [...thread.querySelectorAll(".bubble-group")];
        const t = timers();
        let userChose = false;

        const select = (index, focus = false) => {
            seg.dataset.active = String(index);
            tabs.forEach((tab, i) => {
                const on = i === index;
                tab.setAttribute("aria-selected", String(on));
                tab.tabIndex = on ? 0 : -1;
                panes[i].hidden = !on;
            });
            if (focus) tabs[index].focus();
        };

        tabs.forEach((tab, i) => {
            tab.addEventListener("click", () => { userChose = true; select(i); });
            tab.addEventListener("keydown", (event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                userChose = true;
                select((i + 1) % tabs.length, true);
            });
        });

        if (reduceMotion) {
            bubbles.forEach((b) => b.classList.add("is-in"));
            thread.classList.remove("is-waiting");
        } else {
            onceVisible(thread, () => {
                bubbles.forEach((b, i) => setTimeout(() => b.classList.add("is-in"), 250 + i * 650));
            });
            const cycle = () => {
                if (userChose) return;
                select(seg.dataset.active === "0" ? 1 : 0);
                t.after(4500, cycle);
            };
            whileVisible(community, () => t.after(250 + bubbles.length * 650 + 2200, cycle), () => t.clear());
        }
    }

    // ---------- Market: category chips filter the listings ----------

    const market = document.querySelector("[data-market]");
    if (market) {
        const chips = [...market.querySelectorAll("[data-filter]")];
        const listings = [...market.querySelectorAll(".listing")];
        const featured = new Set(listings.filter((l) => !l.classList.contains("is-hidden")));

        chips.forEach((chip) => {
            chip.addEventListener("click", () => {
                const filter = chip.dataset.filter;
                chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));

                // FLIP: remember where cards were, filter, then animate from old to new positions.
                const before = new Map(listings.map((l) => [l, l.getBoundingClientRect()]));
                listings.forEach((l) => {
                    const show = filter === "all" ? featured.has(l) : l.dataset.cat === filter;
                    l.classList.toggle("is-hidden", !show);
                });
                if (reduceMotion) return;
                listings.forEach((l) => {
                    if (l.classList.contains("is-hidden")) return;
                    const was = before.get(l);
                    const now = l.getBoundingClientRect();
                    if (was.width === 0) {
                        l.animate([{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "none" }],
                            { duration: 450, easing: "cubic-bezier(0.34, 1.4, 0.64, 1)" });
                        return;
                    }
                    const dx = was.left - now.left;
                    const dy = was.top - now.top;
                    if (dx || dy) {
                        l.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
                            { duration: 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
                    }
                });
            });
        });
    }

    // ---------- Services: booking moves through its lifecycle, then gets rated ----------

    const services = document.querySelector("[data-services]");
    if (services) {
        const steps = services.querySelector("[data-steps]");
        const stepEls = [...steps.querySelectorAll(".status-step")];
        const stars = [...services.querySelectorAll("[data-stars] .ms")];
        const setStage = (stage) => {
            steps.style.setProperty("--progress", stage <= 0 ? 0 : (stage - 1) / 2);
            stepEls.forEach((s, i) => s.classList.toggle("is-done", i < stage));
        };
        const setStars = (n) => stars.forEach((s, i) => s.classList.toggle("is-on", i < n));

        if (reduceMotion) {
            setStage(3);
            setStars(5);
        } else {
            const t = timers();
            const run = () => {
                setStage(0);
                setStars(0);
                t.after(700, () => setStage(1));
                t.after(1700, () => setStage(2));
                t.after(2700, () => setStage(3));
                stars.forEach((_, i) => t.after(3400 + i * 140, () => setStars(i + 1)));
                t.after(7000, run);
            };
            whileVisible(services, run, () => t.clear());
        }
    }

    // ---------- Search: types a query, results arrive ----------

    const search = document.querySelector("[data-search]");
    if (search) {
        const typed = search.querySelector("[data-typed]");
        const results = search.querySelector("[data-results]");
        const rows = [...results.children];
        const query = "aircon";

        if (reduceMotion) {
            typed.textContent = query;
            results.classList.remove("is-waiting");
        } else {
            const t = timers();
            const run = () => {
                typed.textContent = "";
                rows.forEach((r) => r.classList.remove("is-in"));
                [...query].forEach((_, i) => t.after(500 + i * 110, () => { typed.textContent = query.slice(0, i + 1); }));
                const shown = 500 + query.length * 110 + 250;
                rows.forEach((r, i) => t.after(shown + i * 120, () => r.classList.add("is-in")));
                t.after(shown + 4200, run);
            };
            whileVisible(search, run, () => t.clear());
        }
    }

    // ---------- Create menu rows arrive once ----------

    const create = document.querySelector("[data-create]");
    if (create) {
        const rows = [...create.querySelectorAll(".create-row")];
        if (reduceMotion) {
            create.classList.remove("is-waiting");
        } else {
            onceVisible(create, () => {
                rows.forEach((r, i) => setTimeout(() => r.classList.add("is-in"), 150 + i * 110));
            }, 0.5);
        }
    }

    // ---------- Business mode toggles ----------

    const business = document.querySelector("[data-business]");
    if (business) {
        const switches = [...business.querySelectorAll("[data-biz]")];
        let touched = false;
        const setSwitch = (btn, on) => {
            btn.setAttribute("aria-checked", String(on));
            document.getElementById(btn.getAttribute("aria-controls"))?.classList.toggle("is-open", on);
        };
        switches.forEach((btn) => {
            btn.addEventListener("click", () => {
                touched = true;
                setSwitch(btn, btn.getAttribute("aria-checked") !== "true");
            });
        });
        if (reduceMotion) {
            switches.forEach((btn) => setSwitch(btn, true));
        } else {
            onceVisible(business, () => {
                switches.forEach((btn, i) => setTimeout(() => { if (!touched) setSwitch(btn, true); }, 500 + i * 800));
            }, 0.5);
        }
    }
});
