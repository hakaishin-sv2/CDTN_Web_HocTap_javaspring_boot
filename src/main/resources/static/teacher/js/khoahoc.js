async function loadKhoaHocCuaToi() {
    var url = 'http://localhost:8080/api/course/teacher/find-by-teacher';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-sm-3 dropend">
        <div class="singlekhoahoc" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="${list[i].image}" class="imgkhoahocct">
            <p class="tenkhoahoc">${list[i].name}</p>
            <ul class="dropdown-menu dropitem" aria-labelledby="dropdownMenuButton1">
                <li onclick="window.location.href='tailieu?khoahoc=${list[i].id}'"><a class="dropdown-item"><i class="fa fa-file"></i> Tài liệu</a></li>
                <li onclick="window.location.href='chapter?khoahoc=${list[i].id}'"><a class="dropdown-item" href="#"><i class="fa fa-list"></i> Nội dung</a></li>
                <li onclick="window.location.href='thongke?khoahoc=${list[i].id}'"><a class="dropdown-item" href="#"><i class="fa fa-chart-line"></i> Thống kê</a></li>
            
        </div>
    </div>`
    }
    document.getElementById("listcoursect").innerHTML = main
}


async function loadKhoaHocCuaToiSelect() {
    var uls = new URL(document.URL)
    var khoahoc = uls.searchParams.get("khoahoc");
    var url = 'http://localhost:8080/api/course/teacher/find-by-teacher';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option ${khoahoc==list[i].id?'selected':""} value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("khoahocselect").innerHTML = main
}


async function loadKhoaHocCuaToiAdd() {
    var uls = new URL(document.URL)
    var khoahoc = uls.searchParams.get("khoahoc");
    var url = 'http://localhost:8080/api/course/teacher/find-by-teacher';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option ${khoahoc==list[i].id?'selected':""} value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("khoahocselectadd").innerHTML = main
}
