<?php
// Thông tin kết nối cơ sở dữ liệu
$host = "192.168.0.105";
$username = "root"; // Tên người dùng MySQL
$password = "root";     // Mật khẩu MySQL
$database = "QuanLyWebBanHoa"; // Tên cơ sở dữ liệu

// Tạo kết nối
$conn = new mysqli($host, $username, $password, $database);

// Thiết lập mã hóa UTF-8 cho kết nối
$conn->set_charset("utf8mb4");

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>