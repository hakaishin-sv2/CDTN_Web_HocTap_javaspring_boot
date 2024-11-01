package com.web.repository;

import com.web.entity.Result;
import com.web.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    @Query("select u from Unit u where u.chapter.id = ?1")
    List<Unit> findByChapter(Long chapterId);

    @Query("select u from Unit u where u.chapter.course.id = ?1")
    List<Unit> findByCourse(Long courseId);
}
