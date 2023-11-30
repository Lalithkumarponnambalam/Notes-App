package com.example.pharmacy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.pharmacy.model.User;
import com.example.pharmacy.service.UserServiceImpl;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserServiceImpl userService;

    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/view")
    public List<User> viewUser() {
        return userService.viewUser();
    }
    
    @PostMapping("/view/{userId}")
    public ResponseEntity<?> viewUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            if (user != null) {
                return ResponseEntity.ok(user); 
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user data");
        }
    }

    @PostMapping("/edit")
    public User editUser(@RequestBody User user) {
        return userService.editUser(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {
        return userService.login(user);
    }
    
    @PostMapping("/{userId}/upload-image")
    public ResponseEntity<String> uploadProfileImage(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            userService.uploadProfileImage(userId, file);
            return ResponseEntity.ok("Image uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }
    
    @GetMapping("/{userId}/view-upload-images")
    public ResponseEntity<?> getUploadedImagesByUserId(@PathVariable String userId) {
        List<String> imagePaths = userService.getUploadedImagesByUserId(userId);

        if (imagePaths != null) {
            return ResponseEntity.ok(imagePaths);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No images found for the user");
        }
    }
}