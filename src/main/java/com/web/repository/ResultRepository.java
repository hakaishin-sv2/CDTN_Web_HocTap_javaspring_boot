package com.web.repository;

import com.web.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {

    @Query("select r from Result r where r.user.id = ?1")
    public List<Result> findByUser(Long userId);

    @Query("select r from Result r where r.exam.id = ?1")
    public List<Result> findByExam(Long examId);

    @Query("select r from Result r where r.user.id = ?1 and r.exam.id = ?2")
    Optional<Result> findByUserAndExam(Long userId, Long examId);
}