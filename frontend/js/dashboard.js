// 📊 Dashboard Functions - Your library command center!
console.log("📊 Dashboard loading...");

// 🔒 Make sure user is logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔒 Checking authentication...");
    checkAuth(); // This will redirect to login if not authenticated
    loadDashboard();
});

// 📊 Load dashboard data
async function loadDashboard() {
    console.log("📊 Loading dashboard data...");
    
    // Show user info
    displayUserInfo();
    
    // Load statistics - UNIFIED APPROACH
    await loadDashboardData();
    
    // Show/hide elements based on user role
    setupRoleBasedUI();
}

// 👤 Display user information
function displayUserInfo() {
    const user = getUser();
    if (user) {
        document.getElementById('userName').textContent = user.fullName;
        
        // Check if these elements exist before updating
        const welcomeElement = document.getElementById('welcomeUserName');
        if (welcomeElement) {
            welcomeElement.textContent = user.fullName;
        }
        
        const roleElement = document.getElementById('userRole');
        if (roleElement) {
            roleElement.textContent = user.role;
        }
        
        console.log(`👤 Welcome ${user.fullName}! Role: ${user.role}`);
    }
}

// 🎭 Setup UI based on user role
function setupRoleBasedUI() {
    const user = getUser();
    
    if (user && user.role === 'MEMBER') {
        // Hide librarian-only elements for members
        const librarianElements = [
            'usersNavItem',
            'totalUsersCard', 
            'addBookBtn',
            'overdueCard'
        ];
        
        librarianElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        console.log("👤 Member UI configured");
    } else {
        console.log("👩‍🏫 Librarian UI configured");
    }
}

// 🔄 Navigation functions
function showDashboard() {
    console.log("🏠 Showing dashboard");
    // We're already on dashboard
}

function showBooks() {
    console.log("📚 Navigating to books page");
    window.location.href = 'books.html';
}

function showUsers() {
    console.log("👥 Navigating to users page");
    if (!isLibrarian()) {
        alert("🚫 Access denied! Only librarians can view users.");
        return;
    }
    window.location.href = 'users.html';
}

function showTransactions() {
    console.log("📊 Navigating to transactions page");
    window.location.href = 'transactions.html';
}

function showProfile() {
    console.log("👤 Showing profile");
    const user = getUser();
    if (user) {
        alert(`👤 Profile Info:\n\nName: ${user.fullName}\nUsername: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}`);
    }
}

// 📚 Show add book modal
function showAddBookModal() {
    if (!isLibrarian()) {
        alert("🚫 Only librarians can add books!");
        return;
    }
    
    // Clear form
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookCategory').value = '';
    document.getElementById('bookISBN').value = '';
    document.getElementById('bookYear').value = '2024';
    document.getElementById('bookCopies').value = '1';
    
    hideError('addBookError');
    
    const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    modal.show();
}

// 📚 Add new book
async function addNewBook() {
    hideError('addBookError');
    
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const category = document.getElementById('bookCategory').value;
    const isbn = document.getElementById('bookISBN').value.trim();
    const year = parseInt(document.getElementById('bookYear').value);
    const copies = parseInt(document.getElementById('bookCopies').value);
    
    if (!title || !author || !category || !copies) {
        showError('addBookError', 'Please fill in all required fields!');
        return;
    }
    
    const bookData = {
        title: title,
        author: author,
        category: category,
        isbn: isbn || null,
        publicationYear: year || 2024,
        totalCopies: copies,
        availableCopies: copies
    };
    
    try {
        console.log("📚 Adding new book:", bookData);
        const newBook = await apiCall('/books', 'POST', bookData);
        
        if (newBook) {
            console.log("✅ Book added successfully:", newBook);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
            modal.hide();
            
            // Refresh dashboard stats
            await loadDashboardData();
            
            alert(`✅ Book "${title}" added successfully!`);
        }
        
    } catch (error) {
        console.error("❌ Error adding book:", error);
        showError('addBookError', error.message || 'Failed to add book');
    }
}

