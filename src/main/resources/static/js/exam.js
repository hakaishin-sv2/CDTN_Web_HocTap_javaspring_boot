var sizeexam = 4;

async function loadDeThi(page) {
    var url = 'http://localhost:8080/api/exam/public/find-all-page?page=' + page + '&size=' + sizeexam+'&sort=id,desc';
    const response = await fetch(url, {
    });
    var result = await response.json();
    console.log(result);
    var list = result.content;
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-sm-3">
        <a href="dethi?id=${list[i].id}" class="singdt"><div class="singdethi">
            <span class="tieudecourse">${list[i].name}</span>
            <span class="testitem-info">
                <i class="fa fa-clock"></i> ${list[i].limitTime} phút
                | <i class="fa fa-user"></i> ${list[i].numUser}
                | ${list[i].numLesson} phần thi
            </span>
            <span class="danhmucexam">
                <span>${list[i].category.name}</span>
                <span>${list[i].skill}</span>
            </span>
            <span class="spchitiet"><button class="btnchitietexam">Chi tiết</button></span>
        </div></a>
    </div>`
    }
    document.getElementById("listdethi").innerHTML += main

    if(result.last == false){
        document.getElementById("btnxemthemkh").onclick=function(){
            loadDeThi(Number(page) + Number(1));
        }
    }
    else{
        document.getElementById("btnxemthemdethi").onclick=function(){
            toastr.warning("Đã hết kết quả tìm kiếm");
        }
    }
}


async function loadCtDeThi(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");


    var url = 'http://localhost:8080/api/lesson/public/find-by-exam?id=' + id;
    var response = await fetch(url, {
    });
    var list = await response.json();
    var main = '';
    var arrLess = '';
    var numQuestion = 0;
    for (i = 0; i < list.length; i++) {
        main += `<tr>
        <td style="width: 20%;"><input type="checkbox" checked readonly onclick="return false;"></td>
        <td>
            <label for="dt${list[i].id}">
                ${list[i].name} (${list[i].questions.length} câu hỏi) <br>  <span class="danhmucthi">IELTS Academic</span>
                <span class="danhmucthi">Listening</span>
            </label>
        </td>
    </tr>`
    arrLess += `&lesson=${list[i].id}`;
    numQuestion += list[i].questions.length;
    }
    document.getElementById("listlesson").innerHTML = main



    var response = await fetch('http://localhost:8080/api/exam/user/find-by-id?id=' + id, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var result = await response.json();
    var urlfulltest = `lambaithi?exam=${id}&limittime=${result.limitTime}`+arrLess
    document.getElementById("linkfulltest").href = urlfulltest
    document.getElementById("timedethi").innerHTML = result.limitTime
    document.getElementById("sophanthi").innerHTML = result.lessons.length
    document.getElementById("socauhoi").innerHTML = numQuestion
    document.getElementById("danhmucdethi").innerHTML = result.course.category.name
    document.getElementById("tenbaithi").innerHTML = result.course.name
}



async function loadThongTinDeThi(){
    var uls = new URL(document.URL)
    var exam = uls.searchParams.get("exam");
    var url = 'http://localhost:8080/api/exam/public/findById?id=' + exam;
    const response = await fetch(url, {
    });
    var result = await response.json();
    document.getElementById("tenbaithi").innerHTML = result.name
}


async function searchDeThi(page) {
    var uls = new URL(document.URL)
    var category = uls.searchParams.get("category");
    var search = uls.searchParams.get("search");
    var url = 'http://localhost:8080/api/exam/public/find-by-param?page=' + page + '&size=' + sizeexam+'&sort=id,desc';
    if(category != null && category != -1){
        url += '&category='+category
    }
    if(search != null){
        url += '&search='+search
    }
    const response = await fetch(url, {
    });
    var result = await response.json();
    console.log(result);
    var list = result.content;
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-sm-3">
        <a href="dethi?id=${list[i].id}" class="singdt"><div class="singdethi">
            <span class="tieudecourse">${list[i].name}</span>
            <span class="testitem-info">
                <i class="fa fa-clock"></i> ${list[i].limitTime} phút
                | <i class="fa fa-user"></i> ${list[i].numUser}
                | ${list[i].numLesson} phần thi
            </span>
            <span class="danhmucexam">
                <span>${list[i].category.name}</span>
                <span>${list[i].skill}</span>
            </span>
            <span class="spchitiet"><button class="btnchitietexam">Chi tiết</button></span>
        </div></a>
    </div>`
    }
    document.getElementById("listdethi").innerHTML += main

    if(result.last == false){
        document.getElementById("btnxemthemkh").onclick=function(){
            loadDeThi(Number(page) + Number(1));
        }
    }
    else{
        document.getElementById("btnxemthemdethi").onclick=function(){
            toastr.warning("Đã hết kết quả tìm kiếm");
        }
    }
}


async function loadDeThiByCourse() {
    $('#example').DataTable().destroy();
    var uls = new URL(document.URL)
    var khoahoc = uls.searchParams.get("khoahoc");
    var tenkhoahoc = uls.searchParams.get("tenkhoahoc");
    var url = 'http://localhost:8080/api/exam/user/find-by-course-and-user?course=' + khoahoc;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        var btn = `Đang chờ`
        if(list[i].trangThai == "DA_KET_THUC"){
            btn = `<a href="ketqua?exam=${list[i].id}" class="btn btn-primary form-control">Xem kết quả</button>`
        }
        if(list[i].trangThai == "DANG_THI"){
            btn = ` <a href="dethi?id=${list[i].id}" class="btn btn-primary form-control">Vào thi</button>`
        }
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].name}</td>
                    <td>${list[i].limitTime}</td>
                    <td>${list[i].examTime}, ${list[i].examDate}</td>
                    <td>${list[i].coefficient}%</td>
                    <td>${list[i].lessons.length}</td>
                    <td class="sticky-col">
                        ${btn}
                    </td>
                </tr>`
    }
    document.getElementById("listdethi").innerHTML = main
    document.getElementById("tenkhoahoc").innerHTML = tenkhoahoc
    $('#example').DataTable();
}