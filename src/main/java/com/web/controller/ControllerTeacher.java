package com.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/teacher")
public class ControllerTeacher {

    @RequestMapping(value = {"/addbaihoc"}, method = RequestMethod.GET)
    public String addbaihoc() {
        return "teacher/addbaihoc.html";
    }

    @RequestMapping(value = {"/addtailieu"}, method = RequestMethod.GET)
    public String addtailieu() {
        return "teacher/addtailieu.html";
    }

    @RequestMapping(value = {"/baihoc"}, method = RequestMethod.GET)
    public String baihoc() {
        return "teacher/baihoc.html";
    }

    @RequestMapping(value = {"/chapter"}, method = RequestMethod.GET)
    public String chapter() {
        return "teacher/chapter.html";
    }

    @RequestMapping(value = {"/doimatkhau"}, method = RequestMethod.GET)
    public String doimatkhau() {
        return "teacher/doimatkhau.html";
    }

    @RequestMapping(value = {"/khoahoccuatoi"}, method = RequestMethod.GET)
    public String khoahoccuatoi() {
        return "teacher/khoahoccuatoi.html";
    }

    @RequestMapping(value = {"/tailieu"}, method = RequestMethod.GET)
    public String tailieu() {
        return "teacher/tailieu.html";
    }

    @RequestMapping(value = {"/thongke"}, method = RequestMethod.GET)
    public String thongke() {
        return "teacher/thongke.html";
    }


    @RequestMapping(value = {"/thongtincanhan"}, method = RequestMethod.GET)
    public String taikhoan() {
        return "teacher/taikhoan.html";
    }

}
