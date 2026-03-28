document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('trigger-area');
    const butterfly = document.getElementById('butterfly-art');
    const workSection = document.getElementById('work');

    if (!trigger || !butterfly) return;

    let isFollowing = false;
    let isVisible = true;
    let time = 0;
    let mouseX = 0, mouseY = 0;
    let butterflyX = 0, butterflyY = 0;
    const driftSpeed = 0.02; // That slow, elegant drift you wanted

    // 1. PIN TO 'C' (Forces it to stay stuck while scrolling)
    const pinToC = () => {
        if (!isFollowing && isVisible) {
            const rect = trigger.getBoundingClientRect();
            // We use fixed positioning math:
            butterflyX = rect.left - 5;
            butterflyY = rect.top - 20;
            
            butterfly.style.left = `${butterflyX}px`;
            butterfly.style.top = `${butterflyY}px`;
            butterfly.style.opacity = "1";
        }
    };

    // Run pinning on scroll/resize/load
    window.addEventListener('scroll', pinToC);
    window.addEventListener('resize', pinToC);
    window.addEventListener('load', () => setTimeout(pinToC, 100));
    pinToC(); 

    // 2. THE ANIMATION LOOP
    function animate() {
        if (isVisible && isFollowing) {
            time += 0.02;

            // Slow-motion catch up
            butterflyX += (mouseX - butterflyX) * driftSpeed;
            butterflyY += (mouseY - butterflyY) * driftSpeed;

            const sway = Math.sin(time) * 3;
            const targetTilt = (mouseX - butterflyX) * 0.05;
            const clampedTilt = Math.max(-15, Math.min(15, targetTilt));

            butterfly.style.left = `${butterflyX}px`;
            butterfly.style.top = `${butterflyY + sway}px`; 
            butterfly.style.transform = `rotate(${clampedTilt}deg)`;
            
            requestAnimationFrame(animate);
        }
    }

    // 3. MOUSE TRACKING & WAKE UP
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX + 35;
        mouseY = e.clientY - 35;
    });

    trigger.addEventListener('mouseenter', () => {
        if (!isFollowing) {
            isFollowing = true;
            butterfly.classList.remove('butterfly-rest');
            butterfly.classList.add('butterfly-following');
            // Stop the pinning listener so it can fly away
            window.removeEventListener('scroll', pinToC);
            animate();
        }
    });

    // 4. THE DISAPPEAR OBSERVER (The "Work" Trigger)
    const hideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isVisible = false;
                butterfly.classList.add('hidden');
                // Force it away from the screen entirely
                setTimeout(() => butterfly.style.display = 'none', 400);
            }
        });
    }, { threshold: 0.1 });

    if (workSection) hideObserver.observe(workSection);
});

/* --- 2. PROJECT MODAL & LIGHTBOX --- */
const modal = document.getElementById('project-modal');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Handle Project Card Clicks (The Pop-up "Page")
document.querySelectorAll('.project-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        // Don't open modal if the click was on a direct link inside the card
        if (e.target.closest('a')) return;
        if (modal) {
            // Fill Modal with Data from the HTML attributes
            document.getElementById('modal-title').innerText = trigger.dataset.title || '';
            document.getElementById('modal-cat').innerText = trigger.dataset.category || '';
            document.getElementById('modal-org').innerText = trigger.dataset.org || '';
            document.getElementById('modal-year').innerText = trigger.dataset.year || '';
            document.getElementById('modal-desc').innerText = trigger.dataset.desc || '';
            document.getElementById('modal-hero').style.backgroundImage = `url('${trigger.dataset.img}')`;

            // Show CTA button if a link is provided
            const cta = document.getElementById('modal-cta');
            if (cta) {
                if (trigger.dataset.link) {
                    cta.href = trigger.dataset.link;
                    cta.innerText = trigger.dataset.linkText || 'View Full Process ↗';
                    cta.style.display = 'inline-block';
                } else {
                    cta.style.display = 'none';
                }
            }

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });
});

// Handle Photography Clicks (Simple Lightbox)
document.querySelectorAll('.photo-masonry img').forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents conflict with modal
        if (lightbox) {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
        }
    });
});

// Close functions for Modal and Lightbox
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

if (lightbox) {
    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
}


/* --- 3. DYNAMIC BACKGROUND IMAGE LOADER --- */
// Automatically sets the card images based on your HTML data tags
document.querySelectorAll('.project-trigger').forEach(card => {
    const imgPath = card.getAttribute('data-img');
    const imgDiv = card.querySelector('.card-img');
    
    if (imgPath && imgDiv) {
        imgDiv.style.backgroundImage = `url('${imgPath}')`;
    }
});


//modal expanding after the gallery - point of contact


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    const galleryLabel = document.querySelector('.gallery-label');

    // Create the Observer
    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the modal is open and the user scrolls PAST the gallery label
            if (!entry.isIntersecting && modal.style.display === 'flex') {
                // entry.boundingClientRect.top < 0 means it's above the screen
                if (entry.boundingClientRect.top < 0) {
                    modal.classList.add('full-page-mode');
                    
                    // Optional: Change the URL hash so it feels like a new page
                    // window.location.hash = "project-details";
                }
            }
        });
    }, {
        threshold: 0, // Trigger as soon as the last pixel leaves the screen
        rootMargin: "-50px 0px 0px 0px" // Optional offset
    });

    if (galleryLabel) {
        pageObserver.observe(galleryLabel);
    }
});
/* --- SMART NAV HIGHLIGHTER --- */
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').toLowerCase();
        link.classList.remove('active');

        // 1. Logic for HOME
        if (linkHref.includes("index.html") || linkHref === "/" || linkHref === "./") {
            if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
                link.classList.add('active');
            }
        } 
        
        // 2. Logic for BLOG (Stay active if on blog.html OR inside any /posts/ file)
        else if (linkHref.includes("blog")) {
            if (currentPath.includes("blog") || currentPath.includes("/posts/")) {
                link.classList.add('active');
            }
        }

        // 3. Logic for any other pages (Work, Photography, etc.)
        else if (currentPath.includes(linkHref.replace('.html', ''))) {
            link.classList.add('active');
        }
    });
});

//READING EXPERIENCE FOR BLOG

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the containers (the actual "sheets" of paper that flip)
    const pageContainers = document.querySelectorAll('.page-container');
    const nextBtn = document.getElementById('next-page');
    const prevBtn = document.getElementById('prev-page');
    let currentPage = 0;

    // 2. Handle Page Numbering (targets the faces inside the containers)
    const allFaces = document.querySelectorAll('.front, .back');
    allFaces.forEach((face, index) => {
        const numSpan = face.querySelector('.page-number');
        if (numSpan) {
            numSpan.innerText = index + 1;
        }
    });

    // 3. Initialize z-index for the containers
    pageContainers.forEach((container, index) => {
        container.style.zIndex = pageContainers.length - index;
    });

    // 4. Navigation Logic
    nextBtn.addEventListener('click', () => {
        if (currentPage < pageContainers.length) {
            pageContainers[currentPage].classList.add('flipped');
            pageContainers[currentPage].style.zIndex = currentPage + 1;
            currentPage++;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            pageContainers[currentPage].classList.remove('flipped');
            pageContainers[currentPage].style.zIndex = pageContainers.length - currentPage;
        }
    });
});