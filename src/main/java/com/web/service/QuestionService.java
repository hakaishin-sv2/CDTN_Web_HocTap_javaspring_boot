package com.web.service;

import com.web.entity.Category;
import com.web.entity.Question;
import com.web.enums.CategoryType;
import com.web.exception.MessageException;
import com.web.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public Question save(Question question) {
        Question result = questionRepository.save(question);
        return result;
    }

    public void delete(Long id) {
        questionRepository.deleteById(id);
    }

    public Question findById(Long id) {
        Optional<Question> question = questionRepository.findById(id);
        if(question.isEmpty()){
            throw new MessageException("Not found category :"+id);
        }
        return question.get();
    }

    public List<Question> findByLesson(Long lessonId) {
        List<Question> result = questionRepository.findByLesson(lessonId);
        return result;
    }

}
