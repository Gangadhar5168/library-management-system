// 👥 Users Management Functions
console.log("👥 Users page loading...");

let allUsers = []; // Store all users for filtering
let filteredUsers = []; // Store filtered users for pagination
let currentPage = 1;
let usersPerPage = 3; // Show 3 users per page (better for testing with fewer users)

// 🔒 Check authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔒 Checking authentication...");
    checkAuth();
    checkLibrarianAuth(); // Users page is librarian-only
    displayUserInfo();
    loadUsers();
});

// 👤 Display user information
function displayUserInfo() {
    const user = getUser();
    if (user) {
        document.getElementById('userName').textContent = user.fullName;
        console.log(`👤 Welcome ${user.fullName}!`);
    }
}

// 👥 Load all users from API
async function loadUsers() {
    console.log("👥 Loading users from API...");
    
    try {
        const users = await apiCall('/users');
        
        if (users && Array.isArray(users)) {
            allUsers = users;
            displayUsers(users);
            updateUserStats(users);
            console.log(`✅ Loaded ${users.length} users`);
        } else {
            console.log("👥 No users found or invalid response");
            showNoUsersMessage();
        }
        
    } catch (error) {
        console.error("❌ Error loading users:", error);
        showError('loadingUsers', 'Failed to load users: ' + error.message);
    } finally {
        // Hide loading spinner
        document.getElementById('loadingUsers').style.display = 'none';
    }
}

// 📊 Update user statistics
function updateUserStats(users) {
    const totalUsers = users.length;
    const members = users.filter(u => u.role === 'MEMBER').length;
    const librarians = users.filter(u => u.role === 'LIBRARIAN').length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalMembers').textContent = members;
    document.getElementById('totalLibrarians').textContent = librarians;
    
    console.log(`📊 Stats: ${totalUsers} total (${members} members, ${librarians} librarians)`);
}

// 📊 Display users with pagination and elegant styling
function displayUsers(users) {
    filteredUsers = users || [];
    const totalUsers = filteredUsers.length;
    
    // Calculate pagination
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);
    
    const usersContainer = document.getElementById('usersContainer');
    const noUsersDiv = document.getElementById('noUsersFound');
    
    if (currentUsers.length === 0) {
        showNoUsersMessage();
        return;
    }
    
    // Build elegant user list
    let usersHTML = '';
    currentUsers.forEach(user => {
        const roleBadge = user.role === 'LIBRARIAN' 
            ? '<span class="badge bg-gradient-warning text-dark px-3 py-2"><i class="fas fa-user-tie me-1"></i>Librarian</span>'
            : '<span class="badge bg-gradient-primary px-3 py-2"><i class="fas fa-user me-1"></i>Member</span>';
            
        const joinDate = user.createdAt 
            ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })
            : 'N/A';
        
        usersHTML += `
            <div class="col-12 mb-3">
                <div class="card user-card shadow-sm border-0 h-100">
                    <div class="card-body p-4">
                        <div class="row align-items-center">
                            <!-- User Avatar & Basic Info -->
                            <div class="col-md-4 col-lg-3">
                                <div class="d-flex align-items-center">
                                    <div class="user-avatar me-3">
                                        <div class="avatar-circle bg-gradient-primary">
                                            <i class="fas fa-user text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 class="mb-1 fw-bold text-dark">${user.fullName}</h5>
                                        <p class="text-muted mb-1 small">@${user.username}</p>
                                        <div class="mb-2">${roleBadge}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Contact Information -->
                            <div class="col-md-4 col-lg-4">
                                <div class="user-info">
                                    <div class="info-item mb-2">
                                        <i class="fas fa-envelope text-primary me-2"></i>
                                        <span class="small">${user.email}</span>
                                    </div>
                                    <div class="info-item mb-2">
                                        <i class="fas fa-phone text-success me-2"></i>
                                        <span class="small">${user.phoneNumber || 'Not provided'}</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-calendar-alt text-info me-2"></i>
                                        <span class="small">Joined ${joinDate}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Stats & Actions -->
                            <div class="col-md-4 col-lg-5">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="user-stats">
                                        <div class="stat-item">
                                            <span class="badge bg-light text-dark border px-3 py-2" id="userBooks${user.id}">
                                                <i class="fas fa-spinner fa-spin me-1"></i>Loading...
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div class="user-actions">
                                        <div class="btn-group shadow-sm" role="group">
                                            <button class="btn btn-outline-primary btn-sm px-3" onclick="editUser(${user.id})" title="Edit User">
                                                <i class="fas fa-edit me-1"></i>Edit
                                            </button>
                                            <button class="btn btn-outline-warning btn-sm px-3" onclick="changeUserRole(${user.id})" title="Change Role">
                                                <i class="fas fa-user-cog me-1"></i>Role
                                            </button>
                                            <button class="btn btn-outline-danger btn-sm px-3" onclick="deleteUser(${user.id})" title="Delete User">
                                                <i class="fas fa-trash me-1"></i>Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    usersContainer.innerHTML = usersHTML;
    usersContainer.style.display = 'block';
    noUsersDiv.style.display = 'none';
    
    // Update pagination controls
    updatePaginationControls(totalPages);
    
    // Update users count display
    updateUsersCount();
    
    // Load active books for each user
    loadUserActiveBooks(currentUsers);
    
    console.log(`👥 Displaying ${currentUsers.length} users (Page ${currentPage}/${totalPages})`);
}

// 📄 Update pagination controls
function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<nav><ul class="pagination justify-content-center">';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </a>
        </li>
    `;
    
    // Page numbers (show max 5 pages)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
}

