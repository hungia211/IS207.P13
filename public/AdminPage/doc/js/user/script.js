// Biến toàn cục để lưu token
let authToken = null;

// Lấy token từ localStorage khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    authToken = localStorage.getItem('auth_token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!authToken || !isLoggedIn) {
        alert('Vui lòng đăng nhập trước!');
        window.location.href = "../login.php";
    } else {
        console.log('Token:', authToken); // Kiểm tra token được truyền vào
        loadCustomers(); // Gọi hàm loadCustomers để lấy dữ liệu
    }
});


// Load customers
function loadCustomers() {
    if (!authToken) {
        alert("Phiên làm việc hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "../login.php";
        return;
    }

    const serverIp = "10.0.50.8";
    const serverPort = "8000";

    const url = `http://${serverIp}:${serverPort}/api/detailuser/view`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => {
            console.log('HTTP Response Status:', response.status);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displayCustomers(data);

        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu khách hàng:', error);
            alert('Không thể tải dữ liệu khách hàng. Vui lòng thử lại!');
        });
}

// Hiển thị danh sách khách hàng trong bảng
function displayCustomers(detailUser) {
    const sampleTable = document.getElementById('sampleTable'); // Lấy bảng mẫu
    const tbody = sampleTable.querySelector('tbody'); // Xác định tbody trong bảng
    tbody.innerHTML = ''; // Xóa nội dung cũ trong tbody

    if (!Array.isArray(detailUser) || detailUser.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">Không có dữ liệu</td></tr>';
        return;
    }

    detailUser.forEach(detailUser => {
        const row = `
            <tr>
                <td width="10"><input type="checkbox" name="check${detailUser.user_id}" value="${detailUser.user_id}"></td>
                <td>${detailUser.user_id}</td>
                <td>${detailUser.name || 'Không xác định'}</td>
                <td>${detailUser.address || 'Không xác định'}</td>
                <td>${detailUser.birthday ? new Date(detailUser.birthday).toLocaleDateString('vi-VN') : 'Không xác định'}</td>
                <td>${detailUser.gender || 'Không xác định'}</td>
                <td>${detailUser.phone || 'Không xác định'}</td>
                <td>${detailUser.role_name}</td>
                <td class="table-td-center"><button class="btn btn-primary btn-sm trash" type="button" title="Xóa"
                      onclick="deleteRow(${detailUser.user_id})"><i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" id="show-emp"
                      data-toggle="modal" data-target="#ModalUP"><i class="fas fa-edit"></i>
                    </button>
                  </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

