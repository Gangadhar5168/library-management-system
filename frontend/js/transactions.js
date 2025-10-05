// 📊 Transactions Management - BOTH ROLES SUPPORTED
console.log("📊 Transactions page loading...");

let allTransactions = []; // Store all transactions for filtering
let filteredTransactions = []; // Store filtered transactions for pagination
let allUsers = []; // Store users for dropdowns
let allBooks = []; // Store books for dropdowns
let currentPage = 1;
let transactionsPerPage = 10; // Show 10 transactions per page (list format is more compact)

// 🔒 Check authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔒 Checking authentication...");
    checkAuth();
    displayUserInfo();
    setupRoleBasedUI();
    loadPageData();
});

// 👤 Display user information
function displayUserInfo() {
    const user = getUser();
    if (user) {
        document.getElementById('userName').textContent = user.fullName;
        console.log(`👤 Welcome ${user.fullName}! Role: ${user.role}`);
    }
}

// 🎭 Setup UI based on user role - UPDATED FOR BOTH ROLES
function setupRoleBasedUI() {
    const user = getUser();
    
    if (user && user.role === 'MEMBER') {
        // Members can still borrow books but hide users nav
        const memberRestrictedElements = [
            'usersNavItem' // Only hide users nav for members
        ];
        
        memberRestrictedElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        console.log("👤 Member UI configured - can borrow and return books");
    } else {
        console.log("👩‍🏫 Librarian UI configured - full access");
    }
}

// 📊 Load all page data
async function loadPageData() {
    console.log("📊 Loading page data...");
    
    try {
        const user = getUser();
        
        // Load data based on role
        let transactionsPromise;
        
        if (user.role === 'LIBRARIAN') {
            // Librarians can see all transactions
            transactionsPromise = apiCall('/transactions');
        } else {
            // Members can only see their own transactions
            transactionsPromise = apiCall(`/transactions/user/${user.id}`);
        }
        
        // Load users and books (needed for dropdowns and display)
        const usersPromise = user.role === 'LIBRARIAN' ? apiCall('/users') : Promise.resolve([user]);
        const booksPromise = apiCall('/books');
        
        const [transactions, users, books] = await Promise.all([
            transactionsPromise.catch(e => { console.warn("Transactions error:", e); return []; }),
            usersPromise.catch(e => { console.warn("Users error:", e); return []; }),
            booksPromise.catch(e => { console.warn("Books error:", e); return []; })
        ]);
        
        allTransactions = transactions || [];
        allUsers = users || [];
        allBooks = books || [];
        
        displayTransactions(allTransactions);
        updateTransactionStats(allTransactions);
        populateUserFilters();
        populateBorrowModal();
        
        console.log(`✅ Loaded ${allTransactions.length} transactions, ${allUsers.length} users, ${allBooks.length} books`);
        
    } catch (error) {
        console.error("❌ Error loading page data:", error);
        showError('loadingTransactions', 'Failed to load data: ' + error.message);
    } finally {
        document.getElementById('loadingTransactions').style.display = 'none';
    }
}

// 📊 Update transaction statistics
function updateTransactionStats(transactions) {
    const total = transactions.length;
    const borrowed = transactions.filter(t => !t.returnDate).length;
    const returned = transactions.filter(t => t.returnDate).length;
    
    // Enhanced overdue calculation
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const overdue = transactions.filter(t => {
        if (t.returnDate) return false;
        if (!t.dueDate) return false;
        
        const dueDate = new Date(t.dueDate);
        return dueDate < today;
    }).length;
    
    document.getElementById('totalTransactions').textContent = total;
    document.getElementById('currentlyBorrowed').textContent = borrowed;
    document.getElementById('returnedBooks').textContent = returned;
    document.getElementById('overdueBooks').textContent = overdue;
    
    console.log(`📊 Stats: ${total} total, ${borrowed} borrowed, ${returned} returned, ${overdue} overdue`);
}

