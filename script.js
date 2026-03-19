const currentPath = window.location.pathname.split("/").pop() || "index.html";
const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
        link.classList.add("active");
    }
});

const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

const countUpItems = document.querySelectorAll("[data-count]");
if (countUpItems.length > 0) {
    const countObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                const el = entry.target;
                const target = Number(el.dataset.count);
                const suffix = el.dataset.suffix || "";
                if (!Number.isFinite(target)) {
                    countObserver.unobserve(el);
                    return;
                }
                let current = 0;
                const step = Math.max(1, Math.floor(target / 60));
                const tick = () => {
                    current += step;
                    if (current >= target) {
                        el.textContent = `${target.toLocaleString()}${suffix}`;
                        countObserver.unobserve(el);
                        return;
                    }
                    el.textContent = `${current.toLocaleString()}${suffix}`;
                    requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
        },
        { threshold: 0.6 }
    );

    countUpItems.forEach((item) => countObserver.observe(item));
}
