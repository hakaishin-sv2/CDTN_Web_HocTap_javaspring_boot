var size = 9;

async function loadKhoaHoc(page) {
    var url = 'http://localhost:8080/api/course/public/courses?type='  + '&page=' + page + '&size=' + size + '&sort=id,desc';
    const response = await fetch(url, {
    });
    var result = await response.json();
    console.log(result);
    var list = result.content;
    // var list = result;
    document.getElementById("listkhoahoc").innerHTML="";
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-sm-4">
        <a href="chitietkhoahoc?id=${list[i].id}" class="singcourse"><div class="singlecourse">
            <img src="${list[i].image}" class="imgkh">
            <span class="tieudecourse">${list[i].name}</span>
            <span class="sohocvien">${list[i].numUser} học viên</span>
            <span class="sivgia"><span class="giagoc">${formatmoney(list[i].price)}</span><span class="giacu">${list[i].oldPrice==null?'':formatmoney(list[i].oldPrice)}</span>
            ${list[i].oldPrice==null?'':`<span class="giamgia">-${(100-list[i].price/list[i].oldPrice*100).toString().split(".")[0]} %</span>`}
            </span>
        </div></a>
    </div>`
    }
    document.getElementById("listkhoahoc").innerHTML += main

    if(result.last == false){
        document.getElementById("btnxemthemkh").onclick=function(){
            loadKhoaHoc(Number(page) + Number(1));
        }
    }
    else{
        document.getElementById("btnxemthemkh").onclick=function(){
            toastr.warning("Đã hết kết quả tìm kiếm");
        }
    }
}

async function loadACourse() {
    var id = window.location.search.split('=')[1];
    if (id != null) {
        var url = 'http://localhost:8080/api/course/public/findById?id=' + id;
        var response = await fetch(url, {
        });
        var result = await response.json();
        console.log(result);
        document.getElementById("bannercourse").style.backgroundImage =  `url(${result.banner})`
        document.getElementById("tenkhoahoc").innerHTML = result.name
        document.getElementById("thongtinkhoahoc").innerHTML = result.description
        document.getElementById("huongdanhoc").innerHTML = result.instruct
        document.getElementById("imgcourse").src = result.image
        var main = '';
        for(i=0; i< result.promises.length; i++){
            main += `✅ ${result.promises[i].content}<br>`;
            if(i== 2){
                break;
            }
        }
        document.getElementById("listpromise").innerHTML = main

        document.getElementById("giamoikh").innerHTML = formatmoney(result.price)
        if(result.oldPrice != null && result.oldPrice > 0){
            document.getElementById("divgiagoc").style.display = ''
            document.getElementById("giacukhoahoc").innerHTML = formatmoney(result.oldPrice)
            document.getElementById("giagiam").innerHTML = formatmoney(result.oldPrice - result.price)
            document.getElementById("phantramgiam").innerHTML = '(-'+(100-result.price/result.oldPrice*100).toString().split(".")[0]+'%)'
        }
        document.getElementById("songuoidk").innerHTML = result.numUser
        document.getElementById("thoigianhoc").innerHTML = `<strong>${result.startDate}</strong>` + ' đến ' + `<strong>${result.endDate}</strong>`
        document.getElementById("giohoc").innerHTML = `<strong>${result.studyTime}, thứ ${result.dayOfWeek}</strong>`
        document.getElementById("giangvien").innerHTML = `<strong>${result.teacher.fullName}</strong>`

        var promises = result.promises
        var main = ``
        for(i=0; i<promises.length; i++){
            main += `<span class="ndcamket"><span class="thutu">${Number(i+1)}</span> ${promises[i].content}</span>`;
        }
        document.getElementById("listcamket").innerHTML = main
        document.getElementById("btndangkykh").onclick = function (){
            window.location.href = 'xacnhan?khoahoc='+id
            // if(result.isfree==false){
            //     window.location.href = 'xacnhan?khoahoc='+id
            // }else{
            //     window.location.href = 'joinkhoahoc'
            // }

        }
    }
}



async function loadACourseCheckout() {
    var id = window.location.search.split('=')[1];
    if (id != null) {
        var url = 'http://localhost:8080/api/course/public/findById?id=' + id;
        try {
            var response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    window.location.href = '/notfound'; // Điều hướng đến trang 404
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            var result = await response.json();
            console.log(result)
            document.getElementById("tenkhoahoc").innerHTML = result.name;
            document.getElementById("thoigianhoc").innerHTML = `<strong>${result.startDate}</strong>` + ' đến ' + `<strong>${result.endDate}</strong>`;
            document.getElementById("giohoc").innerHTML = `<strong>${result.studyTime}, thứ ${result.dayOfWeek}</strong>`;
            document.getElementById("giangvien").innerHTML = `<strong>${result.teacher.fullName}</strong>`;
            if (result.price === null) {
                document.getElementById("giamoikh").innerHTML = "<strong style='color: #28a745; font-size: 1.5em;'>Miễn phí</strong>";
            } else {
                document.getElementById("giamoikh").innerHTML = "<strong style='color: red; font-size: 1.5em;'>" + formatmoney(result.price) + "</strong>";
            }

        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }
}

async function loadKhoaHocCuaToi() {
    var url = 'http://localhost:8080/api/course-user/user/find-by-user';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        var cc = ''
        if(list[i].level != null){
            cc = `<li onclick="window.location.href='chungchi?khoahoc=${list[i].course.id}'"><a class="dropdown-item" href="#"><i class="fa fa-certificate"></i> Xem chứng chỉ</a></li>`
        }
        main += `<div class="col-sm-4 dropend">
        <div class="singlekhoahoc" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="${list[i].course.image}" class="imgkhoahocct">
            <p class="tenkhoahoc">#${list[i].course.id}-${list[i].course.name}</p>
            <ul class="dropdown-menu dropitem" aria-labelledby="dropdownMenuButton1">
                <li onclick="loadTaiLieuKh(${list[i].course.id})" data-bs-toggle="modal" data-bs-target="#modaltailieu"><a class="dropdown-item"><i class="fa fa-file"></i> Tài liệu</a></li>
                <li onclick="window.location.href='baihoc?khoahoc=${list[i].course.id}'"><a class="dropdown-item" href="#"><i class="fa fa-list"></i> Bài học</a></li>
                <li onclick="window.location.href='danhsachdethi?khoahoc=${list[i].course.id}&tenkhoahoc=${list[i].course.name}'"><a class="dropdown-item" href="#"><i class="fa fa-check-square"></i> Đề thi</a></li>
                ${cc}
            </ul>
        </div>
    </div>`
    }
    document.getElementById("listmycourse").innerHTML = main
}


async function loadThongTinHocVienChungChi() {
    var uls = new URL(document.URL)
    var course = uls.searchParams.get("khoahoc");
    var url = 'http://localhost:8080/api/exam/user/thong-tin-hoc-vien?course='+course;
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


async function searchKhoaHoc(page, search) {
    var uls = new URL(document.URL)
    var danhmuc = uls.searchParams.get("danhmuc");
    var url = 'http://localhost:8080/api/course/public/search-course?page=' + page + '&size=' + size+'&sort=id,desc';
    if(danhmuc != null){
        url += '&categoryId='+danhmuc
    }
    if(search != null){
        url += "&search="+search;
    }
    
    const response = await fetch(url, {
    });
    var result = await response.json();
    console.log(result);
    var list = result.content;
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-sm-4">
        <a href="chitietkhoahoc?id=${list[i].id}" class="singcourse"><div class="singlecourse">
            <img src="${list[i].image}" class="imgkh">
            <span class="tieudecourse">${list[i].name}</span>
            <span class="sohocvien">${list[i].numUser} học viên</span>
            <span class="sivgia"><span class="giagoc">${formatmoney(list[i].price)}</span><span class="giacu">${list[i].oldPrice==null?'':formatmoney(list[i].oldPrice)}</span>
            ${list[i].oldPrice==null?'':`<span class="giamgia">-${(100-list[i].price/list[i].oldPrice*100).toString().split(".")[0]} %</span>`}
            </span>
        </div></a>
    </div>`
    }
    document.getElementById("listkhoahoc").innerHTML += main

    if(result.last == false){
        document.getElementById("btnxemthemkh").onclick=function(){
            searchKhoaHoc(Number(page) + Number(1), search);
        }
    }
    else{
        document.getElementById("btnxemthemkh").onclick=function(){
            toastr.warning("Đã hết kết quả tìm kiếm");
        }
    }
}

function searchByParam(){
    var search = document.getElementById("search").value
    document.getElementById("listkhoahoc").innerHTML = ""
    searchKhoaHoc(0, search)
}