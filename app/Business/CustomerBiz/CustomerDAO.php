<?php

namespace App\Business\CustomerBiz;

use Illuminate\Support\Facades\DB;
use App\Models\Customer;

class CustomerDAO
{
    // Thêm mới khách hàng
    public function createCustomer(Customer $customer)
    {
        try {

            // Bắt đầu transaction
            DB::beginTransaction();

            // Thêm bản ghi vào bảng Detail_Users
            $queryDetailUser = "INSERT INTO Detail_Users (user_id, name, gender, birthday, phone, address, IsDeleted) "
                . "VALUES (:user_id, :name, :gender, :birthday, :phone, :address, 0);";
            DB::insert($queryDetailUser, [
                'user_id' => $customer->getUserId(),
                'name' => $customer->getName(),
                'gender' => $customer->getGender(),
                'birthday' => $customer->getBirthday(),
                'phone' => $customer->getPhone(),
                'address' => $customer->getAddress(),
            ]);

            // Thêm bản ghi vào bảng UserRoles (mặc định khách hàng có role_id = 4)
            $queryUserRole = "INSERT INTO UserRoles (user_id, role_id) VALUES (:user_id, 4);";
            DB::insert($queryUserRole, [
                'user_id' => $customer->getUserId(),
            ]);

            // Retrieve the detail_user_id of the newly created customer
            $querylUserId = "SELECT "
                . "     Detail_Users.detail_user_id "
                . " FROM Detail_Users "
                . "     JOIN users ON Detail_Users.user_id = users.id "
                . " WHERE Detail_Users.IsDeleted = 0 AND Detail_Users.user_id = :user_id;";

            $result = DB::selectOne($querylUserId, ['user_id' => $customer->getUserId()]);

            // Xác nhận transaction
            DB::commit();

            return (int) $result->detail_user_id; // Thành công
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();
            throw new \Exception('Không thể thêm khách hàng: ' . $e->getMessage());
        }
    }

    // Xem thông tin tài khoản cá nhân 
    public function viewProfile(int $userId): ?Customer
    {
        $query = "SELECT "
            . "    Detail_Users.detail_user_id, "
            . "    Detail_Users.name, "
            . "    users.email, "
            . "    Detail_Users.phone, "
            . "    Detail_Users.gender, "
            . "    Detail_Users.birthday, "
            . "    Detail_Users.address"
            . " FROM Detail_Users "
            . " JOIN users ON Detail_Users.user_id = users.id "
            . " WHERE Detail_Users.IsDeleted = 0 AND Detail_Users.user_id = :user_id;";

        $result = DB::selectOne($query, ['user_id' => $userId]);

        if ($result) {
            return new Customer(
                $result->detail_user_id,
                $userId,
                $result->name,
                $result->email,
                $result->phone,
                $result->gender,
                $result->birthday,
                $result->address
            );
        }

        return null;
    }

    // Cập nhật thông tin khách hàng theo ID
    public function updateCustomer(Customer $customer)
    {
        $query = "UPDATE Detail_Users "
            . " SET "
            . " name = :name, "
            . " gender = :gender, "
            . " birthday = :birthday, "
            . " phone = :phone, "
            . " address = :address "
            . " WHERE user_id = :user_id AND IsDeleted = 0";

        return DB::update($query, [
            'name' => $customer->getName(),
            'gender' => $customer->getGender(),
            'birthday' => $customer->getBirthday(),
            'phone' => $customer->getPhone(),
            'address' => $customer->getAddress(),
            'user_id' => $customer->getUserId()
        ]);
    }

    // Lấy detail_user_id theo user_id
    public function getDetailUserIdByUserId(int $userId): ?int
    {
        $query = "SELECT detail_user_id "
            . " FROM Detail_Users "
            . " WHERE IsDeleted = 0 AND user_id = :user_id";

        $result = DB::selectOne($query, ['user_id' => $userId]);

        if ($result) {
            return (int) $result->detail_user_id;
        }

        return null;
    }
}