// 📊 Load dashboard data - MAIN FUNCTION
async function loadDashboardData() {
    console.log("📊 Loading dashboard data...");
    
    try {
        // Load all data
        const [books, users, transactions] = await Promise.all([
            apiCall('/books').catch(e => { console.warn("Books error:", e); return []; }),
            apiCall('/users').catch(e => { console.warn("Users error:", e); return []; }),
            apiCall('/transactions').catch(e => { console.warn("Transactions error:", e); return []; })
        ]);
        
        // Update statistics
        updateDashboardStats(books, users, transactions);
        
        // Load recent activity
        loadRecentActivity();
        
        console.log("✅ Dashboard data loaded successfully");
        
    } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
        // Don't show error to user, just log it
        console.warn("Dashboard will show default values");
    }
}

// 📊 Update dashboard statistics
function updateDashboardStats(books, users, transactions) {
    console.log("📊 Updating dashboard stats...");
    
    try {
        // Books statistics
        const totalBooks = books.length;
        
        // Users statistics
        const totalUsers = users.length;
        
        // Transactions statistics - Active loans = not returned
        const activeLoans = transactions.filter(t => !t.returnDate).length;
        
        // Calculate overdue books
        const today = new Date();
        const overdueBooks = transactions.filter(t => {
            if (t.returnDate) return false; // Already returned
            if (!t.dueDate) return false; // No due date
            
            const dueDate = new Date(t.dueDate);
            return dueDate < today;
        }).length;
        
        // Update DOM elements - MATCHING YOUR HTML IDs
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                console.log(`✅ Updated ${id}: ${value}`);
            } else {
                console.warn(`❌ Element with id '${id}' not found`);
            }
        };
        
        // Update stats using YOUR HTML IDs
        updateElement('totalBooks', totalBooks);
        updateElement('totalUsers', totalUsers);
        updateElement('activeLoans', activeLoans);
        updateElement('overdueBooks', overdueBooks);
        
        console.log(`✅ Stats updated: ${totalBooks} books, ${totalUsers} users, ${activeLoans} active loans, ${overdueBooks} overdue`);
        
    } catch (error) {
        console.error("❌ Error updating dashboard stats:", error);
    }
}

