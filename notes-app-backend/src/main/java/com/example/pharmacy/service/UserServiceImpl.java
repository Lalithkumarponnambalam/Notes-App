package com.example.pharmacy.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.pharmacy.model.User;
import com.example.pharmacy.repositiory.UserRepository;

import java.util.Collections;
 
@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
    private UserRepository userRepository;
	
    @Override
    public User getUserById(String userId) {
        return userRepository.findByUserId(userId);
    }
	
	@Override
	public User createUser(User user) {
        List<User> customerList = userRepository.findAll();        

        ArrayList<Integer> arr = new ArrayList<>();
        for (User u : customerList) {
            arr.add(Integer.valueOf(u.getUserId().substring(5)));
        }	
        Collections.sort(arr);
        int lastIdNumber = arr.get(arr.size() - 1);
        final AtomicInteger counter = new AtomicInteger(lastIdNumber);
        int newIdNumber = counter.incrementAndGet();
        String newId = "user_" + newIdNumber;
        user.setUserId(newId);
        return userRepository.save(user);
    }
	
    @Override
    public User login(User user) {
        for (User u : userRepository.findAll()) {
            if (u.getEmail() != null && u.getEmail().equals(user.getEmail()) && u.getPassword().equals(user.getPassword())) {
//                System.out.println("User logged in successfully: " + u.getUserId());
                return u;
            }
        }
        return null;
    }

    @Override
    public List<User> viewUser() {
        return userRepository.findAll();
    }
    
    @Override
    public User editUser(User user) {
        Optional<User> existingUser = userRepository.findById(user.getUserId());

        if (existingUser.isPresent()) {
            User updatedUser = existingUser.get();

            if (user.getEmail() != null) {
                updatedUser.setEmail(user.getEmail());
            }

            if (user.getUsername() != null) {
                updatedUser.setUsername(user.getUsername());
            }

            if (user.getPassword() != null) {
                updatedUser.setPassword(user.getPassword());
            }

            User savedUser = userRepository.save(updatedUser);

            return savedUser;
        }
        return null;
    }
    

    private static final String UPLOAD_DIR = "/home/lalith/Notes-app";

    @Override
    public void uploadProfileImage(String userId, MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            Path targetLocation = Path.of(UPLOAD_DIR + userId);

            if (!Files.exists(targetLocation)) {
                Files.createDirectories(targetLocation);
            }

            LocalDateTime currentTime = LocalDateTime.now();
            String timeStamp = currentTime.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String uniqueFileName = timeStamp + "_" + originalFileName;

            Path filePath = targetLocation.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            User user = userRepository.findByUserId(userId);
            if (user != null) {
                user.setProfileImagePath(filePath.toString());
                userRepository.save(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    
    @Override
    public List<String> getUploadedImagesByUserId(String userId) {
        User user = userRepository.findByUserId(userId);

        if (user != null) {
            String imagePathsString = user.getProfileImagePath();
            List<String> imagePaths = Arrays.asList(imagePathsString.split(","));

            return imagePaths;
        } else {
      
            return null;
        }
    }

    @Override
    public void deleteUser(String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteUser'");
    }
    
}
