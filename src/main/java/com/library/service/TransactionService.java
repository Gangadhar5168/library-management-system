package com.library.service;


import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import com.library.model.Book;
import com.library.model.Transaction;
import com.library.model.TransactionStatus;
import com.library.model.TransactionType;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.TransactionRepository;
import com.library.repository.UserRepository;



@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    //Borrow a book
    @Transactional
    public Transaction borrowBook(Long userId, Long bookId){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new RuntimeException("Book not found"));

        // check if book is available to borrow
        if (book.getAvailableCopies()<=0){
            throw new RuntimeException("Book is not available for borrowing");
        }

        //check if the user already has this book
        Optional<Transaction> existingTransaction = transactionRepository
            .findByUserIdAndBookIdAndStatus(userId, bookId, TransactionStatus.ACTIVE);
        if(existingTransaction.isPresent()){
            throw new RuntimeException("user has already borrowed this book");
        }

        //create borrow transaction
        Transaction transaction = new Transaction(user,book,TransactionType.BORROW);

        //udpate book availability
        book.setAvailableCopies(book.getAvailableCopies() -1);
        bookRepository.save(book);

        return transactionRepository.save(transaction);
        }
    
    //return a book
    @Transactional
    public Transaction returnBook(Long userId,Long bookId){
        User user  = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new RuntimeException("Book not found"));
        
        //Find Active borrow transaction
        Transaction borrowTransaction = transactionRepository
            .findByUserIdAndBookIdAndStatus(userId, bookId, TransactionStatus.ACTIVE)
            .orElseThrow(()-> new RuntimeException("No active borrow record found"));

        //update borrow transaction
        borrowTransaction.setReturnDate(LocalDateTime.now());
        borrowTransaction.setStatus(TransactionStatus.RETURNED);

        //Calculate fine if overdue
        if (LocalDateTime.now().isAfter(borrowTransaction.getDueDate())){
            long overdueDays = ChronoUnit.DAYS.between(borrowTransaction.getDueDate(),LocalDateTime.now());
            double fine = overdueDays * 1.0; //$1 per day fine
            borrowTransaction.setFine(fine);
        }

        //create return transaction
        Transaction returntTransaction = new Transaction(user,book,TransactionType.RETURN);
        returntTransaction.setReturnDate(LocalDateTime.now());
        returntTransaction.setStatus(TransactionStatus.RETURNED);

        //update book availability
        book.setAvailableCopies(book.getAvailableCopies()+1);
        bookRepository.save(book);

        //Save both Transactions
        transactionRepository.save(borrowTransaction);
        return transactionRepository.save(returntTransaction);
    }
    //get all transactions
    public List<Transaction> getAllTransactions(){
        return transactionRepository.findAll();
    }

    //get user's transactions
    public List<Transaction> getUserTransactions(Long userId){
        return transactionRepository.findByUserId(userId);
    }

    //get book's transactions
    public List<Transaction> getBookTransactions(Long bookId){
        return transactionRepository.findByBookId(bookId);
    }

    //Get Overdue books
    public List<Transaction> getOverDueBooks(){
        return transactionRepository.findByDueDateBeforeAndStatus(LocalDateTime.now(),TransactionStatus.ACTIVE);
    }

    //get active borrowings
    public List<Transaction> getActiveBorrowings(){
        return transactionRepository.findByStatus(TransactionStatus.ACTIVE);
    }
}
