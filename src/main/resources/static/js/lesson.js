var listLesson = null;
async function getAllLesson(){
    var lessons = getparamNameMultiValues("lesson");
    var url = 'http://localhost:8080/api/lesson/public/find-by-list-id';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(lessons)
    });
    var list = await response.json();
    listLesson = list;
    console.log(listLesson)
    var main = ''
    var ind = 0
    for(i=0; i< list.length; i++){
        var ls = '';
        var listch = list[i].questions;
        for(j=0; j<listch.length; j++){
            ++ ind;
            ls += `<button onclick="moTab(${list[i].id})" id="btnch${listch[j].id}" class="socauhoi">${ind}</button>`
        }
        main += `<div class="singlelesson">
        <strong>${list[i].name}</strong>
        <div>
            ${ls}
        </div>
    </div>`
    }
    document.getElementById("listlesson").innerHTML = main;


    var main = ''
    var maindiv = '';
    for(i=0; i< list.length; i++){
        main += `<li class="nav-item" role="presentation">
        <a class="nav-link ${i>0?'':'active'}" id="ex1-tab-${list[i].id}"  data-bs-toggle="tab" href="#ex1-tabs-${list[i].id}" role="tab" aria-controls="ex1-tabs-${list[i].id}" aria-selected="${i>0?'false':'true'}">${list[i].name}</a>
      </li>`
      maindiv += `<div class="tab-pane fade ${i>0?'':'show active'}" id="ex1-tabs-${list[i].id}" role="tabpanel" aria-labelledby="ex1-tab-${list[i].id}" >
        <div class="row">
           
            <div class="col-sm-12">
                <div class="noidungctl" id="dscauhoi${list[i].id}">
                        
                </div>
            </div>
        </div>
    </div>`
    }
    document.getElementById("ex1-listtab").innerHTML = main;
    document.getElementById("ex1-content").innerHTML = maindiv;
    loadCauHoiDiv();
    loadNoiDungDiv();
}

async function loadCauHoiDiv(){
    var index = 0;
    for(i=0; i< listLesson.length; i++){
        var mainCauHoi = '';
        var listch = listLesson[i].questions;
        for(j=0; j<listch.length; j++){
            ++ index;
            var listctl = listch[j].answers;
            var dsctl = '';
            for(k=0; k< listctl.length; k++){
                dsctl += `<span class="singctl" id="singctl${listctl[k].id}"><input value="${listctl[k].id}" onchange="setBGbutton(${listch[j].id})" type="radio" name="dapanctl${listch[j].id}" id="dpan${listctl[k].id}"> <label for="dpan${listctl[k].id}"> ${listctl[k].title}</label></span>`
            }
            mainCauHoi += ` <div class="singcauhoi" id="singcauhoi${listch[j].id}">
            <span class="thutuch">${index}</span> <span class="titlech">${listch[j].title}</span>
            ${dsctl}
        </div>`
        }
        document.getElementById("dscauhoi"+listLesson[i].id).innerHTML = mainCauHoi
    }
}


var listcauTl = [];
async function nopBaiThi(){
    var uls = new URL(document.URL)
    var exam = uls.searchParams.get("exam");
    var giaylam = limittime * 60 - giay;
    var sophutlam = (giaylam / 60).toString().split(".")[0] + ' : ' +giaylam % 60;

    for(i=0; i< listLesson.length; i++){
        var listch = listLesson[i].questions;
        for(j=0; j<listch.length; j++){
            var dapanchon = $('input[name="dapanctl'+listch[j].id+'"]:checked').val();
            if(dapanchon == undefined){
            }
            else{
                listcauTl.push(dapanchon)
            }
        }
    }
    console.log(listcauTl);
    clearInterval(looper)

    const response = await fetch('http://localhost:8080/api/result/user/create?examId='+exam+'&time='+sophutlam, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(listcauTl)
    });
    var result = await response.json();
    console.log(result);
    if(response.status < 300){
        swal({
            title: "Thông báo",
            text: "Đã nộp bài thi của bạn!",
            type: "success"
        }, function() {
            localStorage.setItem("ketqua", JSON.stringify(result));
            window.location.href = 'ketqua'
        });
    }
    else{
        if(response.status == exceptionCode){
            toastr.error(result.defaultMessage)
        }
        else{
            toastr.error("Có lỗi xảy ra")
        }
    }
}



