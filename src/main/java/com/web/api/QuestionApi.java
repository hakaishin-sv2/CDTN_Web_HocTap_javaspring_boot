package com.web.api;

import com.web.entity.Lesson;
import com.web.entity.Question;
import com.web.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question")
@CrossOrigin
public class QuestionApi {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/public/find-by-lesson")
    public ResponseEntity<?> findByExam(@RequestParam Long id){
        List<Question> result = questionService.findByLesson(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> update(@RequestBody Question question){
        questionService.save(question);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        questionService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Question result = questionService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
