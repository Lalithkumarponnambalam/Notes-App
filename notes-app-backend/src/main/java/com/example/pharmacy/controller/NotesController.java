package com.example.pharmacy.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.pharmacy.model.Notes;
import com.example.pharmacy.service.NotesService;
import com.example.pharmacy.service.NotesServiceImpl;

@RestController
@CrossOrigin 
@RequestMapping("/notes")
public class NotesController {
    
    @Autowired
    private NotesService notesService;
    
	@Autowired
    NotesServiceImpl notesserviceimpl;

    @PostMapping("/create")
    public Notes createNotes(@RequestBody Notes notes, @RequestParam String userId, @RequestParam String category) {
        return notesService.createNotes(notes, userId, category);
    }

    @PostMapping("/edit/{notesId}")
    public Notes editNotes(@PathVariable String notesId, @RequestBody Notes notes, @RequestParam String category ) {
        return notesService.editNotes(notesId, notes, category);
    }
    
	@PostMapping("/view")
	public List<Notes> viewUserNotes(@RequestParam String userId) {
	    List<Notes> userNotes = notesserviceimpl.getUserNotesByUserId(userId);
	    return userNotes;
	}
    
    @PostMapping("/{notesId}")
    public ResponseEntity<Notes> getNoteById(@PathVariable String notesId, @RequestParam String userId) {
        Optional<Notes> optionalNote = notesService.getNoteById(notesId, userId);

        if (optionalNote.isPresent()) {
            Notes note = optionalNote.get();
            return new ResponseEntity<>(note, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    

    @PostMapping("/add-reminder/{notesId}")
    public ResponseEntity<Notes> addReminderToNote(
            @PathVariable String notesId,
            @RequestParam String userId,
            @RequestBody Map<String, Object> requestBody) throws ParseException {

        String reminderDate = (String) requestBody.get("reminderDate");
        String reminderTime = (String) requestBody.get("reminderTime");

        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String combinedDateTime = reminderDate + " " + reminderTime;
        Date parsedReminderDateTime = dateFormatter.parse(combinedDateTime);

        notesService.addReminderToNote(notesId, userId, parsedReminderDateTime);

        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping("/delete/{notesId}")
    public void deleteDepartment(@PathVariable String notesId) {
        notesserviceimpl.deleteNotes(notesId);
    }
}
