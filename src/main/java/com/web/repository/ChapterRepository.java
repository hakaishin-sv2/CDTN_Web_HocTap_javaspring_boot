package com.web.repository;

import com.web.entity.Chapter;
import com.web.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    @Query("select c from Chapter c where c.course.id = ?1")
    List<Chapter> findByCourse(Long courseId);

}
