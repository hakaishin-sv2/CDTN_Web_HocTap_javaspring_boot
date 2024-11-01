package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "unit")
@Getter
@Setter
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String name;

    private String content;

    private String video;

    private Integer minStudyTime;

    private Timestamp updateDate;

    private String learning_material;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    @JsonIgnoreProperties(value = {"units"})
    private Chapter chapter;

    @Transient
    private Boolean locked = true;
}