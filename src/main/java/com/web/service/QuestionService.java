package com.web.service;

import com.web.entity.Answer;
import com.web.entity.Category;
import com.web.entity.Question;
import com.web.enums.CategoryType;
import com.web.exception.MessageException;
import com.web.repository.AnswerRepository;
import com.web.repository.CategoryRepository;
import com.web.repository.QuestionRepository;
import com.web.repository.ResultExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;
 @Autowired
 private AnswerRepository answerRepository;
 @Autowired
 private ResultExamRepository resultExamRepository;
    public Question save(Question question) {
        Question result = questionRepository.save(question);
        return result;
    }

    public void delete(Long id) {
        List<Answer> answers = answerRepository.findByQuestion_Id(id);
        for (Answer answer : answers) {
            resultExamRepository.deleteByAnswer_Id(answer.getId());
            answerRepository.deleteById(answer.getId());
        }
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





        public void deleteQuestionAndAnswers(Long questionId) {

            Optional<Question> question = questionRepository.findById(questionId);

            if (question.isPresent()) {
                // Xóa câu hỏi (các câu trả lời sẽ được xóa tự động nhờ cascade)
                questionRepository.delete(question.get());
            }
        }
    public void deleteQuestionAndAnswers2(Long questionId) {
        Optional<Question> question = questionRepository.findById(questionId);

        if (question.isPresent()) {
            List<Answer> answers = question.get().getAnswers();
            for (Answer answer : answers) {
                answerRepository.delete(answer); // Xóa từng câu trả lời
            }
            questionRepository.delete(question.get());
        }
    }

}
