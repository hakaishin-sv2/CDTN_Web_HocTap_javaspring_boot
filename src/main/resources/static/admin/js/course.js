async function loadCourse() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/course/public/find-all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td><img src="${list[i].image}" style="width:100px"></td>
                    <td>${list[i].name}</td>
                    <td>${list[i].category.name}</td>
                    <td>${formatmoney(list[i].price)}</td>
                    <td>${list[i].startDate}</td>
                    <td>${list[i].studyTime}</td>
                    <td class="sticky-col">
                        <i onclick="xoaKhoaHoc(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a href="addkhoahoc?id=${list[i].id}" onclick="loadACategory(${list[i].id})"><i class="fa fa-edit iconaction"></i></a>
                        <i onclick="loadDanhSachHocVien(${list[i].id})" data-bs-toggle="modal" data-bs-target="#addtk" class="fa fa-eye iconaction"></i>
                    </td>
                </tr>`
    }
    document.getElementById("listcourse").innerHTML = main
    $('#example').DataTable();
}

function checkFree(e){
    if(e.checked == true){
        document.getElementById("hocphi").value = "";
        document.getElementById("hocphi").readOnly  = true;
        document.getElementById("hocphicu").value = "";
        document.getElementById("hocphicu").readOnly = true;

    }
    else{
        document.getElementById("hocphi").readOnly  = false;
        document.getElementById("hocphicu").readOnly = false;
    }
}

var linkImage = '';
var linkBanner = '';
async function saveCourse() {
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");

    var linkImagecheck = await uploadAnh(document.getElementById("anhdaidien"));
    var linkBannercheck = await uploadAnh(document.getElementById("imagebanner"));
    if(linkImagecheck != null){linkImage = linkImagecheck}
    if(linkBannercheck != null){linkBanner = linkBannercheck}
    
    var course = {
        "id": id,
        "name": document.getElementById("tenkh").value,
        "image": linkImage,
        "banner": linkBanner,
        "price": document.getElementById("hocphi").value,
        "oldPrice": document.getElementById("hocphicu").value,
        "description": tinyMCE.get('editor').getContent(),
        "instruct": tinyMCE.get('editorch').getContent(),
        "dayOfWeek": $("#thutrongtuan").val().toString(),
        "studyTime": document.getElementById("giohoc").value,
        "startDate": document.getElementById("tungay").value,
        "endDate": document.getElementById("denngay").value,
        "isFree": document.getElementById("isFree").checked,
        "teacher": {
            "id":document.getElementById("giangvien").value
        },
        "category": {
            "id":document.getElementById("danhmuckhoahoc").value
        },
        "promises": listCamKet,
    }
    console.log(course);

    const response = await fetch('http://localhost:8080/api/course/admin/create-update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(course)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa khóa học thành công!",
                type: "success"
            },
            function() {
                window.location.replace('khoahoc')
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
    document.getElementById("loading").style.display = 'none'
}


async function loadACourse() {
    var id = window.location.search.split('=')[1];
    if (id != null) {
        document.getElementById("btnthemkhoahoc").innerHTML = `<i class="fa fa-edit"></i> Cập nhật khóa học`
        var url = 'http://localhost:8080/api/course/public/findById?id=' + id;
        var response = await fetch(url, {
        });
        var result = await response.json();
        console.log(result);
        document.getElementById("tenkh").value = result.name
        document.getElementById("tungay").value = result.startDate
        linkBanner = result.banner
        linkImage = result.image
        document.getElementById("imgpreview").src = result.image
        document.getElementById("hocphi").value = result.price
        document.getElementById("denngay").value = result.endDate
        document.getElementById("giangvien").value = result.teacher.id
        document.getElementById("hocphicu").value = result.oldPrice
        document.getElementById("isFree").checked = result.isFree

        if(result.isFree == true){
            document.getElementById("hocphi").readOnly  = true;
            document.getElementById("hocphicu").readOnly = true;
        }

        $("#thutrongtuan").val(result.dayOfWeek.split(",")).change()
        document.getElementById("giohoc").value = result.studyTime
        tinyMCE.get('editor').setContent(result.description)
        tinyMCE.get('editorch').setContent(result.instruct)
        await loadCategoryKhoaHoc();
        document.getElementById("danhmuckhoahoc").value = result.category.id


        var main = '';
        for(i=0; i<result.promises.length; i++){
            main += `<div class="singlebonho">
            Cam kết: ${result.promises[i].content} 
            <i onclick="xoaCamKet(${result.promises[i].id})" class="fa fa-trash iconxoabn"></i>
            <i onclick="loadACamKet(${result.promises[i].id})" data-bs-toggle="modal" data-bs-target="#capnhatmodal" class="fa fa-edit iconedit"></i>
        </div>`
        }
        document.getElementById("listcamketdathem").innerHTML = main
    }
}

async function loadACamKet(id) {
    var url = 'http://localhost:8080/api/promise/public/findById?id=' + id;
    var response = await fetch(url, {
    });
    var result = await response.json();
    document.getElementById("idcamketupdate").value = result.id
    document.getElementById("camketupdate").value = result.content
}

async function updateCamKet() {
    var prom = {
        "id": document.getElementById("idcamketupdate").value,
        "content": document.getElementById("camketupdate").value,
    }
    const response = await fetch('http://localhost:8080/api/promise/admin/update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(prom)
    });
    if (response.status < 300) {
        toastr.success("Cập nhật thành công");
        loadACourse();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
    document.getElementById("loadingupdate").style.display = 'none'
}



async function uploadAnh(filePath){
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        var linkImage = await res.text();
        return linkImage
    }
    else{
        return null;
    }
}

var listCamKet = [];
function addCamKet(){
    var obj = {
        "content":document.getElementById("camket").value
    }
    listCamKet.push(obj);
    setPreviewCamKet();
}

function setPreviewCamKet(){
    var main = '';
    for(i=0; i< listCamKet.length; i++){
        main += `
        <div class="singlebonho">
            Nội dung cam kết: ${listCamKet[i].content} <i onclick="deleteCamKetTam(${i})" class="fa fa-trash iconxoabn"></i>
        </div>
        `
    }
    document.getElementById("listcamket").innerHTML = main;
}

function deleteCamKetTam(id){
    listCamKet.splice(id, 1);
    toastr.success("Đã xóa cam kết khỏi bộ nhớ tạm");
    setPreviewCamKet();
}


async function xoaKhoaHoc(id){
    var con = confirm("Xác nhận xóa khóa học này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/course/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadCourse();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function xoaCamKet(id){
    var con = confirm("Xác nhận xóa?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/promise/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadACourse();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}



async function loadCourseSelectAddBaiThi() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/course/public/find-all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("khoahocbaithi").innerHTML = main
}

async function loadDanhSachHocVien(id) {
    $('#exampletr').DataTable().destroy();
    var url = 'http://localhost:8080/api/course-user/admin/find-by-course?id=' + id;
    var response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for(i=0; i<list.length; i++){
        main += `<tr>
        <td>${list[i].id}</td>
        <td>${list[i].fullName}</td>
        <td>${list[i].phone}</td>
        <td>${list[i].email}</td>
        <td>${list[i].createdDate}</td>
        <td>${list[i].note}</td>
        <td class="sticky-col">
            <i onclick="xoaKhoaHocUser(${list[i].id}, ${id})" class="fa fa-trash-alt iconaction"></i>
            <a href="hocvien?id=${list[i].user.id}&course=${id}" target="_blank"><i class="fa fa-edit iconaction"></i></a>
        </td>
    </tr>`
    }
    document.getElementById("listcourseuser").innerHTML = main
    $('#exampletr').DataTable();
}


async function xoaKhoaHocUser(id, idcourse){
    var con = confirm("Xác nhận xóa học viên này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/course-user/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadDanhSachHocVien(idcourse);
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


async function loadCourseSelectBaiThi() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/course/public/find-all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '<option value="-1">Tất cả bài thi</option>';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("khoahocbaithi").innerHTML = main
}



async function loadThongTinHocVien() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var course = uls.searchParams.get("course");
    var url = 'http://localhost:8080/api/exam/admin/thong-tin-hoc-vien?course='+course+'&user='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var hocvien = await response.json();
    console.log(hocvien);
    document.getElementById("imageuser").src = hocvien.user.avatar
    document.getElementById("hotenhv").innerHTML = hocvien.user.fullName
    document.getElementById("email").innerHTML = hocvien.user.email
    document.getElementById("tenkhoahoc").innerHTML = hocvien.course.name
    document.getElementById("level").value = hocvien.courseUser.level
    document.getElementById("ngaydki").innerHTML = formatdate(hocvien.courseUser.createdDate)
    var tongDiem = 0;
    var main = '';
    for(i=0; i<hocvien.exams.length; i++){
        main += `<tr>
        <td>${hocvien.exams[i].id}</td>
        <td>${hocvien.exams[i].name}</td>
        <td>${hocvien.exams[i].limitTime}</td>
        <td>${hocvien.exams[i].examTime}, ${hocvien.exams[i].examDate}</td>
        <td>${hocvien.exams[i].coefficient}%</td>
        <td>${hocvien.exams[i].lessons.length}</td>
    </tr>`
    }
    document.getElementById("listdethi").innerHTML = main

    var main = '';
    for(i=0; i<hocvien.results.length; i++){
        tongDiem += hocvien.results[i].phanTram * hocvien.results[i].result.exam.coefficient / 100
        main += `<tr>
        <td>${hocvien.results[i].result.exam.id}</td>
        <td>${hocvien.results[i].result.exam.name}</td>
        <td>${hocvien.results[i].result.finishTime} giây</td>
        <td>${hocvien.results[i].phanTram.toFixed(2)} %</td>
        <td>${hocvien.results[i].result.exam.coefficient} %</td>
    </tr>`
    }
    document.getElementById("baithidalam").innerHTML = main
    document.getElementById("tongdiem").innerHTML = tongDiem.toFixed(2)
}



async function loadThongTinHocVienChungChi() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var course = uls.searchParams.get("course");
    var url = 'http://localhost:8080/api/exam/admin/thong-tin-hoc-vien?course='+course+'&user='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var hocvien = await response.json();
    console.log(hocvien);
    document.getElementById("tenhocvien").innerHTML = hocvien.user.fullName
    document.getElementById("tenkhoahoc").innerHTML = hocvien.course.name
    document.getElementById("loaicc").innerHTML = hocvien.courseUser.level
}




async function thongKe() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var course = uls.searchParams.get("course");
    var url = 'http://localhost:8080/api/chapter/all/find-by-course?course='+course;
    var response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    var main = `<tr>`;
    for (i = 0; i < list.length; i++) {
        main += `<th class="text-center" colspan="${list[i].units.length}">${list[i].name}</th>`
    }
    main += `<th class="sticky-col">Tổng</th>
    </tr>`;
    document.getElementById("chuongtk").innerHTML = main
    document.getElementById("listthongke").innerHTML = ""

    main = '<tr>';
    for (i = 0; i < list.length; i++) {
        var listUnit = list[i].units;
        for(j=0; j<listUnit.length; j++){
            main += `<td class="text-center small-text">${listUnit[j].name}</td>`
        }
    }
    main += `<td class="sticky-col"></td>
    </tr>`;
    document.getElementById("chuongtk").innerHTML += main


    var url = 'http://localhost:8080/api/user-unit/admin/thong-ke?course='+course+'&userId='+id;
    var response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    console.log(list);

    for (i = 0; i < list.length; i++) {
        var main = `<tr>`;
        var listUnit = list[i].units;

        var tonghoc = 0;
        for(j=0; j<listUnit.length; j++){
            if(listUnit[j].daHoc == true){
                main += `<td>${listUnit[j].createdDate}</td>`
                tonghoc += Number(1)
            }
            else{
                main += `<td><span class="text-red">x</span></td>`
            }
        }

        main += `<td class="sticky-col">${tonghoc}/ ${listUnit.length}</td>
        </tr>`;
        document.getElementById("listthongke").innerHTML += main
    }

}


async function updateCC() {
    var con = confirm("Xác nhận cập nhật chứng chỉ?");
    if (con == false) {
        return;
    }

    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var course = uls.searchParams.get("course");
    var level = document.getElementById("level").value
    var url = 'http://localhost:8080/api/course-user/admin/update-cc?courseId='+course+"&userId="+id+'&level='+level;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if (response.status < 300) {
        toastr.success("Cập nhật thành công!");
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}
