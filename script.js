/**
 * KAKADA CHHEM PORTFOLIO - MODERN INTERACTIVE JAVASCRIPT
 * Features: Typewriter effect, Theme Switcher, Project Filter, Scrollspy, 
 * Reading Progress, Formspree AJAX with Toast, and Interactive Micro-animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle (Dark & Light)
    initTheme();

    // 3. Dynamic Typewriter Effect in Hero
    initTypewriter();

    // 4. Scroll Progress Bar & Header Scrolled State
    initScrollInteractions();

    // 5. Project Filtering
    initProjectFilter();

    // 6. Copy to Clipboard
    initCopyButtons();

    // 7. Contact Form AJAX Submission with Custom Toast
    initContactForm();

    // 8. Back to Top Button
    initBackToTop();

    // 9. Interactive Mobile App Screenshot Sliders
    initAppSliders();

    // 10. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60
        });
    }
});

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('kakada_portfolio_theme');
    
    // Check saved theme or system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('kakada_portfolio_theme', targetTheme);

            showToast(
                targetTheme === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode',
                'success'
            );
        });
    }
}

/* ==========================================================================
   TYPEWRITER ANIMATION
   ========================================================================== */
function initTypewriter() {
    const targetElement = document.getElementById('typewriter');
    if (!targetElement) return;

    const words = [
        "Flutter Mobile Apps",
        "Cross-Platform iOS & Android",
        "Laravel RESTful APIs",
        "Clean Dart Architecture",
        "Modern Mobile UI/UX"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 85;
    const deletingSpeed = 40;
    const pauseDelay = 1800;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            targetElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            targetElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let nextSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            nextSpeed = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            nextSpeed = 350;
        }

        setTimeout(type, nextSpeed);
    }

    type();
}

/* ==========================================================================
   SCROLL INTERACTIONS (PROGRESS BAR, HEADER, SCROLLSPY)
   ========================================================================== */
function initScrollInteractions() {
    const progressBar = document.getElementById('scrollProgressBar');
    const headerNav = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        const scrollY = window.scrollY;

        // Reading Progress
        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progressPercentage = (scrollY / totalHeight) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            }
        }

        // Header Scrolled Glassmorphism State
        if (headerNav) {
            if (scrollY > 40) {
                headerNav.classList.add('scrolled');
            } else {
                headerNav.classList.remove('scrolled');
            }
        }

        // Active Navigation Scrollspy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial trigger

    // Close mobile menu on navlink click
    const mobileNavbar = document.getElementById('navbarContent');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavbar && mobileNavbar.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(mobileNavbar);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });
}

/* ==========================================================================
   PROJECT FILTERING
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (!filterButtons.length || !projectItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.96)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   COPY TO CLIPBOARD BUTTONS
   ========================================================================== */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast(`Copied to clipboard: ${textToCopy}`, 'success');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast(`Copied: ${textToCopy}`, 'success');
            }
        });
    });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION WITH FORMSPREE & TOAST
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const submitBtn = document.getElementById('submitBtn');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Send Message';

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic validation
        const nameInput = document.getElementById('formName');
        const emailInput = document.getElementById('formEmail');
        const messageInput = document.getElementById('formMessage');

        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast('Please fill out all required fields.', 'error');
            return;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Sending message...</span>
            `;
        }

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showToast('Thank you! Your message was sent successfully.', 'success');
                contactForm.reset();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.errors ? errorData.errors.map(err => err.message).join(', ') : 'Failed to send message.';
                showToast(`Error: ${errorMessage}`, 'error');
            }
        } catch (error) {
            showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        }
    });
}

/* ==========================================================================
   FLOATING TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastMessage || !toastIcon) return;

    clearTimeout(toastTimeout);

    toast.classList.remove('success', 'error');
    toast.classList.add(type);

    toastIcon.innerHTML = type === 'success' 
        ? '<i class="fas fa-check-circle"></i>' 
        : '<i class="fas fa-exclamation-circle"></i>';

    toastMessage.textContent = message;

    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* ==========================================================================
   APP SCREENSHOT SLIDER FUNCTIONALITY
   ========================================================================== */
function initAppSliders() {
    const sliders = document.querySelectorAll('.app-slider-box');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.app-slide');
        const dots = slider.querySelectorAll('.indicator-dot');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');

        if (!slides.length) return;

        let currentIndex = 0;

        function showSlide(index) {
            if (index < 0) {
                currentIndex = slides.length - 1;
            } else if (index >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            slides.forEach((slide, i) => {
                if (i === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(currentIndex + 1);
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(idx);
            });
        });
    });
}
