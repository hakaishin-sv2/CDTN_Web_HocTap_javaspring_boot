package com.web.service;

import com.web.entity.Exam;
import com.web.entity.Lesson;
import com.web.entity.Question;
import com.web.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public List<Lesson> findByExam(Long examId){
        List<Lesson> list = lessonRepository.findByExam(examId);
        return list;
    }

    public List<Lesson> findByListId(List<Long> listLesson){
        List<Lesson> list = lessonRepository.findAllById(listLesson);
        return list;
    }

    public void delete(Long id){
        lessonRepository.deleteById(id);
    }

    public void update(Lesson lesson){
        lessonRepository.save(lesson);
    }

    public Lesson findById(Long id) {
        return lessonRepository.findById(id).get();
    }
}
