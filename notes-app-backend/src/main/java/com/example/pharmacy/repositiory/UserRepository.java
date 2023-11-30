package com.example.pharmacy.repositiory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.pharmacy.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

	User findByUserId(String userId);
}
