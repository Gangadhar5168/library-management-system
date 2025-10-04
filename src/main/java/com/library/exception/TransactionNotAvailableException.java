package com.library.exception;

public class TransactionNotAvailableException extends RuntimeException{
    public TransactionNotAvailableException(String message){
        super(message);
    }
    
}
