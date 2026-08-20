document.addEventListener("DOMContentLoaded", () => {
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const linkToRegister = document.getElementById("linkToRegister");
    const linkToLogin = document.getElementById("linkToLogin");
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const loginUsernameInput = document.getElementById("loginUsername");

    // Load saved username from localStorage if "Remember Me" was previously enabled
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername && loginUsernameInput) {
        loginUsernameInput.value = savedUsername;
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }

    // Switch between Login & Create Account Forms
    function showTab(mode) {
        if (mode === "login") {
            if (tabLogin) tabLogin.classList.add("active");
            if (tabRegister) tabRegister.classList.remove("active");
            if (loginForm) loginForm.classList.add("active");
            if (registerForm) registerForm.classList.remove("active");
        } else {
            if (tabRegister) tabRegister.classList.add("active");
            if (tabLogin) tabLogin.classList.remove("active");
            if (registerForm) registerForm.classList.add("active");
            if (loginForm) loginForm.classList.remove("active");
        }
    }

    if (tabLogin) tabLogin.addEventListener("click", () => showTab("login"));
    if (tabRegister) tabRegister.addEventListener("click", () => showTab("register"));
    if (linkToRegister) linkToRegister.addEventListener("click", (e) => { e.preventDefault(); showTab("register"); });
    if (linkToLogin) linkToLogin.addEventListener("click", (e) => { e.preventDefault(); showTab("login"); });

    // Password Eye Icon Toggle for all password fields
    const toggleIcons = document.querySelectorAll(".toggle-password");
    toggleIcons.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (input) {
                const isPassword = input.type === "password";
                input.type = isPassword ? "text" : "password";
                toggle.className = isPassword
                    ? "ri-eye-fill toggle-password"
                    : "ri-eye-off-fill toggle-password";
            }
        });
    });

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = loginUsernameInput ? loginUsernameInput.value.trim() : "";
            
            if (username) {
                // Save or remove remembered username based on checkbox
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    localStorage.setItem("rememberedUsername", username);
                } else {
                    localStorage.removeItem("rememberedUsername");
                }
                window.location.href = "dashboard.html";
            }
        });
    }

    // Handle Create Account Form Submission
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const regUsername = document.getElementById("regUsername").value.trim();
            const regPassword = document.getElementById("regPassword").value;
            const regConfirmPassword = document.getElementById("regConfirmPassword").value;

            if (regPassword !== regConfirmPassword) {
                alert("Passwords do not match. Please check your password.");
                return;
            }

            // Save username if registered successfully
            if (regUsername) {
                localStorage.setItem("rememberedUsername", regUsername);
            }

            alert("Account created successfully! Welcome to MICHI.");
            window.location.href = "dashboard.html";
        });
    }
});
