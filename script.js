document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading bar
    initializeLoadingBar();
    
    // Initialize animations and interactions
    initializeAnimations();
    initializeInteractions();
    try {
        initializeSearchBar();
    } catch(e) {
        console.error('Error in initializeSearchBar:', e);
    }
    initializeProductAnimations();
    initializeProductDetailNavigation();
    initializeProductDetailButtons();
    initializeBackButton();

    // Homepage Gallery Carousel Logic
    const gallery = document.querySelector('.homepage-gallery');
    const leftArrow = document.querySelector('.gallery-arrow.left');
    const rightArrow = document.querySelector('.gallery-arrow.right');
    // Shuffle images for random order
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    let galleryStart = 0;
    let galleryImages = shuffleArray([
        'images/air-jordan-3-1.jpg',
        'images/air-jordan-3-2.jpg',
        'images/air-jordan-3-3.jpg',
        'images/air-jordan-3-4.jpg',
        'images/air-jordan-4-travis-1.jpg',
        'images/air-jordan-4-travis-2.jpg',
        'images/airpods-max-1.jpg',
        'images/airpods-max-2.jpg',
        'images/nike-dunk-low-sb-1.jpg',
        'images/nike-dunk-low-sb-2.jpg',
        'images/nike-elite-backpack-1.jpg',
        'images/nike-tech-fleece-1.jpg',
        'images/north-face-jacket-1.jpg',
        'images/ralph-lauren-polo-1.jpg'
    ]);
    function showGalleryImages(direction) {
        if (!gallery) return;
        const currentImgs = gallery.querySelectorAll('.gallery-img');
        if (direction === 1) {
            currentImgs.forEach(img => img.classList.add('gallery-img-animate-out-left'));
        } else if (direction === -1) {
            currentImgs.forEach(img => img.classList.add('gallery-img-animate-out-right'));
        } else {
            currentImgs.forEach(img => img.classList.add('gallery-img-animate-out-left'));
        }
        setTimeout(() => {
            gallery.innerHTML = '';
            galleryStart = (galleryStart + direction * 4 + galleryImages.length) % galleryImages.length;
            for (let i = 0; i < 4; i++) {
                // Show every second image (skip 1 between each displayed)
                const idx = (galleryStart + i * 2) % galleryImages.length;
                const img = document.createElement('img');
                if (direction === 1) {
                    img.className = 'gallery-img gallery-img-animate-in-left';
                } else if (direction === -1) {
                    img.className = 'gallery-img gallery-img-animate-in-right';
                } else {
                    img.className = 'gallery-img gallery-img-animate-in-left';
                }
                img.src = galleryImages[idx];
                img.alt = `Gallery Image ${idx+1}`;
                // Make image clickable to go to product page
                img.style.cursor = 'pointer';
                img.addEventListener('click', function() {
                    // Map image file to product id/name
                    // Map gallery image to product id directly for all variants
                    if (window.LVDC_PRODUCTS) {
                        const imgPath = galleryImages[idx];
                        const imageToId = {
                            'images/air-jordan-3-1.jpg': '3',
                            'images/air-jordan-3-2.jpg': '3',
                            'images/air-jordan-3-3.jpg': '3',
                            'images/air-jordan-3-4.jpg': '3',
                            'images/air-jordan-4-travis-1.jpg': '2',
                            'images/air-jordan-4-travis-2.jpg': '2',
                            'images/airpods-max-1.jpg': '5',
                            'images/airpods-max-2.jpg': '5',
                            'images/nike-dunk-low-sb-1.jpg': '1',
                            'images/nike-dunk-low-sb-2.jpg': '1',
                            'images/nike-elite-backpack-1.jpg': '4',
                            'images/nike-elite-backpack-2.jpg': '4',
                            'images/nike-elite-backpack-3.jpg': '4',
                            'images/nike-tech-fleece-1.jpg': '6',
                            'images/north-face-jacket-1.jpg': '7',
                            'images/ralph-lauren-polo-1.jpg': '8'
                        };
                        const id = imageToId[imgPath];
                        const product = window.LVDC_PRODUCTS.find(p => p.id === id);
                        console.log('Gallery click:', {imgPath, id, product});
                        if (product) {
                            const params = new URLSearchParams({id: product.id, name: product.name});
                            window.location.href = `product-detail.html?${params.toString()}`;
                            return;
                        }
                    }
                    // fallback if not found
                    window.location.href = 'product-detail.html';
                });
                gallery.appendChild(img);
                setTimeout(() => {
                    img.classList.remove('gallery-img-animate-in-left');
                    img.classList.remove('gallery-img-animate-in-right');
                }, 450);
            }
        }, currentImgs.length ? 400 : 0);
    }
    if (gallery && leftArrow && rightArrow) {
        showGalleryImages(0); // initial

        leftArrow.addEventListener('click', function() {
            showGalleryImages(-1);
        });
        rightArrow.addEventListener('click', function() {
            showGalleryImages(1);
        });
    }
});