// 📄 Change page
function changePage(page) {
    if (page < 1 || page > Math.ceil(filteredUsers.length / usersPerPage)) {
        return;
    }
    currentPage = page;
    displayUsers(filteredUsers);
}

// 📄 Change users per page
function changeUsersPerPage() {
    const newUsersPerPage = parseInt(document.getElementById('usersPerPageSelect').value);
    usersPerPage = newUsersPerPage;
    currentPage = 1; // Reset to first page
    displayUsers(filteredUsers);
    console.log(`📄 Changed to ${usersPerPage} users per page`);
}

// 📊 Update users count display
function updateUsersCount() {
    const totalUsers = filteredUsers.length;
    const startIndex = (currentPage - 1) * usersPerPage + 1;
    const endIndex = Math.min(currentPage * usersPerPage, totalUsers);
    
    const countDisplay = document.getElementById('usersCount');
    if (countDisplay) {
        if (totalUsers === 0) {
            countDisplay.textContent = 'No users found';
        } else {
            countDisplay.textContent = `Showing ${startIndex}-${endIndex} of ${totalUsers} users`;
        }
    }
}

// 📚 Load active books count for each user
async function loadUserActiveBooks(users) {
    for (const user of users) {
        try {
            // Get transactions for this user
            const transactions = await apiCall(`/transactions/user/${user.id}`);
            
            if (transactions && Array.isArray(transactions)) {
                const activeBooks = transactions.filter(t => 
                    t.status === 'BORROWED' || t.returnDate === null
                ).length;
                
                const badgeElement = document.getElementById(`userBooks${user.id}`);
                if (badgeElement) {
                    if (activeBooks > 0) {
                        badgeElement.innerHTML = `<i class="fas fa-book me-1"></i>${activeBooks} Active Books`;
                        badgeElement.className = 'badge bg-success text-white px-3 py-2';
                    } else {
                        badgeElement.innerHTML = `<i class="fas fa-book me-1"></i>No Active Books`;
                        badgeElement.className = 'badge bg-light text-muted border px-3 py-2';
                    }
                }
            }
        } catch (error) {
            console.log(`⚠️ Could not load books for user ${user.id}:`, error.message);
            const badgeElement = document.getElementById(`userBooks${user.id}`);
            if (badgeElement) {
                badgeElement.innerHTML = `<i class="fas fa-question me-1"></i>Unknown`;
                badgeElement.className = 'badge bg-secondary text-white px-3 py-2';
            }
        }
    }
}

// 🔍 Filter users based on search and filters
function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = allUsers.filter(user => {
        const matchesSearch = !searchTerm || 
            user.fullName.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm);
            
        const matchesRole = !roleFilter || user.role === roleFilter;
        
        // For status filter, we'd need to implement active books logic
        const matchesStatus = !statusFilter || true; // Simplified for now
            
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    // Reset to first page when filtering
    currentPage = 1;
    
    displayUsers(filtered);
    updateUserStats(filtered);
    console.log(`🔍 Filtered ${filtered.length} users from ${allUsers.length} total`);
}

// 🚫 Show no users message
function showNoUsersMessage() {
    document.getElementById('usersContainer').style.display = 'none';
    document.getElementById('noUsersFound').style.display = 'block';
    document.getElementById('paginationContainer').innerHTML = '';
    
    const countDisplay = document.getElementById('usersCount');
    if (countDisplay) {
        countDisplay.textContent = 'No users found';
    }
}

// 👤 Show user profile (same as other pages)
function showProfile() {
    const user = getUser();
    if (user) {
        alert(`👤 Profile Info:\n\nName: ${user.fullName}\nUsername: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}`);
    }
}

// ✏️ Edit user function - REAL IMPLEMENTATION
async function editUser(userId) {
    if (!isLibrarian()) {
        alert("🚫 Only librarians can edit users!");
        return;
    }
    
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        alert("❌ User not found!");
        return;
    }
    
    // Pre-fill the edit form
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserFullName').value = user.fullName;
    document.getElementById('editUserUsername').value = user.username;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserPhone').value = user.phoneNumber || '';
    document.getElementById('editUserRole').value = user.role;
    
    hideError('editUserError');
    
    // Show edit modal
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

