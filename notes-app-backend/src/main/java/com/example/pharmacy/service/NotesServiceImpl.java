package com.example.pharmacy.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.pharmacy.model.Notes;
import com.example.pharmacy.repositiory.NotesRepository;

import java.util.Date;

@Service
public class NotesServiceImpl implements NotesService {
	
	@Autowired
	private NotesRepository notesRepository;
	
	@Override
	public Notes createNotes(Notes notes, String userId, String category ) {
	    List<Notes> notesList = notesRepository.findAll();

	    int lastIdNumber = notesList.stream()
	        .map(n -> {
	            String notesId = n.getNotesId();
	            if (notesId.startsWith("notes_")) {
	                String number = notesId.substring(6);
	                try {
	                    return Integer.parseInt(number);
	                } catch (NumberFormatException e) {
	                    return 0;
	                }
	            }
	            return 0;
	        })
	        .max(Integer::compareTo)
	        .orElse(0);

	    int newIdNumber = lastIdNumber + 1;
	    String newId = "notes_" + newIdNumber;
	    notes.setNotesId(newId);

	    notes.setUserId(userId);

	    System.out.println(notesRepository.count());
	    
	    Date currentDate = new Date();
	    notes.setCreatedDate(currentDate);
	    notes.setUpdatedDate(currentDate);
	    
	    notes.setCategory(category);

	    return notesRepository.save(notes);
	}

    
	@Override
	public Notes editNotes(String notesId, Notes notes, String category) {
	    Optional<Notes> existingNotes = notesRepository.findById(notesId);

	    if (existingNotes.isPresent()) {
	        Notes existing = existingNotes.get();
	        
	        if (notes.getNotesTitle() != null) {
	            existing.setNotesTitle(notes.getNotesTitle());
	        }

	        if (notes.getNotesDescription() != null) {
	            existing.setNotesDescription(notes.getNotesDescription());
	        }
	        
	        if (category != null) {
	            existing.setCategory(category);
	        }
	        
	        if (notes.getNotesTitle() != null || notes.getNotesDescription() != null) {
	            existing.setUpdatedDate(new Date());

	        return notesRepository.save(existing);
	        }
	    }

	    return null;
	}

    
    @Override
    public List<Notes> viewNotes() {
        return notesRepository.findAll();
    }
    
    
    public List<Notes> getUserNotesByUserId(String userId) {
        return notesRepository.findByUserId(userId);
    }
    
    @Override
    public Optional<Notes> getNoteById(String notesId, String userId) {
        return notesRepository.findByNotesIdAndUserId(notesId, userId);
    }
    
    @Override
    public void addReminderToNote(String notesId, String userId, Date reminderDate) {
        Optional<Notes> optionalNote = getNoteById(notesId, userId);
        if (optionalNote.isPresent()) {
            Notes note = optionalNote.get();
            note.setReminderDate(reminderDate);
            notesRepository.save(note);
        } else {
            System.err.println("Note with ID: " + notesId + " and User ID: " + userId + " not found");
        }
    }
    
    @Override
    public void deleteNotes(String notesId) {
        notesRepository.deleteById(notesId);
    }
    
}
