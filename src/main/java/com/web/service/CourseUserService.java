package com.web.service;

import com.web.entity.CourseUser;
import com.web.repository.CourseUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CourseUserService {

    @Autowired
    private CourseUserRepository courseUserRepository;

    public void updateCC(Long userId, Long courseId, String level){
        CourseUser courseUser = courseUserRepository.findByCourseAndUser(courseId, userId).get();
        courseUser.setLevel(level);
        courseUserRepository.save(courseUser);
    }
}
