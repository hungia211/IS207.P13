<?php

namespace App\Http\Controllers\Customer;

use App\Business\CustomerBiz\CustomerBusiness;
use App\Business\PermissionBiz\PermissionBusiness;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    protected CustomerBusiness $customerBusiness;
    protected PermissionBusiness $permissionBiz;

    public function __construct()
    {
        $this->customerBusiness = new CustomerBusiness();
        $this->permissionBiz = new PermissionBusiness();
    }

    // Xem thông tin khách hàng
    public function viewProfile()
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;                // Lấy ID từ token
            $pageName = "Profile Management";  // Tên trang quản lý

            // Lấy thông tin quyền từ PermissionBiz
            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            // Kiểm tra quyền can_view
            if ($canView) {
                // Có quyền xem, thực hiện lấy thông tin khách hàng
                $customer = $this->customerBusiness->viewProfile($userId);
                return response()->json($customer);
            } else {
                // Không có quyền xem
                return response()->json(['message' => 'Bạn không có quyền xem thông tin khách hàng.'], 403);
            }
        } catch (\Exception $e) {
            // Trả về lỗi hệ thống
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }



    public function updateCustomer(Request $request)
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;                // Lấy ID từ token
            $pageName = "Profile Management";  // Tên trang quản lý

            // Lấy thông tin quyền từ PermissionBiz
            $canEdit = $this->permissionBiz->checkEditPermission($pageName, $userId);

            // Kiểm tra quyền can_edit
            if ($canEdit) {
                // Có quyền sửa, thực hiện cập nhật
                $this->customerBusiness->updateCustomer($userId, $request->all());
                return response()->json(['message' => 'Cập nhật khách hàng thành công']);
            } else {
                // Không có quyền sửa
                return response()->json(['message' => 'Bạn không có quyền cập nhật khách hàng.'], 403);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }
}
