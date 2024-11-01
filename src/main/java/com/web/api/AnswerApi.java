package com.web.api;

import com.web.entity.Answer;
import com.web.entity.Question;
import com.web.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answer")
@CrossOrigin
public class AnswerApi {

    @Autowired
    private AnswerService answerService;

    @GetMapping("/public/find-by-question")
    public ResponseEntity<?> findByQuestion(@RequestParam Long id){
        List<Answer> result = answerService.findByQuestion(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> update(@RequestBody Answer answer){
        answerService.save(answer);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        answerService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Answer result = answerService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
