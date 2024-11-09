package com.web.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/admin")
public class ControllerAdmin {

    @RequestMapping(value = {"/addbaithi"}, method = RequestMethod.GET)
    public String addbaithi() {
        return "admin/addbaithi";
    }

    @RequestMapping(value = {"/addblog"}, method = RequestMethod.GET)
    public String addblog() {
        return "admin/addblog";
    }

    @RequestMapping(value = {"/addkhoahoc"}, method = RequestMethod.GET)
    public String addkhoahoc() {
        return "admin/addkhoahoc";
    }

    @RequestMapping(value = {"/baihoc"}, method = RequestMethod.GET)
    public String baihoc() {
        return "admin/baihoc";
    }

    @RequestMapping(value = {"/baithi"}, method = RequestMethod.GET)
    public String baithi() {
        return "admin/baithi";
    }

    @RequestMapping(value = {"/blog"}, method = RequestMethod.GET)
    public String blog() {
        return "admin/blog";
    }

    @RequestMapping(value = {"/cauhoi"}, method = RequestMethod.GET)
    public String cauhoi() {
        return "admin/cauhoi";
    }

    @RequestMapping(value = {"/danhmuc"}, method = RequestMethod.GET)
    public String danhmuc() {
        return "admin/danhmuc";
    }

    @RequestMapping(value = {"/doanhthu"}, method = RequestMethod.GET)
    public String doanhthu() {
        return "admin/doanhthu";
    }

    @RequestMapping(value = {"/doimatkhau"}, method = RequestMethod.GET)
    public String doimatkhau() {
        return "admin/doimatkhau";
    }

    @RequestMapping(value = {"/hocvien"}, method = RequestMethod.GET)
    public String hocvien() {
        return "admin/hocvien";
    }

    @RequestMapping(value = {"/index"}, method = RequestMethod.GET)
    public String index() {
        return "admin/index";
    }

    @RequestMapping(value = {"/ketqua"}, method = RequestMethod.GET)
    public String ketqua() {
        return "admin/ketqua";
    }

    @RequestMapping(value = {"/khoahoc"}, method = RequestMethod.GET)
    public String khoahoc() {
        return "admin/khoahoc";
    }

    @RequestMapping(value = {"/taikhoan"}, method = RequestMethod.GET)
    public String taikhoan() {
        return "admin/taikhoan";
    }

    @RequestMapping(value = {"/taochungchi"}, method = RequestMethod.GET)
    public String taochungchi() {
        return "admin/taochungchi";
    }

    @RequestMapping(value = {"/addthanhvien"}, method = RequestMethod.GET)
    public String addhocvien() {
        return "admin/addthanhvien";
    }
}
