async function loadQuestion() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("exam");
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/question/public/find-by-lesson?id='+id;
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        var ctl = ''
        for(j=0; j<list[i].answers.length; j++){
            ctl += `<span><i onclick="loadAAnsewr(${list[i].answers[j].id}, ${list[i].id})" data-bs-toggle="modal" data-bs-target="#addcautl" class="fa fa-edit iconctl"></i>
            <i onclick="deleteAnw(${list[i].answers[j].id})" class="fa fa-trash iconctl"></i>${list[i].answers[j].title} ${list[i].answers[j].isTrue == true? '<span class="icontrue"> - true</span>':''} </span><br><br>`
        }
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].title}</td>
                    <td>${list[i].lesson.name}</td>
                    <td>${list[i].lesson.exam.name}</td>
                    <td>${ctl}</td>
                    <td class="sticky-col">
                        <i onclick="deleteQuestion(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a data-bs-toggle="modal" data-bs-target="#addtk" href="#" onclick="loadAQuestion(${list[i].id})"><i class="fa fa-edit iconaction"></i></a>
                        <a onclick="setIdQuestion(${list[i].id})" data-bs-toggle="modal" data-bs-target="#addcautl" href="#"><i class="fa fa-plus iconaction"></i></a>
                    </td>
                </tr>`
    }
    document.getElementById("listQuestion").innerHTML = main
    $('#example').DataTable();
}

function clearDataCauHoi(){
    document.getElementById("idcauhoi").value = ""
    document.getElementById("title").value = ""
}

async function saveCauHoi() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("exam");
    var cauhoi = {
        "id": document.getElementById("idcauhoi").value,
        "title": document.getElementById("title").value,
        "lesson":{
            "id":id
        }
    }
    const response = await fetch('http://localhost:8080/api/question/admin/create-update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(cauhoi)
    });
    if (response.status < 300) {
        toastr.success("thêm/sửa câu hỏi thành công!");
        loadQuestion();
        $("#addtk").modal('hide');
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function loadAQuestion(id) {
    var url = 'http://localhost:8080/api/question/public/findById?id=' + id;
    const response = await fetch(url, {
    });
    var result = await response.json();
    console.log(result);
    document.getElementById("idcauhoi").value = result.id
    document.getElementById("title").value = result.title
}

function setIdQuestion(id){
    document.getElementById("idquestion").value = id
    document.getElementById("iddapan").value = ""
    document.getElementById("tieudectl").value = ""
    document.getElementById("istrue").checked = false
}

async function deleteQuestion(id) {
    var con = confirm("Bạn chắc chắn muốn xóa câu hỏi này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/question/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadQuestion();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteAnw(id) {
    var con = confirm("Bạn chắc chắn muốn xóa câu trả lời này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/answer/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadQuestion();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


async function saveCauTraLoi() {
    var dapan = {
        "id": document.getElementById("iddapan").value,
        "title": document.getElementById("tieudectl").value,
        "isTrue": document.getElementById("istrue").checked,
        "question":{
            "id":document.getElementById("idquestion").value
        }
    }
    const response = await fetch('http://localhost:8080/api/answer/admin/create-update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(dapan)
    });
    if (response.status < 300) {
        toastr.success("thêm/sửa câu trả lời thành công!");
        loadQuestion();
        $("#addcautl").modal('hide');
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


async function loadAAnsewr(id,idquestion) {
    var url = 'http://localhost:8080/api/answer/public/findById?id=' + id;
    const response = await fetch(url, {
    });
    var result = await response.json();
    console.log(result);
    document.getElementById("iddapan").value = result.id
    document.getElementById("tieudectl").value = result.title
    document.getElementById("istrue").checked = result.isTrue
    document.getElementById("idquestion").value = idquestion
}