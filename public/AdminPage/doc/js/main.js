(function () {
	"use strict";

	var treeviewMenu = $('.app-menu');

	// Toggle Sidebar
	$('[data-toggle="sidebar"]').click(function(event) {
		event.preventDefault();
		$('.app').toggleClass('sidenav-toggled');
	});

	// Activate sidebar treeview toggle
	$("[data-toggle='treeview']").click(function(event) {
		event.preventDefault();
		if(!$(this).parent().hasClass('is-expanded')) {
			treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
		}
		$(this).parent().toggleClass('is-expanded');
	});

	// Set initial active toggle
	$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

	//Activate bootstrip tooltips
	$("[data-toggle='tooltip']").tooltip();

})();

function logout() {
	const confirmation = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
	if (confirmation) {
	  // Xóa token hoặc thông tin xác thực
	  localStorage.removeItem('auth_token'); // Nếu bạn dùng localStorage để lưu token
	  localStorage.removeItem("isLoggedIn");
	  localStorage.removeItem("role");
	  sessionStorage.clear(); // Xóa toàn bộ sessionStorage nếu cần

	  // Nếu dùng cookie, bạn có thể xóa bằng cách sau:
	  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

	  // Chuyển hướng đến trang chính chưa đăng nhập
	  window.location.href = '../index.html';
	}

}
