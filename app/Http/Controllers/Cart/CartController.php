<?php

namespace App\Http\Controllers\Cart;

use App\Models\Cart;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Business\CartBiz\CartBusiness;
use App\Business\PermissionBiz\PermissionBusiness;

class CartController extends Controller
{
    protected CartBusiness $cartBusiness;
    protected PermissionBusiness $permissionBiz;

    public function __construct()
    {
        $this->cartBusiness = new CartBusiness();
        $this->permissionBiz = new PermissionBusiness();
    }

    // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
    public function getAllCartProduct()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Cart Management";

            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json(['message' => 'Bạn không có quyền xem thông tin giỏ hàng.'], 403);
            }

            $cartProducts = $this->cartBusiness->getAllCartProduct($userId);
            return response()->json($cartProducts);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    public function addProductToCart(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Cart Management";

            $canAdd = $this->permissionBiz->checkAddPermission($pageName, $userId);

            if (!$canAdd) {
                return response()->json(['message' => 'Bạn không có quyền thêm sản phẩm vào giỏ hàng.'], 403);
            }

            $validator = Validator::make($request->all(), [
                'product_id' => 'required|integer',
                'quantity' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $productId = $request->input('product_id');
            $quantity = $request->input('quantity');

            $this->cartBusiness->addProductToCart($userId, $productId, $quantity);

            return response()->json(['message' => 'Thêm sản phẩm vào giỏ hàng thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function deleteProductFromCart(int $productId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Cart Management";

            $canDelete = $this->permissionBiz->checkDeletePermission($pageName, $userId);

            if (!$canDelete) {
                return response()->json(['message' => 'Bạn không có quyền xóa sản phẩm khỏi giỏ hàng.'], 403);
            }

            $this->cartBusiness->deleteProductFromCart($userId, $productId);

            return response()->json(['message' => 'Xóa sản phẩm khỏi giỏ hàng thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Tính tổng tiền của giỏ hàng
    public function calculateCartTotalAmount()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Cart Management";

            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json(['message' => 'Bạn không có quyền xem thông tin giỏ hàng.'], 403);
            }

            $totalAmount = $this->cartBusiness->calculateCartTotalAmount($userId);
            return response()->json(['total_amount' => $totalAmount]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }
}
