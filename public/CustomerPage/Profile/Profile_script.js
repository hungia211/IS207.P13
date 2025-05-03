

//----------------------------------------------Thông tin tài khoản----------------------------------------------

async function fetchUserData() {
    try {
        // Lấy token từ localStorage hoặc cookie (nếu sử dụng token xác thực)
        const token = localStorage.getItem('auth_token'); // Hoặc từ cookie nếu bạn dùng Laravel Sanctum

        const response = await fetch('https://your-laravel-app.com/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching user data');
        }

        const data = await response.json(); // Giả sử dữ liệu trả về là JSON

        // Cập nhật thông tin vào HTML trên trang chính
        document.getElementById('full-name').textContent = data.name;
        document.getElementById('birth-date').textContent = data.birth_date;
        document.getElementById('email').textContent = data.email;
        document.getElementById('phone').textContent = data.phone;
        document.getElementById('address').textContent = data.address;

        // Cập nhật thông tin vào các input trong modal chỉnh sửa
        document.getElementById('edit-name').value = data.name;
        document.getElementById('edit-birth-date').value = data.birth_date;
        document.getElementById('edit-phone').value = data.phone;
        document.getElementById('edit-address').value = data.address;

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Gọi hàm khi trang tải
window.onload = fetchUserData;

//----------------------------------------------Chỉnh sửa tài khoản----------------------------------------------
// Hàm hiển thị modal chỉnh sửa thông tin cá nhân
function openEditAccount() {
    const modal = document.getElementById('edit-account');
    modal.style.display = 'flex'; // Hiển thị modal
}

// Thêm sự kiện cho nút "Chỉnh sửa thông tin"
document.getElementById('edit-button').addEventListener('click', openEditAccount);

// Hàm đóng modal
function closeEditAccount() {
    const modal = document.getElementById('edit-account');
    modal.style.display = 'none'; // Ẩn modal
}

// Hàm chuyển đổi ngày tháng từ định dạng web sang định dạng API (YYYY-MM-DD)
function formatDateTimeToAPI(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Định nghĩa hàm để cập nhật thông tin profile
async function updateUserInfo() {
    try {
        const serverIp = localStorage.getItem("serverIP");
        const serverPort = "8000";
        const authToken = localStorage.getItem("auth_token");

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }

        // Lấy dữ liệu từ các trường input (hoặc từ các phần tử HTML đã có sẵn)
        const name = document.getElementById('edit-name').value.trim();
        const birthDate = document.getElementById('edit-birth-date').value.trim();
        const phone = document.getElementById('edit-phone').value.trim();
        const address = document.getElementById('edit-address').value.trim();
        const gender = document.getElementById('edit-gender').value.trim();

        // URL API
        const profileUrl = `http://${serverIp}:${serverPort}/api/profile/edit`;

        // Dữ liệu gửi lên API
        const updatedData = {
            name,
            phone,
            gender,
            birthday: birthDate,  // Giả sử server yêu cầu ngày sinh theo định dạng YYYY-MM-DD
            address
        };

        // Gọi API với phương thức PUT
        const response = await fetch(profileUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error(`API trả về lỗi: ${response.status}`);
        }

        // Parse JSON từ API
        const profileData = await response.json();

        // Cập nhật lại thông tin trong HTML
        document.getElementById("full-name").textContent = profileData.name  ;
        document.getElementById("birth-date").textContent = profileData.birthday ;
        document.getElementById("gender").textContent = profileData.gender ;
        document.getElementById("email").textContent = profileData.email ;
        document.getElementById("phone").textContent = profileData.phone ;
        document.getElementById("address").textContent = profileData.address;

        console.log("Thông tin profile đã được cập nhật:", profileData);

        // Gọi lại hàm loadProfileInfo() để tải lại dữ liệu mới
        loadProfileInfo();
        closeEditAccount(); // Đóng modal sau khi cập nhật thành công

    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin profile:", error);
    }
}


//----------------------------------------------Đổi mật khẩu----------------------------------------------

// Hàm hiển thị modal đổi mật khẩu
function openChangePassword() {
    const modal = document.getElementById('change-password');
    modal.style.display = 'flex'; // Hiển thị modal
}

// Thêm sự kiện cho nút "Đổi mật khẩu"
document.getElementById('change-password-button').addEventListener('click', openChangePassword);

// Hàm đóng modal
function closeChangePassword() {
    const modal = document.getElementById('change-password');
    modal.style.display = 'none'; // Ẩn modal
}

// Hàm kiểm tra mật khẩu cũ và mở khóa trường mật khẩu mới
async function checkCurrentPassword() {
    const currentPassword = document.getElementById('current-password').value;
    const token = localStorage.getItem('auth_token'); // Lấy token từ localStorage

    try {
        const response = await fetch('https://your-laravel-app.com/api/check-current-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ current_password: currentPassword })
        });

        if (!response.ok) {
            throw new Error('Mật khẩu cũ không đúng!');
        }

        // Nếu mật khẩu cũ đúng, enable mật khẩu mới
        document.getElementById('new-password').disabled = false;
        document.getElementById('confirm-password').disabled = false;
        document.getElementById('error-message').style.display = 'none'; // Ẩn thông báo lỗi

    } catch (error) {
        // Nếu mật khẩu cũ sai, hiển thị thông báo lỗi
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('new-password').disabled = true;
        document.getElementById('confirm-password').disabled = true;
    }
}

