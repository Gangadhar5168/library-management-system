package com.library.exception;


import com.library.dto.ErrorResponse;
import com.library.dto.ValidationError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.List;
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    //Handle resource not found exception
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
        ResourceNotFoundException ex , WebRequest request){
        logger.error("Resource not Found : {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            request.getDescription(false).replace("uri=","")
        );
        return new ResponseEntity<>(errorResponse,HttpStatus.NOT_FOUND);
    }

    //HAndle resource already exists exception
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleResourceAlreadyExistsException(
        ResourceAlreadyExistsException ex, WebRequest request){
            logger.error("Resource already exists:{}",ex.getMessage());
            ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Conflict",
                ex.getMessage(),
                request.getDescription(false).replace("url=","")
            );
            return new ResponseEntity<>(errorResponse,HttpStatus.CONFLICT);
        }

    // Handle Book not available Exception
    @ExceptionHandler(BookNotAvailableException.class)
    public ResponseEntity<ErrorResponse> handleBookNotAvailableException(
        BookNotAvailableException ex,WebRequest request){
            logger.error("Book Not available",ex.getMessage());
            ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getDescription(false).replace("url=","")
            );
            return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);
        }
    
    //Handle Transaction Not found exception
    @ExceptionHandler(TransactionNotAvailableException.class)
    public ResponseEntity<ErrorResponse> handleTransactionNotAvailableException(
        TransactionNotAvailableException ex, WebRequest request){   
            logger.error("Transaction not available", ex.getMessage());

            ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getDescription(false).replace("url=","")
                );
            return new ResponseEntity<>(errorResponse,HttpStatus.NOT_FOUND);
        }

    //handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleArgumentNotValidExceptions(
        MethodArgumentNotValidException ex, WebRequest request){
            logger.error("Validation failed {}",ex.getMessage());

            ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "validation Failed",
                "Invalid input provided",
                request.getDescription(false).replace("url=","")
            );
            List<ValidationError> validationErrors = new ArrayList<>();
            ex.getBindingResult().getAllErrors().forEach((error)-> {
                String fieldName = ((FieldError) error).getField();
                Object rejectedValue = ((FieldError) error).getRejectedValue();
                String errorMessage = error.getDefaultMessage();
                validationErrors.add(new ValidationError(fieldName,rejectedValue,errorMessage));
            });
            errorResponse.setValidationErrors(validationErrors);

            return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);
        }
    
    // Handle IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        logger.error("Illegal argument: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Bad Request",
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    // Handle Generic Runtime Exception
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        
        logger.error("Runtime exception occurred: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            "An unexpected error occurred: " + ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    // Handle Generic Exception (catch-all)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {
        
        logger.error("Unexpected exception occurred: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            "An unexpected error occurred. Please contact support.",
            request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

