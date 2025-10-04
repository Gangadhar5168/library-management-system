package com.library.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.exception.ResourceAlreadyExistsException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.User;
import com.library.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    //create User
    public User createUser(User user){
        if (userRepository.existsByUsername(user.getUsername())){
            throw new ResourceAlreadyExistsException("User", "username", user.getUsername());
        }
        if (userRepository.existsByEmail(user.getEmail())){
            throw new ResourceAlreadyExistsException("User", "email", user.getEmail());
        }
        return userRepository.save(user);
    }
    
    //Get all users
    public  List<User> getAllUsers(){
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }

    // get user by username 
    public Optional<User> getUserByUsername(String username){
        return userRepository.findByUsername(username);
    }

    // update user 
    public User updateUser(Long id, User userDetails){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new  ResourceNotFoundException("User", "id", id));
        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setRole(userDetails.getRole());

        return userRepository.save((user));
    }

    // delete user
    public void deleteUser(Long id){
        if (!userRepository.existsById(id)){
            throw new  ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }
}
