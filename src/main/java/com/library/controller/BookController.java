package com.library.controller;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.library.model.Book;
import com.library.service.BookService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController {

  
    @Autowired
    private BookService bookService;

    //Create new Book
    @PostMapping
    public ResponseEntity<?> createBook(@Valid @RequestBody Book book){
        try {
            Book createdBook = bookService.createBook(book);
            return new ResponseEntity<>(createdBook,HttpStatus.CREATED);
        } catch (RuntimeException e) {
           return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    //Get all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(){
        List<Book> books = bookService.getAllBooks();
        return new ResponseEntity<>(books,HttpStatus.OK);
    }

    //Get Book by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id){
        Optional<Book> book = bookService.getBookById(id);
        if (book.isPresent()){
            return new ResponseEntity<>(book.get(),HttpStatus.OK);
        }
        return new ResponseEntity<>("Book not found",HttpStatus.NOT_FOUND);
    }

      //Get Book by ISBN
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<?> getBookByIsbn(@PathVariable String isbn){
        Optional<Book> book = bookService.getBookByIsbn(isbn);
        if (book.isPresent()){
            return new ResponseEntity<>(book.get(),HttpStatus.OK);
        }
        return new ResponseEntity<>("Book not found",HttpStatus.NOT_FOUND);
    }

    //get books by title
    @GetMapping("/title/{title}")
    public ResponseEntity<?> getBooKByTitle(@PathVariable String title){
        List<Book> books = bookService.getBooksByTitle(title);
        return new ResponseEntity<>(books,HttpStatus.OK);
    }

    //get Books by author

    @GetMapping("/author/{author}")
    public ResponseEntity<?> getBooksByAuthor(@PathVariable String author){
        List<Book> books = bookService.getBooksByAuthor(author);
        return new ResponseEntity<>(books,HttpStatus.OK);
    }

    // Get books by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getBooksByCategory(@PathVariable String category){
        List<Book> books = bookService.getBooksByCategory(category);
        return new ResponseEntity<>(books,HttpStatus.OK);
    }
    // Get available books only
    @GetMapping("/available")
    public ResponseEntity<List<Book>> getAvailableBooks() {
        List<Book> books = bookService.getAvailableBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
    
    //Update book
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails){
        try {
            Book updatedBook = bookService.updateBook(id, bookDetails);
            return new ResponseEntity<>(updatedBook,HttpStatus.OK);
        } catch (RuntimeException e) {
           return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }

    //Delete book
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id){
        try {
            bookService.deleteBook(id);
            return new ResponseEntity<>("book deleted successfully",HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }

}
