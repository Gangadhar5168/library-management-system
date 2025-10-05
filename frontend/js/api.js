// 🌐 API Configuration - This is our bridge to the backend!
console.log("🔗 API helper loaded!");

const API_BASE_URL = 'http://localhost:8080/api';

// 🎫 Get JWT token from browser storage
function getToken() {
    const token = localStorage.getItem('jwt-token');
    console.log('🎫 Getting token:', token ? 'Token found!' : 'No token found');
    return token;
}

// 👤 Get user info from browser storage
function getUser() {
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
        const user = JSON.parse(userInfo);
        console.log('👤 Getting user:', user.username);
        return user;
    }
    console.log('👤 No user info found');
    return null;
}

// 🔍 Check if user is logged in
function isLoggedIn() {
    const loggedIn = getToken() !== null;
    console.log('🔍 Is logged in:', loggedIn);
    return loggedIn;
}

// 👩‍🏫 Check if user is librarian
function isLibrarian() {
    const user = getUser();
    const isLib = user && user.role === 'LIBRARIAN';
    console.log('👩‍🏫 Is librarian:', isLib);
    return isLib;
}

// 🚀 Main API call function - This talks to your Spring Boot backend!
async function apiCall(endpoint, method = 'GET', data = null, includeAuth = true) {
    console.log(`🚀 API Call: ${method} ${API_BASE_URL}${endpoint}`);
    
    const headers = {
        'Content-Type': 'application/json'
    };

    // Add JWT token if needed
    if (includeAuth && getToken()) {
        headers['Authorization'] = `Bearer ${getToken()}`;
        console.log('🎫 Added JWT token to request');
    }

    const config = {
        method: method,
        headers: headers
    };

    // Add data for POST/PUT requests
    if (data) {
        config.body = JSON.stringify(data);
        console.log('📤 Sending data:', data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        console.log(`📥 Response status: ${response.status}`);
        
        // Handle authentication errors
        if (response.status === 401) {
            console.log('🚫 Authentication failed - redirecting to login');
            logout();
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ API Error:', errorData);
            throw new Error(errorData.message || 'Something went wrong!');
        }

        const result = await response.json();
        console.log('✅ API Success:', result);
        return result;
        
    } catch (error) {
        console.error('💥 API call failed:', error);
        throw error;
    }
}

// 🚨 Show error message to user
function showError(elementId, message) {
    console.log(`🚨 Showing error on ${elementId}:`, message);
    const errorElement = document.getElementById(elementId);
    const textElement = document.getElementById(elementId + 'Text');
    
    if (textElement) {
        textElement.textContent = message;
    } else {
        errorElement.textContent = message;
    }
    errorElement.classList.remove('d-none');
}

// ✅ Hide error message
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.add('d-none');
}

// 🎉 Show success message
function showSuccess(elementId, message) {
    console.log(`🎉 Showing success on ${elementId}:`, message);
    const successElement = document.getElementById(elementId);
    const textElement = document.getElementById(elementId + 'Text');
    
    if (textElement) {
        textElement.textContent = message;
    } else {
        successElement.textContent = message;
    }
    successElement.classList.remove('d-none');
}

// ✅ Hide success message
function hideSuccess(elementId) {
    const successElement = document.getElementById(elementId);
    successElement.classList.add('d-none');
}

console.log("✅ API helper functions ready!");