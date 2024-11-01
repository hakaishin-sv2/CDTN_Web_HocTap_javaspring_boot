package com.web.service;

import com.web.entity.Chapter;
import com.web.entity.Unit;
import com.web.entity.User;
import com.web.repository.ChapterRepository;
import com.web.repository.UnitRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;

@Component
public class UnitService {

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UserUtils userUtils;

    public Unit save(Unit unit) {
        unit.setUpdateDate(new Timestamp(System.currentTimeMillis()));
        unitRepository.save(unit);
        return unit;
    }

    public void delete(Long id) {
        unitRepository.deleteById(id);
    }

    public Unit findById(Long id) {
        return unitRepository.findById(id).get();
    }

    public List<Unit> findByChapter(Long chapterId) {
        List<Unit> list = unitRepository.findByChapter(chapterId);
        return list;
    }


}