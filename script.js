/* --- 1. BUTTERFLY ANIMATION --- */
const butterfly = document.getElementById('hero-butterfly');

// Start the butterfly in the middle of the screen
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Fade on scroll logic
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        butterfly.classList.add('bfly-fade');
    } else {
        butterfly.classList.remove('bfly-fade');
    }
});

function animateButterfly() {
    if (!butterfly) return;

    // Calculate the new position with a "Lag" (0.05 = slow/floaty)
    posX += (mouseX - posX) * 0.05;
    posY += (mouseY - posY) * 0.05;

    // Apply the coordinates directly to the style
    butterfly.style.left = posX + 'px';
    butterfly.style.top = posY + 'px';

    // Add a tilt based on movement direction
    const tilt = (mouseX - posX) * 0.15;
    butterfly.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;

    requestAnimationFrame(animateButterfly);
}

// Start the loop
animateButterfly();


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