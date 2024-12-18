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
    // Hiển thị loading
    document.getElementById("loadingupdate").style.display = 'block';

    // Lấy các giá trị từ form
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("id");
    const filePath = document.getElementById('chonfilenngheupdate');
    const tenphanthi = document.getElementById("tenphanthiupdate").value;
    const danhmucphanthi = document.getElementById("danhmucphanthiupdate").value;
    const kynang = document.getElementById("kynangupdate").value;

    // Validate các trường nhập
    let errorMessages = '';
    if (!tenphanthi) {
        errorMessages += 'Tên phần thi không được để trống. <br>';
    }
    if (!danhmucphanthi) {
        errorMessages += 'Danh mục không được để trống. <br>';
    }
    if (!kynang) {
        errorMessages += 'Kỹ năng không được chọn. <br>';
    }
    if (kynang === 'LISTENING' && !filePath.files.length) {
        errorMessages += 'Vui lòng chọn file MP4 nếu là bài nghe. <br>';
    }

    if (errorMessages) {
        // Hiển thị thông báo lỗi nếu có
        swal({
            title: "Lỗi",
            text: errorMessages,
            type: "error"
        });
        document.getElementById("loadingupdate").style.display = 'none';
        return;  // Dừng hàm nếu có lỗi
    }

    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append("file", filePath.files[0]);

    // Gửi yêu cầu tải tệp lên server
    const res = await fetch('http://localhost:8080/api/public/upload-file', {
        method: 'POST',
        body: formData
    });

    let lessonLink = '';  // Biến lưu đường dẫn file
    if (res.status < 300) {
        lessonLink = await res.text();
    }

    // Tạo đối tượng dữ liệu cho phần thi
    var phanthi = {
        "id": document.getElementById("idlesson").value,
        "name": tenphanthi,
        "content": tinyMCE.get('editorupdate').getContent(),
        "linkFile": lessonLink,
        "skill": kynang,
        "exam": {
            "id": id
        },
        "category": {
            "id": danhmucphanthi
        },
    };

    // Gửi yêu cầu cập nhật phần thi
    const response = await fetch('http://localhost:8080/api/lesson/admin/update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(phanthi)
    });

    // Kiểm tra kết quả phản hồi từ server
    if (response.status < 300) {
        swal({
            title: "Thông báo",
            text: "Thêm/sửa phần thi thành công!",
            type: "success"
        }, function() {
            window.location.reload();  // Tải lại trang sau khi cập nhật thành công
        });
    } else if (response.status === exceptionCode) {
        var result = await response.json();
        toastr.warning(result.defaultMessage);
    }

    // Ẩn loading sau khi hoàn thành
    document.getElementById("loadingupdate").style.display = 'none';
}



async function saveExam() {
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("id");

    // Lấy giá trị từ các input
    var tenBaithi = document.getElementById("tenbaithi").value;
    var limitTime = document.getElementById("limittime").value;
    var examDate = document.getElementById("ngaythi").value;
    var examTime = document.getElementById("giothi").value;
    var coefficient = document.getElementById("heso").value;
    var courseId = document.getElementById("khoahocbaithi").value;

    // Ẩn tất cả thông báo lỗi
    document.getElementById("error-tenbaithi").style.display = "none";
    document.getElementById("error-limittime").style.display = "none";
    document.getElementById("error-ngaythi").style.display = "none";
    document.getElementById("error-giothi").style.display = "none";
    document.getElementById("error-heso").style.display = "none";
    document.getElementById("error-khoahoc").style.display = "none";

    // Kiểm tra dữ liệu nhập vào
    var errorMessages = false;

    // Kiểm tra tên bài thi
    if (!tenBaithi) {
        document.getElementById("error-tenbaithi").style.display = "block";
        errorMessages = true;
    }
    if (!coefficient) {
        document.getElementById("error-konhapheso").style.display = "block";
        errorMessages = true;
    }
    // Kiểm tra thời gian giới hạn
    if (!limitTime || limitTime <= 0) {
        document.getElementById("error-limittime").style.display = "block";
        errorMessages = true;
    }

    // Kiểm tra hệ số điểm
    if (coefficient < 0 || coefficient > 100) {
        document.getElementById("error-heso").style.display = "block";
        errorMessages = true;
    }

    // Kiểm tra ngày thi
    if (!examDate) {
        document.getElementById("error-ngaythi").style.display = "block";
        errorMessages = true;
    }

    // Kiểm tra khóa học
    if (!courseId) {
        document.getElementById("error-khoahoc").style.display = "block";
        errorMessages = true;
    }
    if (id === null && listPhanThi.length===0) {
        document.getElementById("error-phanthi").style.display = "block";
        errorMessages = true;
    }
    // Nếu có lỗi, dừng và hiển thị thông báo
    if (errorMessages) {
        toastr.error("Vui lòng kiểm tra các trường thông tin bắt buộc.");
        return; // Dừng không gửi dữ liệu nếu có lỗi
    }

    // Tạo đối tượng baithi
    var baithi = {
        "id": id,
        "name": tenBaithi,
        "limitTime": limitTime,
        "examDate": examDate,
        "examTime": examTime,
        "coefficient": coefficient,
        "lessonDtos": listPhanThi,
        "course": {
            "id": courseId
        },
    }

    // Gửi yêu cầu POST để thêm/sửa bài thi
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
                text: "Thêm/sửa bài thi thành công!",
                type: "success"
            },
            function() {
                window.location.replace('baithi');
            });
    } else if (response.status == exceptionCode) {
        var result = await response.json();
        toastr.warning(result.defaultMessage);
    }
}


var listPhanThi = [];
async function addPhanThi() {
    // Hiển thị loading khi thực hiện
    document.getElementById("loading").style.display = 'block';

    // Kiểm tra các trường bắt buộc
    var tenphanthi = document.getElementById("tenphanthi").value;
    var kynang = document.getElementById("kynang").value;
    var linkFile = '';
    var filePath = document.getElementById('chonfilennghe');
    var content = tinyMCE.get('editor').getContent();
    var danhmuc = document.getElementById("danhmucphanthi").value;

    if (!tenphanthi || !kynang || !danhmuc ) {
        // Nếu có trường bắt buộc chưa được điền, hiển thị cảnh báo
        toastr.warning("Vui lòng điền đầy đủ thông tin các trường bắt buộc!");
        document.getElementById("loading").style.display = 'none'; // Ẩn loading
        return; // Dừng lại không thực hiện các bước tiếp theo
    }

    // Tiến hành upload file
    const formData = new FormData();
    formData.append("file", filePath.files[0]);

    const res = await fetch('http://localhost:8080/api/public/upload-file', {
        method: 'POST',
        body: formData
    });

    if (res.status < 300) {
        linkFile = await res.text(); // Lấy link file trả về
    }

    // Tạo đối tượng phần thi
    var phanthi = {
        "name": tenphanthi,
        "skill": kynang,
        "content": content,
        "linkFile": linkFile,
        "category": {
            "id": danhmuc
        },
    }

    // Thêm phần thi vào bộ nhớ tạm
    listPhanThi.push(phanthi);

    // Ẩn loading và hiển thị thông báo thành công
    document.getElementById("loading").style.display = 'none';
    toastr.success("Đã thêm vào bộ nhớ tạm");

    // Cập nhật preview phần thi
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