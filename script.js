// Portfolio navigation, theme switcher, and certificate filters.
const themeBtn = document.getElementById('themeBtn');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

function applyTheme(light) {
    document.body.classList.toggle('light', light);
    themeBtn.textContent = light ? '☾' : '☀';
    themeBtn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
}

let savedTheme;
try {
    savedTheme = localStorage.getItem('elimar-theme');
} catch (error) {
    // Theme still works when local storage is unavailable.
}
applyTheme(savedTheme === 'light');

themeBtn.addEventListener('click', () => {
    const light = !document.body.classList.contains('light');
    applyTheme(light);
    try {
        localStorage.setItem('elimar-theme', light ? 'light' : 'dark');
    } catch (error) {
        // Ignore storage restrictions.
    }
});

menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.textContent = isOpen ? '✕' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
    });
});

// Show only certificates belonging to the selected organization.
document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach(filter => {
            filter.classList.toggle('active', filter === button);
        });

        const category = button.dataset.category;
        document.querySelectorAll('.certificate-card').forEach(card => {
            card.hidden = category !== 'all' && card.dataset.filter !== category;
        });
    });
});


// Open a full-size screenshot when a project photo is clicked.
const imageLightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

if (imageLightbox && lightboxImage && lightboxClose) {
    document.querySelectorAll('.project-photo').forEach(button => {
        button.addEventListener('click', () => {
            const image = button.querySelector('img');
            if (!image) return;

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            imageLightbox.showModal();
        });
    });

    lightboxClose.addEventListener('click', () => imageLightbox.close());

    imageLightbox.addEventListener('click', event => {
        if (event.target === imageLightbox) imageLightbox.close();
    });

    imageLightbox.addEventListener('close', () => {
        lightboxImage.removeAttribute('src');
    });
}

// Reveal single-photo cards only when their screenshots exist.
// Until then, keep the descriptive placeholder visible.
document.querySelectorAll('.project-images.single-image').forEach(gallery => {
    const button = gallery.querySelector('.project-photo');
    const image = button?.querySelector('img');
    const placeholder = gallery.querySelector('.project-placeholder');

    if (!button || !image) return;

    image.addEventListener('load', () => {
        button.hidden = false;
        if (placeholder) placeholder.hidden = true;
    });

    image.addEventListener('error', () => {
        button.hidden = true;
        if (placeholder) placeholder.hidden = false;
    });

    if (image.complete && image.naturalWidth > 0) {
        button.hidden = false;
        if (placeholder) placeholder.hidden = true;
    }
});
