import { products } from './products.js';
import { cart, saveCartToLocalStorage, removeItemFromCart, updateCart } from './cart.js';
console.log(cart);

const username = localStorage.getItem('username') || 'Guest';

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem(`cartOf${username}`);
    if (savedCart) {
        cart.length = 0;
        JSON.parse(savedCart).forEach(item => cart.push(item));
    }
}

loadCartFromLocalStorage();

document.getElementById("searchbar").addEventListener("input", debounce(findProducts));

function debounce(callback, delay = 250){
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

function findProducts() {
    const input = document.getElementById("searchbar").value;
    const matchingProducts = products.filter(product => product.name.toLowerCase().includes(input.toLowerCase()));
    displayProducts(matchingProducts);
    if (input === '') {
        resetProducts();
    }
}

function resetProducts() {
    const initialProducts = products.slice(0, 6);
    displayProducts(initialProducts);
}

function displayProducts(productsToDisplay) {
    const productRow = document.getElementById('row');
    productRow.innerHTML = '';
    let label = '';
    const input = document.getElementById("searchbar").value;

    if (input) {
        label = '';
        const resultsHeader = document.createElement('h2');
        resultsHeader.textContent = 'Results:';
        productRow.appendChild(resultsHeader);
    }

    if (!productsToDisplay || productsToDisplay.length === 0) {
        const noProductsDiv = document.createElement('div');
        noProductsDiv.classList.add('col-md-4');
        noProductsDiv.innerHTML = `
            <div id="empty-cart">
                <p id="empty-cart-text">No Results</p>
            </div>`;
        productRow.appendChild(noProductsDiv);
    } else {
        productsToDisplay.forEach((product, index) => {
            if (!input) {
                label = (index === 0) ? 'Most Popular' : (index === 1) ? 'Best Seller' : (index === 2) ? 'Top Rated' : (index === 3) ? 'For You' : (index === 4) ? 'Exclusive' : 'On Sale';
            }

            const productDiv = document.createElement('div');
            productDiv.classList.add('col-md-4');
            productDiv.innerHTML = `
                <h2>${label}</h2>
                <div class="product">
                    <img src="${product.image}">
                    <div class="product-details">
                        <p class="product-name">${product.name}</p>
                        <p class="product-price">$${product.price}</p>
                        <p class="product-description">${product.description}</p>
                    </div>
                </div>
                <p><a class="btn btn-secondary add-to-cart" role="button" data-id="${product.id}">Add to Cart&raquo;</a></p>
            `;
            productRow.appendChild(productDiv);
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => button.addEventListener('click', addToCart));
}


function addToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCartToLocalStorage()
    displayCart();
    openCart();
}

function displayCart() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = '';
    console.log(cart)

    if (cart.length === 0) {
        cartContent.innerHTML = `<div id="empty-cart">
            <p id="empty-cart-text">Your cart is empty.</p>
        </div>`;
        document.getElementById('checkout-btn').disabled = true
    } else {
        document.getElementById('checkout-btn').disabled = false
        cart.forEach((product) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="cart-item-name">${product.name}</p>
                    <p class="cart-item-price">$${product.price}</p>
                    <p class="cart-item-description">${product.description}</p>
                    <div class="cart-item-quantity">
                        <button class="decrement-quantity" data-id="${product.id}">-</button>
                        <input type="number" class="quantity-input" data-id="${product.id}" value="${product.quantity}">
                        <button class="increment-quantity" data-id="${product.id}">+</button>
                    </div>
                    <button class="remove-from-cart" data-id="${product.id}">Remove</button>
                </div>
            `;
            cartContent.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => button.addEventListener('click', removeFromCart));
        document.querySelectorAll('.increment-quantity').forEach(button => button.addEventListener('click', incrementQuantity));
        document.querySelectorAll('.decrement-quantity').forEach(button => button.addEventListener('click', decrementQuantity));
        document.querySelectorAll('.quantity-input').forEach(input => input.addEventListener('change', updateQuantity));
    }
}

function incrementQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    updateCart(productId, cart.find(item => item.id === productId).quantity + 1);
    displayCart();
}

function decrementQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const newQuantity = cart.find(item => item.id === productId).quantity - 1;
    if (newQuantity > 0) {
        updateCart(productId, newQuantity);
    }
    displayCart();
}

function updateQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
        updateCart(productId, newQuantity);
    }
    displayCart();
}

function removeFromCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    removeItemFromCart(productId);
    displayCart();
}

function openCart() {
    document.getElementById("cart-sidebar").style.width = "400px";
}

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById("cart-sidebar").style.width = "0px";
});

resetProducts();
displayCart()