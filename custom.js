document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Animations
    const animatedElements = document.querySelectorAll('[style*="opacity: 0"]');
    
    // Store initial states
    animatedElements.forEach(el => {
        el.dataset.initialOpacity = el.style.opacity || '0';
        el.dataset.initialTransform = el.style.transform || '';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a transition to make it smooth
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none'; // resets translate/scale
            } else {
                // Revert to initial state when out of view
                entry.target.style.transition = 'all 0.5s ease-in';
                entry.target.style.opacity = entry.target.dataset.initialOpacity;
                entry.target.style.transform = entry.target.dataset.initialTransform;
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    animatedElements.forEach(el => {
        // Exclude mobile menu children from scroll observer as they are handled by menu toggle
        if (!el.closest('nav.md\\:hidden')) {
            observer.observe(el);
        }
    });

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('button[aria-label="Toggle mobile menu"]');
    const mobileMenu = document.querySelector('nav.md\\:hidden.overflow-hidden');
    if (menuBtn && mobileMenu) {
        // Prepare mobile menu transitions
        mobileMenu.style.transition = 'all 0.4s ease-in-out';
        const menuItems = mobileMenu.querySelectorAll('[style*="opacity: 0"]');
        menuItems.forEach(item => {
            item.style.transition = 'all 0.4s ease-out';
        });

        menuBtn.addEventListener('click', () => {
            if (mobileMenu.style.height === '0px' || !mobileMenu.style.height) {
                mobileMenu.style.height = 'auto';
                mobileMenu.style.opacity = '1';
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'none';
                    }, index * 50); // Staggered animation
                });
            } else {
                mobileMenu.style.height = '0px';
                mobileMenu.style.opacity = '0';
                menuItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                });
            }
        });
    }

    // 3. Countdown Timer (if present on page)
    const countdownDivs = document.querySelectorAll('div.text-4xl');
    if (countdownDivs.length >= 4) {
        // Let's set the event date to Oct 25, 2026 (or adjust as needed)
        const eventDate = new Date('2026-10-25T00:00:00').getTime();
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            if (distance > 0) {
                countdownDivs[0].innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
                countdownDivs[1].innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                countdownDivs[2].innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                countdownDivs[3].innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
            } else {
                countdownDivs.forEach(div => div.innerText = '00');
            }
        };
        
        updateTimer(); // initial call
        setInterval(updateTimer, 1000);
    }

    // 4. Carousel Logic
    const carouselTrack = document.querySelector('.transition-transform.duration-500.ease-in-out');
    if (carouselTrack) {
        const prevBtn = document.querySelector('button .lucide-chevron-left')?.closest('button');
        const nextBtn = document.querySelector('button .lucide-chevron-right')?.closest('button');
        
        // Find dots container
        const dotsContainer = document.querySelector('.absolute.bottom-4.left-1\\/2');
        let dots = [];
        if (dotsContainer) {
            dots = Array.from(dotsContainer.querySelectorAll('button'));
        }

        const slidesCount = carouselTrack.children.length;
        let currentIndex = 0;

        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.className = 'w-3 h-3 rounded-full transition-all duration-300 bg-primary scale-110';
                } else {
                    dot.className = 'w-3 h-3 rounded-full transition-all duration-300 bg-primary/30 hover:bg-primary/60';
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slidesCount) % slidesCount;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slidesCount;
                updateCarousel();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }

    // 5. Dynamic Custom Cursor
    function initCustomCursor() {
        // Only initialize on desktop devices (where a fine pointer like a mouse is used)
        if (window.matchMedia("(pointer: fine)").matches) {
            const style = document.createElement('style');
            style.innerHTML = `
                * {
                    cursor: none !important;
                }
                .custom-cursor-dot, .custom-cursor-outline {
                    position: fixed;
                    top: 0;
                    left: 0;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 99999;
                    will-change: transform;
                }
                .custom-cursor-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #E6B325; /* Primary gold */
                    transition: width 0.2s ease, height 0.2s ease;
                }
                .custom-cursor-outline {
                    width: 40px;
                    height: 40px;
                    border: 1px solid rgba(230, 179, 37, 0.6);
                    transition: width 0.2s ease, height 0.2s ease, background-color 0.2s ease;
                }
            `;
            document.head.appendChild(style);

            const dot = document.createElement('div');
            dot.className = 'custom-cursor-dot';
            document.body.appendChild(dot);

            const outline = document.createElement('div');
            outline.className = 'custom-cursor-outline';
            document.body.appendChild(outline);

            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let outlineX = mouseX;
            let outlineY = mouseY;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            });

            // Smooth interpolation for the outline
            function animateOutline() {
                // Easing factor
                outlineX += (mouseX - outlineX) * 0.15;
                outlineY += (mouseY - outlineY) * 0.15;
                outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
                requestAnimationFrame(animateOutline);
            }
            animateOutline();

            // Hover effects for clickable elements
            const updateInteractiveElements = () => {
                const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
                interactiveElements.forEach(el => {
                    if (el.dataset.cursorBound) return;
                    el.dataset.cursorBound = "true";
                    
                    el.addEventListener('mouseenter', () => {
                        outline.style.width = '60px';
                        outline.style.height = '60px';
                        outline.style.backgroundColor = 'rgba(230, 179, 37, 0.1)';
                        dot.style.width = '4px';
                        dot.style.height = '4px';
                    });
                    el.addEventListener('mouseleave', () => {
                        outline.style.width = '40px';
                        outline.style.height = '40px';
                        outline.style.backgroundColor = 'transparent';
                        dot.style.width = '8px';
                        dot.style.height = '8px';
                    });
                });
            };
            
            updateInteractiveElements();
            
            // Re-run the binder in case of DOM changes (like mobile menu toggle)
            const domObserver = new MutationObserver(updateInteractiveElements);
            domObserver.observe(document.body, { childList: true, subtree: true });
        }
    }
    
    initCustomCursor();
});

