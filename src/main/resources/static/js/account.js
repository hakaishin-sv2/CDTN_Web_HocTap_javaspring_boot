async function login() {
    var url = 'http://localhost:8080/api/login'
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var user = {
        "username": username,
        "password": password,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        if (result.user.authorities.name === "ROLE_ADMIN") {
            window.location.href = 'admin/index';
        }
        if (result.user.authorities.name === "ROLE_USER") {
            window.location.href = 'index';
        }
        if (result.user.authorities.name === "ROLE_TEACHER") {
            window.location.href = 'teacher/khoahoccuatoi';
        }
    }
    if (response.status == exceptionCode) {
        if (result.errorCode == 300) {
            swal({
                title: "Thông báo",
                text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",
                type: "warning"
            }, function() {
                window.location.href = 'confirm?email=' + username
            });
        } else {
            toastr.warning(result.defaultMessage);
        }
    }
}

function handleCredentialResponse(response) {
    console.log(response);
    console.log(response.credential);
    sendLoginRequestToBackend(response.credential);
}

async function sendLoginRequestToBackend(accessToken) {
    var response = await fetch('http://localhost:8080/api/login/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: accessToken
    })
    var result = await response.json();

    if (response.status < 300) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        if (result.user.authorities.name === "ROLE_ADMIN") {
            window.location.href = 'admin/index';
        }
        if (result.user.authorities.name === "ROLE_USER") {
            window.location.href = 'index';
        }
        if (result.user.authorities.name === "ROLE_TEACHER") {
            window.location.href = 'teacher/khoahoccuatoi';
        }
    }
    if (response.status == exceptionCode) {
        if (result.errorCode == 300) {
            swal({
                title: "Thông báo",
                text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",
                type: "warning"
            }, function() {
                window.location.href = 'confirm?email=' + username
            });
        } else {
            toastr.warning(result.defaultMessage);
        }
    }
}



async function regis() {
    var url = 'http://localhost:8080/api/regis'
    var email = document.getElementById("email").value
    var fullname = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var password = document.getElementById("password").value
    var user = {
        "fullName": fullname,
        "username": email,
        "email": email,
        "phone": phone,
        "password": password
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "đăng ký thành công! hãy check email của bạn!",
                type: "success"
            },
            function() {
                window.location.href = 'confirm?email=' + result.email
            });
    }
    if (response.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }
}


async function confirmAccount() {
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = document.getElementById("maxacthuc").value;
    var url = 'http://localhost:8080/api/active-account?email=' + email + '&key=' + key
    const res = await fetch(url, {
        method: 'POST'
    });
    if (res.status < 300) {
        swal({
                title: "Thông báo",
                text: "Xác nhận tài khoản thành công!",
                type: "success"
            },
            function() {
                window.location.href = 'login'
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}


async function changePassword() {
    var token = localStorage.getItem("token");
    var oldpass = document.getElementById("oldpass").value
    var newpass = document.getElementById("newpass").value
    var renewpass = document.getElementById("renewpass").value
    var url = 'http://localhost:8080/api/user/change-password';
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

async function loadThongTinTkCheckout(){
    const response = await fetch('http://localhost:8080/api/user/user-logged', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    console.log(response);
    document.getElementById("fullname").value = result.fullName
    document.getElementById("phone").value = result.phone
    document.getElementById("emaildangky").value = result.email
}

async function capNhatThongTin() {
    var user = {
        "fullName": document.getElementById("fullname").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("phone").value,
    }
    const response = await fetch('http://localhost:8080/api/user/update-account', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Cập nhât tài khoản thành công!",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (response.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }
}







async function capNhatThongTinteacher() {
    var imgElement = document.getElementById("btnchange");
    var backgroundImage = imgElement.style.backgroundImage;

// Loại bỏ phần `url("...")` để chỉ lấy đường link
    var url = backgroundImage.slice(5, -2);
    var avatar = url;
    var user = {
        "fullName": document.getElementById("fullname").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("phone").value,
        "avatar": avatar,
    }
    const response = await fetch('http://localhost:8080/api/teacher/update-account', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Cập nhât tài khoản thành công! test",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (response.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }
}
async function loadThongTinTaiKhoan() {
    const response = await fetch('http://localhost:8080/api/user/user-logged', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    console.log(result);

    // Gán giá trị cho các trường thông tin
    document.getElementById("fullname").value = result.fullName;
    document.getElementById("phone").value = result.phone;
    document.getElementById("email").value = result.email;

    // Thay đổi ảnh nền của nút
    var img = document.getElementById("btnchange");
    img.style.backgroundImage = `url(${result.avatar})`;
    img.style.backgroundSize = 'cover'; // Đảm bảo ảnh phủ kín
    img.style.backgroundPosition = 'center'; // Đảm bảo ảnh căn giữa
    img.style.backgroundRepeat = 'no-repeat'; // Không lặp lại ảnh
}
async function loadThongTinTaiKhoan_teacher() {
    const response = await fetch('http://localhost:8080/api/teacher/logged', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    console.log(result);

    // Gán giá trị cho các trường thông tin
    document.getElementById("fullname").value = result.fullName;
    document.getElementById("phone").value = result.phone;
    document.getElementById("email").value = result.email;

    // Thay đổi ảnh nền của nút
    var img = document.getElementById("btnchange");
    img.style.backgroundImage = `url(${result.avatar})`;
    img.style.backgroundSize = 'cover'; // Đảm bảo ảnh phủ kín
    img.style.backgroundPosition = 'center'; // Đảm bảo ảnh căn giữa
    img.style.backgroundRepeat = 'no-repeat'; // Không lặp lại ảnh
}
async function changeAvatar(){
    
    const filePath = document.getElementById('fileanhdaidientl')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/all/change-avatar';
    const res = await fetch(urlUpload, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
        body: formData
    });
    if (res.status < 300) {
        var linkImage = await res.text();
        console.log(linkImage);
        document.getElementById("btnchange").style.backgroundImage = `url(${linkImage})`
    }
}


async function forgorPassword() {
    var email = document.getElementById("email").value
    var url = 'http://localhost:8080/api/public/quen-mat-khau?email=' + email
    const res = await fetch(url, {
        method: 'POST'
    });
    if (res.status < 300) {
        swal({
                title: "",
                text: "Kiểm tra email của bạn",
                type: "success"
            },
            function() {
                window.location.replace("login")
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}

async function datLaiMatKhau() {
    var password = document.getElementById("password").value
    var repassword = document.getElementById("repassword").value
    if(password != repassword){
        toastr.warning("Mật khẩu không trùng khớp");
        return;
    }
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = uls.searchParams.get("key");
    var url = 'http://localhost:8080/api/public/dat-lai-mat-khau?email=' + email+'&key='+key+'&password='+password
    const res = await fetch(url, {
        method: 'POST'
    });
    if (res.status < 300) {
        swal({
                title: "",
                text: "Đặt lại mật khẩu thành công",
                type: "success"
            },
            function() {
                window.location.replace("login")
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}