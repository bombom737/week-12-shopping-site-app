function login(event) {
    event.preventDefault();

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let usernameInput = document.querySelector("#username");
    let passwordInput = document.querySelector("#password");
    let usernameError = document.querySelector("#usernameError");
    let passwordError = document.querySelector("#passwordError");

    usernameError.textContent = "";
    passwordError.textContent = "";
    usernameInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            //NOT SECURE AT ALL!!! Never do this in a real website!
            localStorage.setItem('firstName', data.user.firstName);
            localStorage.setItem('lastName', data.user.lastName);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password); 
            localStorage.setItem('isLoggedIn', true);
            window.location.href = "/";
        } else {
            if (data.message === 'Username not found') {
                usernameError.textContent = "Can't recognize username";
                usernameInput.classList.add("input-error");
            } else if (data.message === 'Incorrect password') {
                passwordError.textContent = "Incorrect password";
                passwordInput.classList.add("input-error");
            }
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });
}
