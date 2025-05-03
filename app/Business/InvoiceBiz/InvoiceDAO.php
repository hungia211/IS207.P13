<?php

namespace App\Business\InvoiceBiz;

use Illuminate\Support\Facades\DB;
use App\Models\Invoice;

class InvoiceDAO
{
    public function createInvoice(Invoice $invoice)
    {
        try {
            DB::beginTransaction();

            $query = "INSERT INTO Invoices (total_amount) VALUES (:total_amount)";

            // Thực hiện chèn dữ liệu và trả về kết quả của DB::insert()
            $result = DB::insert($query, [
                'total_amount' => $invoice->getTotalAmount(),
            ]);

            // Xác nhận transaction
            DB::commit();

            return $result; // Trả về kết quả từ DB::insert()
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();
            throw new \Exception('Không thể thêm hóa đơn: ' . $e->getMessage());
        }
    }

    // Lấy tất cả hóa đơn
    public function getAllInvoices()
    {
        $query = "SELECT "
            . "    invoice_id, "
            . "    issued_at, "
            . "    total_amount "
            . " FROM Invoices";

        return DB::select($query); // Trả về danh sách hóa đơn
    }

    // Lấy thông tin hóa đơn theo ID
    public function getInvoiceById(int $invoiceId): ?Invoice
    {
        $query = "SELECT "
            . "    invoice_id, "
            . "    issued_at, "
            . "    total_amount "
            . " FROM Invoices "
            . " WHERE invoice_id = :invoice_id";

        $result = DB::selectOne($query, ['invoice_id' => $invoiceId]);

        if (!$result) {
            return null;
        }

        return new Invoice(
            $result->invoice_id,
            $result->issued_at,
            $result->total_amount
        );
    }
}
