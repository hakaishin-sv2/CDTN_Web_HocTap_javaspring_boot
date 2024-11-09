var token = localStorage.getItem("token");
async function loadExam() {
    $('#example').DataTable().destroy();
    var course = document.getElementById("khoahocbaithi").value;
    var url = 'http://localhost:8080/api/exam/public/findAll';
    if(course != -1){
        url += '?course='+course
    }
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    //console.log(list);
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].name}</td>
                    <td>${list[i].limitTime} phút</td>
                    <td>${list[i].examDate}</td>
                    <td>${list[i].examTime}</td>
                    <td>${list[i].coefficient}%</td>
                    <td>id: ${list[i].course.id}- ${list[i].course.name}</td>
                    <td>${list[i].lessons.length}</td>
                    <td>
                        <select onchange="updateTrangThai(this,${list[i].id})" class="form-control">
                            <option ${list[i].trangThai == 'CHUA_THI'?'selected':''} value="CHUA_THI">Chưa thi</option>
                            <option ${list[i].trangThai == 'DANG_THI'?'selected':''} value="DANG_THI">Đang thi</option>
                            <option ${list[i].trangThai == 'DA_KET_THUC'?'selected':''} value="DA_KET_THUC">Đã kết thúc</option>
                        </select>
                    </td>
                    <td class="sticky-col">
                        <i onclick="xoaBaiThi(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a href="addbaithi?id=${list[i].id}" onclick="loadACategory(${list[i].id})"><i class="fa fa-edit iconaction"></i></a>
                        <br><br><button onclick="loadDsLesson(${list[i].id})" data-bs-toggle="modal" data-bs-target="#phanthimodal" class="btn btn-primary form-control">Phần thi</button>
                        <br><br><a href="ketqua?exam=${list[i].id}" class="btn btn-primary form-control">Kết quả</a>
                    </td>
                </tr>`
    }
    document.getElementById("listexam").innerHTML = main
    $('#example').DataTable();
}

async function updateTrangThai(e, id) {
    const response = await fetch('http://localhost:8080/api/exam/admin/update-trangthai?id='+id+'&trangthai='+e.value, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Cập nhật thành công");
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function loadAExam() {
    var id = window.location.search.split('=')[1];

    if (id != null) {
        document.getElementById("btnthemdethi").innerHTML = `<i class="fa fa-edit"></i> Cập nhật đề thi`
        var url = 'http://localhost:8080/api/exam/public/findById?id=' + id;
        var response = await fetch(url, {
        });
        var result = await response.json();
        console.log(result);
        document.getElementById("tenbaithi").value = result.name
        document.getElementById("limittime").value = result.limitTime
        document.getElementById("ngaythi").value = result.examDate
        document.getElementById("giothi").value = result.examTime.split(":")[0]+":"+result.examTime.split(":")[1]
        document.getElementById("heso").value = result.coefficient
        await loadCourseSelectAddBaiThi();
        document.getElementById("khoahocbaithi").value = result.course.id

        var url = 'http://localhost:8080/api/lesson/public/find-by-exam?id=' + id;
        var response = await fetch(url, {
        });
        var list = await response.json();
        var main = '';
        for(i=0; i<list.length; i++){
            main += `<div class="singlebonho">
            Tên bài thi: ${list[i].name} -  ${list[i].category.name} 
            <i onclick="xoaPhanThi(${list[i].id})" class="fa fa-trash iconxoabn"></i>
            <i onclick="loadALesson(${list[i].id})" data-bs-toggle="modal" data-bs-target="#suaphanthi" class="fa fa-edit iconedit"></i>
        </div>`
        }
        document.getElementById("listphanthidathem").innerHTML = main
    }
}


var lessonLink = '';
async function loadALesson(id) {
    var url = 'http://localhost:8080/api/lesson/public/findById?id=' + id;
    var response = await fetch(url, {
    });
    var result = await response.json();
    document.getElementById("idlesson").value = result.id
    document.getElementById("tenphanthiupdate").value = result.name
    document.getElementById("danhmucphanthiupdate").value = result.category.id
    lessonLink = result.linkFile
    tinyMCE.get('editorupdate').setContent(result.content)
    document.getElementById("kynangupdate").value = result.skill
}

async function updateLesson() {
    document.getElementById("loadingupdate").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    const filePath = document.getElementById('chonfilenngheupdate')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    const res = await fetch('http://localhost:8080/api/public/upload-file', {
        method: 'POST',  body: formData
    });
    if (res.status < 300) { lessonLink = await res.text(); }
    var phanthi = {
        "id": document.getElementById("idlesson").value,
        "name": document.getElementById("tenphanthiupdate").value,
        "content": tinyMCE.get('editorupdate').getContent(),
        "linkFile": lessonLink,
        "skill": document.getElementById("kynangupdate").value,
        "exam": {
            "id":id
        },
        "category": {
            "id":document.getElementById("danhmucphanthiupdate").value
        },
    }

    const response = await fetch('http://localhost:8080/api/lesson/admin/update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(phanthi)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa phần thi thành công!",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
    document.getElementById("loadingupdate").style.display = 'none'
}


async function saveExam() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");

    var baithi = {
        "id": id,
        "name": document.getElementById("tenbaithi").value,
        "limitTime": document.getElementById("limittime").value,
        "examDate": document.getElementById("ngaythi").value,
        "examTime": document.getElementById("giothi").value,
        "coefficient": document.getElementById("heso").value,
        "lessonDtos": listPhanThi,
        "course": {
            "id":document.getElementById("khoahocbaithi").value
        },
    }

    const response = await fetch('http://localhost:8080/api/exam/admin/create-update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(baithi)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa bài thi thành công!",
                type: "success"
            },
            function() {
                window.location.replace('baithi')
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

var listPhanThi = [];
async function addPhanThi() {
    document.getElementById("loading").style.display = 'block'
    var linkFile = '';
    const filePath = document.getElementById('chonfilennghe')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    const res = await fetch('http://localhost:8080/api/public/upload-file', {
        method: 'POST',  body: formData
    });
    if (res.status < 300) { linkFile = await res.text(); }
    var phanthi = {
        "name": document.getElementById("tenphanthi").value,
        "skill": document.getElementById("kynang").value,
        "content":  tinyMCE.get('editor').getContent(),
        "linkFile": linkFile,
        "category": {
            "id":document.getElementById("danhmucphanthi").value
        },
    }
    listPhanThi.push(phanthi);
    document.getElementById("loading").style.display = 'none'
    toastr.success("Đã thêm vào bộ nhớ tạm")
    setPreviewPhanThi();
}

function setPreviewPhanThi(){
    var main = '';
    console.log(listPhanThi);
    for(i=0; i< listPhanThi.length; i++){
        main += `
        <div class="singlebonho">
            Tên phần thi: ${listPhanThi[i].name} <i onclick="deletePhanThiTam(${i})" class="fa fa-trash iconxoabn"></i>
        </div>
        `
    }
    document.getElementById("listphanthitam").innerHTML = main;
}

function deletePhanThiTam(id){
    listPhanThi.splice(id, 1);
    toastr.success("Đã xóa phần thi khỏi bộ nhớ tạm");
    setPreviewPhanThi();
}

async function xoaPhanThi(id){
    var con = confirm("Xác nhận xóa phần thi này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/lesson/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa phần thi thành công!");
        loadAExam();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function xoaBaiThi(id){
    var con = confirm("Xác nhận xóa bài thi này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/exam/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa bài thi thành công!");
        loadExam();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function loadDsLesson(id){
    var url = 'http://localhost:8080/api/lesson/public/find-by-exam?id=' + id;
    var response = await fetch(url, {
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for(i=0; i<list.length; i++){
        main += `<tr>
            <td>${list[i].id}</td>
            <td>${list[i].name}</td>
            <td>${list[i].category.name}</td>
            <td>${list[i].skill == "TULUAN"?`<a href="${list[i].linkFile}" target="_blank">Xem file Tự Luận</a>`:""}</td>
            <td class="tdcol"><div class="noidunglesson">${list[i].content}</div></td>
            <td>${list[i].questions.length}</td>
            <td><a target="_blank" href="cauhoi?exam=${list[i].id}" class="btn btn-primary">Danh sách câu hỏi</a></td>
        </tr>`
    }
    document.getElementById("listlesson").innerHTML = main
}