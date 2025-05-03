<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\Role\RoleController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Authenication\AuthController;
use App\Http\Controllers\DetailUser\DetailUserController;

// Route for Auth
Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Phần 1: Màn hình và API liên quan tới khách hàng, tài khoản, mua hàng, ...
Route::middleware(['auth:sanctum'])->prefix('profile')->group(function () {
    // Lấy thông tin khách hàng
    Route::get('/view', [CustomerController::class, 'viewProfile']); // GET /api/profile

    // Cập nhật thông tin khách hàng
    Route::put('/edit', [CustomerController::class, 'updateCustomer']); // PUT /api/profile
});


// Route để xem tất cả sản phẩm mà không cần kiểm tra quyền
Route::get('product/view', [ProductController::class, 'viewAllProductsPublic']);

// Route để xem sản phẩm theo ID mà không cần kiểm tra quyền
Route::get('product/view/{product_id}', [ProductController::class, 'viewProductByIdPublic'])
    ->where('product_id', '[0-9]+');

// Route để xem sản phẩm theo tên danh mục
Route::get('product/category', [ProductController::class, 'viewProductsByCategoryName']);


// Giỏ hàng
Route::middleware(['auth:sanctum'])->prefix('cart')->group(function () {
    // Lấy thông tin giỏ hàng của tài khoản hiện tại
    Route::get('/view', [CartController::class, 'getAllCartProduct']); // GET /api/cart/view

    // Thêm sản phẩm vào giỏ hàng
    Route::post('/add', [CartController::class, 'addProductToCart']); // POST /api/cart

    // Xóa sản phẩm khỏi giỏ hàng
    Route::delete('/delete/{product_id}', [CartController::class, 'deleteProductFromCart'])
        ->where('product_id', '[0-9]+'); // DELETE /api/cart/{product_id}

    // Tính tổng tiền của giỏ hàng
    Route::get('/total', [CartController::class, 'calculateCartTotalAmount']);
});

// Đặt hàng
Route::middleware(['auth:sanctum'])->prefix('order')->group(function () {
    // Tạo đơn hàng mới
    Route::post('', [OrderController::class, 'createOrder']);           // POST /api/order

    // Xem chi tiết đơn hàng
    Route::get('/{order_id}', [OrderController::class, 'viewOrderById'])
        ->where('order_id', '[0-9]+');          // GET /api/order/{order_id}

    // Xem chi tiết sản phẩm đơn hàng
    Route::get('/detail/{order_id}', [ProductController::class, 'viewOrderDetailById'])
        ->where('order_id', '[0-9]+');           // GET /api/order/detail/{order_id}

    // Xem lịch sử đặt hàng của tài khoản
    Route::get('/history', [OrderController::class, 'viewOrderHistoryByUserId'])
        ->where('user_id', '[0-9]+');               // GET /api/order/history

    // Hủy đơn hàng (Đối với đơn hàng đang ở trạng thái 'Pending')
    Route::put('/cancel/{order_id}', [OrderController::class, 'cancelOrder'])
        ->where('order_id', '[0-9]+');              // PUT /api/order/cancel/{order_id}

    // Tính tổng tiền của đơn hàng
    Route::get('/total/{order_id}', [OrderController::class, 'calculateTotalAmount'])
        ->where('order_id', '[0-9]+');

    // Tính tổng tiền khi áp dụng mã giảm giá
    Route::get('/total/{order_id}/{discount_code}', [OrderController::class, 'calculateTotalAmountWithDiscount'])
        ->where('order_id', '[0-9]+');              // GET /api/order/total/{order_id}/{discount_code}

});

// Phần 2: Màn hình và API liên quan tới Admin
Route::middleware(['auth:sanctum'])->prefix('detailuser')->group(function () {
    // Lấy danh sách người dùng
    Route::get('/view', [DetailUserController::class, 'viewAllDetailUser']); // GET /api/detailuser/view

    // Lấy thông tin người dùng theo ID
    Route::get('/view/{user_id}', [DetailUserController::class, 'viewUserById'])
        ->where('user_id', '[0-9]+'); // GET /api/detailuser/view/{user_id}

    // Tạo mới thông tin người dùng
    Route::post('', [DetailUserController::class, 'createUser']);           // POST /api/detailuser

    // Cập nhật thông tin người dùng
    Route::put('/edit/{user_id}', [DetailUserController::class, 'updateUser']);       // PUT /api/profile

    // Xóa thông tin người dùng
    Route::delete('/delete/{user_id}', [DetailUserController::class, 'deleteUser']); // DELETE /api/detailuser/delete/{user_id}
});

Route::middleware(['auth:sanctum'])->prefix('admin/product')->group(function () {
    // Lấy danh sách sản phẩm
    Route::get('/view', [ProductController::class, 'viewAllProducts']); // GET /api/product/view

    // Lấy thông tin sản phẩm theo ID
    Route::get('/view/{product_id}', [ProductController::class, 'viewProductById'])
        ->where('product_id', '[0-9]+'); // GET /api/product/view/{product_id}

    // Tạo mới thông tin sản phẩm
    Route::post('', [ProductController::class, 'createProduct']); // POST /api/product

    // Cập nhật thông tin sản phẩm
    Route::put('/edit/{product_id}', [ProductController::class, 'updateProduct']); // PUT /api/product/edit

    // Xóa thông tin sản phẩm
    Route::delete('/delete/{product_id}', [ProductController::class, 'deleteProduct'])
        ->where('product_id', '[0-9]+'); // DELETE /api/product/delete/{product_id}
});

Route::middleware(['auth:sanctum'])->prefix('admin/order')->group(function () {
    // Lấy danh sách đơn hàng
    Route::get('/view', [OrderController::class, 'viewAllOrders']); // GET /api/admin/order/view

    // Lấy thông tin đơn hàng theo ID
    Route::get('/view/{order_id}', [OrderController::class, 'viewOrderById'])
        ->where('order_id', '[0-9]+');              // GET /api/admin/order/view/{order_id}

    // Xem chi tiết sản phẩm trong đơn hàng theo ID
    Route::get('/view/detail/{order_id}', [ProductController::class, 'viewOrderDetailById'])
        ->where('order_id', '[0-9]+');               // GET /api/admin/order/detail/{order_id}

    // Cập nhật tình trạng đơn hàng
    Route::put('/edit/{order_id}', [OrderController::class, 'updateOrder']); // PUT /api/admin/order/edit

});

Route::middleware(['auth:sanctum'])->prefix('admin/invoice')->group(function () {
    // Tạo hóa đơn mới
    Route::post('', [InvoiceController::class, 'createInvoice']);           // POST /api/invoice

    // Xem tất cả hóa đơn
    Route::get('/view', [InvoiceController::class, 'getAllInvoices']);           // GET /api/invoice

    // Xem chi tiết hóa đơn
    Route::get('/view/{invoice_id}', [InvoiceController::class, 'getInvoiceById'])
        ->where('invoice_id', '[0-9]+');           // GET /api/invoice/{invoice_id}
});
