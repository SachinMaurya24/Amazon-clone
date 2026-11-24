// ==========================================================================
// Shopping Cart State Management, LocalStorage Persistence & Drawer UI
// ==========================================================================

const CART_STORAGE_KEY = "amazon_clone_cart_v1";

let cart = loadCartFromStorage();

function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (err) {
        return [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
        // Ignore storage quota errors in restricted environments
    }
}

/**
 * Adds a product to the cart by product ID and updates UI + toast feedback.
 * Exposed globally so inline onclick="addToCart(id)" handlers work seamlessly.
 */
function addToCart(productId) {
    const product = products.find(item => item.id === Number(productId));
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`Added "${product.title.split("—")[0].trim()}" to Cart`);
    highlightAddButton(product.id);
}

function updateCartQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === Number(productId));
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }

    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== Number(productId));
    saveCartToStorage();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartUI();
    showToast("Shopping cart cleared");
}

function getCartTotalQuantity() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartUI() {
    const totalCount = getCartTotalQuantity();
    const subtotal = getCartSubtotal();

    const cartCountText = document.getElementById("cart-count-text");
    const cartBadge = document.getElementById("cart-badge");
    const cartSubtotalCount = document.getElementById("cart-subtotal-count");
    const cartSubtotalAmount = document.getElementById("cart-subtotal-amount");
    const cartItemsList = document.getElementById("cart-items-list");

    if (cartCountText) {
        cartCountText.textContent = `Cart (${totalCount})`;
    }
    if (cartBadge) {
        cartBadge.textContent = totalCount;
    }
    if (cartSubtotalCount) {
        cartSubtotalCount.textContent = `${totalCount} ${totalCount === 1 ? "item" : "items"}`;
    }
    if (cartSubtotalAmount) {
        cartSubtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="cart-empty-state">
                <h3>Your Amazon Cart is empty</h3>
                <p>Explore today's deals and add your favorite items to get started.</p>
            </div>
        `;
        return;
    }

    cartItemsList.innerHTML = cart
        .map(
            item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title.split("—")[0].trim()}</h4>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button type="button" class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
                        <button type="button" class="remove-item-btn" onclick="removeFromCart(${item.id})">Delete</button>
                    </div>
                </div>
            </div>
        `
        )
        .join("");
}

function highlightAddButton(productId) {
    const btn = document.querySelector(`.add-to-cart-btn[data-product-id="${productId}"]`);
    if (!btn) return;

    const originalText = "Add to Cart";
    btn.classList.add("added");
    btn.textContent = "✓ Added to Cart";

    setTimeout(() => {
        btn.classList.remove("added");
        btn.textContent = originalText;
    }, 1100);
}

function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span class="toast-check">✓</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2600);
}

function toggleCartDrawer(forceOpen) {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (!drawer || !overlay) return;

    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !drawer.classList.contains("open");
    drawer.classList.toggle("open", shouldOpen);
    overlay.classList.toggle("open", shouldOpen);
    drawer.setAttribute("aria-hidden", String(!shouldOpen));
}