// Lắng nghe sự kiện khi người dùng nhập mật khẩu cũ
document.getElementById('current-password').addEventListener('blur', checkCurrentPassword);

// Hàm cập nhật mật khẩu
async function updatePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
        return;
    }

    const token = localStorage.getItem('auth_token');
    const updatedData = {
        current_password: currentPassword,
        new_password: newPassword
    };

    try {
        const response = await fetch('https://your-laravel-app.com/api/update-password', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Error updating password');
        }

        const data = await response.json();
        alert('Mật khẩu đã được cập nhật thành công!');
        closeChangePassword();

    } catch (error) {
        console.error('Error updating password:', error);
        alert('Có lỗi xảy ra khi cập nhật mật khẩu!');
    }
}

//----------------------------------------------Lịch sử đơn hàng----------------------------------------------

// Hàm để lấy dữ liệu lịch sử đơn hàng từ backend
async function fetchOrderHistory() {
    try {
        const userId = getUserIdFromSession(); // Hàm để lấy ID người dùng từ session hoặc cookie

        // Gọi API Laravel để lấy thông tin lịch sử đơn hàng của người dùng
        const response = await fetch(`/api/orders/history/${userId}`);
        const data = await response.json();

        if (response.ok) {
            // Lấy phần tử tbody để thêm các hàng vào bảng
            const tbody = document.getElementById('order-history-tbody');

            // Xóa nội dung hiện tại của tbody trước khi thêm dữ liệu mới
            tbody.innerHTML = '';

            // Lặp qua các đơn hàng và tạo các hàng trong bảng
            data.orders.forEach(order => {
                const row = document.createElement('tr');

                // Thêm nội dung vào các ô trong hàng
                row.innerHTML = `
                    <td>#${order.order_id}</td>
                    <td>${order.order_date}</td>
                    <td>${order.status}</td>
                    <td><a href="#" onclick="viewOrderDetails(${order.order_id})">Xem chi tiết</a></td>
                `;

                // Thêm hàng vào tbody
                tbody.appendChild(row);
            });
        } else {
            console.error('Không thể tải lịch sử đơn hàng', data);
        }
    } catch (error) {
        console.error('Error fetching order history:', error);
    }
}

// Gọi hàm để lấy dữ liệu khi trang web được tải
window.onload = fetchOrderHistory;

//----------------------------------------------Chi tiết đơn hàng----------------------------------------------

