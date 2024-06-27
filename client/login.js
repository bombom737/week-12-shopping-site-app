function login(event) {
    event.preventDefault(); // Prevent form submission

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let usernameInput = document.querySelector("#username");
    let passwordInput = document.querySelector("#password");
    let usernameError = document.querySelector("#usernameError");
    let passwordError = document.querySelector("#passwordError");

    // Clear previous error messages and remove error styles
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
            localStorage.setItem('firstName', data.user.firstName);
            localStorage.setItem('lastName', data.user.lastName);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password); // This is generally not recommended for security reasons
            localStorage.setItem('isLoggedIn', true);

            // Alternatively, you can use cookies
            // document.cookie = `username=${username}; path=/`;
            // document.cookie = `isLoggedIn=true; path=/`;

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
