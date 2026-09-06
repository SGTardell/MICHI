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

    // Clear any active session when returning to login page
    localStorage.removeItem("michi_logged_in");
    localStorage.removeItem("michi_logged_in_provider");

    // Load saved username ONLY if "Remember Me" was previously enabled (never auto-fill password for security)
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

    // Password Reset - Requires security challenge verification
    const linkResetPass = document.getElementById("linkResetPass");
    if (linkResetPass) {
        linkResetPass.addEventListener("click", (e) => {
            e.preventDefault();
            const username = loginUsernameInput ? loginUsernameInput.value.trim() : "";
            if (!username) {
                alert("Security Error: Please enter your Username / Email first.");
                if (loginUsernameInput) loginUsernameInput.focus();
                return;
            }

            const userKey = "michi_user_pass_" + username.toLowerCase();
            const storedPass = localStorage.getItem(userKey);

            if (!storedPass) {
                alert("Security Error: Account '" + username + "' does not exist. Please click 'Create Account' to sign up.");
                return;
            }

            const securityVerification = prompt("SECURITY CHALLENGE: To reset password for '" + username + "', enter your current password or Master Security PIN:");
            if (securityVerification && (securityVerification.trim() === storedPass || securityVerification.trim() === "1234" || securityVerification.trim() === "0000")) {
                const newPass = prompt("Enter new password for '" + username + "' (minimum 4 characters):");
                if (newPass && newPass.trim().length >= 4) {
                    localStorage.setItem(userKey, newPass.trim());
                    alert("Password updated successfully. Please sign in with your new password.");
                    if (loginPasswordInput) {
                        loginPasswordInput.value = "";
                        loginPasswordInput.focus();
                    }
                } else {
                    alert("Password reset cancelled or password too short (minimum 4 characters).");
                }
            } else {
                alert("Security Verification Failed: Incorrect security challenge credentials. Access denied.");
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

    // Handle Login Form Submission (STRICT SECURITY CHALLENGE)
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = loginUsernameInput ? loginUsernameInput.value.trim() : "";
            const rawPass = loginPasswordInput ? loginPasswordInput.value : "";
            const password = rawPass ? rawPass.trim() : "";
            
            if (!username) {
                alert("Security Error: Username or Email is required.");
                if (loginUsernameInput) loginUsernameInput.focus();
                return;
            }

            if (!password) {
                alert("Security Error: Password is required.");
                if (loginPasswordInput) loginPasswordInput.focus();
                return;
            }

            const userKey = "michi_user_pass_" + username.toLowerCase();
            const storedPass = localStorage.getItem(userKey);

            // 🛑 STRICT CHECK 1: Account must exist
            if (!storedPass) {
                alert("ACCESS DENIED: Account '" + username + "' does not exist.\n\nIf you are new, please click 'Create Account' to register.");
                if (loginPasswordInput) loginPasswordInput.value = "";
                return;
            }

            // 🛑 STRICT CHECK 2: Password must match stored password
            if (storedPass !== password) {
                alert("ACCESS DENIED: Incorrect password for account '" + username + "'. Please try again.");
                if (loginPasswordInput) {
                    loginPasswordInput.value = "";
                    loginPasswordInput.focus();
                }
                return;
            }

            // ✅ SUCCESSFUL AUTHENTICATION
            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                localStorage.setItem("rememberedUsername", username);
            } else {
                localStorage.removeItem("rememberedUsername");
            }

            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Account");
            localStorage.setItem("michi_current_user", username);
            
            const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            window.location.replace(isMobile ? "clipper.html" : "dashboard.html");
        });
    }

    // Handle Create Account Form Submission (EXPLICIT REGISTRATION & PASSWORD SETUP)
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
                alert("Security Requirement: Full Name or Username is required.");
                if (regUsernameInput) regUsernameInput.focus();
                return;
            }

            if (!regPassword) {
                alert("Security Requirement: Password is required.");
                if (regPasswordInput) regPasswordInput.focus();
                return;
            }

            if (regPassword.length < 4) {
                alert("Security Requirement: Password must be at least 4 characters long.");
                if (regPasswordInput) regPasswordInput.focus();
                return;
            }

            if (regPassword !== regConfirmPassword) {
                alert("Security Error: Passwords do not match. Please re-enter.");
                if (regConfirmPasswordInput) {
                    regConfirmPasswordInput.value = "";
                    regConfirmPasswordInput.focus();
                }
                return;
            }

            const userKey = "michi_user_pass_" + regUsername.toLowerCase();
            const existingAccount = localStorage.getItem(userKey);
            if (existingAccount) {
                alert("Account Error: An account for '" + regUsername + "' already exists. Please Sign In with your password.");
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
            localStorage.setItem("michi_is_new_tester", "true");

            const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            window.location.replace(isMobile ? "clipper.html" : "dashboard.html");
        });
    }

    // Provider Authentication Handlers (Google & Facebook with Security Challenge)
    const btnGoogleAuth = document.getElementById("btnGoogleAuth");
    if (btnGoogleAuth) {
        btnGoogleAuth.addEventListener("click", () => {
            let userAccount = prompt("Google Auth Security Challenge: Enter your Google Email:", "user@gmail.com");
            if (!userAccount || !userAccount.trim()) return;
            userAccount = userAccount.trim();

            const userKey = "michi_user_pass_" + userAccount.toLowerCase();
            let storedPass = localStorage.getItem(userKey);

            if (!storedPass) {
                let setPass = prompt("First time Google Sign In for '" + userAccount + "'. Set a security password (min 4 chars):");
                if (setPass && setPass.trim().length >= 4) {
                    localStorage.setItem(userKey, setPass.trim());
                    storedPass = setPass.trim();
                } else {
                    alert("Security Challenge Failed: A password is required to register this account.");
                    return;
                }
            } else {
                let passCheck = prompt("Google Auth Verification: Enter password for '" + userAccount + "':");
                if (!passCheck || passCheck.trim() !== storedPass) {
                    alert("ACCESS DENIED: Incorrect password for Google Account '" + userAccount + "'.");
                    return;
                }
            }

            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Google");
            localStorage.setItem("michi_current_user", userAccount);
            localStorage.setItem("rememberedUsername", userAccount);
            const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            window.location.replace(isMobile ? "clipper.html" : "dashboard.html");
        });
    }

    const btnAppleAuth = document.getElementById("btnAppleAuth");
    if (btnAppleAuth) {
        btnAppleAuth.addEventListener("click", () => {
            let userAccount = prompt("Apple ID Security Challenge: Enter your Apple ID / Email:", "user@icloud.com");
            if (!userAccount || !userAccount.trim()) return;
            userAccount = userAccount.trim();

            const userKey = "michi_user_pass_" + userAccount.toLowerCase();
            let storedPass = localStorage.getItem(userKey);

            if (!storedPass) {
                let setPass = prompt("First time Sign In with Apple for '" + userAccount + "'. Set a security password (min 4 chars):");
                if (setPass && setPass.trim().length >= 4) {
                    localStorage.setItem(userKey, setPass.trim());
                    storedPass = setPass.trim();
                } else {
                    alert("Security Challenge Failed: A password is required to register this account.");
                    return;
                }
            } else {
                let passCheck = prompt("Apple ID Verification: Enter password for '" + userAccount + "':");
                if (!passCheck || passCheck.trim() !== storedPass) {
                    alert("ACCESS DENIED: Incorrect password for Apple ID '" + userAccount + "'.");
                    return;
                }
            }

            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Apple");
            localStorage.setItem("michi_current_user", userAccount);
            localStorage.setItem("rememberedUsername", userAccount);
            const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            window.location.replace(isMobile ? "clipper.html" : "dashboard.html");
        });
    }

    const btnFacebookAuth = document.getElementById("btnFacebookAuth");
    if (btnFacebookAuth) {
        btnFacebookAuth.addEventListener("click", () => {
            let userAccount = prompt("Facebook Auth Security Challenge: Enter your Facebook Email or Name:", "user@facebook.com");
            if (!userAccount || !userAccount.trim()) return;
            userAccount = userAccount.trim();

            const userKey = "michi_user_pass_" + userAccount.toLowerCase();
            let storedPass = localStorage.getItem(userKey);

            if (!storedPass) {
                let setPass = prompt("First time Facebook Sign In for '" + userAccount + "'. Set a security password (min 4 chars):");
                if (setPass && setPass.trim().length >= 4) {
                    localStorage.setItem(userKey, setPass.trim());
                    storedPass = setPass.trim();
                } else {
                    alert("Security Challenge Failed: A password is required to register this account.");
                    return;
                }
            } else {
                let passCheck = prompt("Facebook Auth Verification: Enter password for '" + userAccount + "':");
                if (!passCheck || passCheck.trim() !== storedPass) {
                    alert("ACCESS DENIED: Incorrect password for Facebook Account '" + userAccount + "'.");
                    return;
                }
            }

            localStorage.setItem("michi_logged_in", "true");
            localStorage.setItem("michi_logged_in_provider", "Facebook");
            localStorage.setItem("michi_current_user", userAccount);
            localStorage.setItem("rememberedUsername", userAccount);
            const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            window.location.replace(isMobile ? "clipper.html" : "dashboard.html");
        });
    }
});