function initializeAnimations() {
    // Intersection Observer for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function initializeInteractions() {
    // Menu toggle interaction
    const menuToggle = document.querySelector('.menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const slidingMenu = document.getElementById('slidingMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');
    const header = document.querySelector('.header');
    
    menuToggle.addEventListener('click', function() {
        hamburger.classList.add('active');
        slidingMenu.classList.add('open');
        menuOverlay.classList.add('active');
        header.classList.add('menu-open');
    });
    
    function closeMenu() {
        hamburger.classList.remove('active');
        slidingMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        header.classList.remove('menu-open');
        
        // Remove active class from all menu items when closing menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && slidingMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // CTA button interactions
    const ctaButtons = document.querySelectorAll('.cta-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            // Only prevent default for buttons, not for links
            if (this.tagName === 'BUTTON') {
                e.preventDefault();
                
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Navigate to products page if it's the "Shop Now" button
                if (this.textContent.trim() === 'Shop Now' && !window.location.pathname.includes('product-detail.html')) {
                    window.location.href = 'products.html';
                }
            }
            // For links (like Telegram), let the default behavior happen
        });
    });

    // Text hover effects
    const brandTitle = document.querySelector('.brand-title');
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach(line => {
        line.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        line.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Subtle mouse movement effects for particles
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Move particles based on mouse position
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.3;
            const xOffset = (mouseX - 0.5) * speed;
            const yOffset = (mouseY - 0.5) * speed;
            particle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // Make LVDC logo clickable to go to homepage
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        brandLogo.style.cursor = 'pointer';
        brandLogo.addEventListener('click', function() {
            if (!window.location.pathname.includes('index.html')) {
                window.location.href = 'index.html';
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Home menu item click scrolls to top and closes menu
    const menuHome = document.getElementById('menuHome');
    if (menuHome) {
        menuHome.style.cursor = 'pointer';
        menuHome.addEventListener('click', function() {
            // Check if we're on the products or product-detail page
            if (window.location.pathname.includes('products.html') || window.location.pathname.includes('product-detail.html')) {
                // Navigate to homepage
                window.location.href = 'index.html';
            } else {
                // Scroll to top if already on homepage
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            if (typeof closeMenu === 'function') {
                closeMenu();
            } else {
                // fallback: try to close menu if closeMenu is not in scope
                const hamburger = document.querySelector('.hamburger');
                const slidingMenu = document.getElementById('slidingMenu');
                const menuOverlay = document.getElementById('menuOverlay');
                const header = document.querySelector('.header');
                hamburger && hamburger.classList.remove('active');
                slidingMenu && slidingMenu.classList.remove('open');
                menuOverlay && menuOverlay.classList.remove('active');
                header && header.classList.remove('menu-open');
            }
        });
    }

    // Contact menu item click shows Telegram handle in the menu container
    let menuContact = null;
    const menuSpans = document.querySelectorAll('.menu-item span');
    menuSpans.forEach(span => {
        if (span.textContent.trim() === 'Contact') {
            menuContact = span;
        }
    });
    if (menuContact) {
        menuContact.style.cursor = 'pointer';
        menuContact.addEventListener('click', function() {
            const telegramDiv = document.getElementById('telegramHandleMenu');
            if (telegramDiv) {
                telegramDiv.textContent = 'Telegram: @weiwq';
                telegramDiv.style.display = 'block';
            }
        });
    }

    // Fix: Only show Telegram handle for Contact, hide for others
    const menuSpansFixed = document.querySelectorAll('.menu-item span');
    menuSpansFixed.forEach(span => {
        span.style.cursor = 'pointer';
        span.addEventListener('click', function() {
            // Remove active class from all menu items
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked menu item
            this.parentElement.classList.add('active');
            
            const telegramDiv = document.getElementById('telegramHandleMenu');
            if (telegramDiv) {
                if (span.textContent.trim() === 'Contact') {
                    telegramDiv.innerHTML = 'Telegram: <a href="https://t.me/weiwq" target="_blank" style="color:#0088cc;text-decoration:underline;">@weiwq</a><br>Instagram: <a href="https://instagram.com/lv.dripcartel" target="_blank" style="color:#8B5CF6;text-decoration:underline;">lv.dripcartel</a>';
                    telegramDiv.style.display = 'block';
                } else if (span.textContent.trim() === 'About') {
                    telegramDiv.innerHTML = `Welcome to Drip Cartel — your trusted plug for exclusive sneakers, streetwear, and rare finds straight from the source.<br>We connect you to top-tier heat from China and beyond, with unbeatable prices, fast shipping.<br><br>📦 All products are hand-checked<br>🚀 Orders delivered directly to your door`;
                    telegramDiv.style.display = 'block';
                } else if (span.textContent.trim() === 'Products') {
                    telegramDiv.style.display = 'none';
                    // Close menu if open
                    if (typeof closeMenu === 'function') {
                        closeMenu();
                    } else {
                        const hamburger = document.querySelector('.hamburger');
                        const slidingMenu = document.getElementById('slidingMenu');
                        const menuOverlay = document.getElementById('menuOverlay');
                        const header = document.querySelector('.header');
                        hamburger && hamburger.classList.remove('active');
                        slidingMenu && slidingMenu.classList.remove('open');
                        menuOverlay && menuOverlay.classList.remove('active');
                        header && header.classList.remove('menu-open');
                    }
                    // Check if we're already on products page
                    if (window.location.pathname.includes('products.html')) {
                        // Just close the menu, we're already here
                        return;
                    } else {
                        window.location.href = 'products.html';
                    }
                } else {
                    telegramDiv.style.display = 'none';
                }
            }
        });
    });
}

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations can be added here
}, 16)); // ~60fps

// Search Bar Functionality

// Scroll Down Arrow logic for products.html
if (window.location.pathname.includes('products.html')) {
    const scrollArrow = document.getElementById('scrollDownArrow');
    function checkArrowVisibility() {
        if (!scrollArrow) return;
        if (window.scrollY <= 10) {
            scrollArrow.classList.remove('hide');
        } else {
            scrollArrow.classList.add('hide');
        }
    }
    window.addEventListener('scroll', checkArrowVisibility);
    window.addEventListener('resize', checkArrowVisibility);
    checkArrowVisibility();
}

if (window.location.pathname.includes('products.html')) {
    const scrollArrow = document.getElementById('scrollDownArrow');
    function checkArrowVisibility() {
        if (!scrollArrow) return;
        const scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 10) {
            scrollArrow.classList.add('hide');
        } else {
            scrollArrow.classList.remove('hide');
        }
    }
    window.addEventListener('scroll', checkArrowVisibility);
    window.addEventListener('resize', checkArrowVisibility);
    checkArrowVisibility();
}

function initializeSearchBar() {
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    
    // Focus search input when clicking on search bar
    searchBar.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            searchInput.focus();
        }
    });
    
    // Clear search bar
    searchClose.addEventListener('click', function(e) {
        e.stopPropagation();
        searchInput.value = '';
        searchInput.focus();
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        // --- Global Search Suggestions ---
        const suggestions = window.LVDC_PRODUCTS || [];
        const suggestionBox = document.getElementById('globalSearchSuggestions');
        if (suggestionBox) {
            suggestionBox.innerHTML = '';
            if (query.length > 0) {
                const matches = suggestions.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.price.toLowerCase().includes(query)
                );
                if (matches.length > 0) {
                    matches.forEach(product => {
                        const item = document.createElement('div');
                        item.className = 'global-search-suggestion-item';
                        item.tabIndex = 0;
                        item.innerHTML = `
                            <img class="global-search-suggestion-img" src="${product.image}" alt="${product.name}">
                            <div class="global-search-suggestion-info">
                                <span class="global-search-suggestion-name">${product.name}</span>
                                <span class="global-search-suggestion-price">${product.price}</span>
                            </div>
                        `;
                        item.addEventListener('mousedown', function(e) {
                            e.preventDefault();
                            window.location.href = `product-detail.html?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}`;
                        });
                        suggestionBox.appendChild(item);
                    });
                    suggestionBox.classList.add('active');
                    suggestionBox.style.display = 'flex';
                } else {
                    const noResult = document.createElement('div');
                    noResult.className = 'global-search-suggestion-item no-results';
                    noResult.style.cursor = 'default';
                    noResult.style.opacity = '0.7';
                    noResult.innerHTML = '<span style="margin:auto; width:100%; text-align:center; color:#b00020; font-weight:600;">No results found</span>';
                    suggestionBox.appendChild(noResult);
                    suggestionBox.classList.add('active');
                    suggestionBox.style.display = 'flex';
                }
            } else {
                suggestionBox.classList.remove('active');
                suggestionBox.style.display = 'none';
            }
        }
        // --- End Global Search Suggestions ---

        // Products page inline filtering
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            const productCards = productsGrid.querySelectorAll('.product-card');
            let anyVisible = false;
            productCards.forEach(card => {
                const name = card.querySelector('.product-name').textContent.toLowerCase();
                const price = card.querySelector('.product-price').textContent.toLowerCase();
                if (name.includes(query) || price.includes(query)) {
                    card.style.display = '';
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.3s';
                    setTimeout(() => { card.style.opacity = '1'; }, 10);
                    anyVisible = true;
                } else {
                    card.style.opacity = '0';
                    card.style.transition = 'opacity 0.3s';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
            let noResultsMsg = document.getElementById('productsNoResults');
            if (!anyVisible && query.length > 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'productsNoResults';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.style.margin = '2rem auto 1rem auto';
                    noResultsMsg.style.fontSize = '1.2rem';
                    noResultsMsg.style.color = '#b00020';
                    noResultsMsg.style.fontWeight = '600';
                    noResultsMsg.textContent = 'No results found';
                    productsGrid.parentNode.insertBefore(noResultsMsg, productsGrid.nextSibling);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }
    });

    // Hide global suggestions on blur
    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            const suggestionBox = document.getElementById('globalSearchSuggestions');
            if (suggestionBox) {
                suggestionBox.classList.remove('active');
                suggestionBox.style.display = 'none';
            }
        }, 150);
    });

    // Show suggestions again on focus if input has value
    searchInput.addEventListener('focus', function() {
        const query = this.value.toLowerCase();
        const suggestions = window.LVDC_PRODUCTS || [];
        const suggestionBox = document.getElementById('globalSearchSuggestions');
        if (suggestionBox && query.length > 0) {
            const matches = suggestions.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.price.toLowerCase().includes(query)
            );
            if (matches.length > 0) {
                suggestionBox.classList.add('active');
                suggestionBox.style.display = 'flex';
            }
        }
    });
    
    // Enter key to search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value;
            // Add search submission logic here
            console.log('Search submitted:', query);
        }
    });
}