// 📊 Load recent activity - FIXED TO USE YOUR API FIELDS
async function loadRecentActivity() {
    console.log("📊 Loading recent activity...");
    
    try {
        // Get recent transactions
        const transactions = await apiCall('/transactions');
        
        console.log("🔍 ALL TRANSACTIONS:", transactions); // Debug
        console.log("🔍 Transaction count:", transactions?.length || 0); // Debug
        
        if (transactions && transactions.length > 0) {
            console.log("🔍 First transaction structure:", transactions[0]); // Debug
            
            // Sort by transactionDate (not borrowDate!) and take last 10
            const recentTransactions = transactions
                .filter(t => {
                    console.log("🔍 Checking transaction:", t.id, "Date:", t.transactionDate); // Debug
                    return t.transactionDate; // Use transactionDate field
                })
                .sort((a, b) => {
                    try {
                        const dateA = new Date(a.transactionDate); // Use transactionDate
                        const dateB = new Date(b.transactionDate); // Use transactionDate
                        return dateB - dateA; // Newest first
                    } catch (error) {
                        console.error("Error sorting dates:", error);
                        return 0;
                    }
                })
                .slice(0, 10);
            
            console.log("🔍 Filtered recent transactions:", recentTransactions); // Debug
            
            if (recentTransactions.length > 0) {
                displayRecentActivity(recentTransactions);
            } else {
                showNoRecentActivity("No recent transactions found");
            }
        } else {
            showNoRecentActivity("No transactions in database");
        }
        
    } catch (error) {
        console.error("❌ Error loading recent activity:", error);
        showNoRecentActivity("Error loading transactions");
    } finally {
        // Hide loading spinner
        const loadingElement = document.getElementById('recentActivityLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// 📊 Display recent activity - FULL WIDTH LAYOUT
function displayRecentActivity(transactions) {
    const container = document.getElementById('recentActivityList');
    if (!container) return;
    
    let activityHTML = '';
    
    // Create a table-like structure for better full-width utilization
    activityHTML += `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th scope="col" width="5%">Status</th>
                        <th scope="col" width="30%">Book</th>
                        <th scope="col" width="20%">User</th>
                        <th scope="col" width="15%">Action</th>
                        <th scope="col" width="15%">Date</th>
                        <th scope="col" width="15%">Time</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    transactions.forEach(transaction => {
        console.log("📊 Processing transaction:", transaction); // Debug log
        
        // Parse transactionDate (not borrowDate!)
        let transactionDate = 'Unknown Date';
        let transactionTime = '';
        
        if (transaction.transactionDate) {
            try {
                const dateObj = new Date(transaction.transactionDate);
                
                // Check if date is valid
                if (!isNaN(dateObj.getTime())) {
                    transactionDate = dateObj.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    });
                    transactionTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                } else {
                    console.warn("Invalid date for transaction:", transaction);
                    transactionDate = 'Invalid Date';
                }
                
            } catch (error) {
                console.error("Error parsing date:", error, transaction.transactionDate);
                transactionDate = 'Date Error';
            }
        }
        
        // Status based on return status (more accurate than transactionType)
        let statusIcon, statusText, statusClass, badgeClass;
        
        if (transaction.returnDate) {
            statusIcon = '✅';
            statusText = 'Returned';
            statusClass = 'text-success';
            badgeClass = 'bg-success';
        } else {
            // Check if overdue
            if (transaction.dueDate && new Date(transaction.dueDate) < new Date()) {
                statusIcon = '⚠️';
                statusText = 'Overdue';
                statusClass = 'text-danger';
                badgeClass = 'bg-danger';
            } else {
                statusIcon = '📚';
                statusText = 'Active';
                statusClass = 'text-primary';
                badgeClass = 'bg-primary';
            }
        }
        
        // Build activity row
        activityHTML += `
            <tr>
                <td class="text-center">
                    <span class="fs-5">${statusIcon}</span>
                </td>
                <td>
                    <div class="fw-bold text-dark">${transaction.book?.title || 'Unknown Book'}</div>
                    <small class="text-muted">by ${transaction.book?.author || 'Unknown Author'}</small>
                </td>
                <td>
                    <div class="fw-semibold">${transaction.user?.fullName || 'Unknown User'}</div>
                    <small class="text-muted">@${transaction.user?.username || 'unknown'}</small>
                </td>
                <td>
                    <span class="badge ${badgeClass} px-2 py-1">${statusText}</span>
                </td>
                <td>
                    <span class="text-dark fw-semibold">${transactionDate}</span>
                </td>
                <td>
                    <span class="text-muted">${transactionTime}</span>
                </td>
            </tr>
        `;
    });
    
    activityHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    // Add a footer with total count
    activityHTML += `
        <div class="mt-3 d-flex justify-content-between align-items-center bg-light p-3 rounded">
            <div>
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    Showing last ${transactions.length} activities
                </small>
            </div>
            <div>
                <a href="transactions.html" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-eye me-1"></i>View All Transactions
                </a>
            </div>
        </div>
    `;
    
    container.innerHTML = activityHTML;
    
    // Show the activity section
    const activitySection = document.getElementById('recentActivitySection');
    if (activitySection) {
        activitySection.style.display = 'block';
    }
    
    console.log(`✅ Displayed ${transactions.length} recent activities in full-width table`);
}

// 🚫 Show no recent activity - WITH MESSAGE
function showNoRecentActivity(message = "No Recent Activity") {
    const container = document.getElementById('recentActivityList');
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-4">
            <i class="fas fa-history fa-3x text-muted mb-3"></i>
            <h6 class="text-muted">${message}</h6>
            <p class="text-muted small">
                ${message.includes('Error') ? 'Please try again later' : 'Borrow some books to see activity here'}
            </p>
        </div>
    `;
    
    const activitySection = document.getElementById('recentActivitySection');
    if (activitySection) {
        activitySection.style.display = 'block';
    }
}

// Add this temporary function for debugging (remove later):

// 🔍 Debug function - check transaction date format
function debugTransactionDates() {
    apiCall('/transactions').then(transactions => {
        if (transactions && transactions.length > 0) {
            console.log("🔍 DEBUGGING TRANSACTION DATES:");
            console.log("First transaction:", transactions[0]);
            console.log("Borrow date type:", typeof transactions[0].borrowDate);
            console.log("Borrow date value:", transactions[0].borrowDate);
            
            if (transactions[0].returnDate) {
                console.log("Return date type:", typeof transactions[0].returnDate);
                console.log("Return date value:", transactions[0].returnDate);
            }
        }
    });
}

// Call this in loadDashboard() temporarily:
// debugTransactionDates();

console.log("✅ Dashboard functions ready!");