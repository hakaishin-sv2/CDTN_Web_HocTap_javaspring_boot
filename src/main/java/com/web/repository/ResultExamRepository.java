package com.web.repository;

import com.web.entity.ResultExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ResultExamRepository extends JpaRepository<ResultExam, Long> {
    void deleteByResult_Id(Long resultId);

    void deleteByAnswer_Id(Long answerId);
}