// Hàm mở modal xem chi tiết đơn hàng
async function viewOrderDetails(orderId) {
    try {
        // Gọi API Laravel để lấy chi tiết đơn hàng
        const response = await fetch(`/api/orders/details/${orderId}`);
        const orderData = await response.json();

        if (response.ok) {
            // Hiển thị thông tin đơn hàng
            document.getElementById('order-id').textContent = orderData.order_id;
            document.getElementById('order-date').textContent = orderData.order_date;
            document.getElementById('delivery-date').textContent = orderData.delivery_date;
            document.getElementById('order-status').textContent = orderData.status;
            document.getElementById('total-amount').textContent = orderData.total_amount;

            // Hiển thị các sản phẩm trong đơn hàng
            const itemsContainer = document.querySelector('.order-items');
            itemsContainer.innerHTML = ''; // Xóa các sản phẩm cũ

            orderData.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.innerHTML = `
                    <div>
                        <img src="https://via.placeholder.com/50" alt="${item.product_name}"> 
                        ${item.product_name}
                    </div>
                    <div>${item.quantity}</div>
                    <div>${item.price}</div>
                    <div>${item.total}</div>
                `;
                itemsContainer.appendChild(itemElement);
            });

            // Hiển thị modal
            document.getElementById('order-details').style.display = 'flex';
        } else {
            console.error('Không thể tải chi tiết đơn hàng', orderData);
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

// Hàm đóng modal
function closeOrderDetails() {
    document.getElementById('order-details').style.display = 'none';
}

// Hàm để lấy ID người dùng từ session hoặc cookie
function getUserIdFromSession() {
    // Lấy ID người dùng từ session hoặc cookie (tùy thuộc vào cách bạn lưu trữ ID người dùng)
    // Ví dụ, nếu bạn lưu trong cookie:
    const userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return userId;
}

//----------------------------------------------Tải thông tin profile----------------------------------------------

// Hàm chuyển đổi định dạng ngày giờ
function formatDate(dateTime) {
    const date = new Date(dateTime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// Định nghĩa hàm để tải thông tin profile
async function loadProfileInfo() {
    try {
        const serverIp = localStorage.getItem("serverIP");
        const serverPort = "8000";
        const authToken = localStorage.getItem("auth_token");

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }

        // URL API
        const profileUrl = `http://${serverIp}:${serverPort}/api/profile/view`;

        // Gọi API
        const response = await fetch(profileUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`API trả về lỗi: ${response.status}`);
        }

        // Parse JSON từ API
        const profileData = await response.json();

        // Gắn dữ liệu vào HTML
        document.getElementById("full-name").textContent = profileData.name || "N/A";
        document.getElementById("gender").textContent = profileData.gender || "N/A";
        document.getElementById("birth-date").textContent = formatDate(profileData.birthday) || "N/A";
        document.getElementById("email").textContent = profileData.email || "N/A";
        document.getElementById("phone").textContent = profileData.phone || "N/A";
        document.getElementById("address").textContent = profileData.address || "N/A";

        console.log("Thông tin profile đã được tải:", profileData);
    } catch (error) {
        console.error("Lỗi khi tải thông tin profile:", error);
    }
}

async function loadOrderHistory() {
    try {
        const serverIp = localStorage.getItem("serverIP");
        const serverPort = "8000";
        const authToken = localStorage.getItem("auth_token");

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }

        const apiUrl = `http://${serverIp}:${serverPort}/api/order/history`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`API trả về lỗi: ${response.status}`);
        }

        const orderHistory = await response.json();
        const tbody = document.getElementById("order-history-tbody");
        tbody.innerHTML = ""; // Xóa dữ liệu cũ trước khi thêm mới

        orderHistory.forEach(order => {
            const tr = document.createElement("tr");

            // Cột mã đơn hàng
            const orderIdCell = document.createElement("td");
            orderIdCell.textContent = order.order_id;
            tr.appendChild(orderIdCell);

            // Cột ngày đặt (chuyển đổi định dạng)
            const createdAtCell = document.createElement("td");
            createdAtCell.textContent = formatDateTime(order.created_at);
            tr.appendChild(createdAtCell);

            // Cột tình trạng
            const statusCell = document.createElement("td");
            statusCell.textContent = order.status;
            tr.appendChild(statusCell);

            // Cột xem chi tiết
            const detailCell = document.createElement("td");
            const detailButton = document.createElement("button");
            detailButton.textContent = "Xem";
            detailButton.classList.add("detail-button");
            detailButton.dataset.orderId = order.order_id;

            detailButton.addEventListener("click", () => viewOrderDetail(order.order_id));
            detailCell.appendChild(detailButton);
            tr.appendChild(detailCell);

            // Cột hủy
            const cancelCell = document.createElement("td");
            if (order.status === "Pending") {
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Hủy";
                cancelButton.classList.add("cancel-button");
                cancelButton.dataset.orderId = order.order_id;

                cancelButton.addEventListener("click", () => cancelOrder(order.order_id));
                cancelCell.appendChild(cancelButton);
            } else {
                cancelCell.textContent = "Không thể hủy";
            }
            tr.appendChild(cancelCell);

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Lỗi khi tải lịch sử đặt hàng:", error);
    }
}

