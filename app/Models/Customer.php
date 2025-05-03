<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Customer
{
    private $id;       // Mã khách hàng (từ bảng detail_users)
    private $user_id;  // Mã người dùng (từ bảng users)
    private $name;     // Tên khách hàng (từ detail_users)
    private $email;    // Email (từ bảng users)
    private $phone;    // Số điện thoại (từ detail_users)
    private $gender;   // Giới tính (từ detail_users)
    private $birthday; // Ngày sinh (từ detail_users)
    private $address;  // Địa chỉ (từ detail_users)

    // Constructor
    public function __construct($id = null, $user_id = null, $name = null, $email = null, $phone = null, $gender = null, $birthday = null, $address = null) {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->name = $name;
        $this->email = $email;
        $this->phone = $phone;
        $this->gender = $gender;
        $this->birthday = $birthday;
        $this->address = $address;
    }

    // Getters
    public function getId() {
        return $this->id;
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

    // Setters
    public function setId($id) {
        $this->id = $id;
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

    // Convert object to array
    public function toArray() {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'address' => $this->address,
        ];
    }
}