// 📊 Display transactions with elegant list and pagination
function displayTransactions(transactions) {
    filteredTransactions = transactions || [];
    const totalTransactions = filteredTransactions.length;
    
    // Calculate pagination
    const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    const transactionsContainer = document.getElementById('transactionsContainer');
    const noTransactionsDiv = document.getElementById('noTransactionsFound');
    
    if (currentTransactions.length === 0) {
        showNoTransactionsMessage();
        return;
    }
    
    const currentUser = getUser();
    
    // Build elegant transaction list items
    let transactionsHTML = '';
    currentTransactions.forEach(transaction => {
        // Debug: Log transaction data to see what fields we're getting
        console.log('Transaction data:', transaction);
        const borrowDate = transaction.transactionDate 
            ? new Date(transaction.transactionDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })
            : 'N/A';
            
        const dueDate = transaction.dueDate 
            ? new Date(transaction.dueDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })
            : 'N/A';
            
        const returnDate = transaction.returnDate 
            ? new Date(transaction.returnDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })
            : null;
        
        // Determine status and styling
        let statusBadge, listItemClass = '';
        let isOverdue = false;
        
        if (transaction.returnDate) {
            statusBadge = '<span class="badge bg-gradient-success px-3 py-2 rounded-pill font-display"><i class="fas fa-check-circle me-2"></i>Completed</span>';
            listItemClass = '';
        } else {
            if (transaction.dueDate && new Date(transaction.dueDate) < new Date()) {
                statusBadge = '<span class="badge bg-gradient-danger px-3 py-2 rounded-pill font-display"><i class="fas fa-exclamation-triangle me-2"></i>Overdue</span>';
                listItemClass = '';
                isOverdue = true;
            } else {
                statusBadge = '<span class="badge bg-gradient-warning px-3 py-2 rounded-pill font-display text-dark"><i class="fas fa-clock me-2"></i>Active</span>';
                listItemClass = '';
            }
        }
        
        // Action buttons - BOTH ROLES can return books
        let actionButtons = '';
        if (!transaction.returnDate) {
            const canReturn = currentUser.role === 'LIBRARIAN' || 
                             (currentUser.role === 'MEMBER' && transaction.user?.id === currentUser.id);
            
            if (canReturn) {
                actionButtons = `
                    <button class="btn bg-gradient-success text-white btn-sm rounded-pill px-3" onclick="returnBook(${transaction.user?.id}, ${transaction.book?.id})" title="Return Book">
                        <i class="fas fa-undo me-2"></i>Return Book
                    </button>
                `;
            } else {
                actionButtons = '<div class="text-center"><small class="text-muted font-body"><i class="fas fa-lock me-1"></i>Restricted</small></div>';
            }
        } else {
            actionButtons = '<div class="text-center"><div class="text-success font-display"><i class="fas fa-check-circle me-2"></i>Completed</div></div>';
        }
        
        // Calculate days info for quick reference
        let daysInfo = '';
        if (!transaction.returnDate && transaction.dueDate) {
            const today = new Date();
            const due = new Date(transaction.dueDate);
            const diffTime = due - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
                daysInfo = `<span class="text-danger fw-bold">${Math.abs(diffDays)} days overdue</span>`;
            } else if (diffDays === 0) {
                daysInfo = `<span class="text-warning fw-bold">Due today</span>`;
            } else if (diffDays <= 3) {
                daysInfo = `<span class="text-warning">Due in ${diffDays} days</span>`;
            } else {
                daysInfo = `<span class="text-muted">Due in ${diffDays} days</span>`;
            }
        }
        
        transactionsHTML += `
            <div class="transaction-card glass-card hover-lift p-4 mb-4 rounded-4 shadow-lg position-relative overflow-hidden">
                <div class="status-indicator position-absolute top-0 end-0 m-3">
                    ${statusBadge}
                </div>
                <div class="row align-items-center">
                    <!-- Transaction ID -->
                    <div class="col-lg-2 col-md-3 col-6 mb-3 mb-lg-0">
                        <div class="transaction-id">
                            <div class="d-flex align-items-center">
                                <div class="transaction-icon me-3">
                                    <div class="icon-circle bg-gradient-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
                                        <i class="fas fa-exchange-alt text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <h6 class="mb-0 font-display">#${transaction.id}</h6>
                                    <small class="text-muted">Transaction</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Book Information -->
                    <div class="col-lg-3 col-md-4 col-6 mb-3 mb-lg-0">
                        <div class="book-info">
                            <div class="d-flex align-items-center">
                                <div class="book-icon me-3">
                                    <div class="icon-circle bg-gradient-success d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
                                        <i class="fas fa-book text-white"></i>
                                    </div>
                                </div>
                                <div class="book-details flex-grow-1">
                                    <h6 class="mb-1 font-display text-dark" title="${transaction.book?.title || 'Unknown Book'}">
                                        ${(transaction.book?.title || 'Unknown Book').length > 25 
                                            ? (transaction.book?.title || 'Unknown Book').substring(0, 25) + '...' 
                                            : (transaction.book?.title || 'Unknown Book')}
                                    </h6>
                                    <small class="text-elegant text-muted">by ${(transaction.book?.author || 'Unknown').length > 20 
                                        ? (transaction.book?.author || 'Unknown').substring(0, 20) + '...' 
                                        : (transaction.book?.author || 'Unknown')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- User Information -->
                    <div class="col-lg-2 col-md-3 col-6 mb-3 mb-lg-0">
                        <div class="user-info">
                            <div class="d-flex align-items-center">
                                <div class="user-icon me-3">
                                    <div class="icon-circle bg-gradient-info d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
                                        <i class="fas fa-user text-white"></i>
                                    </div>
                                </div>
                                <div class="user-details flex-grow-1">
                                    <h6 class="mb-1 font-display text-dark">${(transaction.user?.fullName || 'Unknown').length > 15 
                                        ? (transaction.user?.fullName || 'Unknown').substring(0, 15) + '...' 
                                        : (transaction.user?.fullName || 'Unknown')}</h6>
                                    <small class="text-elegant text-muted">@${transaction.user?.username || 'unknown'}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Dates -->
                    <div class="col-lg-3 col-md-4 col-6 mb-3 mb-lg-0">
                        <div class="dates-section">
                            <div class="date-cards">
                                <div class="mini-card bg-light rounded-3 p-2 mb-2">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="text-muted small font-body">
                                            <i class="fas fa-calendar-plus text-success me-1"></i>Borrowed
                                        </span>
                                        <span class="fw-bold font-display small">${borrowDate}</span>
                                    </div>
                                </div>
                                <div class="mini-card bg-light rounded-3 p-2 mb-2">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="text-muted small font-body">
                                            <i class="fas fa-calendar-times text-warning me-1"></i>Due
                                        </span>
                                        <span class="fw-bold font-display small">${dueDate}</span>
                                    </div>
                                </div>
                                ${returnDate ? `
                                <div class="mini-card bg-success-subtle rounded-3 p-2 mb-2">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="text-success small font-body">
                                            <i class="fas fa-calendar-check text-success me-1"></i>Returned
                                        </span>
                                        <span class="fw-bold font-display small text-success">${returnDate}</span>
                                    </div>
                                </div>
                                ` : ''}
                                ${daysInfo ? `<div class="text-center mt-2 small">${daysInfo}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="col-lg-2 col-md-2 col-12 text-end">
                        <div class="action-section d-flex flex-column align-items-end">
                            <div class="action-buttons mb-2">
                                ${actionButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    transactionsContainer.innerHTML = transactionsHTML;
    transactionsContainer.style.display = 'block';
    noTransactionsDiv.style.display = 'none';
    
    // Update pagination controls
    updateTransactionPagination(totalPages);
    
    // Update transactions count display
    updateTransactionsCount();
    
    console.log(`📊 Displaying ${currentTransactions.length} transactions (Page ${currentPage}/${totalPages})`);
}

