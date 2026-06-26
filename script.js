// ===========================================
// PORTFOLIO v2.0
// ===========================================

// ----------------------------
// Typing Effect
// ----------------------------

const typing = document.getElementById("typing");

const words = [

    "Quality Assurance Engineer",

    "Manual Testing Expert",

    "API Testing Specialist",

    "Playwright Automation",

    "SQL & MongoDB Validation"

];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

    const currentWord = words[wordIndex];

    if (!deleting) {

        typing.textContent = currentWord.substring(0, charIndex);

        charIndex++;

        if (charIndex > currentWord.length) {

            deleting = true;

            setTimeout(typeEffect, 1800);

            return;
        }

    } else {

        typing.textContent = currentWord.substring(0, charIndex);

        charIndex--;

        if (charIndex < 0) {

            deleting = false;

            wordIndex++;

            if (wordIndex >= words.length) {

                wordIndex = 0;

            }

        }

    }

    setTimeout(typeEffect, deleting ? 40 : 80);

}

typeEffect();



// ===========================================
// Counter Animation
// ===========================================

const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const increment = target / 80;

            const update = () => {

                current += increment;

                if (current < target) {

                    if (target < 10) {

                        counter.innerHTML = current.toFixed(1) + "+";

                    } else {

                        counter.innerHTML = Math.floor(current) + "+";

                    }

                    requestAnimationFrame(update);

                } else {

                    if (target < 10) {

                        counter.innerHTML = target.toFixed(1) + "+";

                    } else {

                        counter.innerHTML = target + "+";

                    }

                }

            };

            update();

            observer.unobserve(counter);

        }

    });

});

counters.forEach(counter => {

    observer.observe(counter);

});



// ===========================================
// Sticky Header Shadow
// ===========================================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.boxShadow = "0 10px 35px rgba(0,0,0,.08)";

    } else {

        header.style.boxShadow = "none";

    }

});



// ===========================================
// Smooth Navigation
// ===========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});



// ===========================================
// Active Navigation
// ===========================================

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 120;

        if (pageYOffset >= top) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});



// ===========================================
// Dark Mode
// ===========================================

const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = toggle.querySelector("i");

    if (document.body.classList.contains("dark")) {

        icon.className = "fa-solid fa-sun";

    } else {

        icon.className = "fa-solid fa-moon";

    }

});

window.addEventListener("load", () => {

    const preloader = document.getElementById("preloader");

    preloader.style.opacity = "0";

    setTimeout(() => {

        preloader.style.display = "none";

    }, 600);

});

window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    const progress = (scrollTop / height) * 100;

    document.getElementById("progress-bar").style.width = progress + "%";

});

