package com.web.service;

import com.web.dto.ExamDto;
import com.web.dto.HocVienDto;
import com.web.dto.LessonDto;
import com.web.dto.ResultResponse;
import com.web.entity.*;
import com.web.enums.TrangThai;
import com.web.repository.*;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Component
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ResultExamRepository resultExamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseUserRepository courseUserRepository;

    public Exam createUpdate(ExamDto examDto){
        Exam exam = new Exam();
        exam.setCourse(examDto.getCourse());
        exam.setId(examDto.getId());
        exam.setLimitTime(examDto.getLimitTime());
        exam.setName(examDto.getName());
        exam.setExamDate(examDto.getExamDate());
        exam.setExamTime(examDto.getExamTime());
        exam.setCoefficient(examDto.getCoefficient());
        exam.setUpdateDate(new Timestamp(System.currentTimeMillis()));
        exam.setTrangThai(TrangThai.CHUA_THI);
        if(examDto.getId() != null){
            Exam ex = examRepository.findById(examDto.getId()).get();
            exam.setTrangThai(ex.getTrangThai());
            if(ex.getTrangThai() == null){
                exam.setTrangThai(TrangThai.CHUA_THI);
            }
        }
        Exam result =examRepository.save(exam);
        for(LessonDto l : examDto.getLessonDtos()){
            Lesson lesson = new Lesson();
            lesson.setExam(result);
            lesson.setCategory(l.getCategory());
            lesson.setName(l.getName());
            lesson.setSkill(l.getSkill());
            lesson.setContent(l.getContent());
            lesson.setLinkFile(l.getLinkFile());
            lessonRepository.save(lesson);
        }
        return result;
    }

    public List<Exam> findAll(Long courseId){
        List<Exam> list = null;
        if(courseId == null){
            list = examRepository.findAll();;
        }
        else{
            list = examRepository.findByCourse(courseId);;
        }
        list.forEach(p->{
            p.setNumLesson(p.getLessons().size());
        });
        return list;
    }

    public Page<Exam> findAll(Pageable pageable){
        Page<Exam> page = examRepository.findAll(pageable);
        page.getContent().forEach(p->{
            p.setNumLesson(p.getLessons().size());
        });
        return page;
    }

    public Page<Exam> search(Long category, String search, Pageable pageable){
        Page<Exam> page = null;
        if(search == null){
            search = "";
        }
        search = "%"+search+"%";
        if(category == null){
            page = examRepository.search(search, pageable);
        }
        else{
            page = examRepository.search(search,category, pageable);
        }
        page.getContent().forEach(p->{
            p.setNumLesson(p.getLessons().size());
        });
        return page;
    }

    public Exam findById(Long id){
        Exam exam = examRepository.findById(id).get();
        return exam;
    }

    @Transactional
    public void deleteExam(Long examId) {
        List<Result> results = resultRepository.findByExam_Id(examId);
        for (Result result : results) {
            resultExamRepository.deleteByResult_Id(result.getId());
        }

        resultRepository.deleteByExamId(examId);

        examRepository.deleteById(examId); // Xóa exam
    }



    public Exam findByIdAndUser(Long id){
        User user = userUtils.getUserWithAuthority();
        Exam exam = examRepository.findById(id).get();
        return exam;
    }

    public List<Exam> findByCourseAndUser(Long courseId){
        User user = userUtils.getUserWithAuthority();
        List<Exam> result = examRepository.findByCourse(courseId);
        for(Exam e : result){
            if(resultRepository.findByUserAndExam(user.getId(), e.getId()).isPresent()){
                e.setTrangThai(TrangThai.DA_KET_THUC);
            }
        }
        return result;
    }

    public HocVienDto getByCourseAndUserId(Long userId, Long courseId){
        HocVienDto hv = new HocVienDto();
        User user = userRepository.findById(userId).get();
        Course course = courseRepository.findById(courseId).get();
        hv.setUser(user);
        hv.setCourse(course);
        List<Exam> exams = examRepository.findByCourse(courseId);
        hv.setExams(exams);
        CourseUser courseUser = courseUserRepository.findByCourseAndUser(courseId, userId).get();
        hv.setCourseUser(courseUser);
        for(Exam e : exams){
            List<Question> tongCauHoi = new ArrayList<>();
            for(Lesson lesson : e.getLessons()){
                tongCauHoi.addAll(lesson.getQuestions());
            }
            Result re = resultRepository.findByUserAndExam(userId, e.getId()).get();
            ResultResponse resultResponse = new ResultResponse();
            resultResponse.setSoCauBo(re.getNumNotWork());
            resultResponse.setTongCauHoi(tongCauHoi.size());
            resultResponse.setSoTLDung(re.getNumTrue());
            resultResponse.setSoTLSai(re.getNumFalse());
            resultResponse.setResult(re);
            Float soCd = Float.valueOf(re.getNumTrue());
            Float tongCh = Float.valueOf(tongCauHoi.size());
            resultResponse.setPhanTram(soCd /tongCh * 100);
            hv.getResults().add(resultResponse);
        }
        return hv;
    }


    public void updateTrangThai(Long examId, TrangThai trangThai){
        Exam exam = examRepository.findById(examId).get();
        exam.setTrangThai(trangThai);
        examRepository.save(exam);
    }
}
