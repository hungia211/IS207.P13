<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailUser 
{
    private $detail_user_id;    // Mã thông tin người dùng (từ bảng detail_users)
    private $user_id;           // Mã người dùng (từ bảng users)
    private $name;              // Tên khách hàng (từ detail_users)
    private $email;             // Email (từ bảng users)
    private $phone;             // Số điện thoại (từ detail_users)
    private $gender;            // Giới tính (từ detail_users)
    private $birthday;          // Ngày sinh (từ detail_users)
    private $address;           // Địa chỉ (từ detail_users)
    private $role_name;         // Tên quyền (từ bảng roles)

    // Constructor
    public function __construct($detail_user_id = null, $user_id = null, $name = null, $email = null, $phone = null, $gender = null, $birthday = null, $address = null, $role_name = null)  {
        $this->detail_user_id = $detail_user_id;
        $this->user_id = $user_id;
        $this->name = $name;
        $this->email = $email;
        $this->phone = $phone;
        $this->gender = $gender;
        $this->birthday = $birthday;
        $this->address = $address;
        $this->role_name = $role_name;
    }

    // Getters
    public function getId() {
        return $this->detail_user_id;
    }

    public function getUserId() {
        return $this->user_id;
    }

    public function getName() {
        return $this->name;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPhone() {
        return $this->phone;
    }

    public function getGender() {
        return $this->gender;
    }
    
    public function getBirthday() {
        return $this->birthday;
    }
    
    public function getAddress() {
        return $this->address;
    }

    public function getRoleName() {
        return $this->role_name;
    }

    // Setters
    public function setId($detail_user_id) {
        $this->detail_user_id = $detail_user_id;
    }

    public function setUserId($user_id) {
        $this->user_id = $user_id;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setPhone($phone) {
        $this->phone = $phone;
    }

    public function setGender($gender) {
        $this->gender = $gender;
    }

    public function setBirthday($birthday) {
        $this->birthday = $birthday;
    }

    public function setAddress($address) {
        $this->address = $address;
    }

    public function setRoleName($role_name) {
        $this->role_name = $role_name;
    }

    public function jsonSerialize(): array
    {
        return [
            'detail_user_id' => $this->detail_user_id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'phone' => $this->phone,
            'address' => $this->address,
            'role_name' => $this->role_name,
        ];
    }

    public function toArray() {
        return [
            'detail_user_id' => $this->detail_user_id,
            'name' => $this->name,
            'email' => $this->email,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'phone' => $this->phone,
            'address' => $this->address,
            'role_name' => $this->role_name,
        ];
    }
}