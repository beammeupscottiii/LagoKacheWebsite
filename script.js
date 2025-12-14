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


document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.video-gallery-container');
    const videos = document.querySelectorAll('.video-slide video');
    const progressBar = document.querySelector('.progress-bar');
    const totalVideos = videos.length; // Should be 14
    const unitPercentage = 100 / totalVideos; // 100 / 14 ≈ 7.14%
    let scrollTimeout;

    // --- 1. LOGIC TO FIND CURRENT SLIDE (Same as before) ---
    const getCurrentSlideIndex = () => {
        const scrollPosition = container.scrollLeft;
        const containerWidth = container.offsetWidth;
        return Math.round(scrollPosition / containerWidth);
    };
    
    // --- 2. VIDEO AND PROGRESS BAR UPDATE ---
    const updateUI = (currentIndex) => {
        // --- VIDEO CONTROL ---
        videos.forEach((video, index) => {
            if (index === currentIndex) {
                video.play().catch(error => {
                    console.log('Video playback failed:', error.message);
                });
            } else {
                video.pause();
                video.currentTime = 0; 
            }
        });
        
        // --- PROGRESS BAR CONTROL ---
        // Calculate the new width: (Current Slide Index + 1) * Unit Percentage
        const newWidth = (currentIndex + 1) * unitPercentage;
        progressBar.style.width = `${newWidth}%`;
    };

    // --- 3. SCROLL LISTENER (Debounced) ---
    container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        // Wait a short delay to ensure scrolling has stopped and the slide is snapped
        scrollTimeout = setTimeout(() => {
            const currentSlideIndex = getCurrentSlideIndex();
            updateUI(currentSlideIndex);
        }, 150); 
    });

    // --- 4. INITIAL STATE ---
    // Start by updating the UI for the very first video (index 0)
    updateUI(0); 
});

//Video Gallery
// document.addEventListener('DOMContentLoaded', () => {
//     const container = document.querySelector('.video-gallery-container');
//     const videoSlides = document.querySelectorAll('.video-slide');
//     const videos = document.querySelectorAll('.video-slide video');
//     const indicatorBar = document.querySelector('.videoIndicators');
//     const totalVideos = videos.length;
//     let scrollTimeout;

//     const initializeIndicators = () => {
//         for (let i = 0; i < totalVideos; i++) {
//             const dot = document.createElement('span');
//             dot.classList.add('indicator-dot');
//             dot.dataset.index = i; // Store the index for easy lookup
//             indicatorBar.appendChild(dot);
//         }
//         // Get the created dots
//         return document.querySelectorAll('.indicator-dot');
//     };

//     const indicatorDots = initializeIndicators();

//     /**
//      * Finds the index of the video slide currently centered in the viewport.
//      * The scroll position divided by the container width gives the index (0, 1, 2, etc.).
//      */
//     const getCurrentSlideIndex = () => {
//         // scrollLeft is the distance scrolled from the start
//         const scrollPosition = container.scrollLeft;
//         // offsetWidth is the visible width of the container
//         const containerWidth = container.offsetWidth;
        
//         // Use Math.round to account for partial scrolls and snap behavior
//         return Math.round(scrollPosition / containerWidth);
//     };

//     /**
//      * Pauses all videos and plays the video at the specified index.
//      */
//     const controlVideoPlayback = (currentIndex) => {

//         videos.forEach((video, index) => {
//             if (index === currentIndex) {
//                 // This is the current slide, attempt to play it
//                 // Note: Mobile browsers often require user interaction (a tap)
//                 // before videos can autoplay, even with this call.
//                 video.play().catch(error => {
//                     // Handle potential promise rejection if playback fails (e.g., no user interaction)
//                     console.log('Video playback failed:', error.message);
//                 });
//             } else {
//                 // Pause all other videos
//                 video.pause();
//                 // Optionally reset the video to the beginning
//                 video.currentTime = 0; 
//             }
//         });

//         indicatorDots.forEach((dot, index) => {
//             if (index === currentIndex) {
//                 dot.classList.add('active');
//             } else {
//                 dot.classList.remove('active');
//             }
//         });
//     };

//     /**
//      * Event listener for scrolling.
//      * We use a debounce timeout to only act when scrolling has stopped.
//      */
//     container.addEventListener('scroll', () => {
//         // Clear the previous timeout so it doesn't fire while the user is actively scrolling
//         clearTimeout(scrollTimeout);

//         // Set a new timeout to fire after scrolling has been inactive for 150ms
//         scrollTimeout = setTimeout(() => {
//             const currentSlideIndex = getCurrentSlideIndex();
//             controlVideoPlayback(currentSlideIndex);
//         }, 150); // Adjust this delay as needed
//     });

//     // Initial check on page load to play the first video (index 0)
//     // You might want to defer this until the user interacts with the page for mobile compatibility
//     controlVideoPlayback(0); 
// });