package com.web.service;

import com.web.dto.ResultResponse;
import com.web.entity.*;
import com.web.exception.MessageException;
import com.web.repository.AnswerRepository;
import com.web.repository.ExamRepository;
import com.web.repository.ResultExamRepository;
import com.web.repository.ResultRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ResultExamRepository resultExamRepository;

    @Autowired
    private AnswerRepository answerRepository;

    public void save(Result result){
        result.setCreatedDate(LocalDateTime.now());
        result.setUser(userUtils.getUserWithAuthority());
        resultRepository.save(result);
    }

    public List<Result> findByUser(){
        return resultRepository.findByUser(userUtils.getUserWithAuthority().getId());
    }

    public ResultResponse create(Long examId, List<Long> answer, String thoiGianht){
        User user = userUtils.getUserWithAuthority();
        Optional<Result> result = resultRepository.findByUserAndExam(user.getId(), examId);
//        resultRepository.delete(result.get());
        if(result.isPresent()){
            throw new MessageException("Đã có bài thi, không thể làm lại");
        }
        Exam exam = examRepository.findById(examId).get();
        List<Answer> daTraLoi = answerRepository.findAllById(answer);
        List<Question> tongCauHoi = new ArrayList<>();
        for(Lesson lesson : exam.getLessons()){
            tongCauHoi.addAll(lesson.getQuestions());
        }
        Result re = new Result();
        Integer tongChuaTl = tongCauHoi.size() - daTraLoi.size();
        re.setUser(user);
        re.setCreatedDate(LocalDateTime.now());
        re.setExam(exam);
        re.setFinishTime(thoiGianht);
        re.setNumNotWork(tongChuaTl);

        Integer tongDung = 0;
        Integer tongSai = 0;
        for(Answer a : daTraLoi){
            if(a.getIsTrue() == true){
                ++tongDung;
            }
            else{
                ++tongSai;
            }
        }
        re.setNumFalse(tongSai);
        re.setNumTrue(tongDung);
        resultRepository.save(re);
        for(Answer a : daTraLoi){
            ResultExam resultExam = new ResultExam();
            resultExam.setResult(re);
            resultExam.setAnswer(a);
            resultExamRepository.save(resultExam);
        }
        ResultResponse resultResponse = new ResultResponse();
        resultResponse.setSoCauBo(re.getNumNotWork());
        resultResponse.setTongCauHoi(tongCauHoi.size());
        resultResponse.setSoTLDung(re.getNumTrue());
        resultResponse.setSoTLSai(re.getNumFalse());
        resultResponse.setResult(re);
        Float soCd = Float.valueOf(re.getNumTrue());
        Float tongCh = Float.valueOf(tongCauHoi.size());

        resultResponse.setPhanTram(soCd /tongCh * 100);
        return resultResponse;
    }

    public ResultResponse getByExamAndUser(Long examId, Long userId){
        Optional<Result> result = resultRepository.findByUserAndExam(userId, examId);
        if(result.isEmpty()){
            throw new MessageException("Không tìm thấy kết quả");
        }
        Result re = result.get();
        List<Question> tongCauHoi = new ArrayList<>();
        for(Lesson lesson : re.getExam().getLessons()){
            tongCauHoi.addAll(lesson.getQuestions());
        }
        ResultResponse resultResponse = new ResultResponse();
        resultResponse.setSoCauBo(re.getNumNotWork());
        resultResponse.setTongCauHoi(tongCauHoi.size());
        resultResponse.setSoTLDung(re.getNumTrue());
        resultResponse.setSoTLSai(re.getNumFalse());
        resultResponse.setResult(re);
        Float soCd = Float.valueOf(re.getNumTrue());
        Float tongCh = Float.valueOf(tongCauHoi.size());

        resultResponse.setPhanTram(soCd /tongCh * 100);
        return resultResponse;
    }


    public List<ResultResponse> findByExam(Long examId){
        List<Result> list = resultRepository.findByExam(examId);
        List<ResultResponse> result = new ArrayList<>();
        Exam exam = examRepository.findById(examId).get();
        List<Question> tongCauHoi = new ArrayList<>();
        for(Lesson lesson : exam.getLessons()){
            tongCauHoi.addAll(lesson.getQuestions());
        }
        for(Result re : list){
            ResultResponse resultResponse = new ResultResponse();
            resultResponse.setSoCauBo(re.getNumNotWork());
            resultResponse.setTongCauHoi(tongCauHoi.size());
            resultResponse.setSoTLDung(re.getNumTrue());
            resultResponse.setSoTLSai(re.getNumFalse());
            resultResponse.setResult(re);
            Float soCd = Float.valueOf(re.getNumTrue());
            Float tongCh = Float.valueOf(tongCauHoi.size());
            resultResponse.setPhanTram(soCd /tongCh * 100);
            result.add(resultResponse);
        }
        return result;
    }
    public void deleteByExamId(Long examId) {
        resultRepository.deleteByExamId(examId);  // Phương thức này cần định nghĩa trong ResultRepository
    }
}
