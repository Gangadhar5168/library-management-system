package com.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
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
public class TransactionController  {

    @Autowired
    private TransactionService transactionService;

    // Borrow a book
    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(@RequestParam Long userId, @RequestParam Long bookId){
        try {
            Transaction transaction  = transactionService.borrowBook(userId, bookId);
            return new ResponseEntity<>(transaction,HttpStatus.CREATED);
        }
        catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    //Return a boook
    @PostMapping("/return")
    public ResponseEntity<?> returnBook(@RequestParam Long userId, @RequestParam Long bookId){
        try {
            Transaction transaction = transactionService.returnBook(userId, bookId);
            return new ResponseEntity<>(transaction,HttpStatus.OK);
        }
        catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
    
    //Get all transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(){
        List<Transaction> transactions = transactionService.getAllTransactions();
        return new ResponseEntity<>(transactions,HttpStatus.OK);
    }

    //Get user's transactions
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId){
        List<Transaction> transactions = transactionService.getUserTransactions(userId);
        return new ResponseEntity<>(transactions,HttpStatus.OK);
    }

    //Get Book's transactions history
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Transaction>> getBookTransactions(@PathVariable Long bookId){
        List<Transaction> transactions = transactionService.getBookTransactions(bookId);
        return new ResponseEntity<>(transactions,HttpStatus.OK);
    }

    //Get overdue books
    @GetMapping("/overdue")
    public ResponseEntity<List<Transaction>> getOverdueBooks(){
        List<Transaction> transactions = transactionService.getOverDueBooks();
        return new ResponseEntity<>(transactions,HttpStatus.OK);
    }

    //get Actve Borrowings
    @GetMapping("/active")
    public ResponseEntity<List<Transaction>> getActiveBorrowings(){
        List<Transaction> transactions = transactionService.getActiveBorrowings();
        return new ResponseEntity<>(transactions,HttpStatus.OK);
    }

}
