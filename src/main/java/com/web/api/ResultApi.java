package com.web.api;

import com.web.dto.ResultResponse;
import com.web.entity.Blog;
import com.web.entity.Result;
import com.web.entity.User;
import com.web.service.ResultService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/result")
@CrossOrigin
public class ResultApi {

    @Autowired
    private ResultService resultService;

    @Autowired
    private UserUtils userUtils;

    @PostMapping("/user/create")
    public ResponseEntity<?> save(@RequestBody List<Long> answer, @RequestParam("examId") Long examId, @RequestParam("time") String time){
        ResultResponse resultResponse = resultService.create(examId,answer, time);
        return new ResponseEntity<>(resultResponse, HttpStatus.CREATED);
    }

    @GetMapping("/user/find-by-user")
    public ResponseEntity<?> findAll(){
        List<Result> result = resultService.findByUser();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/user/find-by-user-exam")
    public ResponseEntity<?> findByUserAndExam(@RequestParam("examId") Long examId){
        User user = userUtils.getUserWithAuthority();
        ResultResponse result = resultService.getByExamAndUser(examId, user.getId());
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/admin/find-by-exam")
    public ResponseEntity<?> findByExam(@RequestParam("examId") Long examId){
        List<ResultResponse> result = resultService.findByExam(examId);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

}
