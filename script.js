document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    // Function to load all images
    function loadImages() {
        return new Promise((resolve) => {
            const images = document.images;
            const totalImages = images.length;
            let loadedImages = 0;

            
            if (totalImages === 0) {
                resolve();
            }

            // Load each image
            Array.from(images).forEach(img => {
                if (img.complete) {
                    imageLoaded();
                } else {
                    img.addEventListener('load', imageLoaded);
                    img.addEventListener('error', imageLoaded);
                }
            });

            function imageLoaded() {
                loadedImages++;
                if (loadedImages === totalImages) {
                    resolve();
                }
            }
        });
    }

    // Function to show content and hide loader
    function showContent() {
        loader.style.display = 'none';
        content.style.display = 'block';
    }

    // Load images and then show content
    loadImages().then(showContent);

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search students...';
    searchInput.classList.add('search-input');
    document.querySelector('header').appendChild(searchInput);

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const studentCards = document.querySelectorAll('.student-card');

        studentCards.forEach(card => {
            const studentName = card.querySelector('h4').textContent.toLowerCase();
            const studentInfo = card.querySelector('.student-info').textContent.toLowerCase();
            
            if (studentName.includes(searchTerm) || studentInfo.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});


// Theme switcher
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Card pop-up functionality
const popup = document.getElementById('cardPopup');
const popupCard = document.getElementById('popupCard');
const closeButton = document.getElementsByClassName('close')[0];

function openPopup(cardContent) {
    popup.style.display = "block";
    popupCard.innerHTML = cardContent;
}

closeButton.onclick = function() {
    popup.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}

// Add click event to all student cards
document.addEventListener('DOMContentLoaded', function() {
    const studentCards = document.querySelectorAll('.student-card');
    studentCards.forEach(card => {
        card.addEventListener('click', function() {
            openPopup(this.innerHTML);
        });
    });
});

// Function to download the card as an image
function downloadCard(card) {
    html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.download = 'student_card.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Add click event to all download buttons
document.addEventListener('DOMContentLoaded', function() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card pop-up when clicking download button
            const card = this.closest('.student-card');
            downloadCard(card);
        });
    });
});