function setBGbutton(idcauhoi){
    document.getElementById("btnch"+idcauhoi).style.background = 'blue'
    document.getElementById("btnch"+idcauhoi).style.color = '#fff'
}

async function loadNoiDungDiv(){
    for(i=0; i< listLesson.length; i++){
        if(listLesson[i].skill == 'READING'){
            document.getElementById("noidungds"+listLesson[i].id).innerHTML = listLesson[i].content
        }
        if(listLesson[i].skill == 'LISTENING'){
            document.getElementById("noidungds"+listLesson[i].id).innerHTML = 
            `<audio class="post-audio-item" controls>
                <source src="${listLesson[i].linkFile}">
                Your browser does not support the audio element.
            </audio>`
        }
    }
}


function getparamNameMultiValues(paramName){
    var sURL = window.document.URL.toString();
    var value =[];
    if (sURL.indexOf("?") > 0){
        var arrParams = sURL.split("?");
        var arrURLParams = arrParams[1].split("&");
        for (var i = 0; i<arrURLParams.length; i++){
            var sParam =  arrURLParams[i].split("=");
            if(sParam){
                if(sParam[0] == paramName){
                    if(sParam.length>0){
                        value.push(sParam[1].trim());
                    }
                }
            }
        }
    }
    return value;
}

function moTab(idlesson){
    document.getElementById("ex1-tab-"+idlesson).click();
}


function loadKetQua(){
    var ketqua = window.localStorage.getItem("ketqua");
    ketqua = JSON.parse(ketqua);
    console.log(ketqua);
    document.getElementById("tenbaithi").innerHTML = ketqua.result.exam.name
    document.getElementById("ngaythi").innerHTML = ketqua.result.exam.examDate + " "+  ketqua.result.exam.examTime
    document.getElementById("timeht").innerHTML = ketqua.result.finishTime + " giây "
    document.getElementById("hotenthi").innerHTML = ketqua.result.user.fullName
    document.getElementById("tongphu").innerHTML = ketqua.result.exam.limitTime
    document.getElementById("sodung").innerHTML = ketqua.soTLDung
    document.getElementById("sosai").innerHTML = ketqua.soTLSai
    document.getElementById("chuatl").innerHTML = ketqua.soCauBo
    document.getElementById("progress").style.width = ketqua.phanTram+"%"
    document.getElementById("sosaidung").innerHTML = ketqua.soTLDung + " / "+ketqua.tongCauHoi +" ("+parseFloat(ketqua.phanTram).toFixed(2)+"%)"
}


async function loadKetQuaByExam(){
    var uls = new URL(document.URL)
    var exam = uls.searchParams.get("exam");
    const response = await fetch('http://localhost:8080/api/result/user/find-by-user-exam?examId='+exam, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var ketqua = await response.json();
    if(response.status > 300){
        if(response.status == exceptionCode){
            swal({
                title: "Thông báo",
                text: ketqua.defaultMessage,
                type: "error"
            },
            function() {
                history.go(-1);
            });
        }
        else{
            swal({
                title: "Thông báo",
                text: "Có lỗi xảy ra",
                type: "error"
            },
            function() {
                history.go(-1);
            });
        }
    }
    console.log(ketqua);
    document.getElementById("tenbaithi").innerHTML = ketqua.result.exam.name
    document.getElementById("ngaythi").innerHTML = ketqua.result.exam.examDate + " "+  ketqua.result.exam.examTime
    document.getElementById("timeht").innerHTML = ketqua.result.finishTime + " giây "
    document.getElementById("hotenthi").innerHTML = ketqua.result.user.fullName
    document.getElementById("tongphu").innerHTML = ketqua.result.exam.limitTime
    document.getElementById("sodung").innerHTML = ketqua.soTLDung
    document.getElementById("sosai").innerHTML = ketqua.soTLSai
    document.getElementById("chuatl").innerHTML = ketqua.soCauBo
    document.getElementById("progress").style.width = ketqua.phanTram+"%"
    document.getElementById("sosaidung").innerHTML = ketqua.soTLDung + " / "+ketqua.tongCauHoi +" ("+parseFloat(ketqua.phanTram).toFixed(2)+"%)"
}