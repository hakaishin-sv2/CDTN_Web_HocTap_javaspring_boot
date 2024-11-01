async function loadChapter() {
    var uls = new URL(document.URL)
    var khoahoc = uls.searchParams.get("khoahoc");

    var url = 'http://localhost:8080/api/course/public/findById?id=' + khoahoc;
    var response = await fetch(url, {
    });
    var result = await response.json();
    document.getElementById("tenkhoahoc").innerHTML = result.name
    document.getElementById("danhmuckh").innerHTML = result.category.name
    document.getElementById("imgctblog").src = result.image

    var url = 'http://localhost:8080/api/chapter/user/find-by-course?course='+khoahoc;
    var response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    console.log(list);
    var main = '';
    for (i = 0; i < list.length; i++) {
        var chuong = '';
        var listunit = list[i].units
        for(j=0; j< listunit.length; j++){
            if(listunit[j].locked == false){
                chuong += `<li><a onclick="loadUnitById(${listunit[j].id})" class="pointer">${listunit[j].name}</a></li>`
            }
            else{
                chuong += `<li><a>${listunit[j].name}</a> <i class="fa fa-lock"></i></li>`
            }
        }
        main += `<div class="sesctiondethi" style="margin-top: 20px;">
        <h5>${list[i].name}</h5>
        <ul>${chuong}</ul>
    </div>`
    }
    document.getElementById("listchapter").innerHTML = main
}


async function loadUnitById(id) {
    var url = 'http://localhost:8080/api/unit/all/findById?id=' + id;
    var response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var result = await response.json();
    console.log(result);
    document.getElementById("danhmuckh").innerHTML = result.name
    document.getElementById("tieudechao").style.display = 'none'
    document.getElementById("noidungbaihoc").style.display = 'block'
    document.getElementById("linkvideo").innerHTML = `<source id="linkvideos" src="${result.video}" type="video/mp4">`
    document.getElementById("contentbaihoc").innerHTML = `<h4 style="margin-top:40px">Nội dung bài học</h4><br>`+result.content
    var milisecond = result.minStudyTime * 60 * 1000;

    let intervalID = setInterval(async function () {
        var url = 'http://localhost:8080/api/user-unit/user/create?id=' + id;
        var response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            }),
        });
        if(response.status < 300){
            loadChapter();
            alert('Đã mở khóa bài học tiếp theo')
        }
        clearInterval(intervalID);
    }, milisecond);
}