// Hàm chuyển đổi định dạng ngày giờ
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

// Hàm xem chi tiết đơn hàng
async function viewOrderDetail(orderId) {
    try {
        const serverIp = localStorage.getItem("serverIP");
        const serverPort = "8000";
        const authToken = localStorage.getItem("auth_token");

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }

        const apiUrl = `http://${serverIp}:${serverPort}/api/order/detail/${orderId}`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`API trả về lỗi: ${response.status}`);
        }

        const orderDetails = await response.json();
        showOrderDetailPopup(orderDetails);
    } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
    }
}

// Hiển thị popup chi tiết đơn hàng
function showOrderDetailPopup(orderDetails) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    const closeButton = document.createElement("button");
    closeButton.textContent = "Đóng";
    closeButton.classList.add("close-popup-button");
    closeButton.addEventListener("click", () => {
        document.body.removeChild(popupContainer);
    });

    popupContent.innerHTML = `
        <h3>Chi tiết đơn hàng</h3>
        ${orderDetails
            .map(
                detail => `
            <div class="order-item">
                <img src="${detail.image}" alt="${detail.product_name}" style="width: 100px; height: 100px;">
                <p>Tên sản phẩm: ${detail.product_name}</p>
                <p>Giá: ${detail.price} VNĐ</p>
            </div>
        `
            )
            .join("")}
    `;
    popupContent.appendChild(closeButton);
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);
}


//----------------------------------------------Hủy đơn hàng----------------------------------------------
async function cancelOrder(orderId) {
    try {
        const serverIp = localStorage.getItem("serverIP");
        const serverPort = "8000";
        const authToken = localStorage.getItem("auth_token");

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }

        const apiUrl = `http://${serverIp}:${serverPort}/api/order/cancel/${orderId}`;
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`API trả về lỗi: ${response.status}`);
        }

        console.log(`Đơn hàng ${orderId} đã được hủy thành công.`);
        alert(`Đơn hàng ${orderId} đã được hủy.`);
        loadOrderHistory(); // Tải lại lịch sử để cập nhật giao diện
    } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
}

// Gọi hàm khi trang được tải
window.addEventListener("DOMContentLoaded", loadOrderHistory);



//----------------------------------------------Nút tài khoản----------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const accountMenu = document.querySelector("#account-menu");

    // Đảm bảo menu bị ẩn khi trang load
    if (!accountMenu.classList.contains("hidden")) {
        accountMenu.classList.add("hidden");
    }

    const accountLink = document.querySelector("#info-link");

    // Toggle menu khi bấm vào nút "Tài khoản"
    accountLink.addEventListener("click", function (e) {
        e.preventDefault(); // Ngăn điều hướng mặc định
        accountMenu.classList.toggle("hidden");
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", function (e) {
        if (!accountMenu.contains(e.target) && !accountLink.contains(e.target)) {
            accountMenu.classList.add("hidden");
        }
    });

    // Gọi hàm khi load trang
    loadProfileInfo();
});