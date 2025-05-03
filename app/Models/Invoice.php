<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice
{
    // Các thuộc tính công khai (public)
    protected $invoice_id;       // Mã hóa đơn
    protected $issued_at;        // Ngày phát hành
    protected $total_amount;     // Tổng số tiền

    // Constructor 
    public function __construct($invoice_id = null, $issued_at = null, $total_amount = null)
    {
        $this->invoice_id = $invoice_id;
        $this->issued_at = $issued_at;
        $this->total_amount = $total_amount;
    }

    // Các phương thức truy xuất (Getters)
    public function getInvoiceId() {
        return $this->invoice_id;
    }

    public function getIssuedAt() {
        return $this->issued_at;
    }

    public function getTotalAmount() {
        return $this->total_amount;
    }

    // Các phương thức gán giá trị (Setters)
    public function setInvoiceId($invoice_id) {
        $this->invoice_id = $invoice_id;
    }

    public function setIssuedAt($issued_at) {
        $this->issued_at = $issued_at;
    }

    public function setTotalAmount($total_amount) {
        $this->total_amount = $total_amount;
    }

    // Phương thức chuyển đổi sang mảng (chứa các thuộc tính của hóa đơn)
    public function toArray() {
        return [
            'invoice_id' => $this->invoice_id,
            'issued_at' => $this->issued_at,
            'total_amount' => $this->total_amount,
        ];
    }
}