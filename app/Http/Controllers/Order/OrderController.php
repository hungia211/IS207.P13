<?php

namespace App\Http\Controllers\Order;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Business\OrderBiz\OrderBusiness;
use App\Business\PermissionBiz\PermissionBusiness;

class OrderController extends Controller
{
    protected OrderBusiness $orderBusiness;
    protected PermissionBusiness $permissionBiz;

    public function __construct()
    {
        $this->orderBusiness = new OrderBusiness();
        $this->permissionBiz = new PermissionBusiness();
    }

    // Thêm mới 1 đơn hàng
    public function createOrder()
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
                return response()->json(['message' => 'Bạn không có quyền thêm đơn hàng.'], 403);
            }

            $orderId = $this->orderBusiness->createOrder($userId);

            if ($orderId) {
                return response()->json([
                    'message' => 'Thêm đơn hàng thành công',
                    'order_id' => $orderId,
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xem thông tin tất cả đơn hàng
    public function viewAllOrders()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Admin Order Management";

            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json(['message' => 'Bạn không có quyền xem thông tin đơn hàng.'], 403);
            }

            $orders = $this->orderBusiness->viewAllOrders();
            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin đơn hàng theo ID
    public function viewOrderById(int $orderId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Order Management";

            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json(['message' => 'Bạn không có quyền xem thông tin đơn hàng.'], 403);
            }

            $order = $this->orderBusiness->viewOrderById($orderId);

            if (!$order) {
                return response()->json(['message' => 'Không tìm thấy thông tin đơn hàng.'], 404);
            }

            return response()->json($order, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin đơn hàng theo ID khách hàng
    public function viewOrderHistoryByUserId()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Order Management";

            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json(['message' => 'Bạn không có quyền xem thông tin đơn hàng.'], 403);
            }

            $orders = $this->orderBusiness->viewOrderByUserId($userId);

            if (!$orders) {
                return response()->json(['message' => 'Không tìm thấy thông tin đơn hàng.'], 404);
            }

            return response()->json($orders, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Cập nhật tình trạng đơn hàng
    public function updateOrder(Request $request, int $orderId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Admin Order Management";

            $canEdit = $this->permissionBiz->checkEditPermission($pageName, $userId);

            if (!$canEdit) {
                return response()->json(['message' => 'Bạn không có quyền cập nhật đơn hàng.'], 403);
            }

            $this->orderBusiness->updateOrder($request->all(), $orderId);

            return response()->json(['message' => 'Cập nhật đơn hàng thành công']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Hủy đơn hàng
    public function cancelOrder(int $orderId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Order Management";

            $canDelete = $this->permissionBiz->checkDeletePermission($pageName, $userId);

            if (!$canDelete) {
                return response()->json(['message' => 'Bạn không có quyền xóa đơn hàng.'], 403);
            }

            $statusArray = $this->orderBusiness->viewOrderById($orderId);
            $status = $statusArray['status'];

            if ($status === 'Pending') {
                $this->orderBusiness->deleteOrder($orderId);
            } else {
                return response()->json(['message' => 'Không thể hủy đơn hàng đã được xác nhận hoặc đang vận chuyển.'], 403);
            }


            return response()->json(['message' => 'Xóa đơn hàng thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Tính tổng tiền của đơn hàng
    public function calculateTotalAmount(int $orderId)
    {
        try {
            $totalAmount = $this->orderBusiness->calculateTotalAmount($orderId);
            return response()->json(['total_amount' => $totalAmount]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Tính tổng tiền của đơn hàng khi áp dụng mã giảm giá
    public function calculateTotalAmountWithDiscount(int $orderId, string $discountCode)
    {
        try {
            $totalAmountWithDiscount = $this->orderBusiness->calculateTotalAmountWithDiscount($orderId, $discountCode);
            return response()->json(['total_amount_with_discount' => $totalAmountWithDiscount]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
