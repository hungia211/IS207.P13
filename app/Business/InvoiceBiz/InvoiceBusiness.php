<?php

namespace App\Business\InvoiceBiz;

use App\Business\InvoiceBiz\InvoiceDAO;
use Exception;
use App\Models\Invoice;

class InvoiceBusiness
{
    protected InvoiceDAO $invoiceDAO;

    public function __construct()
    {
        $this->invoiceDAO = new InvoiceDAO();
    }

    // Thêm mới hóa đơn
    public function createInvoice(array $data)
    {
        try {
            // Tạo đối tượng Invoice từ dữ liệu đầu vào
            $invoice = new Invoice(
                null, // ID hóa đơn sẽ được tự động sinh bởi database
                null,
                $data['total_amount']
            );

            // Gọi phương thức của InvoiceDAO để thêm hóa đơn
            return $this->invoiceDAO->createInvoice($invoice);
        } catch (Exception $e) {
            throw new Exception("Không thể thêm hóa đơn: " . $e->getMessage());
        }
    }

    // Lấy tất cả hóa đơn
    public function getAllInvoices()
    {
        try {
            return $this->invoiceDAO->getAllInvoices();
        } catch (Exception $e) {
            throw new Exception("Không thể lấy danh sách hóa đơn: " . $e->getMessage());
        }
    }

    // Lấy thông tin hóa đơn theo ID
    public function getInvoiceById(int $invoiceId)
    {
        try {
            $invoice = $this->invoiceDAO->getInvoiceById($invoiceId);

            if ($invoice) {
                return $invoice->toArray();
            } else {
                throw new Exception("Không tìm thấy hóa đơn");
            }
        } catch (Exception $e) {
            throw new Exception("Không thể lấy thông tin hóa đơn: " . $e->getMessage());
        }
    }
}