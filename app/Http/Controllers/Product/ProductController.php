<?php

namespace App\Http\Controllers\Product;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Business\ProductBiz\ProductBusiness;
use App\Business\PermissionBiz\PermissionBusiness;

class ProductController extends Controller
{
    protected ProductBusiness $productBusiness;
    protected PermissionBusiness $permissionBiz;

    public function __construct()
    {
        $this->productBusiness = new ProductBusiness();
        $this->permissionBiz = new PermissionBusiness();
    }

    // Thêm mới 1 sản phẩm
    public function createProduct(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Product Management";

            $canAdd = $this->permissionBiz->checkAddPermission($pageName, $userId);

            if (!$canAdd) {
                return response()->json(['message' => 'Bạn không có quyền thêm sản phẩm.'], 403);
            }

            $product = $this->productBusiness->createProduct($request->all());

            if ($product) {
                return response()->json([
                    'message' => 'Thêm sản phẩm thành công',
                    'product' => $product,
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xem thông tin tất cả sản phẩm
    public function viewAllProducts()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Product Management";

            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json(['message' => 'Bạn không có quyền xem thông tin sản phẩm.'], 403);
            }

            $products = $this->productBusiness->viewAllProducts();
            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin sản phẩm theo ID
    public function viewProductById(int $productId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Product Management";

            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json(['message' => 'Bạn không có quyền xem thông tin sản phẩm.'], 403);
            }

            $product = $this->productBusiness->viewProductById($productId);

            if (!$product) {
                return response()->json(['message' => 'Không tìm thấy thông tin sản phẩm.'], 404);
            }

            return response()->json($product, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin chi tiết đơn hàng
    public function viewOrderDetailById(int $orderId)
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

            $orderDetail = $this->productBusiness->viewOrderDetailById($orderId);

            if (!$orderDetail) {
                return response()->json(['message' => 'Không tìm thấy thông tin chi tiết đơn hàng.'], 404);
            }

            return response()->json($orderDetail, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Cập nhật thông tin sản phẩm
    public function updateProduct(Request $request, int $productId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Product Management";

            $canEdit = $this->permissionBiz->checkEditPermission($pageName, $userId);

            if (!$canEdit) {
                return response()->json(['message' => 'Bạn không có quyền cập nhật sản phẩm.'], 403);
            }

            $this->productBusiness->updateProduct($request->all(), $productId);

            return response()->json(['message' => 'Cập nhật sản phẩm thành công']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xóa sản phẩm
    public function deleteProduct(int $productId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $userId = $user->id;
            $pageName = "Product Management";

            $canDelete = $this->permissionBiz->checkDeletePermission($pageName, $userId);

            if (!$canDelete) {
                return response()->json(['message' => 'Bạn không có quyền xóa sản phẩm.'], 403);
            }

            $this->productBusiness->deleteProduct($productId);

            return response()->json(['message' => 'Xóa sản phẩm thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin tất cả sản phẩm mà không cần kiểm tra quyền
    public function viewAllProductsPublic()
    {
        try {
            $products = $this->productBusiness->viewAllProducts();
            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin sản phẩm theo ID mà không cần kiểm tra quyền
    public function viewProductByIdPublic(int $productId)
    {
        try {
            $product = $this->productBusiness->viewProductById($productId);

            if (!$product) {
                return response()->json(['message' => 'Không tìm thấy thông tin sản phẩm.'], 404);
            }

            return response()->json($product, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin sản phẩm theo tên danh mục
    public function viewProductsByCategoryName(Request $request)
    {
        try {
            $categoryName = $request->category_name;
            $products = $this->productBusiness->viewProductsByCategoryName($categoryName);
            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }
}
