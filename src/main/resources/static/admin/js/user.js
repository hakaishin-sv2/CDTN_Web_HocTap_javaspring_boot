async function loadAllUser() {
    $('#example').DataTable().destroy();
    var role = document.getElementById("role").value
    var url = 'http://localhost:8080/api/admin/get-user-by-role';
    if(role != ""){
        url = 'http://localhost:8080/api/admin/get-user-by-role?role='+role;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for (i = 0; i < list.length; i++) {
        var locks = ``;
        if(list[i].actived == 0){
            locks = `<a onclick="lockOrUnlock(${list[i].id},0)" class="btn btn-danger"><i class="fa fa-unlock"></i> mở khóa</a>`
        }
        else{
            locks = `<a onclick="lockOrUnlock(${list[i].id},1)" class="btn btn-primary"><i class="fa fa-lock"></i> khóa</a>`
        }
        var phone = list[i].phone == null ? "" : list[i].phone
        var fullname = list[i].fullname == null ? "" : list[i].fullname
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].username}</td>
                    <td>${list[i].fullName}</td>
                    <td>${phone}</td>
                    <td>${list[i].createdDate}</td>
                    <td>${list[i].authorities.name}</td>
                    <td>${locks}</td>
                </tr>`
    }
    document.getElementById("listuser").innerHTML = main
    $('#example').DataTable();
}

async function preViewImage(){
    const [file] = chooseimg.files
    if (file) {
        imgpre.src = URL.createObjectURL(file)
    }
    document.getElementById("btnadd").disabled = true;
    const filePath = document.getElementById('chooseimg')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {   method: 'POST',  body: formData });
    if(res.status < 300){
        var linkimage = await res.text();
        document.getElementById("impinput").value = linkimage
    }
    document.getElementById("btnadd").disabled = false;
}

async function lockOrUnlock(id, type) {
    var url = 'http://localhost:8080/api/admin/lockOrUnlockUser?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        var mess = '';
        if(type == 1){
            mess = 'Khóa thành công'
        }
        else{
            mess = 'Mở khóa thành công'
        }
        swal({
            title: "Thông báo", 
            text: mess, 
            type: "success"
          },
        function(){ 
            window.location.reload();
        });
    }
    else {
        swal({
            title: "Thông báo", 
            text: "hành động thất bại", 
            type: "error"
          },
        function(){ 
            window.location.reload();
        });
    }
}

async function addtk() {
    var url = 'http://localhost:8080/api/admin/addaccount'
    var email = document.getElementById("email").value
    var password = document.getElementById("pass").value
    var fullname = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var repassword = document.getElementById("repass").value
    var user = {
        "username": email,
        "fullName": fullname,
        "phone": phone,
        "avatar": document.getElementById("impinput").value,
        "password": password,
        "authorities": {
            "name": document.getElementById("roleadd").value
        }
    }
    if(password != repassword){
        alert("Mật khẩu không trùng khớp")
        return;
    }
    if(password === "" || repassword === ""){
        alert("mật khẩu không được để trống!")
        return;
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    if (res.status < 300) {
        swal({
                title: "Thông báo",
                text: "Tạo tài khoản thành công!",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json();
        toastr.warning(result.defaultMessage);
    }
}


async function loadUserTeacher() {
    var url = 'http://localhost:8080/api/admin/get-user-by-role?role=ROLE_TEACHER';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].fullName} - ${list[i].username}</option>`
    }
    document.getElementById("giangvien").innerHTML = main
}


async function changePassword() {
    var token = localStorage.getItem("token");
    var oldpass = document.getElementById("oldpass").value
    var newpass = document.getElementById("newpass").value
    var renewpass = document.getElementById("renewpass").value
    var url = 'http://localhost:8080/api/all/change-password';
    if (newpass != renewpass) {
        alert("mật khẩu mới không trùng khớp");
        return;
    }
    var passw = {
        "oldPass": oldpass,
        "newPass": newpass
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(passw)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "cập nhật mật khẩu thành công, hãy đăng nhập lại",
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
}