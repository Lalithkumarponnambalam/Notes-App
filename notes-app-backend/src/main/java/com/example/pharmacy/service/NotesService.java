package com.example.pharmacy.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.pharmacy.model.Notes;

@Service
public interface NotesService {
	
	  public Notes createNotes(Notes notes, String userId, String category);

	  public Notes editNotes(String notesId, Notes notes, String category);

	  public List<Notes> viewNotes();
	  
	  Optional<Notes> getNoteById(String notesId, String userId); 
	  
	  void addReminderToNote(String notesId, String userId, Date reminderDate);
	  
	  public void deleteNotes(String notesId);
	 
	    
}
