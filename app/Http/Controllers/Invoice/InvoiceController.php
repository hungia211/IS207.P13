<?php

namespace App\Http\Controllers\Invoice;

use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Business\InvoiceBiz\InvoiceBusiness;
use App\Business\PermissionBiz\PermissionBusiness;

class InvoiceController extends Controller
{
    protected InvoiceBusiness $invoiceBusiness;
    protected PermissionBusiness $permissionBiz;

    public function __construct()
    {
        $this->invoiceBusiness = new InvoiceBusiness();
        $this->permissionBiz = new PermissionBusiness();
    }

    // Thêm mới hóa đơn
    public function createInvoice(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;   
            $pageName = "Order Management";

            $canAdd = $this->permissionBiz->checkAddPermission($pageName, $userId);

            if (!$canAdd) {
                return response()->json(['message' => 'Bạn không có quyền thêm hóa đơn.'], 403);
            }

            $invoiceId = $this->invoiceBusiness->createInvoice($request->all());

            if ($invoiceId) {
                return response()->json([
                    'message' => 'Thêm hóa đơn thành công',
                    'invoice_id' => $invoiceId,
                ], 201);
            }

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Lấy tất cả hóa đơn
    public function getAllInvoices()
    {
        try {
            $invoices = $this->invoiceBusiness->getAllInvoices();
            return response()->json($invoices);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Lấy thông tin hóa đơn theo ID
    public function getInvoiceById(int $invoiceId)
    {
        try {
            $invoice = $this->invoiceBusiness->getInvoiceById($invoiceId);
            return response()->json($invoice);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}