package com.library.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.library.model.Transaction;
import com.library.model.TransactionStatus;
import com.library.model.TransactionType;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByUserId(Long userId);
    
    List<Transaction> findByBookId(Long bookId);
    
    List<Transaction> findByTransactionType(TransactionType transactionType);
    
    List<Transaction> findByStatus(TransactionStatus status);
    
    List<Transaction> findByUserIdAndStatus(Long userId, TransactionStatus status);
    
    List<Transaction> findByBookIdAndStatus(Long bookId, TransactionStatus status);
    
    Optional<Transaction> findByUserIdAndBookIdAndStatus(Long userId, Long bookId, TransactionStatus status);
    
    List<Transaction> findByDueDateBeforeAndStatus(LocalDateTime dueDate, TransactionStatus status);
    
    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
