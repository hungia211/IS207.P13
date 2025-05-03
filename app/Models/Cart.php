<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart
{
    // Các thuộc tính công khai (public)
    protected $user_id; // Mã người dùng

    // Constructor
    public function __construct($user_id = null)
    {
        $this->user_id = $user_id;
    }

    // Các phương thức truy xuất (Getters)
    public function getUserId()
    {
        return $this->user_id;
    }

    // Các phương thức gán giá trị (Setters)
    public function setUserId($user_id)
    {
        $this->user_id = $user_id;
    }

    // Phương thức chuyển đổi sang mảng (chứa các thuộc tính của giỏ hàng)
    public function toArray()
    {
        return [
            'user_id' => $this->user_id,
        ];
    }
}