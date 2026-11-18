const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    // Demo credentials only
    if (username === "admin" && password === "admin123") {

        // Open your dashboard
        window.location.href = "dashboard.html";

    } else {
        errorMessage.textContent =
            "Incorrect username or password.";
    }
});