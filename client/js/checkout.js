import { cart, resetCart, removeItemFromCart, updateCart } from './cart.js';
let isLoggedIn = localStorage.getItem('isLoggedIn');

if (isLoggedIn) {
    let userFirstName = localStorage.getItem('firstName');
    document.querySelector("#dropdown-user").textContent = `Hello ${userFirstName}`;
    
    document.getElementById('dropdown-item1').remove();
    
    const logOut = document.getElementById('dropdown-item2');
    logOut.textContent = 'Log Out';
    logOut.href = "/"
    logOut.onclick = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        location.reload();
    };
}

const username = localStorage.getItem('username') || 'Guest';

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem(`cartOf${username}`);
    if (savedCart) {
        cart.length = 0;
        JSON.parse(savedCart).forEach(item => cart.push(item));
    }
}

loadCartFromLocalStorage();


function updateTotal(array){
    let total = 0
    array.forEach((product) =>{
        total += product.price * product.quantity
    })
    return total
}

function displayProducts() {
    const cartContent = document.querySelector('.cart-content');
    if (cart.length === 0) {
        cartContent.innerHTML = `
        <div id="empty-cart">
            <p id="empty-cart-text"><span style="color:red">Your cart is empty.</span> Go back to <a style="text-decoration: none;" href="/"> Home Page</a>.</p>
        </div>`
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('total-items').textContent = `Items: 0`;
        document.getElementById("total-price").textContent = `Subtotal: $0`;
    } else {
        document.getElementById('checkout-btn').disabled = false;
        cart.forEach((product) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="cart-item-name">${product.name}</p>
                    <p class="cart-item-description">${product.description}</p>
                    <div class="cart-item-quantity">
                        <a class="quantity-text">Quantity:</a>
                        <button class="decrement-quantity" data-id="${product.id}">-</button>
                        <input type="number" class="quantity-input" data-id="${product.id}" value="${product.quantity}">
                        <button class="increment-quantity" data-id="${product.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-details2">
                    <a class="cart-item-price">$${product.price * product.quantity}</a>
                    <button class="remove-from-cart" data-id="${product.id}">Remove</button>
                </div>
            `;
            cartContent.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => button.addEventListener('click', removeFromCart));
        document.querySelectorAll('.increment-quantity').forEach(button => button.addEventListener('click', incrementQuantity));
        document.querySelectorAll('.decrement-quantity').forEach(button => button.addEventListener('click', decrementQuantity));
        document.querySelectorAll('.quantity-input').forEach(input => input.addEventListener('change', updateQuantity));
        console.log(cart);
        document.getElementById('total-items').textContent = cart.length === 1 ? `Item: ${cart.length}` : `Items: ${cart.length}`;
        document.getElementById("total-price").textContent = `Subtotal: $${updateTotal(cart)}`;
    }
}

function incrementQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    updateCart(productId, cart.find(item => item.id === productId).quantity + 1);
    displayProducts();
}

function decrementQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const newQuantity = cart.find(item => item.id === productId).quantity - 1;
    if (newQuantity > 0) {
        updateCart(productId, newQuantity);
    }
    displayProducts();
}

function updateQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
        updateCart(productId, newQuantity);
    }
    displayProducts();
}

function removeFromCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    removeItemFromCart(productId);
    displayProducts();
}

async function checkout(username) {
    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                cart: cart
            })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('checkout-btn').disabled = true;
            showOrderConfirmation(data.order);
            resetCart();
        } else {
            alert('Failed to place order: ' + data.message);
            console.error('Error:', data);
        }
    } catch (error) {
        alert('Failed to place order: ' + error.message);
        console.error('Error:', error);
    }
}

function showOrderConfirmation() {
    const confirmationDiv = document.getElementById('order-confirmation');
    const confirmationMessage = document.getElementById('confirmation-message');

    confirmationMessage.innerText = "Your order has been placed successfully!";

    confirmationDiv.classList.remove('hidden');
    setTimeout(() => {
        confirmationDiv.classList.add('visible');
    }, 10);
}

document.getElementById('checkout-btn').addEventListener('click', () => {
    checkout(username);
});

displayProducts();
