// ==========================================================================
// Main Application Controller: Product Rendering, Filtering, Sorting & Hero
// ==========================================================================

const appState = {
    activeCategory: "all",
    searchQuery: "",
    primeOnly: false,
    sortBy: "featured",
    currentSlide: 0
};

let heroIntervalId = null;

document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
    renderProducts();
    initNavigationListeners();
    initHeroCarousel();
    initCartListeners();
});

/**
 * Generates visual star rating HTML (e.g., ★★★★☆)
 */
function getStarRatingMarkup(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.4;
    let stars = "★".repeat(fullStars);
    if (hasHalf && fullStars < 5) {
        stars += "★";
    }
    while (stars.length < 5) {
        stars += "☆";
    }
    return stars;
}

/**
 * Formats a numeric price into whole dollars and cents superscript
 */
function formatPriceParts(price) {
    const fixed = price.toFixed(2);
    const [whole, fraction] = fixed.split(".");
    return { whole, fraction };
}

/**
 * Filters and sorts products based on current appState, then injects cards
 */
function renderProducts() {
    const productContainer = document.getElementById("product-container");
    const resultsSummary = document.getElementById("results-summary");
    if (!productContainer) return;

    const filtered = products.filter(product => {
        // Category filter
        if (appState.activeCategory === "deals") {
            if (!product.isDeal) return false;
        } else if (appState.activeCategory !== "all") {
            if (product.category !== appState.activeCategory) return false;
        }

        // Prime filter
        if (appState.primeOnly && !product.prime) {
            return false;
        }

        // Search query filter
        if (appState.searchQuery.trim() !== "") {
            const q = appState.searchQuery.toLowerCase();
            const matchesTitle = product.title.toLowerCase().includes(q);
            const matchesCategory = product.category.toLowerCase().includes(q);
            if (!matchesTitle && !matchesCategory) return false;
        }

        return true;
    });

    // Sort filtered list
    const sorted = [...filtered].sort((a, b) => {
        switch (appState.sortBy) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "rating-desc":
                return b.rating - a.rating || (b.reviews || 0) - (a.reviews || 0);
            case "featured":
            default:
                return a.id - b.id;
        }
    });

    // Update toolbar summary
    if (resultsSummary) {
        const categoryLabel =
            appState.activeCategory === "all"
                ? "All Categories"
                : appState.activeCategory === "deals"
                ? "Today's Deals"
                : appState.activeCategory;
        const searchSuffix = appState.searchQuery
            ? ` matching "<strong>${escapeHtml(appState.searchQuery)}</strong>"`
            : "";
        resultsSummary.innerHTML = `Showing <strong>${sorted.length}</strong> ${
            sorted.length === 1 ? "product" : "products"
        } in <span class="results-category-highlight">${escapeHtml(categoryLabel)}</span>${searchSuffix}`;
    }

    // Empty state handling
    if (sorted.length === 0) {
        productContainer.innerHTML = `
            <div class="empty-products-state">
                <h3>No matching products found</h3>
                <p>Try clearing your search filter or switching to a broader category.</p>
                <button type="button" class="btn-reset-filters" id="reset-filters-btn">Reset All Filters</button>
            </div>
        `;
        const resetBtn = document.getElementById("reset-filters-btn");
        if (resetBtn) {
            resetBtn.addEventListener("click", resetAllFilters);
        }
        return;
    }

    // Render product cards
    productContainer.innerHTML = "";
    sorted.forEach(product => {
        const productCard = document.createElement("article");
        productCard.classList.add("product-card");

        const { whole, fraction } = formatPriceParts(product.price);
        const discountPercent =
            product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

        const badgeMarkup = product.badge
            ? `<span class="product-badge badge-${product.badgeType || "bestseller"}">${product.badge}</span>`
            : "";

        const primeMarkup = product.prime
            ? `<span class="prime-tag"><span class="prime-check">✓</span>prime</span>`
            : "";

        productCard.innerHTML = `
            ${badgeMarkup}
            <div class="product-image-wrap">
                <img src="${product.image}" alt="${escapeHtml(product.title)}" loading="lazy">
            </div>
            <span class="product-category">${escapeHtml(product.category)}</span>
            <h3>${escapeHtml(product.title)}</h3>
            <div class="product-rating" aria-label="Rated ${product.rating} out of 5 stars">
                <span class="stars" aria-hidden="true">${getStarRatingMarkup(product.rating)}</span>
                <span class="rating-value">${product.rating}</span>
                <span class="review-count">(${(product.reviews || 120).toLocaleString()})</span>
            </div>
            <div class="product-pricing">
                <p class="price">
                    <span class="price-symbol">$</span>${whole}<span class="price-fraction">${fraction}</span>
                </p>
                ${
                    discountPercent > 0
                        ? `<span class="discount-pill">-${discountPercent}%</span>
                           <span class="original-price">$${product.originalPrice.toFixed(2)}</span>`
                        : ""
                }
            </div>
            <div class="product-delivery">
                ${primeMarkup}
                <span>${escapeHtml(product.delivery || "FREE delivery available")}</span>
            </div>
            <button
                type="button"
                class="add-to-cart-btn"
                data-product-id="${product.id}"
                onclick="addToCart(${product.id})"
            >
                Add to Cart
            </button>
        `;

        productContainer.appendChild(productCard);
    });
}

