// --- Shared Elements ---
const menuToggle = document.getElementById('menu-toggle');
const fullMenu = document.getElementById('full-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');

// --- Menu Logic ---
function toggleMenu() {
    const isOpen = fullMenu.classList.toggle('open');
    
     // --- CHANGE 3: CONFIRMED JAVASCRIPT LOGIC ---
    // Show the Close icon (X) when the menu IS open (isOpen is true)
    menuIconClose.classList.toggle('hidden', !isOpen);
    
    // Show the Hamburger icon when the menu is NOT open (!isOpen is true)
    menuIconOpen.classList.toggle('hidden', isOpen);
    
    // Lock body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
}

function closeMenu() {
    if (fullMenu.classList.contains('open')) {
        toggleMenu();
    }
}

menuToggle.addEventListener('click', toggleMenu);

// --- Hero Slider Logic ---
const heroSlider = document.getElementById('hero-slider');
const totalHeroSlides = heroSlider.children.length;
let currentHeroSlide = 0;

function updateHeroSlider() {
    const offset = -currentHeroSlide * 100;
    heroSlider.style.transform = `translateX(${offset}%)`;
}

// Automatic slide progression
setInterval(() => {
    currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
    updateHeroSlider();
}, 5000); // Change slide every 5 seconds


// --- Gallery Slider Logic (Manual/Swipe) ---
const gallerySlider = document.getElementById('gallery-slider');
const gallerySlides = Array.from(gallerySlider.children);
const totalGallerySlides = gallerySlides.length;
const indicatorContainer = document.getElementById('gallery-indicator');
let currentGallerySlide = 0;

// 1. Create Indicator Dots
gallerySlides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.classList.add('indicator-dot');
    dot.setAttribute('data-slide', index);
    dot.addEventListener('click', () => {
        currentGallerySlide = index;
        updateGallerySlider(true);
    });
    indicatorContainer.appendChild(dot);
});

const indicatorDots = Array.from(indicatorContainer.children);

// 2. Update Slider Position and Indicators
function updateGallerySlider(smooth = true) {
    // Calculate the scroll position based on the current slide index
    const targetScroll = gallerySlides[currentGallerySlide].offsetLeft;
    
    gallerySlider.scrollTo({
        left: targetScroll,
        behavior: smooth ? 'smooth' : 'instant'
    });

    // Update indicators
    indicatorDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGallerySlide);
    });
}

// Initial update
updateGallerySlider(false);

// 3. Listen for manual scroll/swipe on the gallery to update the active indicator
gallerySlider.addEventListener('scroll', () => {
    const scrollLeft = gallerySlider.scrollLeft;
    const containerWidth = gallerySlider.clientWidth;
    
    // Determine which slide is most visible by finding the center point
    const centerScroll = scrollLeft + (containerWidth / 2);
    
    let closestSlideIndex = 0;
    gallerySlides.forEach((slide, index) => {
        // Check if the center of the scroll is past the start of this slide
        if (centerScroll >= slide.offsetLeft) {
            closestSlideIndex = index;
        }
    });
    
    if (closestSlideIndex !== currentGallerySlide) {
        currentGallerySlide = closestSlideIndex;
        // Only update indicators, don't trigger smooth scroll
        updateGallerySlider(false); 
    }
});