// 💾 Save user changes
async function saveUserChanges() {
    hideError('editUserError');
    
    const id = document.getElementById('editUserId').value;
    const fullName = document.getElementById('editUserFullName').value.trim();
    const username = document.getElementById('editUserUsername').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const phone = document.getElementById('editUserPhone').value.trim();
    const role = document.getElementById('editUserRole').value;
    
    if (!fullName || !username || !email || !role) {
        showError('editUserError', 'Please fill in all required fields!');
        return;
    }
    
    const userData = {
        fullName: fullName,
        username: username,
        email: email,
        phoneNumber: phone || null,
        role: role
    };
    
    try {
        console.log("✏️ Updating user:", userData);
        const updatedUser = await apiCall(`/users/${id}`, 'PUT', userData);
        
        if (updatedUser) {
            console.log("✅ User updated successfully:", updatedUser);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
            
            // Reload users
            await loadUsers();
            
            alert(`✅ User "${fullName}" updated successfully!`);
        }
        
    } catch (error) {
        console.error("❌ Error updating user:", error);
        showError('editUserError', error.message || 'Failed to update user');
    }
}

// 🔄 Change user role quickly
async function changeUserRole(userId) {
    if (!isLibrarian()) {
        alert("🚫 Only librarians can change user roles!");
        return;
    }
    
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        alert("❌ User not found!");
        return;
    }
    
    const currentRole = user.role;
    const newRole = currentRole === 'MEMBER' ? 'LIBRARIAN' : 'MEMBER';
    
    const confirmChange = confirm(
        `🔄 Change user role?\n\n` +
        `User: ${user.fullName}\n` +
        `From: ${currentRole}\n` +
        `To: ${newRole}\n\n` +
        `This will change their access permissions!`
    );
    
    if (!confirmChange) return;
    
    try {
        console.log("🔄 Changing user role:", { userId, newRole });
        
        const response = await fetch(`${API_BASE_URL}/users/${userId}/role?role=${newRole}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }
        
        const updatedUser = await response.json();
        
        console.log("✅ User role changed successfully:", updatedUser);
        
        // Reload users
        await loadUsers();
        
        alert(`✅ User role changed successfully!\n\n${user.fullName} is now a ${newRole}`);
        
    } catch (error) {
        console.error("❌ Error changing user role:", error);
        alert(`❌ Failed to change user role: ${error.message}`);
    }
}

// 🗑️ Delete user (optional - be very careful!)
async function deleteUser(userId) {
    if (!isLibrarian()) {
        alert("🚫 Only librarians can delete users!");
        return;
    }
    
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        alert("❌ User not found!");
        return;
    }
    
    // Multiple confirmations for safety
    const firstConfirm = confirm(
        `⚠️ DELETE USER WARNING!\n\n` +
        `User: ${user.fullName} (${user.username})\n` +
        `Role: ${user.role}\n\n` +
        `This will PERMANENTLY delete the user and all their data!\n` +
        `Are you sure you want to continue?`
    );
    
    if (!firstConfirm) return;
    
    const finalConfirm = confirm(
        `🚨 FINAL WARNING!\n\n` +
        `This action CANNOT be undone!\n` +
        `Type the username in the next dialog to confirm deletion.`
    );
    
    if (!finalConfirm) return;
    
    const typedUsername = prompt(`Please type "${user.username}" to confirm deletion:`);
    if (typedUsername !== user.username) {
        alert("❌ Username doesn't match. Deletion cancelled for safety.");
        return;
    }
    
    try {
        console.log("🗑️ Deleting user:", userId);
        
        await apiCall(`/users/${userId}`, 'DELETE');
        
        console.log("✅ User deleted successfully");
        
        // Reload users
        await loadUsers();
        
        alert(`✅ User "${user.fullName}" deleted successfully.`);
        
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        alert(`❌ Failed to delete user: ${error.message}`);
    }
}

// 🎯 Demo function to show pagination scaling
function showPaginationDemo() {
    const currentTotal = allUsers.length;
    const scenarios = [
        { users: 50, pages: Math.ceil(50 / usersPerPage) },
        { users: 100, pages: Math.ceil(100 / usersPerPage) },
        { users: 500, pages: Math.ceil(500 / usersPerPage) }
    ];
    
    let demoText = `📊 Pagination Scaling Demo:\n\n`;
    demoText += `Current: ${currentTotal} users = ${Math.ceil(currentTotal / usersPerPage)} pages\n\n`;
    demoText += `With ${usersPerPage} users per page:\n`;
    
    scenarios.forEach(scenario => {
        demoText += `• ${scenario.users} users → ${scenario.pages} pages\n`;
    });
    
    demoText += `\n✨ The pagination automatically adjusts!\n`;
    demoText += `Try changing "users per page" to see different layouts.`;
    
    alert(demoText);
}

console.log("✅ Users page functions ready!");
console.log(`📄 Current pagination: ${usersPerPage} users per page`);