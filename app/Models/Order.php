<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order
{
    // Các thuộc tính công khai (public)
    protected $order_id;          // Mã đơn hàng
    protected $detail_user_id;    // Mã khách hàng
    protected $name;              // Tên khách hàng
    protected $status;            // Trạng thái đơn hàng
    protected $created_at;        // Ngày đặt hàng
    protected $updated_at;        // Ngày cập nhật

    // Constructor 
    public function __construct($order_id = null, $detail_user_id = null, $name = null, $status = null, $created_at = null, $updated_at = null)
    {
        $this->order_id = $order_id;
        $this->detail_user_id = $detail_user_id;
        $this->name = $name;
        $this->status = $status;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    // Các phương thức truy xuất (Getters)
    public function getOrderId() {
        return $this->order_id;
    }

    public function getDetailUserId() {
        return $this->detail_user_id;
    }

    public function getName() {
        return $this->name;
    }

    public function getStatus() {
        return $this->status;
    }

    public function getCreatedAt() {
        return $this->created_at;
    }

    public function getUpdatedAt() {
        return $this->updated_at;
    }

    // Các phương thức gán giá trị (Setters)
    public function setOrderId($order_id) {
        $this->order_id = $order_id;
    }

    public function setDetailUserId($detail_user_id) {
        $this->detail_user_id = $detail_user_id;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setStatus($status) {
        $this->status = $status;
    }

    public function setCreatedAt($created_at) {
        $this->created_at = $created_at;
    }

    public function setUpdatedAt($updated_at) {
        $this->updated_at = $updated_at;
    }

    // Phương thức chuyển đổi sang mảng (chứa các thuộc tính của đơn hàng)
    public function toArray() {
        return [
            'order_id' => $this->order_id,
            'detail_user_id' => $this->detail_user_id,
            'name' => $this->name,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}