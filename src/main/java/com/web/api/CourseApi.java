package com.web.api;

import com.web.dto.UserDto;
import com.web.entity.Course;
import com.web.entity.Lesson;
import com.web.service.CourseService;
import com.web.service.UnitService;
import com.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course")
@CrossOrigin
public class CourseApi {

    @Autowired
    private CourseService courseService;
    @Autowired
    private UserService userService;

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAll(){
        List<Course> result = courseService.findAll();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/find-all-page")
    public ResponseEntity<?> findAll(Pageable pageable){
        Page<Course> result = courseService.findByStartDate(pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/search-course")
    public ResponseEntity<?> searchCourse(@RequestParam(value = "search", required = false) String search,
                                          @RequestParam(value = "categoryId", required = false) Long categoryId,Pageable pageable){
        Page<Course> result = courseService.searchCourse(categoryId,search,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody Course course){
        Course result = courseService.save(course);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        courseService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Course result = courseService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/user/find-by-user")
    public ResponseEntity<?> findByUser(){
        List<Course> result = courseService.findByUser();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/teacher/find-by-teacher")
    public ResponseEntity<?> findByTeacher(){
        List<Course> result = courseService.findByTeacher();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

//    @GetMapping("/test")
//    public ResponseEntity<?> addTocourse(){
//        List<UserDto> result = userService.getlistUserByRole("ROLE_USER");
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }
}