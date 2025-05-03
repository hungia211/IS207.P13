<?php

namespace App\Business\DetailUserBiz;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\DetailUser;

class DetailUserDAO
{

    public function getAllUser()
    {
        $query = "SELECT "
            . "    detail_user_id, "
            . "    Detail_Users.user_id, "
            . "    name, "
            . "    email, "
            . "    gender, "
            . "    birthday, "
            . "    phone, "
            . "    address, "
            . "    role_name "
            . " FROM Detail_Users "
            . "     JOIN users ON Detail_Users.user_id = users.id "
            . "     JOIN UserRoles ON users.id = UserRoles.user_id "
            . "     JOIN Roles ON UserRoles.role_id = Roles.role_id "
            . " WHERE Detail_Users.IsDeleted = 0";

        return DB::select($query); // Trả về mảng các kết quả
    }


    // Lấy chi tiết người dùng theo ID
    public function getUserById(int $userId): ?DetailUser
    {
        $query = "SELECT "
            . "    detail_user_id, "
            . "    name, "
            . "    email, "
            . "    gender, "
            . "    birthday, "
            . "    phone, "
            . "    address, "
            . "    role_name "
            . " FROM Detail_Users "
            .   " JOIN users ON Detail_Users.user_id = users.id "
            .   " JOIN UserRoles ON users.id = UserRoles.user_id "
            .   " JOIN Roles ON UserRoles.role_id = Roles.role_id "
            . " WHERE Detail_Users.IsDeleted = 0 "
            .       " AND detail_user_id = :user_id;";

        // Thực thi truy vấn
        $result = DB::selectOne($query, ['user_id' => $userId]);

        // Kiểm tra kết quả trả về
        if (!$result) {
            return null; // Không tìm thấy, trả về null
        }

        // Tạo và trả về đối tượng DetailUser
        return new DetailUser(
            $result->detail_user_id,
            $userId,
            $result->name,
            $result->email,
            $result->phone,
            $result->birthday,
            $result->gender,
            $result->address,
            $result->role_name
        );
    }

    public function getUserByName(string $userName)
    {
        $query = "SELECT "
            . "    detail_user_id, "
            . "    Detail_Users.user_id, "
            . "    name, "
            . "    email, "
            . "    gender, "
            . "    birthday, "
            . "    phone, "
            . "    address, "
            . "    role_name "
            . " FROM Detail_Users "
            . "     JOIN users ON Detail_Users.user_id = users.id "
            . "     JOIN UserRoles ON users.id = UserRoles.user_id "
            . "     JOIN Roles ON UserRoles.role_id = Roles.role_id "
            . " WHERE Detail_Users.IsDeleted = 0 "
            . " AND name LIKE :user_name;";

        $result = DB::selectOne($query, ['user_name' => "%$userName%"]);

        if ($result) {
            // Tạo instance của DetailUser từ kết quả truy vấn
            return new DetailUser([
                'detail_user_id' => $result->detail_user_id,
                'user_id'        => $result->user_id,
                'name'           => $result->name,
                'email'          => $result->email,
                'gender'         => $result->gender,
                'birthday'       => $result->birthday,
                'phone'          => $result->phone,
                'address'        => $result->address,
                'role_name'      => $result->role_name,
            ]);
        }

        return null;
    }

    // Thêm mới một người dùng 
    public function createUser(DetailUser $detailUser)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Thêm bản ghi vào bảng Detail_Users
            $queryDetailUser = "INSERT INTO Detail_Users (user_id, name, gender, birthday, phone, address, IsDeleted) "
                . "VALUES (:user_id, :name, :gender, :birthday, :phone, :address, 0);";
            DB::insert($queryDetailUser, [
                'user_id' => $detailUser->getUserId(),
                'name' => $detailUser->getName(),
                'gender' => $detailUser->getGender(),
                'birthday' => $detailUser->getBirthday(),
                'phone' => $detailUser->getPhone(),
                'address' => $detailUser->getAddress(),
            ]);

            // Lấy tên quyền từ $detailUser
            $roleName = $detailUser->getRoleName();

            // Gán roleId dựa trên tên quyền
            $roleId = 0;
            if ($roleName == 'Admin') {
                $roleId = 1; // Admin
            } elseif ($roleName == 'Quản lý') {
                $roleId = 2; // Quản lý
            } elseif ($roleName == 'Nhân viên') {
                $roleId = 3; // Nhân viên
            }

            // Thêm bản ghi vào bảng UserRoles (quyền được cấp từ admin)
            $queryUserRole = "INSERT INTO UserRoles (user_id, role_id) VALUES (:user_id, :role_id);";
            DB::insert($queryUserRole, [
                'user_id' => $detailUser->getUserId(),
                'role_id' => $roleId,
            ]);

            // Xác nhận transaction
            DB::commit();

            return true; // Thành công
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();
            throw new \Exception('Không thể thêm 1 người dùng: ' . $e->getMessage());
        }
    }

    // Cập nhật thông tin khách hàng theo ID
    public function updateUser(DetailUser $detailUser)
    {
        $queryDetailUser = "UPDATE Detail_Users "
            . " SET "
            . " name = :name, "
            . " gender = :gender, "
            . " birthday = :birthday, "
            . " phone = :phone, "
            . " address = :address "
            . " WHERE user_id = :user_id AND IsDeleted = 0";

        $queryRole = "UPDATE UserRoles "
            . " SET "
            . " role_id = :role_id "
            . " WHERE user_id = :user_id";

        // Lấy tên quyền từ $detailUser
        $roleName = $detailUser->getRoleName();

        // Gán roleId dựa trên tên quyền
        $roleId = 0;
        if ($roleName == 'Admin') {
            $roleId = 1; // Admin
        } elseif ($roleName == 'Quản lý') {
            $roleId = 2; // Quản lý
        } elseif ($roleName == 'Nhân viên') {
            $roleId = 3; // Nhân viên
        }
        
        $result = DB::update($queryDetailUser, [
            'name' => $detailUser->getName(),
            'gender' => $detailUser->getGender(),
            'birthday' => $detailUser->getBirthday(),
            'phone' => $detailUser->getPhone(),
            'address' => $detailUser->getAddress(),
            'user_id' => $detailUser->getUserId()
        ]);


        if (!($result === 0)) {
            return DB::update($queryRole, [
                'role_id' => $roleId,
                'user_id' => $detailUser->getUserId()
            ]);
        }
    }

    // Xóa người dùng theo ID
    public function deleteUser(int $userId)
    {
        $query = "UPDATE Detail_Users SET IsDeleted = 1 WHERE user_id = :user_id";
        return DB::update($query, ['user_id' => $userId]);
    }
}
