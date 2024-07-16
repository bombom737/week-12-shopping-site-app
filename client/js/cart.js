let cart = [];

const username = localStorage.getItem("username") || "Guest";
// Function to load the cart from local storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Function to save the cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem(`cartOf${username}`, JSON.stringify(cart));
}

// Load the cart from local storage when the module is loaded
loadCartFromLocalStorage();

function removeItemFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
}

function resetCart(){
    cart = []
    localStorage.removeItem(`cartOf${username}`)
}

function updateCart(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = quantity;
    }
    saveCartToLocalStorage();
}

export { cart, saveCartToLocalStorage, removeItemFromCart, updateCart, resetCart };
