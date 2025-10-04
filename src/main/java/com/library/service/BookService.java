package com.library.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.exception.ResourceAlreadyExistsException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Book;
import com.library.repository.BookRepository;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    //create book
    public Book createBook(Book book){
        if (bookRepository.existsByIsbn(book.getIsbn())){
            throw new ResourceAlreadyExistsException("Book", "ISBN", book.getIsbn());
        }
        return bookRepository.save(book);
    }
    
    //Get all books
    public List<Book> getAllBooks(){
        return bookRepository.findAll();
    }

    //Get book by ID
    public Optional<Book> getBookById(Long id){
        return bookRepository.findById(id);
    }

    //Get book by ISBN
    public Optional<Book> getBookByIsbn(String isbn){
        return bookRepository.findByIsbn(isbn);
    }

    //search books by title
    public List<Book> getBooksByTitle(String title){
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    //search books by author
    public List<Book> getBooksByAuthor(String author){
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    // get Books by category
    public List<Book> getBooksByCategory(String category){
        return bookRepository.findByCategory(category);
    }

    // get available books only
    public List<Book> getAvailableBooks(){
        return bookRepository.findByAvailableCopiesGreaterThan(0);
    }

    //update book

    public Book updateBook(Long id, Book bookDetails){
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Book", "id", id));
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setPublisher(bookDetails.getPublisher());
        book.setPublicationYear(bookDetails.getPublicationYear());
        book.setCategory(bookDetails.getCategory());
        book.setTotalCopies(bookDetails.getTotalCopies());
        book.setAvailableCopies(bookDetails.getAvailableCopies());
        book.setDescription(bookDetails.getDescription());

        return bookRepository.save(book);
    }

    //Delete book
    public void deleteBook(Long id){
        if(!bookRepository.existsById(id)){
            throw new ResourceNotFoundException("Book", "id", id);
        }
        bookRepository.deleteById(id);
    }
}