// 📄 Update pagination controls for transactions
function updateTransactionPagination(totalPages) {
    const paginationContainer = document.getElementById('transactionPaginationContainer');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<nav><ul class="pagination justify-content-center">';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeTransactionPage(${currentPage - 1})">
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
                <a class="page-link" href="#" onclick="changeTransactionPage(${i})">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeTransactionPage(${currentPage + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
}

// 📄 Change transaction page
function changeTransactionPage(page) {
    if (page < 1 || page > Math.ceil(filteredTransactions.length / transactionsPerPage)) {
        return;
    }
    currentPage = page;
    displayTransactions(filteredTransactions);
}

// 📊 Update transactions count display
function updateTransactionsCount() {
    const totalTransactions = filteredTransactions.length;
    const startIndex = (currentPage - 1) * transactionsPerPage + 1;
    const endIndex = Math.min(currentPage * transactionsPerPage, totalTransactions);
    
    const countDisplay = document.getElementById('transactionsCount');
    if (countDisplay) {
        if (totalTransactions === 0) {
            countDisplay.textContent = 'No transactions found';
        } else {
            countDisplay.textContent = `Showing ${startIndex}-${endIndex} of ${totalTransactions} transactions`;
        }
    }
}

// 📄 Change transactions per page
function changeTransactionsPerPage() {
    const newTransactionsPerPage = parseInt(document.getElementById('transactionsPerPageSelect').value);
    transactionsPerPage = newTransactionsPerPage;
    currentPage = 1; // Reset to first page
    displayTransactions(filteredTransactions);
    console.log(`📄 Changed to ${transactionsPerPage} transactions per page`);
}

// 📝 Show borrow book modal - BOTH ROLES CAN BORROW
function showBorrowBookModal() {
    const user = getUser();
    if (!user) {
        alert("🚫 Please login first!");
        return;
    }
    
    hideError('borrowBookError');
    populateBorrowModal();
    
    const modal = new bootstrap.Modal(document.getElementById('borrowBookModal'));
    modal.show();
    
    console.log(`📚 ${user.role} can borrow books - modal opened`);
}

// 📚 Process book borrow - UPDATED TO MATCH YOUR API
async function processBookBorrow() {
    hideError('borrowBookError');
    
    const user = getUser();
    const bookId = document.getElementById('borrowBook').value;
    
    // For members, use their own ID. For librarians, allow selecting user
    let userId;
    if (user.role === 'MEMBER') {
        userId = user.id;
    } else {
        userId = document.getElementById('borrowUser').value;
    }
    
    if (!userId || !bookId) {
        showError('borrowBookError', 'Please select book and user!');
        return;
    }
    
    try {
        console.log("📚 Processing book borrow:", { userId, bookId });
        
        const response = await fetch(`${API_BASE_URL}/transactions/borrow?userId=${userId}&bookId=${bookId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }
        
        const newTransaction = await response.json();
        
        console.log("✅ Book borrowed successfully:", newTransaction);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('borrowBookModal'));
        modal.hide();
        
        // Reload page data
        await loadPageData();
        
        // Show success message
        const selectedUser = allUsers.find(u => u.id == userId);
        const selectedBook = allBooks.find(b => b.id == bookId);
        
        alert(`✅ Book borrowed successfully!\n\nUser: ${selectedUser?.fullName}\nBook: ${selectedBook?.title}\nTransaction ID: ${newTransaction.id}`);
        
    } catch (error) {
        console.error("❌ Error borrowing book:", error);
        showError('borrowBookError', error.message || 'Failed to borrow book');
    }
}

// 🔄 Return book - BOTH ROLES CAN RETURN (updated to match your API)
async function returnBook(userId, bookId) {
    const currentUser = getUser();
    
    // Check if user can return this book
    if (currentUser.role === 'MEMBER' && userId !== currentUser.id) {
        alert("🚫 You can only return your own books!");
        return;
    }
    
    const confirmReturn = confirm("📚 Process book return?");
    if (!confirmReturn) return;
    
    try {
        console.log("🔄 Processing book return:", { userId, bookId });
        
        const response = await fetch(`${API_BASE_URL}/transactions/return?userId=${userId}&bookId=${bookId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }
        
        const updatedTransaction = await response.json();
        
        console.log("✅ Book returned successfully:", updatedTransaction);
        
        // Reload page data
        await loadPageData();
        
        alert(`✅ Book returned successfully!`);
        
    } catch (error) {
        console.error("❌ Error returning book:", error);
        alert(`❌ Failed to return book: ${error.message}`);
    }
}

// 📝 Populate user filters and borrow modal - ROLE-BASED
function populateUserFilters() {
    const user = getUser();
    const userFilter = document.getElementById('userFilter');
    const borrowUserSelect = document.getElementById('borrowUser');
    
    // Clear existing options
    userFilter.innerHTML = '<option value="">All Users</option>';
    
    if (borrowUserSelect) {
        borrowUserSelect.innerHTML = '<option value="">Choose a user...</option>';
    }
    
    // For members, hide the user selection in borrow modal
    if (user.role === 'MEMBER' && borrowUserSelect) {
        borrowUserSelect.closest('.mb-3').style.display = 'none';
    }
    
    // Add user options (librarians see all users, members see only themselves)
    const usersToShow = user.role === 'LIBRARIAN' ? allUsers : [user];
    
    usersToShow.forEach(u => {
        const option1 = new Option(`${u.fullName} (${u.username})`, u.id);
        userFilter.appendChild(option1);
        
        if (borrowUserSelect && user.role === 'LIBRARIAN') {
            const option2 = new Option(`${u.fullName} (${u.username})`, u.id);
            borrowUserSelect.appendChild(option2);
        }
    });
}

// 📚 Populate borrow modal with available books
function populateBorrowModal() {
    const borrowBookSelect = document.getElementById('borrowBook');
    if (!borrowBookSelect) return;
    
    borrowBookSelect.innerHTML = '<option value="">Choose an available book...</option>';
    
    const availableBooks = allBooks.filter(book => book.availableCopies > 0);
    availableBooks.forEach(book => {
        const option = new Option(
            `${book.title} by ${book.author} (${book.availableCopies} available)`, 
            book.id
        );
        borrowBookSelect.appendChild(option);
    });
}

// 🔍 Filter transactions
function filterTransactions() {
    const searchTerm = document.getElementById('searchTransactions').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const userFilter = document.getElementById('userFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filtered = allTransactions.filter(transaction => {
        const matchesSearch = !searchTerm || 
            (transaction.book?.title && transaction.book.title.toLowerCase().includes(searchTerm)) ||
            (transaction.user?.fullName && transaction.user.fullName.toLowerCase().includes(searchTerm)) ||
            (transaction.user?.username && transaction.user.username.toLowerCase().includes(searchTerm));
        
        let matchesStatus = true;
        if (statusFilter === 'BORROWED') {
            matchesStatus = !transaction.returnDate;
        } else if (statusFilter === 'RETURNED') {
            matchesStatus = !!transaction.returnDate;
        } else if (statusFilter === 'OVERDUE') {
            matchesStatus = !transaction.returnDate && 
                          transaction.dueDate && 
                          new Date(transaction.dueDate) < new Date();
        }
        
        const matchesUser = !userFilter || 
                           (transaction.user && transaction.user.id.toString() === userFilter);
        
        let matchesDate = true;
        if (dateFilter && transaction.transactionDate) {
            const borrowDate = new Date(transaction.transactionDate);
            const today = new Date();
            
            if (dateFilter === 'today') {
                matchesDate = borrowDate.toDateString() === today.toDateString();
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = borrowDate >= weekAgo;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesDate = borrowDate >= monthAgo;
            }
        }
        
        return matchesSearch && matchesStatus && matchesUser && matchesDate;
    });
    
    // Reset to first page when filtering
    currentPage = 1;
    
    displayTransactions(filtered);
    updateTransactionStats(filtered);
    console.log(`🔍 Filtered ${filtered.length} transactions from ${allTransactions.length} total`);
}

// 🚫 Show no transactions message
function showNoTransactionsMessage() {
    document.getElementById('transactionsContainer').style.display = 'none';
    document.getElementById('noTransactionsFound').style.display = 'block';
    document.getElementById('transactionPaginationContainer').innerHTML = '';
    
    const countDisplay = document.getElementById('transactionsCount');
    if (countDisplay) {
        countDisplay.textContent = 'No transactions found';
    }
}

// 👤 Show user profile
function showProfile() {
    const user = getUser();
    if (user) {
        alert(`👤 Profile Info:\n\nName: ${user.fullName}\nUsername: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}`);
    }
}

console.log("✅ Transactions page functions ready - BOTH ROLES SUPPORTED!");