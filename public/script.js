document.addEventListener("DOMContentLoaded", () => {
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const linkToRegister = document.getElementById("linkToRegister");
    const linkToLogin = document.getElementById("linkToLogin");
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const loginUsernameInput = document.getElementById("loginUsername");

    // Load saved username & password from localStorage if "Remember Me" was enabled
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername && loginUsernameInput) {
        loginUsernameInput.value = savedUsername;
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
        const userKey = "michi_user_pass_" + savedUsername.toLowerCase();
        const savedPass = localStorage.getItem(userKey);
        const loginPasswordInput = document.getElementById("loginPassword");
        if (savedPass && loginPasswordInput) {
            loginPasswordInput.value = savedPass;
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

    const linkResetPass = document.getElementById("linkResetPass");
    if (linkResetPass) {
        linkResetPass.addEventListener("click", (e) => {
            e.preventDefault();
            const username = loginUsernameInput ? loginUsernameInput.value.trim() : "";
            if (!username) {
                alert("Please enter your Username / Email first to reset your password.");
                if (loginUsernameInput) loginUsernameInput.focus();
                return;
            }
            const newPass = prompt("Set a new password for account '" + username + "':");
            if (newPass && newPass.trim()) {
                const userKey = "michi_user_pass_" + username.toLowerCase();
                localStorage.setItem(userKey, newPass.trim());
                alert("Password updated successfully! Signing in to MICHI...");
                localStorage.setItem("michi_logged_in", "true");
                localStorage.setItem("rememberedUsername", username);
                window.location.replace("dashboard.html");
            }
        });
    }

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
            const rawPass = document.getElementById("loginPassword") ? document.getElementById("loginPassword").value : "";
            const password = rawPass ? rawPass.trim() : "";
            
            if (!username) {
                alert("Please enter your username or email.");
                return;
            }

            if (!password) {
                alert("Please enter your password.");
                return;
            }

            const userKey = "michi_user_pass_" + username.toLowerCase();
            const storedPass = localStorage.getItem(userKey);

            if (!storedPass) {
                // Initial login for username — register password and mark as new tester
                localStorage.setItem(userKey, password);
                localStorage.setItem("michi_logged_in", "true");
                localStorage.setItem("rememberedUsername", username);
                localStorage.setItem("michi_is_new_tester", "true");
                window.location.replace("dashboard.html");
                return;
            }

            if (storedPass !== password) {
                alert("Incorrect password for account '" + username + "'. Access denied.");
                const passInput = document.getElementById("loginPassword");
                if (passInput) {
                    passInput.value = "";
                    passInput.focus();
                }
                return;
            }

            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("rememberedUsername", username);
            window.location.replace("dashboard.html");
        });
    }

    // Handle Create Account Form Submission
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const regUsername = document.getElementById("regUsername").value.trim();
            const regPassword = document.getElementById("regPassword").value;
            const regConfirmPassword = document.getElementById("regConfirmPassword").value;

            if (!regUsername) {
                alert("Please enter your full name or username.");
                return;
            }

            if (!regPassword) {
                alert("Please enter a password.");
                return;
            }

            if (regPassword.length < 3) {
                alert("Password must be at least 3 characters long.");
                return;
            }

            if (regPassword !== regConfirmPassword) {
                alert("Passwords do not match. Please check your password.");
                return;
            }

            const userKey = "michi_user_pass_" + regUsername.toLowerCase();
            localStorage.setItem(userKey, regPassword);
            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("rememberedUsername", regUsername);
            localStorage.setItem("michi_is_new_tester", "true");

            window.location.replace("dashboard.html");
        });
    }
});
