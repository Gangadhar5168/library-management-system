// 📚 Books Management Functions
console.log("📚 Books page loading...");

let allBooks = []; // Store all books for filtering

let currentPage = 1;
let itemsPerPage = 9; // 3 rows x 3 columns = 9 books per page (perfect!)
let totalBooks = 0;
let allBooksData = []; // Store all books for pagination

// 🔒 Check authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔒 Checking authentication...");
    checkAuth();
    displayUserInfo();
    setupRoleBasedUI();
    loadBooks();
});

// 👤 Display user information
function displayUserInfo() {
    const user = getUser();
    if (user) {
        document.getElementById('userName').textContent = user.fullName;
        console.log(`👤 Welcome ${user.fullName}!`);
    }
}

// 🎭 Setup UI based on user role
function setupRoleBasedUI() {
    const user = getUser();
    
    if (user && user.role === 'MEMBER') {
        // Hide librarian-only elements for members
        const librarianElements = [
            'usersNavItem',
            'addBookSection'
        ];
        
        librarianElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        console.log("👤 Member UI configured - limited access");
    } else {
        console.log("👩‍🏫 Librarian UI configured - full access");
    }
}

// 📚 Load all books from API
async function loadBooks() {
    console.log("📚 Loading books from API...");
    
    try {
        const books = await apiCall('/books');
        
        if (books && Array.isArray(books)) {
            allBooks = books;
            displayBooks(books);
            console.log(`✅ Loaded ${books.length} books`);
        } else {
            console.log("📚 No books found or invalid response");
            showNoBooksMessage();
        }
        
    } catch (error) {
        console.error("❌ Error loading books:", error);
        showError('loadingBooks', 'Failed to load books: ' + error.message);
    } finally {
        // Hide loading spinner
        document.getElementById('loadingBooks').style.display = 'none';
    }
}

