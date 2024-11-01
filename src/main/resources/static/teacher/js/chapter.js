async function loadChapter() {
    $('#example').DataTable().destroy();
    var course = document.getElementById("khoahocselect").value
    var url = 'http://localhost:8080/api/chapter/all/find-by-course?course='+course;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    console.log(list);
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
        <td>${list[i].name}</td>
        <td>${list[i].course.name}</td>
        <td>
            <i onclick="deleteChapter(${list[i].id})" class="fa fa-trash icontable"></i>
            <a onclick="loadAChapter(${list[i].id})" data-bs-toggle="modal" data-bs-target="#addtk"><i class="fa fa-edit icontable"></i></a>
        </td>
        <td>
            <a href="baihoc?chapter=${list[i].id}&course=${list[i].course.id}">Xem bài học</a>
        </td>
    </tr>`
    }
    document.getElementById("listchapter").innerHTML = main
    $('#example').DataTable();
}


async function loadAChapter(id) {
    var url = 'http://localhost:8080/api/chapter/all/findById?id=' + id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    document.getElementById("idchapter").value = result.id
    document.getElementById("tenchapter").value = result.name
    document.getElementById("khoahocselectadd").value = result.course.id
}

function cleardata(){
    document.getElementById("idchapter").value = ""
    document.getElementById("tenchapter").value = ""
}

async function saveChapter() {
    var url = 'http://localhost:8080/api/chapter/teacher/create-update';
    var chapter = {
        "id": document.getElementById("idchapter").value,
        "name": document.getElementById("tenchapter").value,
        "course": {
            "id":document.getElementById("khoahocselectadd").value
        },
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(chapter)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa tài chapter công!",
                type: "success"
            },
            function() {
                loadChapter();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


async function deleteChapter(id) {
    var con = confirm("Bạn chắc chắn muốn xóa chapter này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/chapter/teacher/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadChapter();
    }
    else{
        if (response.status == exceptionCode) {
            var result = await response.json()
            toastr.warning(result.defaultMessage);
        }
        else{
            toastr.success("Xóa thất bại");
        }
    }
}

async function loadChapterSelect() {
    var uls = new URL(document.URL)
    var course = uls.searchParams.get("course");
    var chapter = uls.searchParams.get("chapter");
    var url = 'http://localhost:8080/api/chapter/all/find-by-course?course='+course;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += ` <option ${chapter == list[i].id?'selected':''} value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("chapterselect").innerHTML = main
}