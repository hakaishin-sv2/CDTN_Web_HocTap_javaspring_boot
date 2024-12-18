var token = localStorage.getItem("token");
var exceptionCode = 417;
async function loadMenu(){
    var dn = '<li class="liheader"><a href="login" class="btn btn-round btndangnhapheader">Đăng nhập</a></li>';
    if(token != null){
        dn = `
        <li class="nav-item dropdown itemdropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="image/user_icon.webp" class="userheader">
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="taikhoan">Tài khoản</a></li>
            <li><a class="dropdown-item" href="taikhoan#mycourse">Khóa học của tôi</a></li>
            <li><hr class="dropdown-divider"></li>
            <li onclick="dangXuat()"><a class="dropdown-item" href="#">Đăng xuất</a></li>
            </ul>
        </li>`;
    }
    var menu = 
    ` <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="index"><img src="image/logo.webp" class="logoheader"></a>
        </li>
        
      </ul>
      <div class="d-flex">
          <ul class="listdmheader">
              <li class="liheader"><a href="index" class="navlink">Trang chủ</a></li>
              <li class="liheader"><a href="timkhoahoc" class="navlink">Khóa học</a></li>
              <li class="liheader"><a href="baiviet" class="navlink">Blog</a></li>
              ${dn}
          </ul>
      </div>
    </div>
  </div>`
  document.getElementById("menu").innerHTML = menu

  loadFooter();
}



function loadFooter(){
    var footer = 
    `<footer class="text-center text-lg-start text-muted">
    <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      <div class="me-5 d-none d-lg-block"><span>Theo dõi chúng tôi tại:</span></div>
      <div>
        <a href="" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-twitter"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-google"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-instagram"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-github"></i></a>
      </div>
    </section>
    <section class="">
      <div class=" text-center text-md-start mt-5">
        <div class="row mt-3">
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4"><img src="image/logo.webp" class="imglogofooter"></h6>
            <span>
                Công ty TNHH Công Nghệ <br>
                Giấy chứng nhận Đăng ký doanh nghiệp số: abc xyz do Sở Kế hoạch và Đầu tư thành phố Hà Nội cấp ngày 17/06/2021.<br>
                Điện thoại liên hệ/Hotline: 0812965899<br>
                Email: stu715105224@hnue.edu.vn.<br>                Địa chỉ trụ sở: Số 15, Ngõ 199 Giải Phóng, Phường Phương Liệt, Quận Thanh Xuân, Thành phố Hà Nội, Việt Nam
            </span>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Về chúng tôi</h6>
            <p><a href="#!" class="text-reset">Hotline: 09999999</a></p>
            <p><a href="#!" class="text-reset">Email: nguyentrongthi9779@gmail.com</a></p>
            <p><a href="#!" class="text-reset">Địa chỉ cs1: Số 1, đại cồ việt, Hai Bà Trưng, Hà nội</a></p>
            <p><a href="#!" class="text-reset">Địa chỉ cs2: Số 1, đại cồ việt, Hai Bà Trưng, Hà nội</a></p>
          </div>
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Hỗ trợ khách hàng</h6>
            <p><a href="#!" class="text-reset">Uy tín</a></p>
            <p><a href="#!" class="text-reset">Chất lượng</a></p>
            <p><a href="#!" class="text-reset">Nguồn gốc rõ ràng</a></p>
            <p><a href="#!" class="text-reset">Giá rẻ</a></p>
          </div>
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Liên hệ</h6>
            <p><i class="fas fa-home me-3"></i> Hà nội, Việt Nam</p>
            <p><i class="fas fa-envelope me-3"></i> shop@gmail.com</p>
            <p><i class="fas fa-phone me-3"></i> + 01 234 567 88</p>
            <p><i class="fas fa-print me-3"></i> + 01 234 567 89</p>
          </div>
        </div>
      </div>
    </section>
  </footer>`
    document.getElementById("footer").innerHTML = footer
}


function formatmoney(money) {
  const VND = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
  });
  return VND.format(money);
}

async function dangXuat() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.replace('login')
}

function formatdate(dateString){
  let date = new Date(dateString);

  let formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
  return formattedDate// Output: 2024-05-04 06:58:37
}
