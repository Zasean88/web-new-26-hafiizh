const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const description = document.querySelector("[data-word-reveal]");

if (description) {
    const words = description.textContent.trim().split(/\s+/);
    const wordElements = words.map((word, index) => {
        const element = document.createElement("span");
        element.className = "reveal-word";
        element.style.setProperty("--word-index", index);
        element.textContent = word;
        return element;
    });

    description.replaceChildren(
        wordElements.reduce((fragment, element, index) => {
            if (index > 0) {
                fragment.append(document.createTextNode(" "));
            }

            fragment.append(element);
            return fragment;
        }, document.createDocumentFragment())
    );
}

if (!prefersReducedMotion) {
    document.documentElement.classList.add("motion-ready");

    const supportsPointerTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (supportsPointerTilt) {
        document.querySelectorAll(".tilt-card").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const bounds = card.getBoundingClientRect();
                const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
                const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
                const intensity = card.matches(".social-card") ? 7 : 5;

                card.classList.add("is-tilting");
                card.style.setProperty("--tilt-x", `${-vertical * intensity}deg`);
                card.style.setProperty("--tilt-y", `${horizontal * intensity}deg`);
            });

            card.addEventListener("pointerleave", () => {
                card.classList.remove("is-tilting");
                card.style.setProperty("--tilt-x", "0deg");
                card.style.setProperty("--tilt-y", "0deg");
            });
        });
    }
}
