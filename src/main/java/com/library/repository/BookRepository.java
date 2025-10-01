package com.library.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.library.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book,Long>{
    Optional<Book> findByIsbn(String isbn);

    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByAuthorContainingIgnoreCase(String author);

    List<Book> findByCategory(String category);

    boolean existsByIsbn(String isbn);

    List<Book> findByAvailableCopiesGreaterThan(Integer copies);
}
    

