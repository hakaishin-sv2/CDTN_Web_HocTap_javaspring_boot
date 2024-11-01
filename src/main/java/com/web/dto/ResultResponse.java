package com.web.dto;

import com.web.entity.Exam;
import com.web.entity.Result;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ResultResponse {

    private Integer tongCauHoi;

    private Integer soTLDung;

    private Integer soTLSai;

    private Integer soCauBo;

    private Float phanTram;

    private Result result;
}
