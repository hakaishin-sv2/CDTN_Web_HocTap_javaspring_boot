package com.web.repository;

import com.web.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("select c.course from CourseUser c where c.user.id = ?1")
    public List<Course> findByUser(Long userId);

    @Query("select c from Course c where c.teacher.id = ?1")
    public List<Course> findByTeacher(Long userId);


    @Query("select c from Course c where c.startDate >= ?1")
    public Page<Course> findByStartDate(Date currentDate, Pageable pageable);

    @Query("select c from Course c where c.startDate >= ?1 and c.name like ?2")
    public Page<Course> searchCourse(Date currentDate, String param, Pageable pageable);

    @Query("select c from Course c where c.startDate >= ?1 and c.name like ?2 and c.category.id = ?3")
    public Page<Course> searchCourse(Date currentDate, String param, Long categoryId, Pageable pageable);

    List<Course> findAllByOrderByCreatedDateDesc();

    Page<Course> findByIsfreeTrue(Pageable pageable); // Phân trang cho khóa học miễn phí
    Page<Course> findByIsfreeFalse(Pageable pageable); // Phân trang cho khóa học có phí
}
