// 🔐 Authentication Functions - The security guards of our app!
console.log("🔐 Auth functions loading...");

// 🚪 Login function - Let's get you into the library!
async function login() {
    console.log("🚪 Login attempt started...");
    hideError('loginError');
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Basic validation
    if (!username || !password) {
        showError('loginError', 'Please enter both username and password! 🤔');
        return;
    }

    console.log(`👤 Attempting login for: ${username}`);

    try {
        // Call your backend login API
        const response = await apiCall('/auth/login', 'POST', {
            username: username,
            password: password
        }, false); // false = don't include JWT token (we don't have one yet!)

        if (response && response.token) {
            console.log("🎉 Login successful!");
            
            // Store the magic JWT token
            localStorage.setItem('jwt-token', response.token);
            localStorage.setItem('user-info', JSON.stringify({
                username: response.username,
                fullName: response.fullName,
                email: response.email,
                role: response.role
            }));

            console.log("💾 User info saved to browser storage");
            console.log(`👤 Welcome ${response.fullName}! Role: ${response.role}`);

            // 🎊 Success! Redirect to dashboard
            alert(`🎉 Welcome back, ${response.fullName}! Redirecting to dashboard...`);
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error("❌ Login failed:", error);
        showError('loginError', error.message || 'Login failed! Please try again. 😞');
    }
}

// 📝 Register function - Join our library family!
async function register() {
    console.log("📝 Registration attempt started...");
    hideError('registerError');
    hideSuccess('registerSuccess');
    
    const username = document.getElementById('registerUsername').value.trim();
    const fullName = document.getElementById('registerFullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    // Validation
    if (!username || !fullName || !email || !password) {
        showError('registerError', 'Please fill in all required fields! 📝');
        return;
    }

    console.log(`📝 Attempting registration for: ${username} (${role})`);

    try {
        // Call your backend register API
        const response = await apiCall('/auth/register', 'POST', {
            username: username,
            fullName: fullName,
            email: email,
            phoneNumber: phone,
            password: password,
            role: role
        }, false); // false = don't include JWT token

        if (response && response.token) {
            console.log("🎉 Registration successful!");
            
            showSuccess('registerSuccess', 
                `🎉 Welcome to the library, ${response.fullName}! Your account has been created successfully!`);
            
            // Clear the form
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerFullName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPhone').value = '';
            document.getElementById('registerPassword').value = '';
            
            // Show login form after 3 seconds
            setTimeout(() => {
                showLoginForm();
                alert("✅ Registration complete! Please login with your new account.");
            }, 3000);
        }
    } catch (error) {
        console.error("❌ Registration failed:", error);
        showError('registerError', error.message || 'Registration failed! Please try again. 😞');
    }
}

// 🔄 Show register form
function showRegisterForm() {
    console.log("📝 Showing register form");
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('registerForm').classList.remove('d-none');
    hideError('loginError');
}

// 🔄 Show login form
function showLoginForm() {
    console.log("🚪 Showing login form");
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('loginForm').classList.remove('d-none');
    hideError('registerError');
    hideSuccess('registerSuccess');
}

// 🚪 Logout function - See you later!
function logout() {
    console.log("👋 User logging out...");
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user-info');
    alert("👋 Logged out successfully! See you next time!");
    window.location.href = 'index.html';
}

// 🛡️ Check if user is authenticated (for protected pages)
function checkAuth() {
    if (!isLoggedIn()) {
        alert("🔒 Please login first!");
        window.location.href = 'index.html';
    }
}

// 👩‍🏫 Check if user is librarian (for admin pages)
function checkLibrarianAuth() {
    checkAuth();
    if (!isLibrarian()) {
        alert('🚫 Access denied! Librarian role required.');
        window.location.href = 'dashboard.html';
    }
}

console.log("✅ Auth functions ready!");