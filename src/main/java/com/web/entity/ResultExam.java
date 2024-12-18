package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "result_exam_detail")
@Getter
@Setter
public class ResultExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "answers_id")
    private Answer answer;



    @ManyToOne(cascade = CascadeType.ALL)  // Đảm bảo sử dụng CascadeType.REMOVE
    @JoinColumn(name = "result_id")
    @JsonIgnoreProperties(value = {"resultExams"})
    private Result result;

}
