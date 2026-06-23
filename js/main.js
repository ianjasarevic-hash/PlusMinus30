/* ========================================
   Plusminus30 - Main JavaScript
   Interactive Elements & Animations
   ======================================== */

/* Fix for vertical line on mobile */
(function() {
    if (window.innerWidth <= 480) {
        document.documentElement.style.marginRight = '0';
        document.body.style.marginRight = '0';

        // Show edge cover on mobile - 2px to be safe
        var cover = document.querySelector('.edge-cover');
        if (cover) {
            cover.style.width = '2px';
            cover.style.display = 'block';
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initNavigation();
    initImageSlider();
    initScrollAnimations();
    initProjectCards();
    initContactForm();
    initSmoothScroll();
    initProjectDetail();
    initGalleryLightbox();
});

/* Loader */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('loaded');
        }, 1500);
    });

    setTimeout(function() {
        loader.classList.add('loaded');
    }, 3000);
}

/* Image Slider */
function initImageSlider() {
    const slider = document.getElementById('imageSlider');
    if (!slider) return;

    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    let currentIndex = 0;
    const totalSlides = slides.length;

    slides.forEach(function(_, index) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = index;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentIndex + 1);
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        else if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });
}

/* Scroll Animations */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(function() {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(function(el) {
        observer.observe(el);
    });
}

/* Navigation */
function initNavigation() {
    const nav = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!nav || !navToggle || !navMenu) return;

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/* Project Cards Lightbox */
function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    const lightbox = document.getElementById('lightbox');

    if (!cards.length || !lightbox) return;

    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');

    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            const img = card.querySelector('img');
            const title = card.querySelector('h3').textContent;
            const type = card.querySelector('.project-type') ? card.querySelector('.project-type').textContent : '';
            const details = card.querySelector('.project-details') ? card.querySelector('.project-details').textContent : '';

            let imgSrc = img.src;
            if (img.complete && img.naturalHeight === 0) {
                imgSrc = 'https://placehold.co/1200x800/1a1a1a/666?text=' + encodeURIComponent(title);
            }

            lightboxImg.src = imgSrc;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = type + (details ? ' | ' + details : '');
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* Contact Form */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.name || !data.email || !data.message) {
            showFormMessage('Prosimo, izpolnite vsa polja.', 'error');
            return;
        }

        if (!data.email.includes('@')) {
            showFormMessage('Prosimo, vnesite veljaven email naslov.', 'error');
            return;
        }

        showFormMessage('Sporočilo smo prejeli. Stopili bomo v stik.', 'success');
        form.reset();
    });

    function showFormMessage(message, type) {
        let msgEl = form.querySelector('.form-message');
        if (!msgEl) {
            msgEl = document.createElement('div');
            msgEl.className = 'form-message';
            form.appendChild(msgEl);
        }
        msgEl.textContent = message;
        msgEl.className = 'form-message ' + type;

        setTimeout(function() {
            msgEl.textContent = '';
            msgEl.className = 'form-message';
        }, 5000);
    }
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* Project Detail */
function initProjectDetail() {
    const projectHero = document.getElementById('projectHero');
    const projectGalleryGrid = document.getElementById('projectGalleryGrid');

    if (!projectHero) return;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    const project = window.projectsData && window.projectsData[projectId];

    if (project) {
        document.title = project.title + ' | Plusminus30 d.o.o.';

        document.getElementById('heroImage').src = project.image;
        document.getElementById('heroImage').alt = project.title;

        if (document.getElementById('detail-title')) {
            document.getElementById('detail-title').textContent = project.title;
        }
        if (document.getElementById('detail-type')) {
            document.getElementById('detail-type').textContent = project.type;
        }
        if (document.getElementById('detail-description')) {
            document.getElementById('detail-description').textContent = project.description;
        }
        if (document.getElementById('detail-author')) {
            document.getElementById('detail-author').textContent = project.author || '';
        }
        if (document.getElementById('detail-client')) {
            document.getElementById('detail-client').textContent = project.client || '';
        }
        if (document.getElementById('detail-year')) {
            document.getElementById('detail-year').textContent = project.year;
        }
        if (document.getElementById('detail-status')) {
            document.getElementById('detail-status').textContent = project.status || '';
        }
        if (document.getElementById('detail-location')) {
            document.getElementById('detail-location').textContent = project.location;
        }
        if (document.getElementById('detail-photos')) {
            document.getElementById('detail-photos').textContent = project.photos || '';
        }

        if (project.gallery && project.gallery.length > 0 && projectGalleryGrid) {
            project.gallery.forEach(function(imgSrc, index) {
                if (index === 0) return;

                const imgContainer = document.createElement('div');
                imgContainer.className = 'gallery-item';
                imgContainer.innerHTML = '<img src="' + imgSrc + '" alt="' + project.title + ' ' + (index + 1) + '">';
                imgContainer.dataset.fullSrc = imgSrc;
                projectGalleryGrid.appendChild(imgContainer);
            });
        }
    }
}

/* Gallery Lightbox with Slider */
function initGalleryLightbox() {
    const galleryGrid = document.getElementById('projectGalleryGrid');
    const heroImage = document.getElementById('heroImage');

    if (!galleryGrid && !heroImage) return;

    const allImages = [];

    if (heroImage && heroImage.src) {
        allImages.push(heroImage.src);
    }

    if (galleryGrid) {
        const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
        galleryItems.forEach(function(item) {
            if (item.dataset.fullSrc) {
                allImages.push(item.dataset.fullSrc);
            }
        });
    }

    if (allImages.length === 0) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML =
        '<button class="lightbox-close">&times;</button>' +
        '<button class="lightbox-prev">&#10094;</button>' +
        '<img class="lightbox-img" src="">' +
        '<button class="lightbox-next">&#10095;</button>' +
        '<div class="lightbox-counter"></div>';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');

    let currentIndex = 0;

    function showImage(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = allImages.length - 1;
        if (currentIndex >= allImages.length) currentIndex = 0;

        lightboxImg.src = allImages[currentIndex];
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + allImages.length;
    }

    if (galleryGrid) {
        galleryGrid.addEventListener('click', function(e) {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
                const index = items.indexOf(item) + 1;
                showImage(index);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (heroImage) {
        heroImage.style.cursor = 'zoom-in';
        heroImage.addEventListener('click', function() {
            showImage(0);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
}