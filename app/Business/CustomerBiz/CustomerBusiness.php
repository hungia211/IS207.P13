<?php

namespace App\Business\CustomerBiz;

use App\Business\CustomerBiz\CustomerDAO; // Sử dụng CustomerDAO
use App\Business\CartBiz\CartDAO;           // Sử dụng CartDAO
use Exception;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerBusiness
{
    protected CustomerDAO $customerDAO;
    protected CartDAO $cartDAO;

    public function __construct()
    {
        $this->customerDAO = new CustomerDAO();
        $this->cartDAO = new CartDAO();
    }

    // Thêm mới khách hàng
    public function createCustomer(array $data)
    {
        try {
            // Tạo đối tượng Customer từ dữ liệu đầu vào
            $customer = new Customer(
                null, // ID khách hàng sẽ được tự động sinh bởi database
                $data['user_id'],
                $data['name'],
                null, // Email sẽ được lấy từ bảng users
                $data['phone'],
                $data['gender'],
                $data['birthday'],
                $data['address']
            );

            // Gọi phương thức của CustomerDAO để thêm khách hàng
            $user_id = $this->customerDAO->createCustomer($customer);

            if ($user_id) {
                return $this->cartDAO->createCart($user_id); // Tạo cho khách hàng một giỏ hàng
            }
        } catch (Exception $e) {
            throw new Exception("Không thể thêm khách hàng: " . $e->getMessage());
        }
    }

    // Xem thông tin tài khoản cá nhân 
    public function viewProfile(int $userId)
    {
        if ($userId <= 0) {
            throw new Exception("ID người dùng không hợp lệ");
        }

        try {
            // Gọi phương thức của CustomerDAO để lấy thông tin tài khoản
            $customer = $this->customerDAO->viewProfile($userId);

            // Kiểm tra nếu đối tượng Customer không rỗng
            if ($customer) {
                return $customer->toArray(); // Ép kiểu thành mảng
            }
        } catch (Exception $e) {
            throw new Exception("Không thể lấy thông tin tài khoản: " . $e->getMessage());
        }
    }

    // Cập nhật thông tin khách hàng
    public function updateCustomer(int $userId, array $data)
    {
        if ($userId <= 0) {
            throw new Exception("ID người dùng không hợp lệ");
        }

        try {
            // Tạo đối tượng Customer từ dữ liệu đầu vào
            $customer = new Customer(
                null, // ID khách hàng sẽ được lấy từ bảng detail_users
                $userId,
                $data['name'],
                null, // Bạn có thể để email trống nếu không cần cập nhật email
                $data['phone'],
                $data['gender'],
                $data['birthday'],
                $data['address']
            );

            // Gọi phương thức của CustomerDAO để cập nhật thông tin khách hàng
            $updatedRows = $this->customerDAO->updateCustomer($customer);
            if ($updatedRows === 0) {
                throw new Exception("Cập nhật thất bại hoặc không tìm thấy khách hàng");
            }
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật khách hàng: " . $e->getMessage());
        }
    }
}
