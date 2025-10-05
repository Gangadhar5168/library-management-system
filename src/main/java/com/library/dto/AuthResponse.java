package com.library.dto;

import com.library.model.Role;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String username;
    private String fullName;
    private String email;
    private Role role;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String username, String fullName, String email, Role role) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
