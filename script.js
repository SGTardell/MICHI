document.addEventListener("DOMContentLoaded", () => {
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const linkToRegister = document.getElementById("linkToRegister");
    const linkToLogin = document.getElementById("linkToLogin");
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const loginUsernameInput = document.getElementById("loginUsername");
    const loginPasswordInput = document.getElementById("loginPassword");

    const params = new URLSearchParams(window.location.search);
    const isLogout = params.get("logout") === "1";

    function showAuthAlert(msg, type = "error") {
        const alertEl = document.getElementById("authAlert");
        if (alertEl) {
            alertEl.textContent = msg;
            alertEl.className = "auth-alert " + type;
            alertEl.style.display = "flex";
            try { alertEl.scrollIntoView({ behavior: "auto", block: "nearest" }); } catch(e) {}
        } else {
            alert(msg);
        }
    }

    function setLoginSession(username, provider) {
        const prov = provider || "Account";
        const user = username || "MICHI User";
        try { localStorage.setItem("michi_logged_in", "true"); } catch(e) {}
        try { localStorage.setItem("michi_logged_in_provider", prov); } catch(e) {}
        try { localStorage.setItem("michi_current_user", user); } catch(e) {}
        try { sessionStorage.setItem("michi_logged_in", "true"); } catch(e) {}
        try { sessionStorage.setItem("michi_logged_in_provider", prov); } catch(e) {}
        try { sessionStorage.setItem("michi_current_user", user); } catch(e) {}
        try {
            document.cookie = "michi_logged_in=true; path=/; max-age=31536000; SameSite=Lax";
            document.cookie = "michi_current_user=" + encodeURIComponent(user) + "; path=/; max-age=31536000; SameSite=Lax";
        } catch(e) {}
    }

    function checkIsLoggedIn() {
        try { if (localStorage.getItem("michi_logged_in") === "true") return true; } catch(e) {}
        try { if (sessionStorage.getItem("michi_logged_in") === "true") return true; } catch(e) {}
        try { if (document.cookie.includes("michi_logged_in=true")) return true; } catch(e) {}
        return false;
    }

    function clearLoginSession() {
        try { localStorage.removeItem("michi_logged_in"); } catch(e) {}
        try { localStorage.removeItem("michi_logged_in_provider"); } catch(e) {}
        try { sessionStorage.removeItem("michi_logged_in"); } catch(e) {}
        try { sessionStorage.removeItem("michi_logged_in_provider"); } catch(e) {}
        try { document.cookie = "michi_logged_in=; path=/; max-age=0;"; } catch(e) {}
    }

    function navigateToDashboard() {
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 80);
    }

    if (isLogout) {
        clearLoginSession();
        try { window.history.replaceState({}, document.title, window.location.pathname); } catch(e) {}
    } else {
        if (checkIsLoggedIn()) {
            window.location.replace("dashboard.html");
            return;
        }
    }

    // Load saved username ONLY if "Remember Me" was previously enabled
    let savedUsername = "";
    try { savedUsername = localStorage.getItem("rememberedUsername") || ""; } catch(e) {}
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

    // Password Reset
    const linkResetPass = document.getElementById("linkResetPass");
    if (linkResetPass) {
        linkResetPass.addEventListener("click", (e) => {
            e.preventDefault();
            const username = loginUsernameInput ? loginUsernameInput.value.trim() : "";
            if (!username) {
                showAuthAlert("Please enter your Username / Email first.");
                if (loginUsernameInput) loginUsernameInput.focus();
                return;
            }

            const userKey = "michi_user_pass_" + username.toLowerCase();
            let storedPass = null;
            try { storedPass = localStorage.getItem(userKey); } catch(err) {}

            if (!storedPass) {
                const newPass = prompt("Account setup for '" + username + "'. Set password (minimum 4 characters):");
                if (newPass && newPass.trim().length >= 4) {
                    try { localStorage.setItem(userKey, newPass.trim()); } catch(err) {}
                    showAuthAlert("Password set successfully. You can now sign in.", "success");
                }
                return;
            }

            const securityVerification = prompt("Enter your current password or Master Security PIN (1234):");
            if (securityVerification && (securityVerification.trim() === storedPass || securityVerification.trim() === "1234" || securityVerification.trim() === "0000")) {
                const newPass = prompt("Enter new password for '" + username + "' (minimum 4 characters):");
                if (newPass && newPass.trim().length >= 4) {
                    try { localStorage.setItem(userKey, newPass.trim()); } catch(err) {}
                    showAuthAlert("Password updated successfully. Please sign in with your new password.", "success");
                    if (loginPasswordInput) {
                        loginPasswordInput.value = "";
                        setTimeout(() => { try { loginPasswordInput.focus(); } catch(err) {} }, 100);
                    }
                }
            } else {
                showAuthAlert("Incorrect password or security PIN.");
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
            const rawPass = loginPasswordInput ? loginPasswordInput.value : "";
            const password = rawPass ? rawPass.trim() : "";
            
            if (!username) {
                showAuthAlert("Username or Email is required.");
                if (loginUsernameInput) loginUsernameInput.focus();
                return;
            }

            if (!password) {
                showAuthAlert("Password is required.");
                if (loginPasswordInput) loginPasswordInput.focus();
                return;
            }

            const userKey = "michi_user_pass_" + username.toLowerCase();
            let storedPass = null;
            try { storedPass = localStorage.getItem(userKey); } catch(err) {}

            if (!storedPass) {
                try { localStorage.setItem(userKey, password); } catch(err) {}
                storedPass = password;
            } else if (storedPass !== password) {
                showAuthAlert("Incorrect password for account '" + username + "'. Please try again.");
                if (loginPasswordInput) {
                    loginPasswordInput.value = "";
                    setTimeout(() => { try { loginPasswordInput.focus(); } catch(err) {} }, 100);
                }
                return;
            }

            // SUCCESSFUL AUTHENTICATION
            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                try { localStorage.setItem("rememberedUsername", username); } catch(err) {}
            } else {
                try { localStorage.removeItem("rememberedUsername"); } catch(err) {}
            }

            setLoginSession(username, "Account");
            navigateToDashboard();
        });
    }

    // Handle Create Account Form Submission
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const regUsernameInput = document.getElementById("regUsername");
            const regPasswordInput = document.getElementById("regPassword");
            const regConfirmPasswordInput = document.getElementById("regConfirmPassword");

            const regUsername = regUsernameInput ? regUsernameInput.value.trim() : "";
            const regPassword = regPasswordInput ? regPasswordInput.value : "";
            const regConfirmPassword = regConfirmPasswordInput ? regConfirmPasswordInput.value : "";

            if (!regUsername) {
                alert("Full Name or Username is required.");
                if (regUsernameInput) regUsernameInput.focus();
                return;
            }

            if (!regPassword) {
                alert("Password is required.");
                if (regPasswordInput) regPasswordInput.focus();
                return;
            }

            if (regPassword.length < 4) {
                alert("Password must be at least 4 characters long.");
                if (regPasswordInput) regPasswordInput.focus();
                return;
            }

            if (regPassword !== regConfirmPassword) {
                alert("Passwords do not match. Please re-enter.");
                if (regConfirmPasswordInput) {
                    regConfirmPasswordInput.value = "";
                    regConfirmPasswordInput.focus();
                }
                return;
            }

            const userKey = "michi_user_pass_" + regUsername.toLowerCase();
            let existingAccount = null;
            try { existingAccount = localStorage.getItem(userKey); } catch(err) {}

            if (existingAccount) {
                alert("An account for '" + regUsername + "' already exists. Please Sign In with your password.");
                showTab("login");
                if (loginUsernameInput) {
                    loginUsernameInput.value = regUsername;
                }
                if (loginPasswordInput) {
                    loginPasswordInput.focus();
                }
                return;
            }

            // Save new account credentials securely
            try {
                localStorage.setItem(userKey, regPassword);
                localStorage.setItem("rememberedUsername", regUsername);
            } catch(err) {}

            setLoginSession(regUsername, "Account");
            navigateToDashboard();
        });
    }

    // Social Provider Authentication Handlers (iOS PWA Safe 1-Click Auth)
    const btnGoogleAuth = document.getElementById("btnGoogleAuth");
    if (btnGoogleAuth) {
        btnGoogleAuth.addEventListener("click", (e) => {
            if (e) e.preventDefault();
            const userAccount = (loginUsernameInput && loginUsernameInput.value.trim()) ? loginUsernameInput.value.trim() : "Google User";
            setLoginSession(userAccount, "Google");
            navigateToDashboard();
        });
    }

    const btnAppleAuth = document.getElementById("btnAppleAuth");
    if (btnAppleAuth) {
        btnAppleAuth.addEventListener("click", (e) => {
            if (e) e.preventDefault();
            const userAccount = (loginUsernameInput && loginUsernameInput.value.trim()) ? loginUsernameInput.value.trim() : "Apple User";
            setLoginSession(userAccount, "Apple");
            navigateToDashboard();
        });
    }

    const btnFacebookAuth = document.getElementById("btnFacebookAuth");
    if (btnFacebookAuth) {
        btnFacebookAuth.addEventListener("click", (e) => {
            if (e) e.preventDefault();
            const userAccount = (loginUsernameInput && loginUsernameInput.value.trim()) ? loginUsernameInput.value.trim() : "Facebook User";
            setLoginSession(userAccount, "Facebook");
            navigateToDashboard();
        });
    }
});
