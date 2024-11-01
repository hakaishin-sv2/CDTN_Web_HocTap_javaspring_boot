package com.web.repository;

import com.web.entity.CourseUser;
import com.web.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DocumentRepository  extends JpaRepository<Document, Long> {

    @Query("select  d from Document d where d.course.id = ?1")
    List<Document> findByCourse(Long courseId);

    @Query("select  d from Document d where d.course.teacher.id = ?1")
    List<Document> findByTeacher(Long teacherId);
}
