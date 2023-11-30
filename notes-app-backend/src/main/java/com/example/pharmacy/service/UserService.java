package com.example.pharmacy.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.pharmacy.model.User;

@Service
public interface UserService {
	
	  public User createUser(User user);

	  public User editUser(User user);

	  public User login(User user);

	  public List<User> viewUser();

	  public void deleteUser(String userId);
	  
	  User getUserById(String userId);
	  
	  void uploadProfileImage(String userId, MultipartFile file);

	  List<String> getUploadedImagesByUserId(String userId);
}
