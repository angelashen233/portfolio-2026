/* --- 1. BUTTERFLY ANIMATION --- */
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('trigger-area');
    const butterfly = document.getElementById('butterfly-art');
    const caseStudies = document.getElementById('work');
    
    if (!trigger || !butterfly) return;

    let isFollowing = false;
    let isVisible = true;
    let mouseX = 0, mouseY = 0;
    let butterflyX = 0, butterflyY = 0;
    let time = 0; 

    const pinToC = () => {
    const trigger = document.getElementById('trigger-area');
    const butterfly = document.getElementById('butterfly-art');
    
    if (!isFollowing && trigger && butterfly) {
        const rect = trigger.getBoundingClientRect();
        
        // Since it's fixed, we use the viewport coordinates directly
        butterflyX = rect.left - 5;
        butterflyY = rect.top - 20;
        
        butterfly.style.left = `${butterflyX}px`;
        butterfly.style.top = `${butterflyY}px`;
        butterfly.style.width = "45px"; // Force width in JS as a backup
        butterfly.style.opacity = "1";
    }
};
    // Keep pinned during scroll/resize
    window.addEventListener('scroll', pinToC);
    window.addEventListener('resize', pinToC);
    window.addEventListener('load', () => setTimeout(pinToC, 100));
    pinToC(); 

    // Animation loop
    function animate() {
        if (isVisible) {
            if (isFollowing) {
                time += 0.02; 
                butterflyX += (mouseX - butterflyX) * 0.02;
                butterflyY += (mouseY - butterflyY) * 0.02;

                const sway = Math.sin(time) * 3; 
                let targetTilt = (mouseX - butterflyX) * 0.05;
                const maxTilt = 15; 
                const clampedTilt = Math.max(-maxTilt, Math.min(maxTilt, targetTilt));

                butterfly.style.left = `${butterflyX}px`;
                butterfly.style.top = `${butterflyY + sway}px`; 
                butterfly.style.transform = `rotate(${clampedTilt}deg)`;
            }
            requestAnimationFrame(animate);
        }
    }

    // NEW: Trigger the flight when mouse enters the 'C' area
    trigger.addEventListener('mouseenter', () => {
        if (!isFollowing) {
            isFollowing = true;
            butterfly.classList.remove('butterfly-rest');
            butterfly.classList.add('butterfly-following');
            // Stop pinning to the 'C' once it's flying
            window.removeEventListener('scroll', pinToC);
        }
    });

    // Track mouse movement (Always update coordinates so it's ready)
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX + 35; 
        mouseY = e.clientY - 35;
    });

    // Hide when case studies section visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isVisible = false;
                butterfly.style.opacity = '0';
                setTimeout(() => butterfly.style.display = 'none', 500);
            }
        });
    }, { threshold: 0.1 });

    if (caseStudies) observer.observe(caseStudies);

    // START the loop
    animate();
});


/* --- 2. PROJECT MODAL & LIGHTBOX --- */
const modal = document.getElementById('project-modal');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Handle Project Card Clicks (The Pop-up "Page")
document.querySelectorAll('.project-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        if (modal) {
            // Fill Modal with Data from the HTML attributes
            document.getElementById('modal-title').innerText = trigger.dataset.title;
            document.getElementById('modal-cat').innerText = trigger.dataset.category;
            document.getElementById('modal-org').innerText = trigger.dataset.org;
            document.getElementById('modal-year').innerText = trigger.dataset.year;
            document.getElementById('modal-desc').innerText = trigger.dataset.desc;
            document.getElementById('modal-hero').style.backgroundImage = `url('${trigger.dataset.img}')`;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Stop background scroll
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