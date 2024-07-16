function ResetForm() {
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("passconfirm").value = "";

    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(msg => msg.textContent = "");
    document.getElementById("submit").disabled = true;
}

function activateButton(element) {
    if(element.checked) {
        document.getElementById("submit").disabled = false;
    } else {
        document.getElementById("submit").disabled = true;
    }
}

async function register(event) {
    event.preventDefault(); //To prevent the json message from taking over the whole page display

    let firstName = document.querySelector("#firstname").value;
    let lastName = document.querySelector("#lastname").value;
    let username = document.querySelector("#username").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let passconfirm = document.querySelector("#passconfirm").value;
    
    const firstNameError = document.querySelector("#firstnameError");
    const lastNameError = document.querySelector("#lastnameError");
    const usernameError = document.querySelector("#usernameError"); 
    const emailError = document.querySelector("#emailError");
    const passwordError = document.querySelector("#passwordError");
    const passconfirmError = document.querySelector("#passconfirmError");
    
    firstNameError.textContent = "";
    lastNameError.textContent = "";
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    passconfirmError.textContent = "";
    
    let errorOccurred = false;
    
    if (firstName === "" || lastName === "" || username === "" || email === "" || password === "" || passconfirm === "") {
        errorOccurred = true;
    }

    if (lastName === ""){
        lastNameError.textContent = "Invalid last name"
    }

    if (firstName === ""){
        firstNameError.textContent = "Invalid first name"
    }
    
    if(username.length > 8 || username.length < 4){
        usernameError.textContent = "Invalid username, username must be between 4-8 characters in length";
        errorOccurred = true;
    }

    if(!email.includes("@")){
        emailError.textContent = "Invalid email address";
        errorOccurred = true;
    }
    if(!password.includes("$") || password.length > 10 || password.length < 5){
        passwordError.textContent = "Invalid password, password must be between 5-10 characters in length and contain a dollarsign ($) symbol";
        errorOccurred = true;
    }
    if(password != passconfirm){
        passconfirmError.textContent = "Passwords don't match";
        errorOccurred = true;
    }
    if(errorOccurred){
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: firstName,
                lastname: lastName,
                username: username,
                email: email,
                password: password
            })
        });
        const result = await response.json();
        
        if (result.message === 'Email is already taken.') {
            emailError.textContent = "Email is already taken.";
        } else if (result.message === 'Username is already taken.') {
            usernameError.textContent = "Username is already taken.";
        } else if (result.message === 'User registered successfully.') {
            localStorage.setItem("user", username);
            localStorage.setItem("pass", password);
            window.location.href = "/login";
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.querySelector('form').addEventListener('submit', register);
