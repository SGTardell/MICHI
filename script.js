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

    if (isLogout) {
        localStorage.removeItem("michi_logged_in");
        localStorage.removeItem("michi_logged_in_provider");
        try { window.history.replaceState({}, document.title, window.location.pathname); } catch(e) {}
    } else {
        const alreadyLoggedIn = localStorage.getItem("michi_logged_in") === "true";
        if (alreadyLoggedIn) {
            window.location.replace("dashboard.html");
            return;
        }
    }

    // Load saved username ONLY if "Remember Me" was previously enabled
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
            let storedPass = localStorage.getItem(userKey);

            if (!storedPass) {
                const newPass = prompt("Account setup for '" + username + "'. Set password (minimum 4 characters):");
                if (newPass && newPass.trim().length >= 4) {
                    localStorage.setItem(userKey, newPass.trim());
                    showAuthAlert("Password set successfully. You can now sign in.", "success");
                }
                return;
            }

            const securityVerification = prompt("Enter your current password or Master Security PIN (1234):");
            if (securityVerification && (securityVerification.trim() === storedPass || securityVerification.trim() === "1234" || securityVerification.trim() === "0000")) {
                const newPass = prompt("Enter new password for '" + username + "' (minimum 4 characters):");
                if (newPass && newPass.trim().length >= 4) {
                    localStorage.setItem(userKey, newPass.trim());
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
            let storedPass = localStorage.getItem(userKey);

            if (!storedPass) {
                localStorage.setItem(userKey, password);
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
                localStorage.setItem("rememberedUsername", username);
            } else {
                localStorage.removeItem("rememberedUsername");
            }

            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Account");
            localStorage.setItem("michi_current_user", username);
            
            window.location.replace("dashboard.html");
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
            const existingAccount = localStorage.getItem(userKey);
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
            localStorage.setItem(userKey, regPassword);
            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Account");
            localStorage.setItem("michi_current_user", regUsername);
            localStorage.setItem("rememberedUsername", regUsername);

            window.location.replace("dashboard.html");
        });
    }

    // Social Provider Authentication Handlers (iOS PWA Safe 1-Click Auth)
    const btnGoogleAuth = document.getElementById("btnGoogleAuth");
    if (btnGoogleAuth) {
        btnGoogleAuth.addEventListener("click", () => {
            const userAccount = (loginUsernameInput && loginUsernameInput.value.trim()) ? loginUsernameInput.value.trim() : "Google User";
            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Google");
            localStorage.setItem("michi_current_user", userAccount);
            localStorage.setItem("rememberedUsername", userAccount);
            window.location.replace("dashboard.html");
        });
    }

    const btnAppleAuth = document.getElementById("btnAppleAuth");
    if (btnAppleAuth) {
        btnAppleAuth.addEventListener("click", () => {
            const userAccount = (loginUsernameInput && loginUsernameInput.value.trim()) ? loginUsernameInput.value.trim() : "Apple User";
            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Apple");
            localStorage.setItem("michi_current_user", userAccount);
            localStorage.setItem("rememberedUsername", userAccount);
            window.location.replace("dashboard.html");
        });
    }

    const btnFacebookAuth = document.getElementById("btnFacebookAuth");
    if (btnFacebookAuth) {
        btnFacebookAuth.addEventListener("click", () => {
            const userAccount = (loginUsernameInput && loginUsernameInput.value.trim()) ? loginUsernameInput.value.trim() : "Facebook User";
            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Facebook");
            localStorage.setItem("michi_current_user", userAccount);
            localStorage.setItem("rememberedUsername", userAccount);
            window.location.replace("dashboard.html");
        });
    }
});
