package com.example.pharmacy.repositiory;

import org.springframework.stereotype.Repository;

import com.example.pharmacy.model.Notes;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface NotesRepository extends  JpaRepository<Notes, String> {
	List<Notes> findByUserId(String userId);
	Optional<Notes> findByNotesIdAndUserId(String notesId, String userId);
}