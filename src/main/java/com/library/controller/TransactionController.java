package com.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.model.Transaction;
import com.library.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    // Both LIBRARIAN and MEMBER can borrow books
    @PostMapping("/borrow")
    @PreAuthorize("hasRole('LIBRARIAN') or hasRole('MEMBER')")
    public ResponseEntity<Transaction> borrowBook(@RequestParam Long userId, @RequestParam Long bookId) {
        Transaction transaction = transactionService.borrowBook(userId, bookId); // Matches your service method
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
    
    // Both LIBRARIAN and MEMBER can return books
    @PostMapping("/return")
    @PreAuthorize("hasRole('LIBRARIAN') or hasRole('MEMBER')")
    public ResponseEntity<Transaction> returnBook(@RequestParam Long userId, @RequestParam Long bookId) {
        Transaction transaction = transactionService.returnBook(userId, bookId); // Matches your service method
        return ResponseEntity.ok(transaction);
    }
    
    // Only LIBRARIAN can view all transactions
    @GetMapping
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    // LIBRARIAN can view any user's transactions, MEMBER can only view their own
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('LIBRARIAN') or (hasRole('MEMBER') and #userId == authentication.principal.id)")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.getUserTransactions(userId); // Matches your service method
        return ResponseEntity.ok(transactions);
    }
    
    // Get book's transaction history - LIBRARIAN only
    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<Transaction>> getBookTransactions(@PathVariable Long bookId) {
        List<Transaction> transactions = transactionService.getBookTransactions(bookId); // Matches your service method
        return ResponseEntity.ok(transactions);
    }
    
    // Only LIBRARIAN can view overdue books
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<Transaction>> getOverdueBooks() {
        List<Transaction> overdueTransactions = transactionService.getOverDueBooks(); // Matches your service method
        return ResponseEntity.ok(overdueTransactions);
    }
    
    // Only LIBRARIAN can view active borrowings
    @GetMapping("/active")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<Transaction>> getActiveBorrowings() {
        List<Transaction> activeTransactions = transactionService.getActiveBorrowings(); // Matches your service method
        return ResponseEntity.ok(activeTransactions);
    }
}
