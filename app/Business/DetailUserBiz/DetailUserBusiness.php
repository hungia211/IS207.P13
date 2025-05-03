<?php

namespace App\Business\DetailUserBiz;

use App\Business\DetailUserBiz\DetailUserDAO;
use Exception;
use App\Models\DetailUser;
use Illuminate\Http\Request;

class DetailUserBusiness
{
    protected DetailUserDAO $detailUserDAO;

    public function __construct()
    {
        $this->detailUserDAO = new DetailUserDAO();
    }

    // Thêm mới người dùng
    public function createUser(array $data)
    {
        try {
            // Tạo đối tượng detailUser từ dữ liệu đầu vào
            $detailUser = new DetailUser(
                null,                       // ID người dùng sẽ được tự động sinh bởi database
                $data['user_id'],
                $data['name'],
                null,                       // Email sẽ được lấy từ bảng users
                $data['phone'],
                $data['gender'],
                $data['birthday'],
                $data['address'],
                $data['role_name']
            );

            // Gọi phương thức của detailUserDAO để thêm khách hàng
            return $this->detailUserDAO->createUser($detailUser);
        } catch (Exception $e) {
            throw new Exception("Không thể thêm người dùng: " . $e->getMessage());
        }
    }


    // Xem tất cả thông tin tài khoản
    public function viewAllDetailUser()
    {
        try {
            // Gọi phương thức của DetailUserDAO để lấy thông tin tất cả người dùng
            return $this->detailUserDAO->getAllUser();
        } catch (Exception $e) {
            // Trả về lỗi nếu có sự cố xảy ra trong quá trình lấy dữ liệu
            return response()->json(['message' => 'Không tìm thấy người dùng', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin tài khoản cá nhân 
    public function viewUserByName(string $userName)
    {
        try {
            // Gọi phương thức của CustomerDAO để lấy thông tin tài khoản
            $user = $this->detailUserDAO->getUserByName($userName);

            // Kiểm tra nếu đối tượng Customer không rỗng
            if ($user) {
                return $user->toArray(); // Ép kiểu thành mảng
            }
        } catch (Exception $e) {
            throw new Exception("Không tìm thấy người dùng: " . $e->getMessage());
        }
    }

    // Xem thông tin tài khoản cá nhân theo ID
    public function viewUserById(int $userId)
    {
        try {
            // Gọi phương thức của CustomerDAO để lấy thông tin tài khoản theo ID
            $user = $this->detailUserDAO->getUserById($userId);

            // Kiểm tra nếu đối tượng User không rỗng
            if ($user) {
                return $user->toArray(); // Ép kiểu thành mảng
            }
        } catch (Exception $e) {
            throw new Exception("Không tìm thấy người dùng: " . $e->getMessage());
        }
    }

    // Cập nhật thông tin khách hàng
    public function updateUser(array $data, int $userId)
    {

        try {
            // Tạo đối tượng Customer từ dữ liệu đầu vào
            $detailUser = new detailUser(
                null, // ID khách hàng sẽ được lấy từ bảng detail_users
                $userId,
                $data['name'],
                null, // Bạn có thể để email trống nếu không cần cập nhật email
                $data['phone'],
                $data['gender'],
                $data['birthday'],
                $data['address'],
                $data['role_name']
            );

            // Gọi phương thức của CustomerDAO để cập nhật thông tin khách hàng
            $updatedRows = $this->detailUserDAO->updateUser($detailUser);
            if ($updatedRows === 0) {
                throw new Exception("Cập nhật thất bại hoặc không tìm thấy người dùng");
            }
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật người dùng: " . $e->getMessage());
        }
    }

    // Xóa người dùng
    public function deleteUser(int $userId)
    {
        try {
            // Gọi phương thức của DetailUserDAO để xóa người dùng
            return $this->detailUserDAO->deleteUser($userId);
        } catch (Exception $e) {
            throw new Exception("Không thể xóa người dùng: " . $e->getMessage());
        }
    }
}