function setActiveCategory(category) {
    appState.activeCategory = category;

    // Sync secondary navbar buttons
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === category);
    });

    // Sync search select dropdown if applicable
    const searchSelect = document.getElementById("search-category-select");
    if (searchSelect) {
        const optionExists = Array.from(searchSelect.options).some(opt => opt.value === category);
        searchSelect.value = optionExists ? category : "all";
    }

    renderProducts();
}

function resetAllFilters() {
    appState.activeCategory = "all";
    appState.searchQuery = "";
    appState.primeOnly = false;
    appState.sortBy = "featured";

    const searchInput = document.getElementById("search-input");
    const primeToggle = document.getElementById("prime-only-toggle");
    const sortSelect = document.getElementById("sort-select");

    if (searchInput) searchInput.value = "";
    if (primeToggle) primeToggle.checked = false;
    if (sortSelect) sortSelect.value = "featured";

    setActiveCategory("all");
}

function initNavigationListeners() {
    // Secondary category nav clicks
    const categoryNav = document.getElementById("category-nav");
    if (categoryNav) {
        categoryNav.addEventListener("click", event => {
            const btn = event.target.closest(".category-btn");
            if (!btn) return;
            setActiveCategory(btn.dataset.category);
        });
    }

    // Search form submission & live input
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchCategorySelect = document.getElementById("search-category-select");

    if (searchForm) {
        searchForm.addEventListener("submit", event => {
            event.preventDefault();
            if (searchInput) {
                appState.searchQuery = searchInput.value;
            }
            renderProducts();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", event => {
            appState.searchQuery = event.target.value;
            renderProducts();
        });
    }

    if (searchCategorySelect) {
        searchCategorySelect.addEventListener("change", event => {
            setActiveCategory(event.target.value);
        });
    }

    // Prime filter & Sort select
    const primeToggle = document.getElementById("prime-only-toggle");
    if (primeToggle) {
        primeToggle.addEventListener("change", event => {
            appState.primeOnly = event.target.checked;
            renderProducts();
        });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", event => {
            appState.sortBy = event.target.value;
            renderProducts();
        });
    }

    // Hero CTA buttons that filter by category
    const heroFilterBtns = document.querySelectorAll("[data-filter-category]");
    heroFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetCategory = btn.getAttribute("data-filter-category");
            setActiveCategory(targetCategory);
            const catalogEl = document.querySelector(".products-section");
            if (catalogEl) {
                catalogEl.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Logo click resets filters
    const brandLogo = document.getElementById("brand-logo");
    if (brandLogo) {
        brandLogo.addEventListener("click", () => {
            resetAllFilters();
        });
    }
}

function initHeroCarousel() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    const prevBtn = document.getElementById("hero-prev");
    const nextBtn = document.getElementById("hero-next");

    if (slides.length === 0) return;

    function goToSlide(index) {
        appState.currentSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, idx) => {
            slide.classList.toggle("active", idx === appState.currentSlide);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === appState.currentSlide);
        });
    }

    function restartAutoRotate() {
        if (heroIntervalId) clearInterval(heroIntervalId);
        heroIntervalId = setInterval(() => {
            goToSlide(appState.currentSlide + 1);
        }, 6500);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            goToSlide(appState.currentSlide - 1);
            restartAutoRotate();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            goToSlide(appState.currentSlide + 1);
            restartAutoRotate();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const target = Number(dot.getAttribute("data-slide-to"));
            goToSlide(target);
            restartAutoRotate();
        });
    });

    restartAutoRotate();
}

function initCartListeners() {
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    const cartOverlay = document.getElementById("cart-overlay");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (cartToggleBtn) {
        cartToggleBtn.addEventListener("click", () => toggleCartDrawer(true));
    }
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener("click", () => toggleCartDrawer(false));
    }
    if (cartOverlay) {
        cartOverlay.addEventListener("click", () => toggleCartDrawer(false));
    }
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", clearCart);
    }
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (getCartTotalQuantity() === 0) {
                showToast("Your cart is empty — add items before checking out!");
                return;
            }
            showToast(`Order placed! Total: $${getCartSubtotal().toFixed(2)}`);
            cart = [];
            saveCartToStorage();
            updateCartUI();
            toggleCartDrawer(false);
        });
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
