let isLoggedIn = localStorage.getItem('isLoggedIn');

if (isLoggedIn) {
    let userFirstName = localStorage.getItem('firstName');
    document.querySelector("#dropdown-user").textContent = `Hello ${userFirstName}`;
    
    const cart = document.getElementById('dropdown-item1');;
    cart.onclick = () => {
        document.getElementById("cart-sidebar").style.width = "400px";
    };
    cart.textContent = 'View Cart';
    cart.href = '/#'
    
    const logOut = document.getElementById('dropdown-item2');
    logOut.textContent = 'Log Out';
    logOut.href = "/#"
    logOut.onclick = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        location.reload();
    };
}

document.getElementById("cart-btn").onclick = () => {
    document.getElementById("cart-sidebar").style.width = "400px";
};

document.getElementById("close-btn").onclick = () => {
    document.getElementById("cart-sidebar").style.width = "0";
};

document.getElementById("continue-shopping-btn").onclick = () => {
    document.getElementById("cart-sidebar").style.width = "0";
};

document.getElementById("checkout-btn").onclick = async () => {
        window.location.href = "/checkout";
}