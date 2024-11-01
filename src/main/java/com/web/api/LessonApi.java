package com.web.api;

import com.web.dto.ExamDto;
import com.web.entity.Exam;
import com.web.entity.Lesson;
import com.web.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson")
@CrossOrigin
public class LessonApi {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/public/find-by-exam")
    public ResponseEntity<?> findByExam(@RequestParam Long id){
        List<Lesson> result = lessonService.findByExam(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/public/find-by-list-id")
    public ResponseEntity<?> findByExam(@RequestBody List<Long> list){
        List<Lesson> result = lessonService.findByListId(list);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> update(@RequestBody Lesson lesson){
        lessonService.update(lesson);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        lessonService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Lesson result = lessonService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