// 📊 Display books in proper Bootstrap grid
function displayBooks(books) {
    allBooksData = books || [];
    totalBooks = allBooksData.length;
    
    // Calculate pagination
    const totalPages = Math.ceil(totalBooks / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = allBooksData.slice(startIndex, endIndex);
    
    const booksContainer = document.getElementById('booksContainer');
    const noBooksDiv = document.getElementById('noBooksFound');
    
    if (currentBooks.length === 0) {
        showNoBooksMessage();
        return;
    }
    
    let booksHTML = '';
    currentBooks.forEach(book => {
        const availabilityBadge = book.availableCopies > 0 
            ? `<span class="badge bg-success">✅ ${book.availableCopies} Available</span>`
            : `<span class="badge bg-danger">❌ Not Available</span>`;
        
        const actionButtons = getActionButtons(book);
        
        // Use proper Bootstrap columns - 3 per row on desktop with better sizing
        booksHTML += `
            <div class="col-lg-4 col-md-6 col-12 mb-4">
                <div class="card h-100 shadow-sm book-card" style="min-height: 280px;">
                    <div class="card-body p-4">
                        <!-- Header with title and availability -->
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title mb-0 fw-bold" title="${book.title}" style="flex: 1; min-width: 0; font-size: 1.1rem;">
                                📖 ${book.title.length > 30 ? book.title.substring(0, 30) + '...' : book.title}
                            </h5>
                            <div style="flex-shrink: 0; margin-left: 10px;">
                                ${availabilityBadge}
                            </div>
                        </div>
                        
                        <!-- Author -->
                        <p class="text-muted mb-3" style="font-size: 0.95rem;">
                            <i class="fas fa-user me-2"></i> ${book.author}
                        </p>
                        
                        <!-- Category and Year -->
                        <div class="d-flex justify-content-between mb-3" style="font-size: 0.9rem;">
                            <span class="text-muted">
                                <i class="fas fa-tag me-1"></i> ${book.category}
                            </span>
                            <span class="text-muted">
                                📅 ${book.publicationYear || 'N/A'}
                            </span>
                        </div>
                        
                        <!-- Copies info -->
                        <div class="d-flex justify-content-between align-items-center mb-3" style="font-size: 0.9rem;">
                            <span class="text-muted">Total: ${book.totalCopies}</span>
                            <span class="fw-bold ${book.availableCopies > 0 ? 'text-success' : 'text-danger'}">
                                Available: ${book.availableCopies}
                            </span>
                        </div>
                        
                        <!-- ISBN if available -->
                        ${book.isbn ? `<div class="text-muted mb-3" style="font-size: 0.85rem;" title="${book.isbn}">ISBN: ${book.isbn.length > 18 ? book.isbn.substring(0, 18) + '...' : book.isbn}</div>` : ''}
                        
                        <!-- Action buttons -->
                        <div class="mt-auto">
                            ${actionButtons}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    booksContainer.innerHTML = booksHTML;
    booksContainer.className = 'row g-4'; // Reset to proper Bootstrap row with more spacing
    booksContainer.style.display = 'flex'; // Use flexbox, not grid
    noBooksDiv.style.display = 'none';
    
    // Update pagination controls
    updatePaginationControls(totalPages);
    
    // Update books count
    updateBooksCount();
    
    console.log(`📚 Displaying ${currentBooks.length} books (Page ${currentPage}/${totalPages})`);
}

// Add pagination controls function:
function updatePaginationControls(totalPages) {
    let paginationHTML = '';
    
    if (totalPages > 1) {
        paginationHTML = `
            <nav aria-label="Books pagination" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <button class="page-link" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
                    </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <button class="page-link" onclick="goToPage(${i})">${i}</button>
                    </li>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        paginationHTML += `
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <button class="page-link" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </li>
                </ul>
                <div class="text-center mt-2">
                    <small class="text-muted">
                        Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, totalBooks)} of ${totalBooks} books
                    </small>
                </div>
            </nav>
        `;
    }
    
    // Add pagination container if it doesn't exist
    let paginationContainer = document.getElementById('booksPagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'booksPagination';
        document.getElementById('booksContainer').parentNode.appendChild(paginationContainer);
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Add pagination functions:
function goToPage(page) {
    currentPage = page;
    displayBooks(allBooksData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changeItemsPerPage(newItemsPerPage) {
    itemsPerPage = newItemsPerPage;
    currentPage = 1;
    displayBooks(allBooksData);
}

// 🔍 Filter books based on search and filters
function filterBooks() {
    const searchTerm = document.getElementById('searchBooks').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredBooks = allBooks.filter(book => {
        const matchesSearch = !searchTerm || 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            (book.isbn && book.isbn.toLowerCase().includes(searchTerm));
            
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        
        const matchesStatus = !statusFilter || 
            (statusFilter === 'available' && book.availableCopies > 0) ||
            (statusFilter === 'borrowed' && book.availableCopies === 0);
            
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    displayBooks(filteredBooks);
    console.log(`🔍 Filtered ${filteredBooks.length} books from ${allBooks.length} total`);
}

// 📝 Show add book modal
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
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    modal.show();
}

// ➕ Add new book
async function addBook() {
    hideError('addBookError');
    
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const category = document.getElementById('bookCategory').value;
    const isbn = document.getElementById('bookISBN').value.trim();
    const year = parseInt(document.getElementById('bookYear').value);
    const copies = parseInt(document.getElementById('bookCopies').value);
    
    // Validation
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
        console.log("➕ Adding new book:", bookData);
        const newBook = await apiCall('/books', 'POST', bookData);
        
        if (newBook) {
            console.log("✅ Book added successfully:", newBook);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
            modal.hide();
            
            // Reload books
            await loadBooks();
            
            alert(`✅ Book "${title}" added successfully!`);
        }
        
    } catch (error) {
        console.error("❌ Error adding book:", error);
        showError('addBookError', error.message || 'Failed to add book');
    }
}

// 📊 Update books count display
function updateBooksCount() {
    const totalCount = document.getElementById('totalBooksCount');
    if (totalCount) {
        totalCount.textContent = `Total: ${totalBooks} books`;
    }
}

// 🚫 Show no books message
function showNoBooksMessage() {
    const booksContainer = document.getElementById('booksContainer');
    const noBooksDiv = document.getElementById('noBooksFound');
    
    booksContainer.style.display = 'none';
    if (noBooksDiv) {
        noBooksDiv.style.display = 'block';
    }
}

// 👤 Show user profile (same as dashboard)
function showProfile() {
    const user = getUser();
    if (user) {
        alert(`👤 Profile Info:\n\nName: ${user.fullName}\nUsername: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}`);
    }
}

// Replace the placeholder functions with real implementations:

// 🎛️ Get action buttons for each book based on user role
function getActionButtons(book) {
    const user = getUser();
    if (!user) return '';
    
    let buttonsHTML = '<div class="btn-group d-flex gap-1" role="group">';
    
    if (user.role === 'LIBRARIAN') {
        // Librarians get compact icons
        buttonsHTML += `
            <button class="btn btn-sm btn-outline-primary" onclick="editBook(${book.id})" title="Edit Book">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteBook(${book.id})" title="Delete Book">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add borrow button if book is available
        if (book.availableCopies > 0) {
            buttonsHTML += `
                <button class="btn btn-sm btn-success" onclick="borrowBook(${book.id})" title="Borrow Book">
                    <i class="fas fa-hand-holding"></i>
                </button>
            `;
        } else {
            buttonsHTML += `
                <button class="btn btn-sm btn-secondary" disabled title="Not Available">
                    <i class="fas fa-times"></i>
                </button>
            `;
        }
    } else {
        // Members get one clear button
        if (book.availableCopies > 0) {
            buttonsHTML += `
                <button class="btn btn-sm btn-success w-100" onclick="borrowBook(${book.id})" title="Borrow Book">
                    <i class="fas fa-hand-holding me-1"></i> Borrow
                </button>
            `;
        } else {
            buttonsHTML += `
                <button class="btn btn-sm btn-outline-secondary w-100" disabled title="Not Available">
                    <i class="fas fa-times me-1"></i> Unavailable
                </button>
            `;
        }
    }
    
    buttonsHTML += '</div>';
    return buttonsHTML;
}

// 📚 Borrow book function
async function borrowBook(bookId) {
    const user = getUser();
    if (!user) {
        alert("🚫 Please login first!");
        return;
    }
    
    const book = allBooksData.find(b => b.id === bookId);
    if (!book) {
        alert("❌ Book not found!");
        return;
    }
    
    if (book.availableCopies <= 0) {
        alert("🚫 This book is not available for borrowing!");
        return;
    }
    
    const confirmBorrow = confirm(`📚 Borrow this book?\n\nTitle: ${book.title}\nAuthor: ${book.author}\nAvailable: ${book.availableCopies} copies`);
    if (!confirmBorrow) return;
    
    try {
        console.log("📚 Borrowing book:", { userId: user.id, bookId });
        
        const response = await fetch(`${API_BASE_URL}/transactions/borrow?userId=${user.id}&bookId=${bookId}`, {
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
        
        // Reload books to update availability
        await loadBooks();
        
        alert(`✅ Book borrowed successfully!\n\nTitle: ${book.title}\nTransaction ID: ${newTransaction.id}\nDue date will be set by the system.`);
        
    } catch (error) {
        console.error("❌ Error borrowing book:", error);
        alert(`❌ Failed to borrow book: ${error.message}`);
    }
}

// ✏️ Edit book function (librarian only)
async function editBook(bookId) {
    if (!isLibrarian()) {
        alert("🚫 Only librarians can edit books!");
        return;
    }
    
    const book = allBooksData.find(b => b.id === bookId);
    if (!book) {
        alert("❌ Book not found!");
        return;
    }
    
    // Pre-fill the edit form
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookAuthor').value = book.author;
    document.getElementById('editBookCategory').value = book.category;
    document.getElementById('editBookISBN').value = book.isbn || '';
    document.getElementById('editBookYear').value = book.publicationYear || '';
    document.getElementById('editBookCopies').value = book.totalCopies;
    
    hideError('editBookError');
    
    // Show edit modal
    const modal = new bootstrap.Modal(document.getElementById('editBookModal'));
    modal.show();
}

// 🗑️ Delete book function (librarian only)
async function deleteBook(bookId) {
    if (!isLibrarian()) {
        alert("🚫 Only librarians can delete books!");
        return;
    }
    
    const book = allBooksData.find(b => b.id === bookId);
    if (!book) {
        alert("❌ Book not found!");
        return;
    }
    
    const confirmDelete = confirm(`⚠️ Delete this book?\n\nTitle: ${book.title}\nAuthor: ${book.author}\n\nThis action cannot be undone!`);
    if (!confirmDelete) return;
    
    try {
        console.log("🗑️ Deleting book:", bookId);
        
        await apiCall(`/books/${bookId}`, 'DELETE');
        
        console.log("✅ Book deleted successfully");
        
        // Reload books
        await loadBooks();
        
        alert(`✅ Book "${book.title}" deleted successfully!`);
        
    } catch (error) {
        console.error("❌ Error deleting book:", error);
        alert(`❌ Failed to delete book: ${error.message}`);
    }
}

console.log("✅ Books page functions ready!");