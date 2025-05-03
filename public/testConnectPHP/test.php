<?php
// Nhúng file kết nối
require_once('../config.php'); // Ví dụ nếu file config.php ở cấp thư mục trên
// Đảm bảo đường dẫn đúng với file kết nối của bạn

// Tên file để lưu kết quả
$outputFile = 'db_connection_result.txt';

// Kiểm tra kết nối
if ($conn->connect_error) {
    $message = "Kết nối thất bại: " . $conn->connect_error . "\n";
} else {
    $message = "Kết nối đến cơ sở dữ liệu thành công.\n";
}

// Hiển thị kết quả
echo $message;

// Ghi kết quả vào file
file_put_contents($outputFile, $message);

// Đóng kết nối
$conn->close();
?>