// Add search animations to existing styles
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    @keyframes searchExpand {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes searchShrink {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.95);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(searchStyles);

// Product page animations
function initializeProductAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length > 0) {
        // Create intersection observer for product cards
        const productObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation delay
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // 100ms delay between each card
                    productObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe each product card
        productCards.forEach(card => {
            productObserver.observe(card);
        });

        // Add to cart button interactions
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);

                // Add to cart functionality (placeholder)
                const productName = this.closest('.product-card').querySelector('.product-name').textContent;
                console.log(`Added ${productName} to cart`);
                

            });
        });
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Home") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Loading Bar Functionality
function initializeLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    
    if (loadingBar) {
        // Wait for the progress animation to complete, then fade out
        setTimeout(() => {
            loadingBar.classList.add('fade-out');
            
            // Remove loading bar from DOM after fade out
            setTimeout(() => {
                loadingBar.remove();
            }, 500);
        }, 2000); // Match the animation duration
    }
}

// Product Detail Navigation Functionality
function initializeProductDetailNavigation() {
    // Add click event listeners to all "Buy Item" buttons
    const buyItemButtons = document.querySelectorAll('.buy-item-btn');
    
    buyItemButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get the product card that contains this button
            const productCard = button.closest('.product-card');
            
            if (productCard) {
                // Extract product information
                const productId = productCard.getAttribute('data-product-id');
                const productName = productCard.querySelector('.product-name').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productImage = productCard.querySelector('.product-image').src;
                
                // Create URL parameters for the product detail page
                const params = new URLSearchParams({
                    id: productId,
                    name: encodeURIComponent(productName),
                    price: encodeURIComponent(productPrice),
                    image: encodeURIComponent(productImage)
                });
                
                // Navigate to product detail page
                window.location.href = `product-detail.html?${params.toString()}`;
            }
        });
    });
}

function initializeProductDetailButtons() {
    const telegramBtn = document.getElementById('addToCartBtn');
    const instagramBtn = document.getElementById('buyInstagramBtn');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.open('https://t.me/LVDCshop', '_blank');
        });
    }
    if (instagramBtn) {
        instagramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.open('https://www.instagram.com/lv.dripcartel?igsh=N3NleG5va3pmb214', '_blank');
        });
    }
}

function initializeBackButton() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.history.back();
        });
    }
}